import type { CreateMixpanelTrackingFunctionOptions } from "@workleap/mixpanel";
import { useMemo } from "react";
import { useMixpanelClient } from "./useMixpanelClient.ts";

export type UseMixpanelTrackingFunctionOptions = CreateMixpanelTrackingFunctionOptions;

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
