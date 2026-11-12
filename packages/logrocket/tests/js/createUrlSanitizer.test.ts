import { test } from "vitest";
import { createUrlSanitizer } from "../../src/js/createUrlSanitizer.ts";

test.concurrent("sensitive token query parameter from url is sanitized properly", ({ expect }) => {
    const urlSanitizer = createUrlSanitizer(["token"]);
    const result = urlSanitizer("https://activities.officevibe.workleap.com/onboarding?token=ABCDEF");

    expect(result).not.toContain("ABCDEF");
    expect(result).toContain("**redacted**");
});

test.concurrent("sensitive email query parameter from url is sanitized properly", ({ expect }) => {
    const urlSanitizer = createUrlSanitizer(["email"]);
    const result = urlSanitizer("https://officevibe.workleap.com/signup?email=test@email.com");

    expect(result).not.toContain("test@email.com");
    expect(result).toContain("**redacted**");
});

test.concurrent("sensitive password query parameter from url is sanitized properly", ({ expect }) => {
    const urlSanitizer = createUrlSanitizer(["password"]);
    const result = urlSanitizer("https://officevibe.workleap.com/confirm-signup?password=correcthorsebatterystaple");

    expect(result).not.toContain("correcthorsebatterystaple");
    expect(result).toContain("**redacted**");
});

test.concurrent("when a sensitive query parameter appears more than once, every occurrence is sanitized", ({ expect }) => {
    const urlSanitizer = createUrlSanitizer(["token"]);
    const result = urlSanitizer("https://officevibe.workleap.com/onboarding?token=ABCDEF&token=GHIJKL");

    expect(result).not.toContain("ABCDEF");
    expect(result).not.toContain("GHIJKL");
});

test.concurrent("when a query parameter name ends with the name of a sensitive query parameter, both query parameters are sanitized", ({ expect }) => {
    const urlSanitizer = createUrlSanitizer(["token"]);
    const result = urlSanitizer("https://officevibe.workleap.com/onboarding?access_token=ABCDEF&token=GHIJKL");

    expect(result).not.toContain("ABCDEF");
    expect(result).not.toContain("GHIJKL");
});
