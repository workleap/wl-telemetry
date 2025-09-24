import { isString } from "./assertions.ts";

export const XmlHttpVerbProperty = "__wl_verb__";
// Patching: https://github.com/open-telemetry/opentelemetry-js/blob/main/experimental/packages/otlp-exporter-base/src/transport/xhr-transport.ts
//
// Explanations:
//      1) Currently, all trace requests initiated by OTel automatic instrumentation is sent through XMR.
//      2) Current issue is that there's no option to tell OTel automatic instrumentation to include the user credentials. Our collector proxy implementation needs those credentials to authenticate the requests.
//      3) To circumvent this limitation, we patch XMR to include the credentials when the request is sent to configured proxy URL.
//
// If OTel automatic instrumentation transportation switch to the Fetch API, the following article could help patching the Fetch API: https://blog.logrocket.com/intercepting-javascript-fetch-api-requests-responses/
export function patchXmlHttpRequest(proxy: string) {
    const originalOpen = XMLHttpRequest.prototype.open;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    XMLHttpRequest.prototype.open = function(...args) {
        const verb = args[0];
        const url = args[1];

        if (url && proxy) {
            const stringifyUrl = isString(url) ? url : url.toString();

            if (stringifyUrl.includes(proxy)) {
                this.withCredentials = true;
            }
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this[XmlHttpVerbProperty] = verb;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        originalOpen.apply(this, args);
    };
}
