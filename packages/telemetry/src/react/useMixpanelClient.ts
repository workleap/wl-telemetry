import type { MixpanelClient } from "@workleap/mixpanel";
import { useTelemetryClient } from "./TelemetryContext.tsx";

export interface UseMixpanelClientOptions {
    /**
     * Whether or not an exception should be thrown if the client hasn't been provided.
     */
    dontThrowOnUndefined?: boolean;
}

export function useMixpanelClient(options?: { dontThrowOnUndefined?: false }): MixpanelClient;
export function useMixpanelClient(options: { dontThrowOnUndefined: true }): MixpanelClient | undefined;

/**
 * Retrieve the Mixpanel client.
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export function useMixpanelClient(options: UseMixpanelClientOptions = {}) {
    const {
        dontThrowOnUndefined = false
    } = options;

    const telemetryClient = useTelemetryClient();

    if (!telemetryClient.mixpanel && !dontThrowOnUndefined) {
        throw new Error("[telemetry] The useMixpanelClient function is called but the TelemetryClient doesn't include a Mixpanel client. Did you initialize Mixpanel when you called the \"initializeTelemetry\" function?");
    }

    return telemetryClient.mixpanel;
}
