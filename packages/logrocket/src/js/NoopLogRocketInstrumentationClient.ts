import type { LogRocketInstrumentationPartialClient } from "@workleap-telemetry/core";

export class NoopLogRocketInstrumentationClient implements LogRocketInstrumentationPartialClient {
    registerGetSessionUrlListener() {}
}
