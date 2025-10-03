import { useTelemetryClient } from "./TelemetryContext.tsx";

/**
 * Retrieve the Honeycomb instrumentation client.
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export function useHoneycombInstrumentationClient() {
    const telemetryClient = useTelemetryClient();

    if (!telemetryClient.honeycomb) {
        throw new Error("[telemetry] The useHoneycombInstrumentationClient function is called but the TelemetryClient doesn't include an Honeycomb client. Did you initialize Honeycomb when you called the \"initializeTelemetry\" function?");
    }

    return telemetryClient.honeycomb;
}
