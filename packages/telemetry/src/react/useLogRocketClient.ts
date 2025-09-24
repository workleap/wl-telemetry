import { useTelemetryClient } from "./TelemetryClientContext.ts";

export function useLogRocketClient() {
    const telemetryClient = useTelemetryClient();

    if (!telemetryClient.logRocket) {
        throw new Error("[telemetry] The useLogRocketClient function is called but the TelemetryClient doesn't include a LogRocket client. Did you initialize LogRocket when you called the \"initializeTelemetry\" function?");
    }

    return telemetryClient.logRocket;
}
