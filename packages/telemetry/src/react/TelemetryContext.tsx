import { createContext, type PropsWithChildren, useContext } from "react";
import type { TelemetryClient } from "../js/TelemetryClient.ts";

const TelemetryContext = createContext<TelemetryClient | undefined>(undefined);

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export interface TelemetryProviderProps extends PropsWithChildren {
    client: TelemetryClient;
}

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export function TelemetryProvider(props: TelemetryProviderProps) {
    const {
        client,
        children
    } = props;

    return (
        <TelemetryContext.Provider value={client}>
            {children}
        </TelemetryContext.Provider>
    );
}

/**
 * Retrieve the telemetry client.
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export function useTelemetryClient() {
    const client = useContext(TelemetryContext);

    if (!client) {
        throw new Error("[telemetry] The useTelemetryClient function is called before a TelemetryClient instance has been provided.");
    }

    return client;
}
