import type { PropagateTraceHeaderCorsUrls } from "@opentelemetry/sdk-trace-web";
import { createBootstrappingStore, createTelemetryContext } from "@workleap-telemetry/core";
import { registerHoneycombInstrumentation, type HoneycombInstrumentationClient, type HoneycombSdkOptions, type RegisterHoneycombInstrumentationOptions } from "@workleap/honeycomb";
import { createCompositeLogger, type RootLogger } from "@workleap/logging";
import { registerLogRocketInstrumentation, type LogRocketInstrumentationClient, type RegisterLogRocketInstrumentationOptions } from "@workleap/logrocket";
import { initializeMixpanel, type MixpanelEnvironment, type InitializeMixpanelOptions } from "@workleap/mixpanel";
import type { MixpanelClient } from "../../../mixpanel/src/js/MixpanelClient.ts";
import { TelemetryClient } from "./TelemetryClient.ts";

export interface InitializeTelemetryOptions {
    logRocket?: {
        appId: string;
        options?: Omit<RegisterLogRocketInstrumentationOptions, "verbose" | "loggers">;
    };
    honeycomb?: {
        namespace: string;
        serviceName: NonNullable<HoneycombSdkOptions["serviceName"]>;
        apiServiceUrls: PropagateTraceHeaderCorsUrls;
        options?: Omit<RegisterHoneycombInstrumentationOptions, "verbose" | "loggers">;
    };
    mixpanel?: {
        productId: string;
        envOrTrackingApiBaseUrl: MixpanelEnvironment | (string & {});
        options?: Omit<InitializeMixpanelOptions, "verbose" | "loggers">;
    };
    /**
     * Whether or not debug information should be logged to the console.
     */
    verbose?: boolean;
    /**
     * An array of RootLogger instances.
     */
    loggers?: RootLogger[];
}

export function initializeTelemetry(options: InitializeTelemetryOptions = {}) {
    const {
        logRocket,
        honeycomb,
        mixpanel,
        verbose = false,
        loggers = []
    } = options;

    const logger = createCompositeLogger(verbose, loggers);

    const telemetryContext = createTelemetryContext(logger);
    const bootstrappingStore = createBootstrappingStore(logger);

    let logRocketClient: LogRocketInstrumentationClient | undefined;
    let honeycombClient: HoneycombInstrumentationClient | undefined;
    let mixpanelClient: MixpanelClient | undefined;

    if (logRocket) {
        logRocketClient = registerLogRocketInstrumentation(
            logRocket.appId,
            telemetryContext,
            bootstrappingStore,
            logRocket.options
        );
    }

    if (honeycomb) {
        honeycombClient = registerHoneycombInstrumentation(
            honeycomb.namespace,
            honeycomb.serviceName,
            honeycomb.apiServiceUrls,
            telemetryContext,
            bootstrappingStore,
            honeycomb.options
        );
    }

    if (mixpanel) {
        mixpanelClient = initializeMixpanel(
            mixpanel.productId,
            mixpanel.envOrTrackingApiBaseUrl,
            telemetryContext,
            bootstrappingStore,
            mixpanel.options
        );
    }

    return new TelemetryClient(logRocketClient, honeycombClient, mixpanelClient);
}
