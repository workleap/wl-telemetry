import { useTelemetryClient } from "./TelemetryContext.tsx";

export interface UseLogRocketInstrumentationClientOptions {
    /**
     * Whether or not an exception should be thrown if the client hasn't been provided.
     */
    dontThrowOnUndefined?: boolean;
}

/**
 * Retrieve the LogRocket instrumentation client.
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export function useLogRocketInstrumentationClient(options: UseLogRocketInstrumentationClientOptions = {}) {
    const {
        dontThrowOnUndefined = false
    } = options;

    const telemetryClient = useTelemetryClient();

    if (!telemetryClient.logRocket && !dontThrowOnUndefined) {
        throw new Error("[telemetry] The useLogRocketInstrumentationClient function is called but the TelemetryClient doesn't include a LogRocket client. Did you initialize LogRocket when you called the \"initializeTelemetry\" function?");
    }

    return telemetryClient.logRocket;
}
