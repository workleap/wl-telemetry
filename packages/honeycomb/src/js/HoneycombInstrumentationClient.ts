import type { Attributes, AttributeValue } from "@opentelemetry/api";
import type { HoneycombInstrumentationPartialClient } from "@workleap-telemetry/core";
import type { FetchRequestHookFunction, FetchRequestPipeline } from "./FetchRequestPipeline.ts";
import type { GlobalAttributeSpanProcessor } from "./GlobalAttributeSpanProcessor.ts";

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export interface HoneycombInstrumentationClient extends HoneycombInstrumentationPartialClient {
    /**
     * Set a global attribute that will be attached to every Honeycomb trace.
     * @see {@link https://workleap.github.io/wl-telemetry}
     */
    setGlobalSpanAttribute: (key: string, value: AttributeValue) => void;

    /**
     * Set one or multiple global attribute(s) that will be attached to every Honeycomb trace.
     * @see {@link https://workleap.github.io/wl-telemetry}
     */
    setGlobalSpanAttributes: (attributes: Attributes) => void;

    /**
     * Register dynamically an OTel fetch request hook.
     * @see {@link https://workleap.github.io/wl-telemetry}
     */
    registerFetchRequestHook: (hook: FetchRequestHookFunction) => void;

    /**
     * Register dynamically an OTel fetch request hook at the beginning of the execution pipeline.
     * @see {@link https://workleap.github.io/wl-telemetry}
     */
    registerFetchRequestHookAtStart: (hook: FetchRequestHookFunction) => void;
}

export class HoneycombInstrumentationClientImpl implements HoneycombInstrumentationClient {
    readonly #globalAttributeSpanProcessor: GlobalAttributeSpanProcessor;
    readonly #fetchRequestPipeline: FetchRequestPipeline;

    constructor(globalAttributeSpanProcessor: GlobalAttributeSpanProcessor, fetchRequestPipeline: FetchRequestPipeline) {
        this.#globalAttributeSpanProcessor = globalAttributeSpanProcessor;
        this.#fetchRequestPipeline = fetchRequestPipeline;
    }

    setGlobalSpanAttribute(key: string, value: AttributeValue) {
        this.#globalAttributeSpanProcessor.setAttribute(key, value);
    }

    setGlobalSpanAttributes(attributes: Attributes) {
        this.#globalAttributeSpanProcessor.setAttributes(attributes);
    }

    // IMPORTANT: If you update this method, make sure to update the HoneycombInstrumentationPartialClient
    // interface as well in @workleap-telemetry/core.
    registerFetchRequestHook(hook: FetchRequestHookFunction) {
        this.#fetchRequestPipeline.registerHook(hook);
    }

    // IMPORTANT: If you update this method, make sure to update the HoneycombInstrumentationPartialClient
    // interface as well in @workleap-telemetry/core.
    registerFetchRequestHookAtStart(hook: FetchRequestHookFunction) {
        this.#fetchRequestPipeline.registerHookAtStart(hook);
    }
}
