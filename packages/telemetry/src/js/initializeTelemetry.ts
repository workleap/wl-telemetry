import type { ProductFamily } from "@workleap-telemetry/core";
import { createTelemetryContext } from "@workleap-telemetry/core";
import { registerHoneycombInstrumentation, type HoneycombInstrumentationClient, type HoneycombSdkOptions, type PropagateTraceHeaderCorsUrls, type RegisterHoneycombInstrumentationOptions } from "@workleap/honeycomb";
import type { RootLogger } from "@workleap/logging";
import { registerLogRocketInstrumentation, type LogRocketInstrumentationClient, type RegisterLogRocketInstrumentationOptions } from "@workleap/logrocket";
import { initializeMixpanel, type InitializeMixpanelOptions, type MixpanelClient, type MixpanelEnvironment } from "@workleap/mixpanel";
import { TelemetryClientImpl } from "./TelemetryClient.ts";

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export interface InitializeTelemetryOptions {
    /**
     * Enable LogRocket telemetry.
     * @see {@link https://workleap.github.io/wl-telemetry}
     */
    logRocket?: {
        /**
         * LogRocket application id.
         * @see {@link https://workleap.github.io/wl-telemetry}
         */
        appId: string;
        /**
         * LogRocket instrumentation options.
         * @see {@link https://workleap.github.io/wl-telemetry}
         */
        options?: Omit<RegisterLogRocketInstrumentationOptions, "telemetryContext" | "verbose" | "loggers">;
    };
    /**
     * Enable Honeycomb telemetry.
     * @see {@link https://workleap.github.io/wl-telemetry}
     */
    honeycomb?: {
        /**
         * Set the "service.namespace" attribute for every trace.
         * @see {@link https://workleap.github.io/wl-telemetry}
         */
        namespace: string;
        /**
         * Honeycomb service name.
         * @see {@link https://workleap.github.io/wl-telemetry}
         */
        serviceName: NonNullable<HoneycombSdkOptions["serviceName"]>;
        /**
         * Regex matching the hostname of the requests that the instrumentation will
         * add the trace context to the HTTP header.
         * @see {@link https://workleap.github.io/wl-telemetry}
         */
        apiServiceUrls: PropagateTraceHeaderCorsUrls;
        /**
         * Honeycomb instrumentation options.
         * @see {@link https://workleap.github.io/wl-telemetry}
         */
        options?: Omit<RegisterHoneycombInstrumentationOptions, "telemetryContext" | "logRocketInstrumentationClient" | "verbose" | "loggers">;
    };
    /**
     * Enable Mixpanel telemetry.
     * @see {@link https://workleap.github.io/wl-telemetry}
     */
    mixpanel?: {
        /**
         * The environment to get the navigation url from or a base URL.
         * @see {@link https://workleap.github.io/wl-telemetry}
         */
        envOrTrackingApiBaseUrl: MixpanelEnvironment | (string & {});
        /**
         * Mixpanel instrumentation options.
         * @see {@link https://workleap.github.io/wl-telemetry}
         */
        options?: Omit<InitializeMixpanelOptions, "telemetryContext" | "logRocketInstrumentationClient" | "verbose" | "loggers">;
    };
    /**
     * Names of additional query parameters to redact from the URLs sent to every telemetry platform.
     * @see {@link https://workleap.github.io/wl-telemetry}
     */
    privateQueryParameterNames?: string[];
    /**
     * Whether or not debug information should be logged to the console.
     * @see {@link https://workleap.github.io/wl-telemetry}
     */
    verbose?: boolean;
    /**
     * An array of RootLogger instances.
     * @see {@link https://workleap.github.io/wl-telemetry}
     */
    loggers?: RootLogger[];
}

/**
 * Composite telemetry initialization orchestrating the bootstrapping of Workleap telemetry platforms trio.
 * @param productFamily The family of Workleap products.
 * @param options Telemetry platform options.
 * @returns {TelemetryClient} A telemetry client instance.
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export function initializeTelemetry(productFamily: ProductFamily, options: InitializeTelemetryOptions = {}) {
    const { logRocket, honeycomb, mixpanel, privateQueryParameterNames = [], verbose, loggers } = options;

    const telemetryContext = createTelemetryContext(productFamily, {
        verbose,
        loggers
    });

    let logRocketClient: LogRocketInstrumentationClient | undefined;
    let honeycombClient: HoneycombInstrumentationClient | undefined;
    let mixpanelClient: MixpanelClient | undefined;

    if (logRocket) {
        logRocketClient = registerLogRocketInstrumentation(logRocket.appId, {
            ...logRocket.options,
            privateQueryParameterNames: privateQueryParameterNames.concat(logRocket.options?.privateQueryParameterNames ?? []),
            telemetryContext,
            verbose,
            loggers
        });
    }

    if (honeycomb) {
        honeycombClient = registerHoneycombInstrumentation(honeycomb.namespace, honeycomb.serviceName, honeycomb.apiServiceUrls, {
            ...honeycomb.options,
            privateQueryParameterNames: privateQueryParameterNames.concat(honeycomb.options?.privateQueryParameterNames ?? []),
            logRocketInstrumentationClient: logRocketClient,
            telemetryContext,
            verbose,
            loggers
        });
    }

    if (mixpanel) {
        mixpanelClient = initializeMixpanel(mixpanel.envOrTrackingApiBaseUrl, {
            ...mixpanel.options,
            privateQueryParameterNames: privateQueryParameterNames.concat(mixpanel.options?.privateQueryParameterNames ?? []),
            telemetryContext,
            logRocketInstrumentationClient: logRocketClient,
            verbose,
            loggers
        });
    }

    return new TelemetryClientImpl(logRocketClient, honeycombClient, mixpanelClient);
}
