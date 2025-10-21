import type { HoneycombInstrumentationPartialClient } from "@workleap-telemetry/core";
import { createContext, type PropsWithChildren, useContext } from "react";

const HoneycombInstrumentationContext = createContext<HoneycombInstrumentationPartialClient | undefined>(undefined);

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export interface HoneycombInstrumentationProviderProps extends PropsWithChildren {
    client: HoneycombInstrumentationPartialClient;
}

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export function HoneycombInstrumentationProvider(props: HoneycombInstrumentationProviderProps) {
    const {
        client,
        children
    } = props;

    return (
        <HoneycombInstrumentationContext.Provider value={client}>
            {children}
        </HoneycombInstrumentationContext.Provider>
    );
}

/**
 * Retrieve the Honeycomb instrumentation client.
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export function useHoneycombInstrumentationClient() {
    const client = useContext(HoneycombInstrumentationContext);

    if (!client) {
        throw new Error("[honeycomb] The useHoneycombInstrumentationClient function is called before an HoneycombInstrumentationClient instance has been provided.");
    }

    return client;
}
