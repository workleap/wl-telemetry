import { useTelemetryClient } from "./TelemetryClientContext.ts";

export function useHoneycombClient() {
    const telemetryClient = useTelemetryClient();

    if (!telemetryClient.honeycomb) {
        throw new Error("[telemetry] The useHoneycombClient function is called but the TelemetryClient doesn't include an Honeycomb client. Did you initialize Honeycomb when you called the \"initializeTelemetry\" function?");
    }

    return telemetryClient.honeycomb;
}
