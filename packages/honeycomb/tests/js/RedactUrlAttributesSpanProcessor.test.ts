import type { Attributes } from "@opentelemetry/api";
import type { ReadableSpan } from "@opentelemetry/sdk-trace";
import { test } from "vitest";
import { NormalizeAttributesSpanProcessor } from "../../src/js/NormalizeAttributesSpanProcessor.ts";
import { RedactUrlAttributesSpanProcessor } from "../../src/js/RedactUrlAttributesSpanProcessor.ts";

function createSpan(attributes: Attributes) {
    return { attributes } as unknown as ReadableSpan;
}

test.concurrent("the private query parameters and the fragment are removed from the url attributes", ({ expect }) => {
    const span = createSpan({
        "url.full": "https://api/search?token=ABCDEF&foo=bar#access_token=GHIJKL",
        "page.url": "https://app/onboarding?token=ABCDEF&email=john.doe@workleap.com&foo=bar#access_token=GHIJKL",
        "page.search": "?token=ABCDEF&email=john.doe@workleap.com&foo=bar",
        "page.hash": "#access_token=GHIJKL",
        "lcp.navigation_url": "https://app/onboarding?token=ABCDEF&foo=bar"
    });

    new RedactUrlAttributesSpanProcessor(["token", "email"]).onEnd(span);

    expect(span.attributes).toEqual({
        "url.full": "https://api/search?token=**redacted**&foo=bar",
        "page.url": "https://app/onboarding?token=**redacted**&email=**redacted**&foo=bar",
        "page.search": "?token=**redacted**&email=**redacted**&foo=bar",
        "lcp.navigation_url": "https://app/onboarding?token=**redacted**&foo=bar"
    });
});

test.concurrent("when the attributes are set with the legacy names, the private query parameters and the fragment are removed from every attribute", ({ expect }) => {
    const url = "https://app/onboarding?token=ABCDEF&email=john.doe@workleap.com#access_token=GHIJKL";

    const span = createSpan({
        "http.url": url,
        "http.target": url,
        "page.url": url
    });

    new NormalizeAttributesSpanProcessor().onEnd(span);
    new RedactUrlAttributesSpanProcessor(["token", "email"]).onEnd(span);

    const serializedAttributes = JSON.stringify(span.attributes);

    expect(serializedAttributes).not.toContain("ABCDEF");
    expect(serializedAttributes).not.toContain("john.doe@workleap.com");
    expect(serializedAttributes).not.toContain("GHIJKL");
    expect(span.attributes["url.full"]).toBe("https://app/onboarding?token=**redacted**&email=**redacted**");
    expect(span.attributes["http.route"]).toBe("https://app/onboarding?token=**redacted**&email=**redacted**");
    expect(span.attributes["url.query"]).toBe("https://app/onboarding?token=**redacted**&email=**redacted**");
});

test.concurrent("when the fragment of a url attribute doesn't include a private query parameter, the fragment is removed", ({ expect }) => {
    const span = createSpan({
        "url.full": "https://api/search?foo=bar#code=ABCDEF",
        "page.hash": "#code=ABCDEF"
    });

    new RedactUrlAttributesSpanProcessor(["token"]).onEnd(span);

    expect(span.attributes).toEqual({
        "url.full": "https://api/search?foo=bar"
    });
});

test.concurrent("an attribute that is not a url attribute is not altered", ({ expect }) => {
    const span = createSpan({
        "app.custom": "token=ABCDEF#fragment",
        "http.response.status_code": 200
    });

    new RedactUrlAttributesSpanProcessor(["token"]).onEnd(span);

    expect(span.attributes).toEqual({
        "app.custom": "token=ABCDEF#fragment",
        "http.response.status_code": 200
    });
});
