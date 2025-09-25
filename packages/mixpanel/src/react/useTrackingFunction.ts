import { useContext, useMemo } from "react";
import { createTrackingFunction, type CreateMixpanelTrackingFunctionOptions } from "../js/createTrackingFunction.ts";
import { MixpanelClientContext } from "./MixpanelClientContext.ts";

export type UseTrackingFunctionOptions = CreateMixpanelTrackingFunctionOptions;

// DEPRECATED: Grace period ends on January 1th 2026.
// After the grace period, only create the tracking function from the client, remove the fallback
// and also use "useMixpanelClient" to retrieve the client rather than "useContext".
export function useTrackingFunction(options: UseTrackingFunctionOptions = {}) {
    const {
        targetProductId
    } = options;

    const client = useContext(MixpanelClientContext);

    return useMemo(() => {
        const trackOptions = {
            targetProductId
        } satisfies CreateMixpanelTrackingFunctionOptions;

        return client
            ? client.createTrackingFunction(trackOptions)
            : createTrackingFunction(trackOptions);
    }, [client, targetProductId]);
}
