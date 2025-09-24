import { createContext, useContext } from "react";
import { LogRocketInstrumentationClient } from "../js/LogRocketInstrumentationClient.ts";

const LogRocketInstrumentationClientContext = createContext<LogRocketInstrumentationClient | undefined>(undefined);

export const LogRocketInstrumentationClientProvider = LogRocketInstrumentationClientContext.Provider;

export function useLogRocketInstrumentationClient() {
    const client = useContext(LogRocketInstrumentationClientContext);

    if (!client) {
        throw new Error("[logrocket] The useLogRocketInstrumentationClient function is called before an LogRocketInstrumentationClient instance has been provided.");
    }

    return client;
}
