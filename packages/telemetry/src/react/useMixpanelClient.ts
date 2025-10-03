import { useTelemetryClient } from "./TelemetryContext.tsx";

/**
 * Retrieve the Mixpanel client.
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export function useMixpanelClient() {
    const telemetryClient = useTelemetryClient();

    if (!telemetryClient.mixpanel) {
        throw new Error("[telemetry] The useMixpanelClient function is called but the TelemetryClient doesn't include a Mixpanel client. Did you initialize Mixpanel when you called the \"initializeTelemetry\" function?");
    }

    return telemetryClient.mixpanel;
}
