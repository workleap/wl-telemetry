---
order: 200
label: initializeTelemetry
toc:
    depth: 2-3
---

# initializeTelemetry

## Reference

```ts
const client = initializeTelemetry(options?: { logRocket?, honeycomb?, mixpanel?, verbose?, loggers? });
```

### Parameters

- `options`: An optional object literal of options:
    - `logRocket`: An optional LogRocket instrumentation registration options object. If provided, LogRocket instrumentation is registered, if omitted, it is skipped.
        - `appId`: The LogRocket application id.
        - `options`: An optional object literal of options:
            - `rootHostname`: A [root hostname](https://docs.logrocket.com/reference/roothostname) to track sessions across subdomains.
            - `privateFieldNames`: Names of additional fields to exclude from session replays. These fields will be removed from network requests, responses using a fuzzy-matching algorithm.
            - `privateQueryParameterNames`: Names of additional fields to exclude from session replays. These fields will be removed from query parameters using a fuzzy-matching algorithm.
    - `honeycomb`: An optional Honeycomb instrumentation registration options object. If provided, Honeycomb instrumentation is registered, if omitted, it is skipped.
        - `namespace`: The service namespace. Will be added to traces as a `service.namespace` custom attribute.
        - `serviceName`: Honeycomb application service name.
        - `apiServiceUrls`: A `RegExp` or `string` that matches the URLs of the application's backend services. If unsure, start with the temporary regex `/.+/g,` to match all URLs.
        - `options`: An optional object literal of options:
            - `proxy`: Set the URL to an [OpenTelemetry collector](https://docs.honeycomb.io/send-data/opentelemetry/collector/) proxy. Either `proxy` or `apiKey` option must be provided.
            - `apiKey`: Set an Honeycomb ingestion [API key](https://docs.honeycomb.io/get-started/configure/environments/manage-api-keys/#create-api-key). Either `proxy` or `apiKey` option must be provided.
            - `instrumentations`: Append the provided [instrumentation](https://opentelemetry.io/docs/languages/js/instrumentation/) instances to the configuration.
            - `spanProcessors`: Append the provided [span processor](https://docs.honeycomb.io/send-data/javascript-browser/honeycomb-distribution/#custom-span-processing) instances to the configuration.
            - `fetchInstrumentation`: Replace the default [@opentelemetry/instrumentation-fetch](https://github.com/open-telemetry/opentelemetry-js/tree/main/experimental/packages/opentelemetry-instrumentation-fetch) options by providing a function that returns an object literal with the desired options. This function will receive an object literal containing the default options, which you can either extend or replace.
            - `documentLoadInstrumentation`: Replace the default [@opentelemetry/instrumentation-document-load](https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/plugins/web/opentelemetry-instrumentation-document-load#document-load-instrumentation-options) options by providing a function that returns an object literal with the desired options. This function will receive an object literal containing the default options, which you can either extend or replace.
            - `xmlHttpRequestInstrumentation`: By default, [@opentelemetry/instrumentation-xml-http-request](https://github.com/open-telemetry/opentelemetry-js/tree/main/experimental/packages/opentelemetry-instrumentation-xml-http-request) is disabled. To enable this instrumentation, provide a function that returns an object literal with the desired options. This function will receive an object literal of default options, which you can extend or replace as needed.
            - `userInteractionInstrumentation`: By default, [@opentelemetryinstrumentation-user-interaction](https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/plugins/web/opentelemetry-instrumentation-user-interaction) is disabled. To enable this instrumentation, provide a function that returns an object literal with the desired options. This function will receive an object literal of default options, which you can extend or replace as needed.
    - `mixpanel`: An optional Mixpanel initialization options object. If provided, Mixpanel is initialized, if omitted, it is skipped.
        - `productId`: The product id.
        - `envOrTrackingApiBaseUrl`: The environment to get the navigation url from or a base URL.
        - `options`: An optional object literal of options:
            - `trackingEndpoint`: An optional tracking endpoint.
    - `verbose`: If no `loggers` are configured, verbose mode will automatically send logs to the console. In some cases, enabling verbose mode also produces additional debug information.
    - `loggers`: An optional array of `RootLogger` instances.

### Returns

A [TelemetryClient](./TelemetryClient.md) instance.

## Usage

### Initialize all telemetry platforms

```ts !#4-18
import { initializeTelemetry } from "@workleap/telemetry/react";

const client = initializeTelemetry({
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
        productId: "wlp",
        envOrTrackingApiBaseUrl: "development"
    }
});
```

### Initialize LogRocket

```ts !#4-6
import { initializeTelemetry } from "@workleap/telemetry/react";

const client = initializeTelemetry({
    logRocket: {
        appId: "my-app-id"
    }
});
```

### Initialize Honeycomb

```ts !#4-11
import { initializeTelemetry } from "@workleap/telemetry/react";

const client = initializeTelemetry({
    honeycomb: {
        namespace: "sample",
        serviceName: "my-app-name",
        apiServiceUrls: [/.+/g],
        options: {
            proxy: "https://sample-proxy"
        }
    }
});
```

### Initialize Mixpanel

```ts !#4-7
import { initializeTelemetry } from "@workleap/telemetry/react";

const client = initializeTelemetry({
    mixpanel: {
        productId: "wlp",
        envOrTrackingApiBaseUrl: "development"
    }
});
```

### Verbose mode

```ts !#19
import { initializeTelemetry } from "@workleap/telemetry/react";

const client = initializeTelemetry({
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
        productId: "wlp",
        envOrTrackingApiBaseUrl: "development"
    },
    verbose: true
});
```

### Loggers

```ts !#21
import { initializeTelemetry } from "@workleap/telemetry/react";
import { LogRocketLogger } from "@workleap/logrocket/react";
import { BrowserConsoleLogger, LogLevel } from "@workleap/logging";

const client = initializeTelemetry({
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
        productId: "wlp",
        envOrTrackingApiBaseUrl: "development"
    },
    loggers: [new BrowserConsoleLogger(), new LogRocketLogger({ logLevel: LogLevel.information })]
});
```


