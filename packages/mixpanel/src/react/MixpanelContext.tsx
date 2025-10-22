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

export interface UseMixpanelClientOptions {
    /**
     * Whether or not an exception should be thrown if the client hasn't been provided.
     */
    dontThrowOnUndefined?: boolean;
}

/**
 * Retrieve the Mixpanel client.
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export function useMixpanelClient(options: UseMixpanelClientOptions = {}) {
    const {
        dontThrowOnUndefined = false
    } = options;

    const client = useContext(MixpanelContext);

    if (!client && !dontThrowOnUndefined) {
        throw new Error("[mixpanel] The useMixpanelClient function is called before a MixpanelClient instance has been provided.");
    }

    return client;
}
