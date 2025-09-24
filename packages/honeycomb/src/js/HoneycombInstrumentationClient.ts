import { Attributes, AttributeValue } from "@opentelemetry/api";
import { FetchRequestHookFunction, FetchRequestPipeline } from "./FetchRequestPipeline.ts";
import { GlobalAttributeSpanProcessor } from "./GlobalAttributeSpanProcessor.ts";

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export class HoneycombInstrumentationClient {
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

    /**
     * Register dynamically an OTel fetch request hook.
     * @see {@link https://workleap.github.io/wl-telemetry}
     */
    registerFetchRequestHook(hook: FetchRequestHookFunction) {
        this.#fetchRequestPipeline.registerHook(hook);
    }

    /**
     * Register dynamically an OTel fetch request hook at the beginning of the execution pipeline.
     * @see {@link https://workleap.github.io/wl-telemetry}
     */
    registerFetchRequestHookAtStart(hook: FetchRequestHookFunction) {
        this.#fetchRequestPipeline.registerHookAtStart(hook);
    }
}
