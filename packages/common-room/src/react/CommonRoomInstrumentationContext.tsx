import { createContext, type PropsWithChildren, useContext } from "react";
import type { CommonRoomInstrumentationClient } from "../js/CommonRoomInstrumentationClient.ts";

const CommonRoomInstrumentationContext = createContext<CommonRoomInstrumentationClient | undefined>(undefined);

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export interface CommonRoomInstrumentationProviderProps extends PropsWithChildren {
    client: CommonRoomInstrumentationClient;
}

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export function CommonRoomInstrumentationProvider(props: CommonRoomInstrumentationProviderProps) {
    const {
        client,
        children
    } = props;

    return (
        <CommonRoomInstrumentationContext.Provider value={client}>
            {children}
        </CommonRoomInstrumentationContext.Provider>
    );
}

export interface UseCommonRoomInstrumentationClientOptions {
    /**
     * Whether or not an exception should be thrown if the client hasn't been provided.
     */
    dontThrowOnUndefined?: boolean;
}

export function useCommonRoomInstrumentationClient(options?: { dontThrowOnUndefined?: false }): CommonRoomInstrumentationClient;
export function useCommonRoomInstrumentationClient(options: { dontThrowOnUndefined: true }): CommonRoomInstrumentationClient | undefined;

/**
 * Retrieve the Common Room instrumentation client.
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export function useCommonRoomInstrumentationClient(options: UseCommonRoomInstrumentationClientOptions = {}) {
    const {
        dontThrowOnUndefined = false
    } = options;

    const client = useContext(CommonRoomInstrumentationContext);

    if (!client && !dontThrowOnUndefined) {
        throw new Error("[common-room] The useCommonInstrumentationClient function is called before an CommonRoomInstrumentationClient instance has been provided.");
    }

    return client;
}
