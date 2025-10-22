import type { LogRocketInstrumentationClient, LogRocketWorkleapPlatformUserTraits } from "./LogRocketInstrumentationClient.ts";

export class NoopLogRocketInstrumentationClient implements LogRocketInstrumentationClient {
    createWorkleapPlatformDefaultUserTraits() {
        return {} as LogRocketWorkleapPlatformUserTraits;
    }

    registerGetSessionUrlListener() {}
}
