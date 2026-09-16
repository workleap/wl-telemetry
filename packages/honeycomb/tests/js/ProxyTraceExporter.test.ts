import { ExportResultCode, type ExportResult } from "@opentelemetry/core";
import { InMemorySpanExporter, type ReadableSpan, SimpleSpanProcessor, WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { afterEach, describe, test, vi } from "vitest";
import {
    appendTracesPath,
    createProxyTraceExporter,
    parseRetryAfterHeader,
    ProxyTraceExporter
} from "../../src/js/ProxyTraceExporter.ts";

function createSpans(count = 1, attributes: Record<string, string> = {}) {
    const memoryExporter = new InMemorySpanExporter();

    const provider = new WebTracerProvider({
        spanProcessors: [new SimpleSpanProcessor(memoryExporter)]
    });

    const tracer = provider.getTracer("test");

    for (let i = 0; i < count; i++) {
        tracer.startSpan(`span-${i}`, { attributes }).end();
    }

    return memoryExporter.getFinishedSpans();
}

function exportSpans(exporter: ProxyTraceExporter, spans: ReadableSpan[]) {
    return new Promise<ExportResult>(resolve => {
        exporter.export(spans, resolve);
    });
}

function createResponse(status: number, headers: Record<string, string> = {}) {
    return new Response(null, { status, headers });
}

function getRequest(fetchMock: ReturnType<typeof vi.fn>, index = 0) {
    const [url, init] = fetchMock.mock.calls[index] as [string, RequestInit];

    return { url, init };
}

function decodeBody(init: RequestInit) {
    return JSON.parse(new TextDecoder().decode(init.body as Uint8Array));
}

afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
});

describe("appendTracesPath", () => {
    test.concurrent("append the traces path when missing", ({ expect }) => {
        expect(appendTracesPath("https://my-proxy.com")).toBe("https://my-proxy.com/v1/traces");
        expect(appendTracesPath("https://my-proxy.com/")).toBe("https://my-proxy.com/v1/traces");
        expect(appendTracesPath("https://my-proxy.com/telemetry")).toBe("https://my-proxy.com/telemetry/v1/traces");
    });

    test.concurrent("keep the url unchanged when the traces path is present", ({ expect }) => {
        expect(appendTracesPath("https://my-proxy.com/v1/traces")).toBe("https://my-proxy.com/v1/traces");
        expect(appendTracesPath("https://my-proxy.com/v1/traces/")).toBe("https://my-proxy.com/v1/traces/");
    });
});

describe("parseRetryAfterHeader", () => {
    test.concurrent("return undefined when the header is missing", ({ expect }) => {
        expect(parseRetryAfterHeader(null)).toBeUndefined();
        expect(parseRetryAfterHeader(undefined)).toBeUndefined();
    });

    test.concurrent("convert seconds to milliseconds", ({ expect }) => {
        expect(parseRetryAfterHeader("5")).toBe(5000);
    });

    test.concurrent("return -1 when the header is 0 seconds", ({ expect }) => {
        expect(parseRetryAfterHeader("0")).toBe(-1);
    });

    test.concurrent("compute the delay from an http date", ({ expect }) => {
        const delay = parseRetryAfterHeader(new Date(Date.now() + 10_000).toUTCString());

        expect(delay).toBeGreaterThan(8000);
        expect(delay).toBeLessThanOrEqual(10_000);
    });

    test.concurrent("return 0 when the http date is in the past", ({ expect }) => {
        expect(parseRetryAfterHeader(new Date(Date.now() - 10_000).toUTCString())).toBe(0);
    });
});

