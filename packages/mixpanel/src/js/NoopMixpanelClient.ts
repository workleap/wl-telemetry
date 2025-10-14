import type { MixpanelPartialClient } from "@workleap-telemetry/core";

export class NoopMixpanelClient implements MixpanelPartialClient {
    createTrackingFunction() {
        return () => Promise.resolve();
    }
}
