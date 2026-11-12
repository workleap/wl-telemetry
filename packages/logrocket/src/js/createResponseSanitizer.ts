import type { LogRocketResponse } from "./logRocketTypes.ts";
import { sanitizeHeaders } from "./sanitizeHeaders.ts";

// oxlint-disable-next-line typescript/no-explicit-any
export type ResponseSanitizerFunction = (res: LogRocketResponse) => any;

export function createResponseSanitizer(fuzzyResponseSanitizer: ResponseSanitizerFunction) {
    return (res: LogRocketResponse) => {
        res.headers = sanitizeHeaders(res.headers);

        if (res.body) {
            // Do not return the response body, which could contain sensitive information.
            res.body = "**redacted**";
        }

        return fuzzyResponseSanitizer(res);
    };
}