describe("createProxyTraceExporter", () => {
    test.concurrent("append the traces path to the endpoint", ({ expect }) => {
        const exporter = createProxyTraceExporter({ endpoint: "https://my-proxy.com" });

        expect(exporter.url).toBe("https://my-proxy.com/v1/traces");
    });

    test.concurrent("use the traces endpoint as is when provided", ({ expect }) => {
        const exporter = createProxyTraceExporter({ endpoint: "https://my-proxy.com", tracesEndpoint: "https://my-traces-proxy.com/otlp" });

        expect(exporter.url).toBe("https://my-traces-proxy.com/otlp");
    });

    test.concurrent("throw when there is no endpoint", ({ expect }) => {
        expect(() => createProxyTraceExporter({})).toThrow("[honeycomb] Cannot create the proxy trace exporter");
    });

    test.concurrent("send the credentials by default", ({ expect }) => {
        const exporter = createProxyTraceExporter({ endpoint: "https://my-proxy.com" });

        expect(exporter.credentials).toBe("include");
    });

    test.concurrent("use the provided credentials", ({ expect }) => {
        const exporter = createProxyTraceExporter({ endpoint: "https://my-proxy.com" }, "same-origin");

        expect(exporter.credentials).toBe("same-origin");
    });

    test.concurrent("set the json content type header", ({ expect }) => {
        const exporter = createProxyTraceExporter({ endpoint: "https://my-proxy.com" });

        expect(exporter.headers).toEqual({ "Content-Type": "application/json" });
    });

    test.concurrent("merge the headers and the traces headers", ({ expect }) => {
        const exporter = createProxyTraceExporter({
            endpoint: "https://my-proxy.com",
            headers: { "x-foo": "foo", "x-bar": "bar" },
            tracesHeaders: { "x-bar": "traces-bar" }
        });

        expect(exporter.headers).toEqual({
            "Content-Type": "application/json",
            "x-foo": "foo",
            "x-bar": "traces-bar"
        });
    });

    test.concurrent("the json content type header cannot be overridden", ({ expect }) => {
        const exporter = createProxyTraceExporter({
            endpoint: "https://my-proxy.com",
            headers: { "Content-Type": "application/x-protobuf" }
        });

        expect(exporter.headers["Content-Type"]).toBe("application/json");
    });

    test.concurrent("the json content type header cannot be overridden with another casing", ({ expect }) => {
        const exporter = createProxyTraceExporter({
            endpoint: "https://my-proxy.com",
            headers: { "content-type": "text/plain" },
            tracesHeaders: { "CONTENT-TYPE": "text/plain" }
        });

        const contentTypeHeaders = Object.keys(exporter.headers).filter(x => x.toLowerCase() === "content-type");

        expect(contentTypeHeaders).toEqual(["Content-Type"]);
        expect(exporter.headers["Content-Type"]).toBe("application/json");
    });

    test.concurrent("do not add the honeycomb team header when it is provided with another casing", ({ expect }) => {
        const exporter = createProxyTraceExporter({
            endpoint: "https://my-proxy.com",
            apiKey: "123",
            headers: { "X-Honeycomb-Team": "456" }
        });

        expect(exporter.headers["X-Honeycomb-Team"]).toBe("456");
        expect(exporter.headers["x-honeycomb-team"]).toBeUndefined();
    });

    test.concurrent("add the honeycomb team header when an api key is provided", ({ expect }) => {
        const exporter = createProxyTraceExporter({ endpoint: "https://my-proxy.com", apiKey: "123" });

        expect(exporter.headers["x-honeycomb-team"]).toBe("123");
    });

    test.concurrent("the traces api key takes precedence over the api key", ({ expect }) => {
        const exporter = createProxyTraceExporter({ endpoint: "https://my-proxy.com", apiKey: "123", tracesApiKey: "456" });

        expect(exporter.headers["x-honeycomb-team"]).toBe("456");
    });

    test.concurrent("do not add the honeycomb team header when there is no api key", ({ expect }) => {
        const exporter = createProxyTraceExporter({ endpoint: "https://my-proxy.com" });

        expect(exporter.headers["x-honeycomb-team"]).toBeUndefined();
    });
});

