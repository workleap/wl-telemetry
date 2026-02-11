import type { CreateMixpanelTrackingFunctionOptions } from "@workleap-telemetry/core";
import { useMemo } from "react";
import { useAdditionalMixpanelProperties } from "./AdditionalMixpanelPropertiesProvider.tsx";
import { useMixpanelClient } from "./MixpanelContext.tsx";

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export type UseTrackingFunctionOptions = CreateMixpanelTrackingFunctionOptions;

/**
 * Create a Mixpanel tracking function.
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export function useTrackingFunction(options: UseTrackingFunctionOptions = {}) {
    const {
        productId,
        targetProductId
    } = options;

    const client = useMixpanelClient();
    const additionalProperties = useAdditionalMixpanelProperties();

    return useMemo(() => {
        const trackOptions = {
            productId,
            targetProductId,
            additionalProperties
        } satisfies CreateMixpanelTrackingFunctionOptions;

        return client.createTrackingFunction(trackOptions);
    }, [client, productId, targetProductId, additionalProperties]);
}
