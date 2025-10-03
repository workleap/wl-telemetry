import { useTelemetryClient } from "./TelemetryContext.tsx";

/**
 * Retrieve the LogRocket instrumentation client.
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export function useLogRocketInstrumentationClient() {
    const telemetryClient = useTelemetryClient();

    if (!telemetryClient.logRocket) {
        throw new Error("[telemetry] The useLogRocketInstrumentationClient function is called but the TelemetryClient doesn't include a LogRocket client. Did you initialize LogRocket when you called the \"initializeTelemetry\" function?");
    }

    return telemetryClient.logRocket;
}
