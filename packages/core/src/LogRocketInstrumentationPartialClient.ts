/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export interface LogRocketInstrumentationPartialClient {
    // oxlint-disable-next-line typescript/no-explicit-any
    registerGetSessionUrlListener: (listener: any) => void;
}
