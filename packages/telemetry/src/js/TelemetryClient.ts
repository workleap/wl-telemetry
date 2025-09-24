import type { HoneycombInstrumentationClient } from "@workleap/honeycomb";
import type { LogRocketInstrumentationClient } from "@workleap/logrocket";
import type { MixpanelClient } from "@workleap/mixpanel";

export class TelemetryClient {
    readonly #logRocketClient?: LogRocketInstrumentationClient;
    readonly #honeycombClient?: HoneycombInstrumentationClient;
    readonly #mixpanelClient?: MixpanelClient;

    constructor(logRocketClient?: LogRocketInstrumentationClient, honeycombClient?: HoneycombInstrumentationClient, mixpanelClient?: MixpanelClient) {
        this.#logRocketClient = logRocketClient;
        this.#honeycombClient = honeycombClient;
        this.#mixpanelClient = mixpanelClient;
    }

    get logRocket() {
        return this.#logRocketClient;
    }

    get honeycomb() {
        return this.#honeycombClient;
    }

    get mixpanel() {
        return this.#mixpanelClient;
    }
}
