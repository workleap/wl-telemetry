import type { LogRocketRequest } from "./logRocketTypes.ts";
import { sanitizeHeaders } from "./sanitizeHeaders.ts";

// oxlint-disable-next-line typescript/no-explicit-any
export type RequestSanitizerFunction = (req: LogRocketRequest) => any;

export function createRequestSanitizer(fuzzyRequestSanitizer: RequestSanitizerFunction) {
    return (req: LogRocketRequest) => {
        req.headers = sanitizeHeaders(req.headers);

        if (req.body) {
            // Do not return the request body, which could contain sensitive information.
            req.body = "**redacted**";
        }

        return fuzzyRequestSanitizer(req);
    };
}
