import { useTelemetryClient } from "./TelemetryClientContext.ts";

export function useLogRocketInstrumentationClient() {
    const telemetryClient = useTelemetryClient();

    if (!telemetryClient.logRocket) {
        throw new Error("[telemetry] The useLogRocketInstrumentationClient function is called but the TelemetryClient doesn't include a LogRocket client. Did you initialize LogRocket when you called the \"initializeTelemetry\" function?");
    }

    return telemetryClient.logRocket;
}
