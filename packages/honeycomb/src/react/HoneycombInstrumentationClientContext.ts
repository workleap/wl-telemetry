import { createContext, useContext } from "react";
import type { HoneycombInstrumentationClient } from "../js/HoneycombInstrumentationClient.ts";

const HoneycombInstrumentationClientContext = createContext<HoneycombInstrumentationClient | undefined>(undefined);

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export const HoneycombInstrumentationClientProvider = HoneycombInstrumentationClientContext.Provider;

/**
 * Retrieve the Honeycomb instrumentation client.
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export function useHoneycombInstrumentationClient() {
    const client = useContext(HoneycombInstrumentationClientContext);

    if (!client) {
        throw new Error("[honeycomb] The useHoneycombInstrumentationClient function is called before an HoneycombInstrumentationClient instance has been provided.");
    }

    return client;
}
