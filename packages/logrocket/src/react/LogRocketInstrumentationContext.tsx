import { createContext, type PropsWithChildren, useContext } from "react";
import type { LogRocketInstrumentationClient } from "../js/LogRocketInstrumentationClient.ts";

const LogRocketInstrumentationContext = createContext<LogRocketInstrumentationClient | undefined>(undefined);

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export interface LogRocketInstrumentationProviderProps extends PropsWithChildren {
    client: LogRocketInstrumentationClient;
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

export interface UseLogRocketInstrumentationClientOptions {
    /**
     * Whether or not an exception should be thrown if the client hasn't been provided.
     */
    throwOnUndefined?: boolean;
}

export function useLogRocketInstrumentationClient(options?: { throwOnUndefined?: true }): LogRocketInstrumentationClient;
export function useLogRocketInstrumentationClient(options: { throwOnUndefined: false }): LogRocketInstrumentationClient | undefined;

/**
 * Retrieve the LogRocket instrumentation client.
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export function useLogRocketInstrumentationClient(options: UseLogRocketInstrumentationClientOptions = {}) {
    const {
        throwOnUndefined = true
    } = options;

    const client = useContext(LogRocketInstrumentationContext);

    if (!client && throwOnUndefined) {
        throw new Error("[logrocket] The useLogRocketInstrumentationClient function is called before an LogRocketInstrumentationClient instance has been provided.");
    }

    return client;
}
