import { diag } from "@opentelemetry/api";
import {
    createOtlpNetworkExportDelegate,
    ExporterMetrics,
    type ExportResponse,
    getSharedConfigurationDefaults,
    type IExporterTransport,
    mergeOtlpSharedConfigurationWithDefaults,
    OTLPExporterBase
} from "@opentelemetry/otlp-exporter-base";
import { JsonTraceSerializer, TraceExporterMetricsHelper } from "@opentelemetry/otlp-transformer";
import type { ReadableSpan, SpanExporter } from "@opentelemetry/sdk-trace-web";
import type { HoneycombSdkOptions } from "./honeycombTypes.ts";

// Why this file exists:
//
// The Honeycomb Web SDK builds its default OTLP exporters on top of "@opentelemetry/otlp-exporter-base". Since
// version 1.5 of the SDK, the browser transport of that package sends the export requests with the Fetch API,
// and it never sets the "credentials" option of the request. Requests to a proxy are therefore sent without the
// session cookies that the proxy relies on to authenticate the caller, and the proxy answers 401.
//
// There is no option to configure the credentials of the upstream transport, and the retry policy wrapping it is
// not part of the package public API. This file provides a trace exporter that reuses the public building blocks
// of "@opentelemetry/otlp-exporter-base" (serialization, export queue, flush and shutdown semantics), but owns the
// network transport so the credentials can be configured.
//
// The transport and the retry policy are ports of the following upstream files (Apache-2.0, Copyright The OpenTelemetry Authors):
//  - https://github.com/open-telemetry/opentelemetry-js/blob/main/experimental/packages/otlp-exporter-base/src/transport/fetch-transport.ts
//  - https://github.com/open-telemetry/opentelemetry-js/blob/main/experimental/packages/otlp-exporter-base/src/retrying-transport.ts
//  - https://github.com/open-telemetry/opentelemetry-js/blob/main/experimental/packages/otlp-exporter-base/src/is-export-retryable.ts

const logger = diag.createComponentLogger({
    namespace: "@workleap/honeycomb/ProxyTraceExporter"
});

///////////////////////////

export const TracesPath = "v1/traces";

// Same rule as the Honeycomb Web SDK: append the traces path to the endpoint unless it is already there.
export function appendTracesPath(url: string) {
    if (url.endsWith(TracesPath) || url.endsWith(`${TracesPath}/`)) {
        return url;
    }

    return url.endsWith("/") ? `${url}${TracesPath}` : `${url}/${TracesPath}`;
}

///////////////////////////

export function isRetryableHttpStatus(status: number) {
    return status === 429 || status === 502 || status === 503 || status === 504;
}

export function parseRetryAfterHeader(retryAfter: string | null | undefined) {
    if (retryAfter == null) {
        return undefined;
    }

    const seconds = Number.parseInt(retryAfter, 10);

    if (Number.isInteger(seconds)) {
        return seconds > 0 ? seconds * 1000 : -1;
    }

    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After#directives
    const delay = new Date(retryAfter).getTime() - Date.now();

    return delay >= 0 ? delay : 0;
}

///////////////////////////

// Browsers enforce a cumulative 64KiB limit on the body of all the pending "keepalive" requests. 60KB leaves headroom for the headers.
// See https://github.com/whatwg/fetch/issues/679.
const MaxKeepaliveBodySize = 60 * 1024;

// Chrome rejects a new "keepalive" request when more than 9 are already pending in the renderer process.
// See https://github.com/whatwg/fetch/issues/679.
const MaxKeepaliveRequestCount = 9;

let pendingKeepaliveBodySize = 0;
let pendingKeepaliveRequestCount = 0;

// The Fetch API might be wrapped by "@opentelemetry/instrumentation-fetch". In that case, the instrumentation would create
// a new span for every export request, resulting in an endless loop of export -> span -> export. The instrumentation keeps
// a reference to the original function on the wrapper, using it bypasses the instrumentation.
function getFetch(): typeof fetch {
    const fetchApi = globalThis.fetch;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const original = (fetchApi as any).__original;

    return typeof original === "function" ? original : fetchApi;
}

// Relative URLs are resolved against the document URL when there is one, like the XMLHttpRequest transport previously used by the SDK did.
export function resolveUrl(url: string) {
    const base = globalThis.location?.href;

    return base ? new URL(url, base) : new URL(url);
}

function getRequestMode(url: URL): RequestMode {
    if (!globalThis.location) {
        return "no-cors";
    }

    return globalThis.location.origin === url.origin ? "same-origin" : "cors";
}

