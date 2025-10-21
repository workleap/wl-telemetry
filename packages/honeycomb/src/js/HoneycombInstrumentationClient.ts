import type { Attributes, AttributeValue } from "@opentelemetry/api";
import type { HoneycombInstrumentationPartialClient } from "@workleap-telemetry/core";
import type { FetchRequestHookFunction, FetchRequestPipeline } from "./FetchRequestPipeline.ts";
import type { GlobalAttributeSpanProcessor } from "./GlobalAttributeSpanProcessor.ts";

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export class HoneycombInstrumentationClient implements HoneycombInstrumentationPartialClient {
    readonly #globalAttributeSpanProcessor: GlobalAttributeSpanProcessor;
    readonly #fetchRequestPipeline: FetchRequestPipeline;

    constructor(globalAttributeSpanProcessor: GlobalAttributeSpanProcessor, fetchRequestPipeline: FetchRequestPipeline) {
        this.#globalAttributeSpanProcessor = globalAttributeSpanProcessor;
        this.#fetchRequestPipeline = fetchRequestPipeline;
    }

    /**
     * Set a global attribute that will be attached to every Honeycomb trace.
     * @see {@link https://workleap.github.io/wl-telemetry}
     */
    setGlobalSpanAttribute(key: string, value: AttributeValue) {
        this.#globalAttributeSpanProcessor.setAttribute(key, value);
    }

    /**
     * Set one or multiple global attribute(s) that will be attached to every Honeycomb trace.
     * @see {@link https://workleap.github.io/wl-telemetry}
     */
    setGlobalSpanAttributes(attributes: Attributes) {
        this.#globalAttributeSpanProcessor.setAttributes(attributes);
    }

    // IMPORTANT: If you update this method, make sure to update the HoneycombInstrumentationPartialClient
    // interface as well in @workleap-telemetry/core.
    /**
     * Register dynamically an OTel fetch request hook.
     * @see {@link https://workleap.github.io/wl-telemetry}
     */
    registerFetchRequestHook(hook: FetchRequestHookFunction) {
        this.#fetchRequestPipeline.registerHook(hook);
    }

    // IMPORTANT: If you update this method, make sure to update the HoneycombInstrumentationPartialClient
    // interface as well in @workleap-telemetry/core.
    /**
     * Register dynamically an OTel fetch request hook at the beginning of the execution pipeline.
     * @see {@link https://workleap.github.io/wl-telemetry}
     */
    registerFetchRequestHookAtStart(hook: FetchRequestHookFunction) {
        this.#fetchRequestPipeline.registerHookAtStart(hook);
    }
}
