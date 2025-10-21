import type { LogRocketInstrumentationPartialClient } from "@workleap-telemetry/core";
import { createContext, type PropsWithChildren, useContext } from "react";

const LogRocketInstrumentationContext = createContext<LogRocketInstrumentationPartialClient | undefined>(undefined);

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export interface LogRocketInstrumentationProviderProps extends PropsWithChildren {
    client: LogRocketInstrumentationPartialClient;
}

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export function LogRocketInstrumentationProvider(props: LogRocketInstrumentationProviderProps) {
    const {
        client,
        children
    } = props;

    return (
        <LogRocketInstrumentationContext.Provider value={client}>
            {children}
        </LogRocketInstrumentationContext.Provider>
    );
}

/**
 * Retrieve the LogRocket instrumentation client.
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export function useLogRocketInstrumentationClient() {
    const client = useContext(LogRocketInstrumentationContext);

    if (!client) {
        throw new Error("[logrocket] The useLogRocketInstrumentationClient function is called before an LogRocketInstrumentationClient instance has been provided.");
    }

    return client;
}
