import { test } from "vitest";
import { redactQueryParameters } from "../src/redactQueryParameters.ts";

test.concurrent("the value of a private query parameter is redacted", ({ expect }) => {
    const result = redactQueryParameters("https://app/onboarding?token=ABCDEF&foo=bar", ["token"]);

    expect(result).toBe("https://app/onboarding?token=**redacted**&foo=bar");
});

test.concurrent("when there are multiple private query parameters, the value of every query parameter is redacted", ({ expect }) => {
    const result = redactQueryParameters("https://app/onboarding?token=ABCDEF&foo=bar&email=john.doe@workleap.com", ["token", "email"]);

    expect(result).toBe("https://app/onboarding?token=**redacted**&foo=bar&email=**redacted**");
});

test.concurrent("when a private query parameter appears more than once, every occurrence is redacted", ({ expect }) => {
    const result = redactQueryParameters("https://app/onboarding?token=ABCDEF&token=GHIJKL", ["token"]);

    expect(result).toBe("https://app/onboarding?token=**redacted**&token=**redacted**");
});

test.concurrent("when a query parameter name ends with a private name, regardless of the casing, the value is redacted", ({ expect }) => {
    const result = redactQueryParameters("https://app/onboarding?ACCESS_TOKEN=ABCDEF&pageToken=GHIJKL", ["token"]);

    expect(result).not.toContain("ABCDEF");
    expect(result).not.toContain("GHIJKL");
});

test.concurrent("when there is no private query parameter, the url is not altered", ({ expect }) => {
    const result = redactQueryParameters("https://app/onboarding?foo=bar", ["token"]);

    expect(result).toBe("https://app/onboarding?foo=bar");
});

test.concurrent("when a private name includes regular expression special characters, the value is redacted", ({ expect }) => {
    const result = redactQueryParameters("https://app/onboarding?user[email]=john.doe@workleap.com&foo=bar", ["user[email]"]);

    expect(result).toBe("https://app/onboarding?user[email]=**redacted**&foo=bar");
});

test.concurrent("when a private name is percent-encoded in the url, the value is redacted", ({ expect }) => {
    const result = redactQueryParameters("https://app/onboarding?user%5Bemail%5D=john.doe@workleap.com&foo=bar", ["user[email]"]);

    expect(result).toBe("https://app/onboarding?user[email]=**redacted**&foo=bar");
});

test.concurrent("when a private name is not a valid regular expression, the value is redacted", ({ expect }) => {
    const result = redactQueryParameters("https://app/onboarding?c++=ABCDEF", ["c++"]);

    expect(result).toBe("https://app/onboarding?c++=**redacted**");
});
