/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
// Using "any" instead of "Span" to avoid taking a dependency on "@opentelemetry/api".
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FetchRequestHookFunction = (span: any, request: Request | RequestInit) => void | true;

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export interface HoneycombInstrumentationPartialClient {
    registerFetchRequestHook: (hook: FetchRequestHookFunction) => void;
    registerFetchRequestHookAtStart: (hook: FetchRequestHookFunction) => void;
}
