import { createContext, useContext } from "react";
import type { TelemetryClient } from "../js/TelemetryClient.ts";

const TelemetryClientContext = createContext<TelemetryClient | undefined>(undefined);

export const TelemetryClientProvider = TelemetryClientContext.Provider;

export function useTelemetryClient() {
    const client = useContext(TelemetryClientContext);

    if (!client) {
        throw new Error("[telemetry] The useTelemetryClient function is called before a TelemetryClient instance has been provided.");
    }

    return client;
}