// In browsers, a network error (DNS failure, connection refused, CORS rejection, etc..) is a "TypeError" without a cause.
function isNetworkError(error: unknown): error is TypeError {
    return error instanceof TypeError && !error.cause;
}

export interface FetchTransportOptions {
    url: string;
    headers: Record<string, string>;
    credentials: RequestCredentials;
}

export class FetchTransport implements IExporterTransport {
    readonly #url: string;
    readonly #headers: Record<string, string>;
    readonly #credentials: RequestCredentials;

    constructor({ url, headers, credentials }: FetchTransportOptions) {
        this.#url = url;
        this.#headers = headers;
        this.#credentials = credentials;
    }

    async send(data: Uint8Array, timeoutMillis: number): Promise<ExportResponse> {
        let url: URL;

        try {
            url = resolveUrl(this.#url);
        } catch (error: unknown) {
            return {
                status: "failure",
                error: new Error(`Cannot export traces, "${this.#url}" is not a valid URL.`, { cause: error })
            };
        }

        const abortController = new AbortController();
        const timeoutId = setTimeout(() => abortController.abort(), timeoutMillis);

        // The limits are cumulative, they must be checked before adding the request to the pending totals.
        const requestSize = data.byteLength;
        const exceedsBodySize = pendingKeepaliveBodySize + requestSize > MaxKeepaliveBodySize;
        const exceedsRequestCount = pendingKeepaliveRequestCount >= MaxKeepaliveRequestCount;
        const keepalive = !exceedsBodySize && !exceedsRequestCount;

        if (keepalive) {
            pendingKeepaliveBodySize += requestSize;
            pendingKeepaliveRequestCount++;
        } else {
            logger.debug(`keepalive disabled for a ${(requestSize / 1024).toFixed(1)}KB payload with ${pendingKeepaliveRequestCount} pending requests (${exceedsBodySize ? "size limit" : "count limit"}).`);
        }

        try {
            const response = await getFetch()(url.href, {
                method: "POST",
                headers: this.#headers,
                body: data as BodyInit,
                signal: abortController.signal,
                keepalive,
                credentials: this.#credentials,
                mode: getRequestMode(url)
            });

            if (response.status >= 200 && response.status <= 299) {
                logger.debug(`export response success (status: ${response.status}).`);

                return {
                    status: "success"
                };
            }

            if (isRetryableHttpStatus(response.status)) {
                logger.warn(`export response retryable (status: ${response.status}).`);

                return {
                    status: "retryable",
                    retryInMillis: parseRetryAfterHeader(response.headers.get("Retry-After"))
                };
            }

            logger.error(`export response failure (status: ${response.status}).`);

            return {
                status: "failure",
                error: new Error(`Fetch request failed with non-retryable status ${response.status}.`)
            };
        } catch (error: unknown) {
            if (isNetworkError(error)) {
                logger.warn(`export request retryable (network error: ${error}).`);

                return {
                    status: "retryable",
                    error: new Error("Fetch request encountered a network error.", { cause: error })
                };
            }

            logger.error(`export request failure (error: ${error}).`);

            return {
                status: "failure",
                error: new Error("Fetch request errored.", { cause: error })
            };
        } finally {
            clearTimeout(timeoutId);

            if (keepalive) {
                pendingKeepaliveBodySize -= requestSize;
                pendingKeepaliveRequestCount--;
            }
        }
    }

    shutdown() {
        // Nothing to do.
    }
}

///////////////////////////

const MaxRetryAttempts = 5;
const InitialBackoffMillis = 1000;
const MaxBackoffMillis = 5000;
const BackoffMultiplier = 1.5;
const Jitter = 0.2;

// A pseudo-random jitter in the range of [-Jitter, +Jitter].
function getJitter() {
    return Math.random() * (2 * Jitter) - Jitter;
}

export class RetryingTransport implements IExporterTransport {
    readonly #transport: IExporterTransport;

    constructor(transport: IExporterTransport) {
        this.#transport = transport;
    }

    #retry(data: Uint8Array, timeoutMillis: number, inMillis: number) {
        return new Promise<ExportResponse>((resolve, reject) => {
            setTimeout(() => {
                this.#transport.send(data, timeoutMillis).then(resolve, reject);
            }, inMillis);
        });
    }

