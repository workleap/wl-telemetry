import { createContext, type PropsWithChildren, useContext } from "react";
import type { MixpanelClient } from "../js/MixpanelClient.ts";

export const MixpanelContext = createContext<MixpanelClient | undefined>(undefined);

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export interface MixpanelProviderProps extends PropsWithChildren {
    client: MixpanelClient;
}

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export function MixpanelProvider(props: MixpanelProviderProps) {
    const {
        client,
        children
    } = props;

    return (
        <MixpanelContext.Provider value={client}>
            {children}
        </MixpanelContext.Provider>
    );
}

/**
 * Retrieve the Mixpanel client.
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export function useMixpanelClient() {
    const client = useContext(MixpanelContext);

    if (!client) {
        throw new Error("[mixpanel] The useMixpanelClient function is called before a MixpanelClient instance has been provided.");
    }

    return client;
}
