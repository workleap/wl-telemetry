import { HasExecutedGuard } from "@workleap-telemetry/core";
import { createCompositeLogger, type RootLogger } from "@workleap/logging";
import { CommonRoomInstrumentationClient } from "./CommonRoomInstrumentationClient.ts";

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

function loadSignals(siteId: string) {
    return new Promise<void>((resolve, reject) => {
        const url = `https://cdn.cr-relay.com/v1/site/${siteId}/signals.js`;

        // Do not load the script as a "module" because it will mess with CORS.
        const script = document.createElement("script");
        script.src = url;
        script.async = true;

        script.onload = () => {
            resolve();
        };

        script.onerror = () => {
            reject(`Failed to load Common Room script at "${url}".`);
        };

        // Must append the element after setting the event handlers for unit tests.
        document.head.appendChild(script);
    });
}

///////////////////////////

export type ReadyFunction = () => void;

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export interface RegisterCommonRoomInstrumentationOptions {
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

export class CommonRoomInstrumentationRegistrator {
    register(siteId: string, options: RegisterCommonRoomInstrumentationOptions = {}) {
        const {
            verbose = false,
            loggers = []
        } = options;

        const logger = createCompositeLogger(verbose, loggers);

        loadSignals(siteId)
            .then(() => {
                logger.information("[common-room] Common Room instrumentation is registered.");
            })
            .catch((reason: string) => {
                logger.error(`[common-room] ${reason}`);
            });

        return new CommonRoomInstrumentationClient(logger);
    }
}

/**
 * Register instrumentation for the Common Room platform.
 * @param siteId The Common Room site id.
 * @param options The Common Room options.
 * @returns {CommonRoomInstrumentationClient} A Common Room instrumentation client instance.
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export function registerCommonRoomInstrumentation(siteId: string, options?: RegisterCommonRoomInstrumentationOptions) {
    getRegistrationGuard().throw("[common-room] The Common Room instrumentation has already been registered. Did you call the \"registerCommonRoomInstrumentation\" function twice?");

    return new CommonRoomInstrumentationRegistrator().register(siteId, options);
}
