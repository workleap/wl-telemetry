import { redactQueryParameters } from "@workleap-telemetry/core";

export type UrlSanitizerFunction = (url: string) => string;

export function createUrlSanitizer(queryParametersToRemove: string[]) {
    return (url: string | URL) => {
        // A network request made with XMLHttpRequest can provide a URL object rather than a string.
        return redactQueryParameters(String(url), queryParametersToRemove);
    };
}