    async send(data: Uint8Array, timeoutMillis: number): Promise<ExportResponse> {
        let attempts = MaxRetryAttempts;
        let nextBackoff = InitialBackoffMillis;

        const deadline = Date.now() + timeoutMillis;

        let result = await this.#transport.send(data, timeoutMillis);

        while (result.status === "retryable" && attempts > 0) {
            attempts--;

            // Use the maximum of the computed backoff and 0 to avoid negative timeouts.
            const backoff = Math.max(Math.min(nextBackoff * (1 + getJitter()), MaxBackoffMillis), 0);
            nextBackoff = nextBackoff * BackoffMultiplier;

            const retryInMillis = result.retryInMillis ?? backoff;
            const remainingTimeoutMillis = deadline - Date.now();

            // Give up when the expected retry time is after the export deadline.
            if (retryInMillis > remainingTimeoutMillis) {
                logger.info(`Export retry time ${Math.round(retryInMillis)}ms exceeds remaining timeout ${Math.round(remainingTimeoutMillis)}ms, not retrying further.`);

                return result;
            }

            logger.verbose(`Scheduling export retry in ${Math.round(retryInMillis)}ms.`);

            result = await this.#retry(data, remainingTimeoutMillis, retryInMillis);
        }

        if (result.status === "success") {
            logger.verbose(`Export succeeded after ${MaxRetryAttempts - attempts} retry attempts.`);
        } else if (result.status === "retryable") {
            logger.info(`Export failed after maximum retry attempts (${MaxRetryAttempts}).`);
        } else {
            logger.info(`Export failed with non-retryable error: ${result.error}.`);
        }

        return result;
    }

    shutdown() {
        this.#transport.shutdown();
    }
}

///////////////////////////

export interface ProxyTraceExporterOptions {
    /**
     * The URL of the proxy traces endpoint.
     */
    url: string;
    /**
     * The headers sent with every export request.
     */
    headers?: Record<string, string>;
    /**
     * The maximum time in milliseconds to wait for a batch export, retries included.
     */
    timeoutMillis?: number;
    /**
     * The credentials mode of the export requests.
     * @default "include"
     */
    credentials?: RequestCredentials;
}

/**
 * An OTLP HTTP/JSON trace exporter sending the export requests with the session credentials.
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export class ProxyTraceExporter extends OTLPExporterBase<ReadableSpan[]> implements SpanExporter {
    readonly #url: string;
    readonly #headers: Record<string, string>;
    readonly #credentials: RequestCredentials;

    constructor(options: ProxyTraceExporterOptions) {
        const {
            url,
            headers = {},
            timeoutMillis,
            credentials = "include"
        } = options;

        const configuration = mergeOtlpSharedConfigurationWithDefaults({ timeoutMillis }, {}, getSharedConfigurationDefaults());

        const metrics = new ExporterMetrics<ReadableSpan[]>({
            componentType: "otlp_http_span_exporter",
            metricsHelper: TraceExporterMetricsHelper,
            url,
            meterProvider: undefined,
            responseAttributesFromError: () => ({})
        });

        const transport = new RetryingTransport(new FetchTransport({
            url,
            headers,
            credentials
        }));

        super(createOtlpNetworkExportDelegate(configuration, JsonTraceSerializer, metrics, transport));

        this.#url = url;
        this.#headers = headers;
        this.#credentials = credentials;
    }

    get url() {
        return this.#url;
    }

    get headers() {
        return this.#headers;
    }

    get credentials() {
        return this.#credentials;
    }
}

///////////////////////////

export const HoneycombTeamHeaderName = "x-honeycomb-team";

// Derives the exporter configuration from the Honeycomb SDK options the same way the SDK derives its default trace exporter.
export function createProxyTraceExporter(sdkOptions: HoneycombSdkOptions, credentials?: RequestCredentials) {
    const {
        endpoint,
        tracesEndpoint,
        apiKey,
        tracesApiKey,
        headers,
        tracesHeaders,
        timeout,
        tracesTimeout
    } = sdkOptions;

    const url = tracesEndpoint ?? (endpoint ? appendTracesPath(endpoint) : undefined);

    if (!url) {
        throw new Error("[honeycomb] Cannot create the proxy trace exporter, the Honeycomb SDK options have no \"endpoint\" or \"tracesEndpoint\".");
    }

    const resolvedHeaders: Record<string, string> = {
        ...headers,
        ...tracesHeaders,
        // The payload is always JSON, the content type cannot be overridden.
        "Content-Type": "application/json"
    };

    const resolvedApiKey = tracesApiKey ?? apiKey;

    if (resolvedApiKey && !resolvedHeaders[HoneycombTeamHeaderName]) {
        resolvedHeaders[HoneycombTeamHeaderName] = resolvedApiKey;
    }

    return new ProxyTraceExporter({
        url,
        headers: resolvedHeaders,
        timeoutMillis: tracesTimeout || timeout || undefined,
        credentials
    });
}
