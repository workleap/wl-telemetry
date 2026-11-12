# Privacy

By default, this package instrumentation hides a wide range of Personally Identifiable Information (PII) from session replays to protect user privacy:

- [LogRocket's DOM sanitization](https://docs.logrocket.com/reference/dom) hide sensitive text elements from session replays.
- [LogRocket's network data sanitization](https://docs.logrocket.com/reference/network) strip sensitive information from request/response headers and body from session replays.
- [LogRocket's URLs sanitization](https://docs.logrocket.com/reference/browser) strip sensitive information from URLs' query parameters exposed in session replays.

## Record elements

By default, **no DOM elements are recorded**. To record the content of an element and its children, explicitly add the `data-public` property to the element. When this attribute is present, the content inside the element, including child elements, will be captured in the session replay:

```html !#1
<div data-public>
    This text will be visible in the session replay.
</div>
```

## Block elements

To prevent an element and its child elements from being recorded, use the `data-private` attribute.. This is especially useful when you want to selectively exclude sensitive parts of an element tree while allowing others to be captured.

```html !#1,6
<div data-public>
    <ul>
        <li>Page 1</li>
        <li>Page 2</li>
    </ul>
    <div data-private>
        This text will be not be visible in the session replay.
    </div>
</div>
```

## Network requests

The body of a network request or response is never recorded.

A request or response header is redacted when its name contains one of the following values, regardless of the casing: `auth`, `cookie`, `token`, `session`, `secret`, `key`, `csrf`, `xsrf` or `x-honeycomb-team`. For example, the `Authorization`, `Proxy-Authorization`, `Cookie`, `Set-Cookie`, `X-CSRF-Token` and `X-Api-Key` headers are all redacted.

!!!info
Since a header only has to contain one of those values, a few headers that are not credentials, such as `WWW-Authenticate` or `Idempotency-Key`, are redacted as well.
!!!

To redact additional headers, wrap the network sanitizers with a [transformer function](../../reference/telemetry/initializeTelemetry.md#use-transformer-functions):

```ts !#3-20,26
import { initializeTelemetry, type LogRocketSdkOptionsTransformer } from "@workleap/telemetry/react";

const redactTenantHeader: LogRocketSdkOptionsTransformer = config => {
    const requestSanitizer = config.network?.requestSanitizer;

    config.network = {
        ...config.network,
        requestSanitizer: request => {
            for (const name of Object.keys(request.headers ?? {})) {
                if (name.toLowerCase() === "x-tenant") {
                    request.headers[name] = "**redacted**";
                }
            }

            return requestSanitizer ? requestSanitizer(request) : request;
        }
    };

    return config;
};

const client = initializeTelemetry("wlp", {
    logRocket: {
        appId: "my-app-id",
        options: {
            transformers: [redactTenantHeader]
        }
    }
});
```

Use the same technique with `responseSanitizer` to redact additional response headers.
