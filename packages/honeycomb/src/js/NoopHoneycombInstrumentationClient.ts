import type { HoneycombInstrumentationClient } from "./HoneycombInstrumentationClient.ts";

export class NoopHoneycombInstrumentationClient implements HoneycombInstrumentationClient {
    setGlobalSpanAttribute() {}
    setGlobalSpanAttributes() {}
    registerFetchRequestHook() {}
    registerFetchRequestHookAtStart() {}
}
