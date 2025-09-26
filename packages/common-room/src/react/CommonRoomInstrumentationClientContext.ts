import { createContext, useContext } from "react";
import type { CommonRoomInstrumentationClient } from "../js/CommonRoomInstrumentationClient.ts";

const CommonRoomInstrumentationClientContext = createContext<CommonRoomInstrumentationClient | undefined>(undefined);

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export const CommonRoomInstrumentationClientProvider = CommonRoomInstrumentationClientContext.Provider;

/**
 * Retrieve the Common Room instrumentation client.
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export function useCommonRoomInstrumentationClient() {
    const client = useContext(CommonRoomInstrumentationClientContext);

    if (!client) {
        throw new Error("[common-room] The useCommonInstrumentationClient function is called before an CommonRoomInstrumentationClient instance has been provided.");
    }

    return client;
}
