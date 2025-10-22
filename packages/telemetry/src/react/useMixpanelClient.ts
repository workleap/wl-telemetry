import type { MixpanelClient } from "@workleap/mixpanel";
import { useTelemetryClient } from "./TelemetryContext.tsx";

export interface UseMixpanelClientOptions {
    /**
     * Whether or not an exception should be thrown if the client hasn't been provided.
     */
    throwOnUndefined?: boolean;
}

export function useMixpanelClient(options?: { throwOnUndefined?: true }): MixpanelClient;
export function useMixpanelClient(options: { throwOnUndefined: false }): MixpanelClient | undefined;

/**
 * Retrieve the Mixpanel client.
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export function useMixpanelClient(options: UseMixpanelClientOptions = {}) {
    const {
        throwOnUndefined = true
    } = options;

    const telemetryClient = useTelemetryClient();

    if (!telemetryClient.mixpanel && throwOnUndefined) {
        throw new Error("[telemetry] The useMixpanelClient function is called but the TelemetryClient doesn't include a Mixpanel client. Did you initialize Mixpanel when you called the \"initializeTelemetry\" function?");
    }

    return telemetryClient.mixpanel;
}
