import { createContext, type PropsWithChildren, useContext, useMemo } from "react";

const AdditionalMixpanelPropertiesContext = createContext<Record<string, unknown>>({});

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export interface AdditionalMixpanelPropertiesProviderProps extends PropsWithChildren {
    value: Record<string, unknown>;
}

/**
 * Define additional Mixpanel properties that will be passed down to nested "useTrackingFunction" or "useMixpanelTrackingFunction" hook.
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export function AdditionalMixpanelPropertiesProvider(props: AdditionalMixpanelPropertiesProviderProps) {
    const {
        value,
        children
    } = props;

    const parentContext = useContext(AdditionalMixpanelPropertiesContext);

    const contextValue = useMemo(() => ({
        ...parentContext,
        ...value
    }), [parentContext, value]);

    return (
        <AdditionalMixpanelPropertiesContext.Provider value={contextValue}>
            {children}
        </AdditionalMixpanelPropertiesContext.Provider>
    );
}

/**
 * Retrieve the context provider defined Mixpanel properties.
 * @returns The context value or an empty object literal is no provider has been defined.
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export const useAdditionalMixpanelProperties = () => {
    return useContext(AdditionalMixpanelPropertiesContext);
};
