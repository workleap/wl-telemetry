import type { Span } from "@opentelemetry/api";

export type FetchRequestHookFunction = (span: Span, request: Request | RequestInit) => void | true;

export class FetchRequestPipeline {
    private hooks: Set<FetchRequestHookFunction> = new Set();

    registerHook(hook: FetchRequestHookFunction) {
        this.hooks.add(hook);
    }

    registerHookAtStart(hook: FetchRequestHookFunction) {
        this.hooks = new Set([hook, ...this.hooks]);
    }

    dispatchRequest(span: Span, request: Request | RequestInit) {
        for (const hook of this.hooks) {
            const result = hook(span, request);

            // A hook can return "true" to stop the propagation to the subsequent hooks.
            if (result === true) {
                break;
            }
        }
    }

    get hookCount() {
        return this.hooks.size;
    }
}
