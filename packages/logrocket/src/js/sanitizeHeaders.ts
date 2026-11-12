import type { LogRocketRequest } from "./logRocketTypes.ts";

// A header is redacted when its lowercased name contains one of the following values.
const PrivateHeaderNames = ["auth", "cookie", "token", "session", "secret", "key", "csrf", "xsrf", "x-honeycomb-team"];

// When the headers of a fetch request are provided as an array of tuples, LogRocket indexes the headers by their position
// and the header name ends up in the value, e.g. { "0": "Authorization,Bearer 123" }.
const IndexedHeaderNameRegEx = /^\d+$/;

function isPrivateHeader(name: string) {
    const lowercasedName = name.toLowerCase();

    return IndexedHeaderNameRegEx.test(name) || PrivateHeaderNames.some(x => lowercasedName.includes(x));
}

export function sanitizeHeaders(headers: unknown) {
    const sanitizedHeaders: LogRocketRequest["headers"] = {};

    if (headers !== null && typeof headers === "object") {
        for (const [name, value] of Object.entries(headers)) {
            sanitizedHeaders[name] = isPrivateHeader(name) ? "**redacted**" : value;
        }
    }

    return sanitizedHeaders;
}
