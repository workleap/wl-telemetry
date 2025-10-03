import type { ReadableSpan, SpanProcessor } from "@opentelemetry/sdk-trace-web";
import { removeIdsFromUrl } from "./removeIdsFromUrl.ts";

// Based on: https://opentelemetry.io/docs/specs/semconv/registry/attributes/http.
export class NormalizeAttributesSpanProcessor implements SpanProcessor {
    onStart() {}

    onEnd(span: ReadableSpan) {
        const httpUrl = span.attributes["http.url"];
        const httpHost = span.attributes["http.host"];
        const httpMethod = span.attributes["http.method"];
        const httpScheme = span.attributes["http.scheme"];
        const httpStatusCode = span.attributes["http.status_code"];
        const httpStatusText = span.attributes["http.status_text"];
        const httpTarget = span.attributes["http.target"];
        const httpUserAgent = span.attributes["http.user_agent"];
        const httpServerName = span.attributes["http.server_name"];
        const httpRequestContentLength = span.attributes["http.request_content_length"];
        const httpResponseContentLength = span.attributes["http.response_content_length"];

        if (httpUrl) {
            span.attributes["url.full"] = httpUrl;
            delete span.attributes["http.url"];

            // This is a "templated" URL for the Honeycomb "launchpad" feature.
            // By providing "normalized" URLs we hope that specific URLs will stop showing up in sections like
            // "slowest requests by endpoint" or "pages with most events".
            // We would rather have Honeycomb showing URLs identifying general trends.
            span.attributes["http.route"] = removeIdsFromUrl(httpUrl.toString());
        }

        if (httpHost) {
            span.attributes["http.request.header.host"] = httpHost;
            delete span.attributes["http.host"];
        }

        if (httpMethod) {
            span.attributes["http.request.method"] = httpMethod;
            delete span.attributes["http.method"];
        }

        if (httpScheme) {
            span.attributes["url.scheme"] = httpScheme;
            delete span.attributes["http.scheme"];
        }

        if (httpStatusCode) {
            span.attributes["http.response.status_code"] = httpStatusCode;
            delete span.attributes["http.status_code"];
        }

        if (httpStatusText) {
            delete span.attributes["http.status_text"];
        }

        if (httpTarget) {
            span.attributes["url.query"] = httpTarget;
            delete span.attributes["http.target"];
        }

        if (httpUserAgent) {
            span.attributes["user_agent.original"] = httpUserAgent;
            delete span.attributes["http.user_agent"];
        }

        if (httpServerName) {
            span.attributes["server.address"] = httpServerName;
            delete span.attributes["http.server_name"];
        }

        if (httpRequestContentLength) {
            span.attributes["http.request.header.content-length"] = httpRequestContentLength;
            delete span.attributes["http.request_content_length"];
        }

        if (httpResponseContentLength) {
            span.attributes["http.response.header.content-length"] = httpResponseContentLength;
            delete span.attributes["http.response_content_length"];
        }
    }

    forceFlush() {
        return Promise.resolve();
    }

    shutdown() {
        return Promise.resolve();
    }
}
