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

test.concurrent("when a private name includes a dot, the dot is matched literally", ({ expect }) => {
    const result = redactQueryParameters("https://app/onboarding?user.email=john.doe@workleap.com&userXemail=foo", ["user.email"]);

    expect(result).toBe("https://app/onboarding?user.email=**redacted**&userXemail=foo");
});

test.concurrent("when a private query parameter is in the fragment, the value is redacted", ({ expect }) => {
    const result = redactQueryParameters("https://app/callback#access_token=ABCDEF&foo=bar", ["token"]);

    expect(result).toBe("https://app/callback#access_token=**redacted**&foo=bar");
});

test.concurrent("when a private query parameter is nested in a percent-encoded url, the percent-encoded url is redacted", ({ expect }) => {
    const result = redactQueryParameters("https://app/login?returnUrl=https%3A%2F%2Fapp%2Fcallback%3Ftoken%3DABCDEF%26foo%3Dbar&foo=bar", ["token"]);

    expect(result).toBe("https://app/login?returnUrl=**redacted**&foo=bar");
});

test.concurrent("when a private query parameter is nested in a url that is percent-encoded twice, the percent-encoded url is redacted", ({ expect }) => {
    const result = redactQueryParameters("https://app/login?returnUrl=https%253A%252F%252Fapp%252Fcallback%253Ftoken%253DABCDEF&foo=bar", ["token"]);

    expect(result).toBe("https://app/login?returnUrl=**redacted**&foo=bar");
});

test.concurrent("when a private query parameter is nested in a percent-encoded value of the fragment, the percent-encoded value is redacted", ({ expect }) => {
    const result = redactQueryParameters("https://app/callback#state=%2Fcallback%3Femail%3Djohn.doe%40workleap.com&foo=bar", ["email"]);

    expect(result).toBe("https://app/callback#state=**redacted**&foo=bar");
});

test.concurrent("when a private query parameter is nested in a percent-encoded path segment, only the segment is redacted", ({ expect }) => {
    const result = redactQueryParameters("https://app/proxy/callback%3Ftoken%3DABCDEF/details?foo=bar", ["token"]);

    expect(result).toBe("https://app/proxy/**redacted**/details?foo=bar");
});

test.concurrent("when a private query parameter is nested in a percent-encoded name, the name is redacted with the value", ({ expect }) => {
    const result = redactQueryParameters("https://app/login?returnUrl%3D%2Fcallback%3Ftoken%3DABCDEF%26foo=bar&foo=bar", ["token"]);

    expect(result).toBe("https://app/login?**redacted**&foo=bar");
});

test.concurrent("when a private name is partially percent-encoded in the url, the value is redacted", ({ expect }) => {
    const result = redactQueryParameters("https://app/onboarding?to%6Ben=ABCDEF&foo=bar", ["token"]);

    expect(result).toBe("https://app/onboarding?to%6Ben=**redacted**&foo=bar");
});

test.concurrent("when a nested private query parameter is followed by an escape that is not valid UTF-8, the percent-encoded value is redacted", ({ expect }) => {
    const result = redactQueryParameters("https://app/login?returnUrl=%2Fcallback%3Femail%3D%E9ric%40workleap.com", ["email"]);

    expect(result).toBe("https://app/login?returnUrl=**redacted**");
});

test.concurrent("when a percent-encoded value includes a malformed escape, the nested private query parameter is redacted", ({ expect }) => {
    const result = redactQueryParameters("https://app/login?returnUrl=%2Fcallback%3Ftoken%3DABCDEF%26progress%3D100%", ["token"]);

    expect(result).toBe("https://app/login?returnUrl=**redacted**");
});

test.concurrent("when a percent-encoded value includes a lone surrogate, the nested private query parameter is redacted", ({ expect }) => {
    const result = redactQueryParameters("https://app/search?q=\uD83D%3Ftoken%3DABCDEF", ["token"]);

    expect(result).toBe("https://app/search?q=**redacted**");
});

test.concurrent("when a value is percent-encoded too many times to be decoded, the value is redacted", ({ expect }) => {
    const escape = `%${"25".repeat(4000)}`;
    const result = redactQueryParameters(`https://app/login?returnUrl=${escape}3Ftoken${escape}3DABCDEF&foo=bar`, ["token"]);

    expect(result).toBe("https://app/login?returnUrl=**redacted**&foo=bar");
});

test.concurrent("when there is no private query parameter in a percent-encoded url, the url is not altered", ({ expect }) => {
    const url = "https://app/caf%C3%A9/search?q=caf%C3%A9%20au%20lait&returnUrl=https%3A%2F%2Fapp%2Fcallback%3Ffoo%3Dbar%26progress%3D100%25#section%201";
    const result = redactQueryParameters(url, ["token", "email", "password"]);

    expect(result).toBe(url);
});

test.concurrent("when there is no private name, a percent-encoded url is not altered", ({ expect }) => {
    const url = "https://app/login?returnUrl=https%3A%2F%2Fapp%2Fcallback%3Ftoken%3DABCDEF";
    const result = redactQueryParameters(url, []);

    expect(result).toBe(url);
});
