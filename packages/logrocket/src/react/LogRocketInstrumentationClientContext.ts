import { createContext, useContext } from "react";
import type { LogRocketInstrumentationClient } from "../js/LogRocketInstrumentationClient.ts";

const LogRocketInstrumentationClientContext = createContext<LogRocketInstrumentationClient | undefined>(undefined);

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export const LogRocketInstrumentationClientProvider = LogRocketInstrumentationClientContext.Provider;

/**
 * Retrieve the LogRocket instrumentation client.
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export function useLogRocketInstrumentationClient() {
    const client = useContext(LogRocketInstrumentationClientContext);

    if (!client) {
        throw new Error("[logrocket] The useLogRocketInstrumentationClient function is called before an LogRocketInstrumentationClient instance has been provided.");
    }

    return client;
}
