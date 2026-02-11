import type { LogRocketInstrumentationClient, LogRocketShareGateUserTraits, LogRocketWorkleapPlatformUserTraits } from "./LogRocketInstrumentationClient.ts";

export class NoopLogRocketInstrumentationClient implements LogRocketInstrumentationClient {
    createWorkleapPlatformDefaultUserTraits() {
        return {} as LogRocketWorkleapPlatformUserTraits;
    }

    createShareGateDefaultUserTraits() {
        return {} as LogRocketShareGateUserTraits;
    }

    registerGetSessionUrlListener() {}
}
