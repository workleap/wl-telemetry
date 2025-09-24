import { createContext, useContext } from "react";
import type { MixpanelClient } from "../js/MixpanelClient.ts";

const MixpanelClientContext = createContext<MixpanelClient | undefined>(undefined);

export const MixpanelClientProvider = MixpanelClientContext.Provider;

export function useMixpanelClient() {
    const client = useContext(MixpanelClientContext);

    if (!client) {
        throw new Error("[mixpanel] The useMixpanelClient function is called before a MixpanelClient instance has been provided.");
    }

    return client;
}
