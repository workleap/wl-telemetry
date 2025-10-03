import type { RootLogger } from "@workleap/logging";
import type { LogRocketSdkOptions } from "./logRocketTypes.ts";

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export interface LogRocketSdkOptionsTransformerContext {
    verbose: boolean;
    logger: RootLogger;
}

/**
 * Hook to transform the resulting LogRocket SDK options.
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export type LogRocketSdkOptionsTransformer = (options: LogRocketSdkOptions, context: LogRocketSdkOptionsTransformerContext) => LogRocketSdkOptions;

// The function return type is mandatory, otherwise we got an error TS4058.
export function applyTransformers(options: LogRocketSdkOptions, transformers: LogRocketSdkOptionsTransformer[], context: LogRocketSdkOptionsTransformerContext): LogRocketSdkOptions {
    return transformers.reduce((acc, transformer) => transformer(acc, context), options);
}