describe("ProxyTraceExporter", () => {
    test("send the spans to the proxy with the credentials", async ({ expect }) => {
        const fetchMock = vi.fn().mockResolvedValue(createResponse(200));
        vi.stubGlobal("fetch", fetchMock);

        const exporter = createProxyTraceExporter({ endpoint: "https://my-proxy.com" });
        const result = await exportSpans(exporter, createSpans());

        expect(result.code).toBe(ExportResultCode.SUCCESS);
        expect(fetchMock).toHaveBeenCalledTimes(1);

        const { url, init } = getRequest(fetchMock);

        expect(url).toBe("https://my-proxy.com/v1/traces");
        expect(init.method).toBe("POST");
        expect(init.credentials).toBe("include");
        expect(init.mode).toBe("cors");
        expect(init.keepalive).toBe(true);
        expect(init.signal).toBeInstanceOf(AbortSignal);
        expect(init.headers).toEqual({ "Content-Type": "application/json" });

        const body = decodeBody(init);

        expect(body.resourceSpans[0].scopeSpans[0].spans[0].name).toBe("span-0");
    });

    test("use the provided credentials", async ({ expect }) => {
        const fetchMock = vi.fn().mockResolvedValue(createResponse(200));
        vi.stubGlobal("fetch", fetchMock);

        const exporter = new ProxyTraceExporter({ url: "https://my-proxy.com/v1/traces", credentials: "omit" });
        await exportSpans(exporter, createSpans());

        expect(getRequest(fetchMock).init.credentials).toBe("omit");
    });

    test("use the same-origin mode when the proxy is on the document origin", async ({ expect }) => {
        const fetchMock = vi.fn().mockResolvedValue(createResponse(200));
        vi.stubGlobal("fetch", fetchMock);

        const exporter = new ProxyTraceExporter({ url: `${globalThis.location.origin}/telemetry/v1/traces` });
        await exportSpans(exporter, createSpans());

        expect(getRequest(fetchMock).init.mode).toBe("same-origin");
    });

    test("use the cors mode when there is no document location", async ({ expect }) => {
        const fetchMock = vi.fn().mockResolvedValue(createResponse(200));
        vi.stubGlobal("fetch", fetchMock);
        vi.stubGlobal("location", undefined);

        const exporter = createProxyTraceExporter({ endpoint: "https://my-proxy.com" });
        const result = await exportSpans(exporter, createSpans());

        expect(result.code).toBe(ExportResultCode.SUCCESS);
        expect(getRequest(fetchMock).init.mode).toBe("cors");
    });

    test("resolve a relative url against the document url", async ({ expect }) => {
        const fetchMock = vi.fn().mockResolvedValue(createResponse(200));
        vi.stubGlobal("fetch", fetchMock);

        const exporter = createProxyTraceExporter({ endpoint: "/telemetry" });
        const result = await exportSpans(exporter, createSpans());

        expect(result.code).toBe(ExportResultCode.SUCCESS);
        expect(getRequest(fetchMock).url).toBe(`${globalThis.location.origin}/telemetry/v1/traces`);
    });

    test("fail without retrying when the url is invalid", async ({ expect }) => {
        const fetchMock = vi.fn().mockResolvedValue(createResponse(200));
        vi.stubGlobal("fetch", fetchMock);

        const exporter = new ProxyTraceExporter({ url: "http://exa mple.com/v1/traces" });
        const result = await exportSpans(exporter, createSpans());

        expect(result.code).toBe(ExportResultCode.FAILED);
        expect(result.error?.message).toContain("is not a valid URL");
        expect(fetchMock).not.toHaveBeenCalled();
    });

    test("fail without retrying when the proxy answers 401", async ({ expect }) => {
        const fetchMock = vi.fn().mockResolvedValue(createResponse(401));
        vi.stubGlobal("fetch", fetchMock);

        const exporter = createProxyTraceExporter({ endpoint: "https://my-proxy.com" });
        const result = await exportSpans(exporter, createSpans());

        expect(result.code).toBe(ExportResultCode.FAILED);
        expect(result.error?.message).toContain("401");
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    test("retry when the proxy answers 503", async ({ expect }) => {
        vi.useFakeTimers();

        const fetchMock = vi.fn()
            .mockResolvedValueOnce(createResponse(503))
            .mockResolvedValueOnce(createResponse(200));

        vi.stubGlobal("fetch", fetchMock);

        const exporter = createProxyTraceExporter({ endpoint: "https://my-proxy.com" });
        const promise = exportSpans(exporter, createSpans());

        // The initial backoff is 1s with a 20% jitter.
        await vi.advanceTimersByTimeAsync(1300);

        const result = await promise;

        expect(result.code).toBe(ExportResultCode.SUCCESS);
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    test("honor the retry-after header", async ({ expect }) => {
        vi.useFakeTimers();

        const fetchMock = vi.fn()
            .mockResolvedValueOnce(createResponse(429, { "Retry-After": "3" }))
            .mockResolvedValueOnce(createResponse(200));

        vi.stubGlobal("fetch", fetchMock);

        const exporter = createProxyTraceExporter({ endpoint: "https://my-proxy.com" });
        const promise = exportSpans(exporter, createSpans());

        await vi.advanceTimersByTimeAsync(2900);

        expect(fetchMock).toHaveBeenCalledTimes(1);

        await vi.advanceTimersByTimeAsync(200);

        const result = await promise;

        expect(result.code).toBe(ExportResultCode.SUCCESS);
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    test("fail after the maximum retry attempts", async ({ expect }) => {
        vi.useFakeTimers();

        const fetchMock = vi.fn().mockResolvedValue(createResponse(503));
        vi.stubGlobal("fetch", fetchMock);

        const exporter = new ProxyTraceExporter({ url: "https://my-proxy.com/v1/traces", timeoutMillis: 60_000 });
        const promise = exportSpans(exporter, createSpans());

        // Backoffs are 1s, 1.5s, 2.25s, 3.375s and 5s (capped), with a 20% jitter.
        await vi.advanceTimersByTimeAsync(20_000);

        const result = await promise;

        expect(result.code).toBe(ExportResultCode.FAILED);
        expect(fetchMock).toHaveBeenCalledTimes(6);
    });

    test("stop retrying when the next retry exceeds the export timeout", async ({ expect }) => {
        vi.useFakeTimers();

        const fetchMock = vi.fn().mockResolvedValue(createResponse(503));
        vi.stubGlobal("fetch", fetchMock);

        const exporter = new ProxyTraceExporter({ url: "https://my-proxy.com/v1/traces", timeoutMillis: 500 });
        const promise = exportSpans(exporter, createSpans());

        await vi.advanceTimersByTimeAsync(5000);

        const result = await promise;

        expect(result.code).toBe(ExportResultCode.FAILED);
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    test("the retries never run past the export timeout", async ({ expect }) => {
        vi.useFakeTimers();

        let settled = false;

        const fetchMock = vi.fn()
            .mockResolvedValueOnce(createResponse(503, { "Retry-After": "2" }))
            .mockImplementationOnce((_url: string, init: RequestInit) => {
                return new Promise((_resolve, reject) => {
                    init.signal!.addEventListener("abort", () => {
                        reject(new DOMException("The operation was aborted.", "AbortError"));
                    });
                });
            });

        vi.stubGlobal("fetch", fetchMock);

        const exporter = new ProxyTraceExporter({ url: "https://my-proxy.com/v1/traces", timeoutMillis: 3000 });

        const promise = exportSpans(exporter, createSpans()).then(x => {
            settled = true;

            return x;
        });

        // The retry is scheduled in 2s, which leaves 1s to the second attempt.
        await vi.advanceTimersByTimeAsync(2000);

        expect(fetchMock).toHaveBeenCalledTimes(2);

        await vi.advanceTimersByTimeAsync(900);

        expect(settled).toBe(false);

        await vi.advanceTimersByTimeAsync(200);

        expect(settled).toBe(true);

        const result = await promise;

        expect(result.code).toBe(ExportResultCode.FAILED);
    });

    test("do not retry when the retry delay leaves no time for the attempt", async ({ expect }) => {
        vi.useFakeTimers();

        const fetchMock = vi.fn().mockResolvedValue(createResponse(503, { "Retry-After": "3" }));
        vi.stubGlobal("fetch", fetchMock);

        const exporter = new ProxyTraceExporter({ url: "https://my-proxy.com/v1/traces", timeoutMillis: 3000 });
        const promise = exportSpans(exporter, createSpans());

        await vi.advanceTimersByTimeAsync(5000);

        const result = await promise;

        // The failure is reported as retryable rather than as an aborted request.
        expect(result.code).toBe(ExportResultCode.FAILED);
        expect(result.error?.message).toContain("retryable");
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    test("retry when a network error occurs", async ({ expect }) => {
        vi.useFakeTimers();

        const fetchMock = vi.fn()
            .mockRejectedValueOnce(new TypeError("Failed to fetch"))
            .mockResolvedValueOnce(createResponse(200));

        vi.stubGlobal("fetch", fetchMock);

        const exporter = createProxyTraceExporter({ endpoint: "https://my-proxy.com" });
        const promise = exportSpans(exporter, createSpans());

        await vi.advanceTimersByTimeAsync(1300);

        const result = await promise;

        expect(result.code).toBe(ExportResultCode.SUCCESS);
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    test("fail without retrying when an unexpected error occurs", async ({ expect }) => {
        const fetchMock = vi.fn().mockRejectedValue(new Error("Boom"));
        vi.stubGlobal("fetch", fetchMock);

        const exporter = createProxyTraceExporter({ endpoint: "https://my-proxy.com" });
        const result = await exportSpans(exporter, createSpans());

        expect(result.code).toBe(ExportResultCode.FAILED);
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    test("abort the request when the export timeout is reached", async ({ expect }) => {
        vi.useFakeTimers();

        const fetchMock = vi.fn().mockImplementation((_url: string, init: RequestInit) => {
            return new Promise((_resolve, reject) => {
                init.signal!.addEventListener("abort", () => {
                    reject(new DOMException("The operation was aborted.", "AbortError"));
                });
            });
        });

        vi.stubGlobal("fetch", fetchMock);

        const exporter = new ProxyTraceExporter({ url: "https://my-proxy.com/v1/traces", timeoutMillis: 100 });
        const promise = exportSpans(exporter, createSpans());

        await vi.advanceTimersByTimeAsync(200);

        const result = await promise;

        expect(result.code).toBe(ExportResultCode.FAILED);
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    test("bypass the fetch instrumentation when fetch is wrapped", async ({ expect }) => {
        const originalFetch = vi.fn().mockResolvedValue(createResponse(200));
        const wrappedFetch = vi.fn().mockResolvedValue(createResponse(200));

        // Mimic the "@opentelemetry/instrumentation-fetch" wrapper.
        Object.assign(wrappedFetch, { __original: originalFetch });

        vi.stubGlobal("fetch", wrappedFetch);

        const exporter = createProxyTraceExporter({ endpoint: "https://my-proxy.com" });
        const result = await exportSpans(exporter, createSpans());

        expect(result.code).toBe(ExportResultCode.SUCCESS);
        expect(originalFetch).toHaveBeenCalledTimes(1);
        expect(wrappedFetch).not.toHaveBeenCalled();
    });

    test("disable keepalive when the payload exceeds the browser limit", async ({ expect }) => {
        const fetchMock = vi.fn().mockResolvedValue(createResponse(200));
        vi.stubGlobal("fetch", fetchMock);

        const exporter = createProxyTraceExporter({ endpoint: "https://my-proxy.com" });
        const result = await exportSpans(exporter, createSpans(1, { payload: "x".repeat(70 * 1024) }));

        expect(result.code).toBe(ExportResultCode.SUCCESS);
        expect(getRequest(fetchMock).init.keepalive).toBe(false);
    });

    test("send the provided headers", async ({ expect }) => {
        const fetchMock = vi.fn().mockResolvedValue(createResponse(200));
        vi.stubGlobal("fetch", fetchMock);

        const exporter = createProxyTraceExporter({ endpoint: "https://my-proxy.com", apiKey: "123", headers: { "x-foo": "bar" } });
        await exportSpans(exporter, createSpans());

        expect(getRequest(fetchMock).init.headers).toEqual({
            "Content-Type": "application/json",
            "x-honeycomb-team": "123",
            "x-foo": "bar"
        });
    });
});
