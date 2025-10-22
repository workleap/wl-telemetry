import type { MixpanelClient } from "./MixpanelClient.ts";

export class NoopMixpanelClient implements MixpanelClient {
    createTrackingFunction() {
        return () => Promise.resolve();
    }

    setGlobalEventProperty() {}
    setGlobalEventProperties() {}
}
