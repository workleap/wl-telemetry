import type LogRocket from "logrocket";

// Typings are not exposed by the library.
export type LogRocketSdkOptions = NonNullable<Parameters<(typeof LogRocket)["init"]>[1]>;

// Typings are not exposed by the library, copied from the LogRocket package.
export interface LogRocketRequest {
    reqId: string;
    url: string;
    headers: {
        [key: string]: string | null | undefined;
    };
    body?: string;
    method: string;
    referrer?: string;
    mode?: string;
    credentials?: string;
}

// Typings are not exposed by the library, copied from the LogRocket package.
export interface LogRocketResponse {
    reqId: string;
    status?: number;
    headers: {
        [key: string]: string | null | undefined;
    };
    body?: string;
    method: string;
    url?: string;
}
