import type { HoneycombInstrumentationClient } from "@workleap/honeycomb";
import type { LogRocketInstrumentationClient } from "@workleap/logrocket";
import type { MixpanelClient } from "@workleap/mixpanel";

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export class TelemetryClient {
    readonly #logRocketClient?: LogRocketInstrumentationClient;
    readonly #honeycombClient?: HoneycombInstrumentationClient;
    readonly #mixpanelClient?: MixpanelClient;

    constructor(logRocketClient?: LogRocketInstrumentationClient, honeycombClient?: HoneycombInstrumentationClient, mixpanelClient?: MixpanelClient) {
        this.#logRocketClient = logRocketClient;
        this.#honeycombClient = honeycombClient;
        this.#mixpanelClient = mixpanelClient;
    }

    /**
     * @see {@link https://workleap.github.io/wl-telemetry}
     */
    get logRocket() {
        return this.#logRocketClient;
    }

    /**
     * @see {@link https://workleap.github.io/wl-telemetry}
     */
    get honeycomb() {
        return this.#honeycombClient;
    }

    /**
     * @see {@link https://workleap.github.io/wl-telemetry}
     */
    get mixpanel() {
        return this.#mixpanelClient;
    }
}
