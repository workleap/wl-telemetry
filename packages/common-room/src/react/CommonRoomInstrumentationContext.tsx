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

/**
 * Retrieve the Common Room instrumentation client.
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export function useCommonRoomInstrumentationClient() {
    const client = useContext(CommonRoomInstrumentationContext);

    if (!client) {
        throw new Error("[common-room] The useCommonInstrumentationClient function is called before an CommonRoomInstrumentationClient instance has been provided.");
    }

    return client;
}
