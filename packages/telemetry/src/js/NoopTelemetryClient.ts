import { NoopHoneycombInstrumentationClient } from "@workleap/honeycomb";
import { NoopLogRocketInstrumentationClient } from "@workleap/logrocket";
import { NoopMixpanelClient } from "@workleap/mixpanel";
import type { TelemetryClient } from "./TelemetryClient.ts";

export class NoopTelemetryClient implements TelemetryClient {
    readonly #logRocketClient = new NoopLogRocketInstrumentationClient();
    readonly #honeycombClient = new NoopHoneycombInstrumentationClient();
    readonly #mixpanelClient = new NoopMixpanelClient();

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
