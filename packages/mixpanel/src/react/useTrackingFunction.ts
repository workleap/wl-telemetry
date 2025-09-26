import { useContext, useMemo } from "react";
import { createTrackingFunction, type CreateMixpanelTrackingFunctionOptions } from "../js/createTrackingFunction.ts";
import { MixpanelClientContext } from "./MixpanelClientContext.ts";

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
        targetProductId
    } = options;

    const client = useContext(MixpanelClientContext);

    return useMemo(() => {
        const trackOptions = {
            targetProductId
        } satisfies CreateMixpanelTrackingFunctionOptions;

        // DEPRECATED: Grace period ends on January 1th 2026.
        // After the grace period, only create the tracking function from the client, remove the fallback
        // and also use "useMixpanelClient" to retrieve the client rather than "useContext".
        return client
            ? client.createTrackingFunction(trackOptions)
            : createTrackingFunction(trackOptions);
    }, [client, targetProductId]);
}
