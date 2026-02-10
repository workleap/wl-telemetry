import { HasExecutedGuard, type LogRocketInstrumentationPartialClient, type TelemetryContext } from "@workleap-telemetry/core";
import { createCompositeLogger, type RootLogger } from "@workleap/logging";
import { getTrackingEndpoint, type MixpanelEnvironment } from "./env.ts";
import { type MixpanelClient, MixpanelClientImpl, type MixpanelGlobalEventProperties } from "./MixpanelClient.ts";
import { getTelemetryProperties, OtherProperties } from "./properties.ts";

let registrationGuardInstance: HasExecutedGuard | undefined;

// It's important to use a lazy singleton instead of a singleton to avoid
// any future probleme related to HMR, tree-shaking, SSR, etc..
function getRegistrationGuard() {
    if (!registrationGuardInstance) {
        registrationGuardInstance = new HasExecutedGuard();
    }

    return registrationGuardInstance;
}

// This function should only be used by tests.
export function __resetRegistrationGuard() {
    if (registrationGuardInstance) {
        registrationGuardInstance.reset();
    }
}

///////////////////////////

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export interface InitializeMixpanelOptions {
    /**
     * An optional tracking endpoint.
     * @default "tracking/track"
     * @see {@link https://workleap.github.io/wl-telemetry}
     */
    trackingEndpoint?: string;
    /**
     * Context including telemetry correlation ids.
     * @see {@link https://workleap.github.io/wl-telemetry}
     */
    telemetryContext?: TelemetryContext;
    /**
     * An optional LogRocket client to automatically add the LogRocket
     * session URL to Mixpanel events once it's available.
     * @see {@link https://workleap.github.io/wl-telemetry}
     */
    logRocketInstrumentationClient?: LogRocketInstrumentationPartialClient;
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

export class MixpanelInitializer {
    readonly #globalEventProperties: MixpanelGlobalEventProperties;

    constructor(globalEventProperties: MixpanelGlobalEventProperties) {
        this.#globalEventProperties = globalEventProperties;
    }

    initialize(
        productId: string,
        envOrTrackingApiBaseUrl: MixpanelEnvironment | (string & {}),
        options: InitializeMixpanelOptions = {}
    ) {
        const {
            trackingEndpoint,
            telemetryContext,
            logRocketInstrumentationClient,
            verbose = false,
            loggers = []
        } = options;

        const logger = createCompositeLogger(verbose, loggers);
        const endpoint = getTrackingEndpoint(envOrTrackingApiBaseUrl, trackingEndpoint);

        // Set the telemetry correlation ids on every Mixpanel event.
        if (telemetryContext) {
            for (const [key, value] of Object.entries(getTelemetryProperties(telemetryContext))) {
                this.#globalEventProperties.set(key, value);
            }
        }

        // If a LogRocket client is already available, register a listener to get the LogRocket session url
        // once it's available to set it on every Mixpanel event.
        if (logRocketInstrumentationClient) {
            logRocketInstrumentationClient.registerGetSessionUrlListener((sessionUrl: string) => {
                logger
                    .withText("[mixpanel] Received LogRocket session replay URL:")
                    .withText(sessionUrl)
                    .debug();

                this.#globalEventProperties.set(OtherProperties.LogRocketSessionUrl, sessionUrl);
            });
        }

        logger.information("[mixpanel] Mixpanel is initialized.");

        const client = new MixpanelClientImpl(productId, endpoint, this.#globalEventProperties, logger);

        // The cast is to normalize the inferred return type to the "LogRocketInstrumentationClient" type.
        return client as MixpanelClient;
    }
}

/**
 * Initialize Mixpanel telemetry.
 * @param productId The Mixpanel product identifier.
 * @param envOrTrackingApiBaseUrl The environment to get the navigation url from or a base URL.
 * @param options Mixpanel instrumentation options.
 * @returns {MixpanelClient} A Mixpanel client instance.
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export function initializeMixpanel(
    productId: string,
    envOrTrackingApiBaseUrl: MixpanelEnvironment | (string & {}),
    options?: InitializeMixpanelOptions
) {
    getRegistrationGuard().throw("[mixpanel] Mixpanel has already been initialized. Did you call the \"initializeMixpanel\" function twice?");

    return new MixpanelInitializer(
        new Map<string, unknown>()
    ).initialize(
        productId,
        envOrTrackingApiBaseUrl,
        options
    );
}
