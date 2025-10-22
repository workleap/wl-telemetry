import type { Logger } from "@workleap/logging";

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export interface CommonRoomInstrumentationClient {
    /**
     * Identify a user for the Common Room platform.
     * @see {@link https://workleap.github.io/wl-telemetry}
     */
    identify: (email: string) => void;
}

export class CommonRoomInstrumentationClientImpl implements CommonRoomInstrumentationClient {
    readonly #logger: Logger;

    constructor(logger: Logger) {
        this.#logger = logger;
    }

    identify(email: string) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const signals = globalThis.signals;

        if (!signals) {
            this.#logger.error("[common-room] Cannot identify user because the signals scripts is not loaded. Did you initialize signals with the \"registerCommonRoomInstrumentation\" function?");

            return;
        }

        signals.identify({
            email
        });

        this.#logger.information("[common-room] User has been identified.");
    }
}
