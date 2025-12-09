import type { PropagateTraceHeaderCorsUrls } from "@opentelemetry/sdk-trace-web";
import { createTelemetryContext } from "@workleap-telemetry/core";
import { registerHoneycombInstrumentation, type HoneycombInstrumentationClient, type HoneycombSdkOptions, type RegisterHoneycombInstrumentationOptions } from "@workleap/honeycomb";
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
         * The Mixpanel product identifier.
         * @see {@link https://workleap.github.io/wl-telemetry}
         */
        productId: string;
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
 * @param options Telemetry platform options.
 * @returns {TelemetryClient} A telemetry client instance.
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export function initializeTelemetry(options: InitializeTelemetryOptions = {}) {
    const {
        logRocket,
        honeycomb,
        mixpanel,
        verbose,
        loggers
    } = options;

    const telemetryContext = createTelemetryContext({
        verbose,
        loggers
    });

    let logRocketClient: LogRocketInstrumentationClient | undefined;
    let honeycombClient: HoneycombInstrumentationClient | undefined;
    let mixpanelClient: MixpanelClient | undefined;

    if (logRocket) {
        logRocketClient = registerLogRocketInstrumentation(
            logRocket.appId,
            {
                ...(logRocket.options ?? {}),
                telemetryContext,
                verbose,
                loggers
            }
        );
    }

    if (honeycomb) {
        honeycombClient = registerHoneycombInstrumentation(
            honeycomb.namespace,
            honeycomb.serviceName,
            honeycomb.apiServiceUrls,
            {
                ...(honeycomb.options ?? {}),
                logRocketInstrumentationClient: logRocketClient,
                telemetryContext,
                verbose,
                loggers
            }
        );
    }

    if (mixpanel) {
        mixpanelClient = initializeMixpanel(
            mixpanel.productId,
            mixpanel.envOrTrackingApiBaseUrl,
            {
                ...(mixpanel.options ?? {}),
                telemetryContext,
                logRocketInstrumentationClient: logRocketClient,
                verbose,
                loggers
            }
        );
    }

    return new TelemetryClientImpl(logRocketClient, honeycombClient, mixpanelClient);
}
