import { createContext, type PropsWithChildren, useContext } from "react";
import type { HoneycombInstrumentationClient } from "../js/HoneycombInstrumentationClient.ts";

const HoneycombInstrumentationContext = createContext<HoneycombInstrumentationClient | undefined>(undefined);

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export interface HoneycombInstrumentationProviderProps extends PropsWithChildren {
    client: HoneycombInstrumentationClient;
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

export interface UseHoneycombInstrumentationClientOptions {
    /**
     * Whether or not an exception should be thrown if the client hasn't been provided.
     */
    dontThrowOnUndefined?: boolean;
}

/**
 * Retrieve the Honeycomb instrumentation client.
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export function useHoneycombInstrumentationClient(options: UseHoneycombInstrumentationClientOptions = {}) {
    const {
        dontThrowOnUndefined = false
    } = options;

    const client = useContext(HoneycombInstrumentationContext);

    if (!client && !dontThrowOnUndefined) {
        throw new Error("[honeycomb] The useHoneycombInstrumentationClient function is called before an HoneycombInstrumentationClient instance has been provided.");
    }

    return client;
}
