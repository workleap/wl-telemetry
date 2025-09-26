import { createContext, useContext } from "react";
import type { MixpanelClient } from "../js/MixpanelClient.ts";

export const MixpanelClientContext = createContext<MixpanelClient | undefined>(undefined);

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export const MixpanelClientProvider = MixpanelClientContext.Provider;

/**
 * Retrieve the Mixpanel client.
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export function useMixpanelClient() {
    const client = useContext(MixpanelClientContext);

    if (!client) {
        throw new Error("[mixpanel] The useMixpanelClient function is called before a MixpanelClient instance has been provided.");
    }

    return client;
}
