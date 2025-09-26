import type { CreateMixpanelTrackingFunctionOptions } from "@workleap/mixpanel";
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
        targetProductId
    } = options;

    const client = useMixpanelClient();

    return useMemo(() => {
        return client.createTrackingFunction({
            targetProductId
        });
    }, [client, targetProductId]);
}
