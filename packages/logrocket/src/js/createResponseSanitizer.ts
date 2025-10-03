import type { LogRocketResponse } from "./logRocketTypes.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ResponseSanitizerFunction = (res: LogRocketResponse) => any;

export function createResponseSanitizer(fuzzyResponseSanitizer: ResponseSanitizerFunction) {
    return (res: LogRocketResponse) => {
        if (res.body) {
            // Do not return the response body, which could contain sensitive information.
            res.body = "**redacted**";
        }

        return fuzzyResponseSanitizer(res);
    };
}
