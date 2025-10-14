import type { HoneycombInstrumentationPartialClient } from "@workleap-telemetry/core";

export class NoopHoneycombInstrumentationClient implements HoneycombInstrumentationPartialClient {
    registerFetchRequestHook() {}
    registerFetchRequestHookAtStart() {}
}
