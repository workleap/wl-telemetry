import { createContext, useContext } from "react";
import { CommonRoomInstrumentationClient } from "../js/CommonRoomInstrumentationClient.ts";

const CommonRoomInstrumentationClientContext = createContext<CommonRoomInstrumentationClient | undefined>(undefined);

export const CommonRoomInstrumentationClientProvider = CommonRoomInstrumentationClientContext.Provider;

export function useCommonInstrumentationClient() {
    const client = useContext(CommonRoomInstrumentationClientContext);

    if (!client) {
        throw new Error("[common-room] The useCommonInstrumentationClient function is called before an CommonRoomInstrumentationClient instance has been provided.");
    }

    return client;
}
