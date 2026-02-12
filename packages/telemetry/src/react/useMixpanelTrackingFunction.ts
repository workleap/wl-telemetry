import { useMixpanelProviderProperties, type CreateMixpanelTrackingFunctionOptions } from "@workleap/mixpanel/react";
import { useMemo } from "react";
import { useMixpanelClient } from "./useMixpanelClient.ts";

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export type UseMixpanelTrackingFunctionOptions = CreateMixpanelTrackingFunctionOptions;

/**
 * Create a Mixpanel tracking function.
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export function useMixpanelTrackingFunction(options: UseMixpanelTrackingFunctionOptions = {}) {
    const {
        productId,
        targetProductId
    } = options;

    const client = useMixpanelClient();
    const additionalProperties = useMixpanelProviderProperties();

    return useMemo(() => {
        return client.createTrackingFunction({
            productId,
            targetProductId,
            additionalProperties
        });
    }, [client, productId, targetProductId, additionalProperties]);
}
