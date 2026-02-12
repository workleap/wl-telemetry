import { createContext, type PropsWithChildren, useContext, useMemo } from "react";

const MixpanelPropertiesContext = createContext<Record<string, unknown>>({});

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export interface MixpanelPropertiesProviderProps extends PropsWithChildren {
    value: Record<string, unknown>;
}

/**
 * Define Mixpanel properties that will be passed down to nested "useTrackingFunction" or "useMixpanelTrackingFunction" hook.
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export function MixpanelPropertiesProvider(props: MixpanelPropertiesProviderProps) {
    const {
        value,
        children
    } = props;

    const parentContext = useContext(MixpanelPropertiesContext);

    const contextValue = useMemo(() => ({
        ...parentContext,
        ...value
    }), [parentContext, value]);

    return (
        <MixpanelPropertiesContext.Provider value={contextValue}>
            {children}
        </MixpanelPropertiesContext.Provider>
    );
}

/**
 * Retrieve the Mixpanel properties from all parent providers.
 * @returns The context value or an empty object literal if no provider isdefined.
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export const useMixpanelProviderProperties = () => {
    return useContext(MixpanelPropertiesContext);
};
