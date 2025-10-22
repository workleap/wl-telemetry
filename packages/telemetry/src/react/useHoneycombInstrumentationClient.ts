import { useTelemetryClient } from "./TelemetryContext.tsx";

export interface UseHoneycombInstrumentationClientOptions {
    /**
     * Whether or not an exception should be thrown if the client hasn't been provided.
     */
    dontThrowOnUndefined?: boolean;
}

/**
 * Retrieve the Honeycomb instrumentation client.
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export function useHoneycombInstrumentationClient(options: UseHoneycombInstrumentationClientOptions = {}) {
    const {
        dontThrowOnUndefined = false
    } = options;

    const telemetryClient = useTelemetryClient();

    if (!telemetryClient.honeycomb && !dontThrowOnUndefined) {
        throw new Error("[telemetry] The useHoneycombInstrumentationClient function is called but the TelemetryClient doesn't include an Honeycomb client. Did you initialize Honeycomb when you called the \"initializeTelemetry\" function?");
    }

    return telemetryClient.honeycomb;
}
