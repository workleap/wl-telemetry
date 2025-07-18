import { getBootstrappingStore, getTelemetryContext } from "@workleap/telemetry";
import { setMixpanelContext } from "./context.ts";
import { getTrackingEndpoint, type Environment } from "./env.ts";
import { HasExecutedGuard } from "./HasExecutedGuard.ts";
import { getSuperProperties, getTelemetryProperties, OtherProperties, setSuperProperties, setSuperProperty } from "./properties.ts";

/**
 * @see https://workleap.github.io/wl-telemetry
 */
export interface InitializeMixpanelOptions {
    verbose?: boolean;
}
function registerLogRocketSessionUrlListener(verbose = false) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (globalThis.__WLP_LOGROCKET_INSTRUMENTATION_REGISTER_GET_SESSION_URL_LISTENER__) {
        // Automatically add the LogRocket session URL to all Honeycomb traces as an attribute.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        globalThis.__WLP_LOGROCKET_INSTRUMENTATION_REGISTER_GET_SESSION_URL_LISTENER__((sessionUrl: string) => {
            if (verbose) {
                console.log("[mixpanel] Received LogRocket session replay URL:", sessionUrl);
            }

            setSuperProperty(OtherProperties.LogRocketSessionUrl, sessionUrl);
        });
    } else if (verbose) {
        console.log("[mixpanel] Cannot integrate with LogRocket because \"globalThis.__WLP_LOGROCKET_INSTRUMENTATION_REGISTER_GET_SESSION_URL_LISTENER__\" is not available.");
    }
}

const initializationGuard = new HasExecutedGuard();

// This function should only be used by tests.
export function __resetInitializationGuard() {
    initializationGuard.reset();
}

/**
 * Creates a function that sends tracking events to the tracking API.
 * @param productId Your product identifier.
 * @param envOrTrackingApiBaseUrl The environment to get the navigation url from or a base URL.
 * @param options Options for creating the tracking function.
 * @returns A function that sends tracking events to the tracking API.
 * @see https://workleap.github.io/wl-telemetry
 */
export function initializeMixpanel(productId: string, envOrTrackingApiBaseUrl: Environment | (string & {}), options: InitializeMixpanelOptions = {}) {
    const {
        verbose = false
    } = options;

    initializationGuard.throw("[mixpanel] Mixpanel has already been initialized. Did you call the \"initializeMixpanel\" function twice?");

    const endpoint = getTrackingEndpoint(envOrTrackingApiBaseUrl);
    const telemetryContext = getTelemetryContext({ verbose });

    setSuperProperties(getTelemetryProperties(telemetryContext));

    const bootstrappingStore = getBootstrappingStore();

    // If LogRocket is already available, register the listener. Otherwise, subscribe to the bootstrapping store
    // and register the listener once a notification is received that LogRocket is registered.
    if (bootstrappingStore.state.isLogRocketReady) {
        registerLogRocketSessionUrlListener(verbose);
    } else {
        bootstrappingStore.subscribe((action, store, unsubscribe) => {
            if (store.state.isLogRocketReady) {
                unsubscribe();
                registerLogRocketSessionUrlListener(verbose);
            }
        });
    }

    setMixpanelContext({
        productId,
        endpoint,
        superProperties: getSuperProperties(),
        verbose
    });

    if (verbose) {
        console.log("[mixpanel] Mixpanel is initialized.");
    }
}
