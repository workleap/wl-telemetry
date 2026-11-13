import type { ReadableSpan, SpanProcessor } from "@opentelemetry/sdk-trace";
import { redactQueryParameters } from "@workleap-telemetry/core";

const UrlAttributeNames = ["url.full", "url.query", "http.route", "page.url", "page.search", "cls.navigation_url", "lcp.navigation_url", "inp.navigation_url", "fcp.navigation_url", "ttfb.navigation_url", "lcp.url", "inp.timing.script.source_url"];

export class RedactUrlAttributesSpanProcessor implements SpanProcessor {
    readonly #privateQueryParameterNames: string[];

    constructor(privateQueryParameterNames: string[]) {
        this.#privateQueryParameterNames = privateQueryParameterNames;
    }

    onStart() {}

    onEnd(span: ReadableSpan) {
        for (const x of UrlAttributeNames) {
            const value = span.attributes[x];

            if (typeof value === "string") {
                // The fragment is removed because it can include sensitive values, such as an access token.
                span.attributes[x] = redactQueryParameters(value.split("#")[0], this.#privateQueryParameterNames);
            }
        }

        delete span.attributes["page.hash"];
    }

    forceFlush() {
        return Promise.resolve();
    }

    shutdown() {
        return Promise.resolve();
    }
}
