import { createContext, useContext } from "react";
import { HoneycombInstrumentationClient } from "../js/HoneycombInstrumentationClient.ts";

const HoneycombInstrumentationClientContext = createContext<HoneycombInstrumentationClient | undefined>(undefined);

export const HoneycombInstrumentationClientProvider = HoneycombInstrumentationClientContext.Provider;

export function useHoneycombInstrumentationClient() {
    const client = useContext(HoneycombInstrumentationClientContext);

    if (!client) {
        throw new Error("[honeycomb] The useHoneycombInstrumentationClient function is called before an HoneycombInstrumentationClient instance has been provided.");
    }

    return client;
}
