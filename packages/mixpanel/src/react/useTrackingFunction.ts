import type { CreateMixpanelTrackingFunctionOptions } from "@workleap-telemetry/core";
import { useMemo } from "react";
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
        targetProductId
    } = options;

    const client = useMixpanelClient();

    return useMemo(() => {
        const trackOptions = {
            targetProductId
        } satisfies CreateMixpanelTrackingFunctionOptions;

        return client.createTrackingFunction(trackOptions);
    }, [client, targetProductId]);
}
