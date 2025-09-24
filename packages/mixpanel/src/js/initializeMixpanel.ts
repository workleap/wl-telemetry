import { createCompositeLogger, type Logger, type RootLogger } from "@workleap/logging";
import { BootstrappingStore, TelemetryContext } from "@workleap/telemetry";
import { setMixpanelContext } from "./context.ts";
import { getTrackingEndpoint, type Environment } from "./env.ts";
import { HasExecutedGuard } from "./HasExecutedGuard.ts";
import { MixpanelClient, SuperProperties } from "./MixpanelClient.ts";
import { getTelemetryProperties, OtherProperties } from "./properties.ts";

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export interface InitializeMixpanelOptions {
    /**
     * An optional tracking endpoint.
     * @default "tracking/track"
     */
    trackingEndpoint?: string;
    /**
     * Whether or not debug information should be logged to the console.
     */
    verbose?: boolean;
    /**
     * An array of RootLogger instances.
     */
    loggers?: RootLogger[];
}

function registerLogRocketSessionUrlListener(superProperties: SuperProperties, logger: Logger) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (globalThis.__WLP_LOGROCKET_INSTRUMENTATION_REGISTER_GET_SESSION_URL_LISTENER__) {
        // Automatically add the LogRocket session URL to all Honeycomb traces as an attribute.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        globalThis.__WLP_LOGROCKET_INSTRUMENTATION_REGISTER_GET_SESSION_URL_LISTENER__((sessionUrl: string) => {
            logger
                .withText("[mixpanel] Received LogRocket session replay URL:")
                .withText(sessionUrl)
                .debug();

            superProperties.set(OtherProperties.LogRocketSessionUrl, sessionUrl);
        });
    } else {
        logger.information("[mixpanel] Cannot integrate with LogRocket because \"globalThis.__WLP_LOGROCKET_INSTRUMENTATION_REGISTER_GET_SESSION_URL_LISTENER__\" is not available.");
    }
}

///////////////////////////

// DEPRECATED: Grace period ends on January 1th 2026.
// Don't forget to remove the tests as well.
export const IsInitializedVariableName = "__WLP_MIXPANEL_IS_INITIALIZED__";

// DEPRECATED: Grace period ends on January 1th 2026.
function registerDeprecatedContextAndGlobalVariables(productId: string, endpoint: string, superProperties: Map<string, unknown>, logger: Logger) {
    setMixpanelContext({
        productId,
        endpoint,
        superProperties: superProperties,
        logger
    });

    // Indicates to the host applications that Mixpanel has been initialized.
    // It's useful in cases where an "add-on", like the platform widgets needs
    // to know whether or not the host application is using Mixpanel.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    globalThis[IsInitializedVariableName] = true;
}

///////////////////////////

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

export class MixpanelInitializer {
    initialize(
        productId: string,
        envOrTrackingApiBaseUrl: Environment | (string & {}),
        telemetryContext: TelemetryContext,
        bootstrappingStore: BootstrappingStore,
        options: InitializeMixpanelOptions = {}
    ) {
        const {
            trackingEndpoint,
            verbose = false,
            loggers = []
        } = options;

        const logger = createCompositeLogger(verbose, loggers);
        const endpoint = getTrackingEndpoint(envOrTrackingApiBaseUrl, trackingEndpoint);
        const superProperties: SuperProperties = new Map<string, unknown>();

        for (const [key, value] of Object.entries(getTelemetryProperties(telemetryContext))) {
            superProperties.set(key, value);
        }

        // If LogRocket is already available, register the listener. Otherwise, subscribe to the bootstrapping store
        // and register the listener once a notification is received that LogRocket is registered.
        if (bootstrappingStore.state.isLogRocketReady) {
            registerLogRocketSessionUrlListener(superProperties, logger);
        } else {
            bootstrappingStore.subscribe((action, store, unsubscribe) => {
                if (store.state.isLogRocketReady) {
                    unsubscribe();
                    registerLogRocketSessionUrlListener(superProperties, logger);
                }
            });
        }

        registerDeprecatedContextAndGlobalVariables(productId, endpoint, superProperties, logger);

        logger.information("[mixpanel] Mixpanel is initialized.");

        return new MixpanelClient(productId, endpoint, superProperties, logger);
    }
}

/**
 * Creates a function that sends tracking events to the tracking API.
 * @param productId Your product identifier.
 * @param envOrTrackingApiBaseUrl The environment to get the navigation url from or a base URL.
 * @param options Options for creating the tracking function.
 * @returns A function that sends tracking events to the tracking API.
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export function initializeMixpanel(
    productId: string,
    envOrTrackingApiBaseUrl: Environment | (string & {}),
    telemetryContext: TelemetryContext,
    bootstrappingStore: BootstrappingStore,
    options?: InitializeMixpanelOptions
) {
    getRegistrationGuard().throw("[mixpanel] Mixpanel has already been initialized. Did you call the \"initializeMixpanel\" function twice?");

    return new MixpanelInitializer().initialize(productId, envOrTrackingApiBaseUrl, telemetryContext, bootstrappingStore, options);
}
