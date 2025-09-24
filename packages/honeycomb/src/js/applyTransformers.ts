import type { Logger } from "@workleap/logging";
import type { HoneycombSdkOptions } from "./honeycombTypes.ts";

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export interface HoneycombSdkOptionsTransformerContext {
    verbose: boolean;
    logger: Logger;
}

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export type HoneycombSdkOptionsTransformer = (options: HoneycombSdkOptions, context: HoneycombSdkOptionsTransformerContext) => HoneycombSdkOptions;

// Must specify the return type, otherwise we get a TS4058: Return type of exported function has or is using name X from external module "XYZ" but cannot be named.
export function applyTransformers(options: HoneycombSdkOptions, transformers: HoneycombSdkOptionsTransformer[], context: HoneycombSdkOptionsTransformerContext): HoneycombSdkOptions {
    return transformers.reduce((acc, transformer) => transformer(acc, context), options);
}


