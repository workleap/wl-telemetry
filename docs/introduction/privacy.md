---
order: 45
label: Privacy
---

# Privacy

The telemetry platforms receive URLs, such as the URL of the current page, the referrer and the URL of the network requests. A URL can include a sensitive value, such as a token or an email. By default, the sensitive values are removed from the URLs before they are sent to a telemetry platform.

## Default behavior

The value of a private query parameter is replaced by `**redacted**`. By default, the private query parameters are `token`, `email` and `password`. A query parameter is redacted when its name ends with one of those values, regardless of the casing. For example, the `access_token` and `userEmail` query parameters are redacted as well.

| | LogRocket | Honeycomb | Mixpanel |
| --- | --- | --- | --- |
| URLs | The URL of the pages and the network requests of a session replay. | The URL attributes of a trace, such as `url.full`, `page.url` and `entry_page.referrer`. | The `$current_url` and `$referrer` properties of an event. |
| Private query parameters | Redacted. | Redacted. | Redacted. |
| Fragment | Kept. A fragment that directly follows the value of a private query parameter is redacted with the value. | Removed. The `page.hash` and `entry_page.hash` attributes are not sent. | Removed from `$current_url`. |

!!!warning
The value of the other query parameters is sent as is. If an application adds a sensitive value to a query parameter that is not private by default, the name of the query parameter must be provided with the `privateQueryParameterNames` option.
!!!

## Redact custom query parameters

To redact additional query parameters from the URLs sent to every telemetry platform, use the `privateQueryParameterNames` option:

```ts !#18
import { initializeTelemetry } from "@workleap/telemetry/react";

const client = initializeTelemetry("wlp", {
    logRocket: {
        appId: "my-app-id"
    },
    honeycomb: {
        namespace: "sample",
        serviceName: "my-app-name",
        apiServiceUrls: [/.+/g],
        options: {
            proxy: "https://sample-proxy"
        }
    },
    mixpanel: {
        envOrTrackingApiBaseUrl: "development"
    },
    privateQueryParameterNames: ["a-custom-param"]
});
```

To redact a query parameter for a single telemetry platform, use the `privateQueryParameterNames` option of the platform options instead. To learn more, refer to the [initializeTelemetry](../reference/telemetry/initializeTelemetry.md) reference.

## LogRocket session replays

LogRocket also records the DOM and the network requests of a session. To learn more about what is recorded and how to hide sensitive information from session replays, refer to the LogRocket [Privacy](./learn-logrocket/privacy.md) page.
