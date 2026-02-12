---
order: 90
label: Reference
title: Reference - Honeycomb
toc:
    depth: 2-3
---

# Reference

## `registerHoneycombInstrumentation`

Initializes an instance of [Honeycomb Web SDK](https://docs.honeycomb.io/send-data/javascript-browser/honeycomb-distribution) with Workleap's default settings.

```ts
const client = registerHoneycombInstrumentation(namespace, serviceName, apiServiceUrls: [string | Regex], options?: {
    proxy?,
    apiKey?,
    instrumentations?,
    spanProcessors?,
    fetchInstrumentation?,
    documentLoadInstrumentation?,
    xmlHttpRequestInstrumentation?,
    userInteractionInstrumentation?,
    telemetryContext?,
    logRocketInstrumentationClient?,
    verbose?,
    loggers?,
    transformers?
})
```

### Parameters

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
    - `telemetryContext`: A `TelemetryContext` instance containing the telemetry correlation ids to attach to Honeycomb traces.
    - `logRocketInstrumentationClient`: A `LogRocketInstrumentationClient` instance to integrate Honeycomb traces with LogRocket session replays.
    - `verbose`: If no `loggers` are configured, verbose mode will automatically send logs to the console. In some cases, enabling verbose mode also produces additional debug information.
    - `loggers`: An array of logger instances that will output messages.
    - `transformers`: An array of transformer functions to update the default LogRocket options.

### Returns

A [HoneycombInstrumentationClient](#honeycombinstrumentationclient) instance.

### Default instrumentation

The `registerHoneycombInstrumentation` function registers the following OpenTelemetry instrumentations by default:

- [@opentelemetry/instrumentation-fetch](https://github.com/open-telemetry/opentelemetry-js/tree/main/experimental/packages/opentelemetry-instrumentation-fetch)
- [@opentelemetry/instrumentation-document-load](https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/plugins/web/opentelemetry-instrumentation-document-load)

For more details, refer to the [registerHoneycombInstrumentation.ts](https://github.com/workleap/wl-telemetry/blob/main/packages/honeycomb/src/registerHoneycombInstrumentation.ts) file on GitHub.

### Use a proxy

```ts !#4
import { registerHoneycombInstrumentation } from "@workleap/honeycomb/react";

const client = registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    proxy: "https://sample-proxy"
});
```

When a `proxy` option is provided, the current session credentials are automatically sent with the OTel trace requests.

### Use an API key

!!!warning
Prefer using an [OpenTelemetry collector](https://docs.honeycomb.io/send-data/opentelemetry/collector/) with an authenticated proxy over an ingestion [API key](https://docs.honeycomb.io/get-started/configure/environments/manage-api-keys/#create-api-key), as API keys can expose Workleap to potential attacks.
!!!

```ts !#4
import { registerHoneycombInstrumentation } from "@workleap/honeycomb/react";

const client = registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    apiKey: "123"
});
```

### Use custom instrumentations

```ts !#6-8
import { registerHoneycombInstrumentation } from "@workleap/honeycomb/react";
import { LongTaskInstrumentation } from "@opentelemetry/instrumentation-long-task";

const client = registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    proxy: "https://sample-proxy",
    instrumentations: [
        new LongTaskInstrumentation()
    ]
});
```

### Use custom span processors

```ts CustomSpanPressor.ts
export class CustomSpanProcessor implements SpanProcessor {
    onStart(span: Span): void {
        span.setAttributes({
            "processor.name": "CustomSpanPressor"
        });
    }

    onEnd(): void {}

    forceFlush() {
        return Promise.resolve();
    }

    shutdown() {
        return Promise.resolve();
    }
}
```

```ts !#6-8
import { registerHoneycombInstrumentation } from "@workleap/honeycomb/react";
import { CustomSpanProcessor } from "./CustomSpanProcessor.ts";

const client = registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    proxy: "https://sample-proxy",
    spanProcessors: [
        new CustomSpanProcessor()
    ]
});
```

### Customize `fetchInstrumentation`

```ts !#5-10
import { registerHoneycombInstrumentation } from "@workleap/honeycomb/react";

const client = registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    proxy: "https://sample-proxy",
    fetchInstrumentation: (defaultOptions) => {
        return {
            ...defaultOptions,
            ignoreNetworkEvents: false
        }
    }
});
```

To disable [@opentelemetry/instrumentation-fetch](https://github.com/open-telemetry/opentelemetry-js/tree/main/experimental/packages/opentelemetry-instrumentation-fetch), set the option to `false`.

```ts !#5
import { registerHoneycombInstrumentation } from "@workleap/honeycomb/react";

const client = registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    proxy: "https://sample-proxy",
    fetchInstrumentation: false
});
```

### Customize `documentLoadInstrumentation`

```ts !#5-10
import { registerHoneycombInstrumentation } from "@workleap/honeycomb/react";

const client = registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    proxy: "https://sample-proxy",
    documentLoadInstrumentation: (defaultOptions) => {
        return {
            ...defaultOptions,
            ignoreNetworkEvents: false
        }
    }
});
```

To disable [@opentelemetry/instrumentation-document-load](https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/plugins/web/opentelemetry-instrumentation-document-load#document-load-instrumentation-options), set the option to `false`.

```ts !#5-10
import { registerHoneycombInstrumentation } from "@workleap/honeycomb/react";

const client = registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    proxy: "https://sample-proxy",
    documentLoadInstrumentation: (defaultOptions) => {
        return {
            ...defaultOptions,
            ignoreNetworkEvents: false
        }
    }
});
```

### Customize `xmlHttpRequestInstrumentation`

```ts !#5-10
import { registerHoneycombInstrumentation } from "@workleap/honeycomb/react";

const client = registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    proxy: "https://sample-proxy",
    xmlHttpRequestInstrumentation: (defaultOptions) => {
        return {
            ...defaultOptions,
            ignoreNetworkEvents: false
        }
    }
});
```

Or set the option to `true` to enable [@opentelemetry/instrumentation-xml-http-request](https://github.com/open-telemetry/opentelemetry-js/tree/main/experimental/packages/opentelemetry-instrumentation-xml-http-request) with the default options.

```ts !#5
import { registerHoneycombInstrumentation } from "@workleap/honeycomb/react";

const client = registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    proxy: "https://sample-proxy",
    xmlHttpRequestInstrumentation: true
});
```

### Customize `userInteractionInstrumentation`

```ts !#5-10
import { registerHoneycombInstrumentation } from "@workleap/honeycomb/react";

const client = registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    proxy: "https://sample-proxy",
    userInteractionInstrumentation: (defaultOptions) => {
        return {
            ...defaultOptions,
            eventNames: ["submit", "click", "keypress"]
        }
    }
});
```

Or set the option to `true` to enable [@opentelemetryinstrumentation-user-interaction](https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/plugins/web/opentelemetry-instrumentation-user-interaction) with the default options.

```ts !#5
import { registerHoneycombInstrumentation } from "@workleap/honeycomb/react";

const client = registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    proxy: "https://sample-proxy",
    userInteractionInstrumentation: true
});
```

### Use a telemetry context

```ts !#3,6
import { registerHoneycombInstrumentation, createTelemetryContext } from "@workleap/honeycomb/react";

const telemetryContext = createTelemetryContext();

const client = registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    telemetryContext
});
```

### Integrate with LogRocket

```ts !#4,8
import { registerHoneycombInstrumentation, createTelemetryContext } from "@workleap/honeycomb/react";
import { registerLogRocketInstrumentation } from "@workleap/logrocket/react";

const logRocketInstrumentationClient = registerLogRocketInstrumentation("my-app-id");

const honeycombClient = registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    proxy: "https://sample-proxy",
    logRocketInstrumentationClient
});
```

### Verbose mode

```ts !#5
import { registerHoneycombInstrumentation } from "@workleap/honeycomb/react";

const client = registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    proxy: "https://sample-proxy",
    verbose: true
});
```

### Use loggers

```ts !#6
import { registerHoneycombInstrumentation } from "@workleap/honeycomb/react";
import { LogRocketLogger } from "@workleap/logrocket";
import { BrowserConsoleLogger, LogLevel } from "@workleap/logging";

const client = registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    loggers: [new BrowserConsoleLogger(), new LogRocketLogger({ logLevel: LogLevel.information })]
});
```

### Use transformer functions

The predefined options are useful to quickly customize the default configuration of the [Honeycomb Web SDK](https://docs.honeycomb.io/send-data/javascript-browser/honeycomb-distribution), but only covers a subset of the [options](https://docs.honeycomb.io/send-data/javascript-browser/honeycomb-distribution/#advanced-configuration). If you need full control over the configuration, you can provide configuration transformer functions through the `transformers` option of the `registerHoneycombInstrumentation` function. Remember, **no locked in** :heart::v:.

To view the default configuration of [registerHoneycombInstrumentation](#registerhoneycombinstrumentation), have a look at the [registerHoneycombInstrumentation.ts](https://github.com/workleap/wl-telemetry/blob/main/packages/honeycomb/src/registerHoneycombInstrumentation.ts) file on GitHub.

```tsx !#3-7,11
import { registerHoneycombInstrumentation, type HoneycombSdkOptionsTransformer } from "@workleap/honeycomb/react";

const skipOptionsValidationTransformer: HoneycombSdkOptionsTransformer = config => {
    config.skipOptionsValidation = true;

    return config;
};

const client = registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    proxy: "https://sample-proxy",
    transformers: [skipOptionsValidationTransformer]
});
```

Generic transformers can use the `context` argument to gather additional information about their execution context:

```ts !#4 transformer.ts
import type { HoneycombSdkOptionsTransformer } from "@workleap/honeycomb/react";

const debugTransformer: HoneycombSdkOptionsTransformer = (config, context) => {
    if (context.verbose) {
        config.debug = true;
        context.logger.debug("Debug mode has been activated.");
    }

    return config;
}
```

## `HoneycombInstrumentationClient`

A lightweight client providing access to Honeycomb instrumentation utilities.

```ts
const client = new HoneycombInstrumentationClient(globalAttributeSpanProcessor?, fetchRequestPipeline?)
```

### Parameters

- `globalAttributeSpanProcessor`: A [SpanProcessor](https://docs.honeycomb.io/send-data/javascript-browser/honeycomb-distribution/#custom-span-processing) to attach global attributes to all traces.
- `fetchRequestPipeline`: A pipeline instance to dynamically add [@opentelemetry/instrumentation-fetch](https://github.com/open-telemetry/opentelemetry-js/tree/main/experimental/packages/opentelemetry-instrumentation-fetch) request hooks.

### Methods

- `setGlobalSpanAttribute(key, value)`: Set a single global attribute to be included in all traces.
- `setGlobalSpanAttributes(attributes)`: Set a single or multiple global attributes to be included in all traces.
- `registerFetchRequestHook(hook)`: Dynamically registers fetch request hook at the end of the pipeline.
- `registerFetchRequestHookAtStart(hook)`: Dynamically registers a fetch request hook at the start of the pipeline.

### Register global attributes

```ts !#5-7
import { useHoneycombInstrumentationClient } from "@workleap/honeycomb/react";

const client = useHoneycombInstrumentationClient();

client.setGlobalSpanAttributes({
    "app.user_id": "123"
});
```

### Register a dynamic request hook

```ts !#5-15
import { useHoneycombInstrumentationClient } from "@workleap/honeycomb/react";

const client = useHoneycombInstrumentationClient();

client.registerFetchRequestHook((requestSpan, request) => {
    let headers: Headers;

    if (request instanceof Request) {
        const moduleId = request.headers.get("x-module-id");

        if (moduleId) {
            requestSpan.setAttribute("app.module_id", moduleId);
        }
    }
});
```

### Register a dynamic request hook to be executed first

```ts !#5-15
import { useHoneycombInstrumentationClient } from "@workleap/honeycomb/react";

const client = useHoneycombInstrumentationClient();

client.registerFetchRequestHookAtStart((requestSpan, request) => {
    let headers: Headers;

    if (request instanceof Request) {
        const moduleId = request.headers.get("x-module-id");

        if (moduleId) {
            requestSpan.setAttribute("app.module_id", moduleId);
        }
    }
});
```

### Prevent the execution of subsequent request hooks

A dynamic request hook can stop the execution of subsequent request hooks by returning `true`.

```ts !#15
import { useHoneycombInstrumentationClient } from "@workleap/honeycomb/react";

const client = useHoneycombInstrumentationClient();

client.registerFetchRequestHookAtStart((requestSpan, request) => {
    let headers: Headers;

    if (request instanceof Request) {
        const moduleId = request.headers.get("x-module-id");

        if (moduleId) {
            requestSpan.setAttribute("app.module_id", moduleId);

            // Indicates to not propagate the requests to the subsequent hooks.
            return true;
        }
    }
});
```

## NoopHoneycombInstrumentationClient`

A fake implementation of [HoneycombInstrumentationClient](#honeycombinstrumentationclient) for use in non-standard contexts such as unit tests and Storybook.

```ts
import { NoopHoneycombInstrumentationClient } from "@workleap/honeycomb/react";

const client = new NoopHoneycombInstrumentationClient();
```

## `HoneycombInstrumentationProvider`

React provider to share a `HoneycombInstrumentationProvider` instance with the application code.

```tsx
<HoneycombInstrumentationProvider client={client}>
    <App />
</HoneycombInstrumentationProvider>
```

### Properties

- `client`: A [HoneycombInstrumentationClient](#honeycombinstrumentationclient) instance.

### Provide a client instance

```tsx !#12-14
import { registerHoneycombInstrumentation, HoneycombInstrumentationProvider } from "@workleap/honeycomb/react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

const client = registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    proxy: "https://sample-proxy"
});

const root = createRoot(document.getElementById("root"));

root.render(
    <HoneycombInstrumentationProvider client={client}>
        <App />
    </HoneycombInstrumentationProvider>
);
```

### Retrieve a client instance

```ts !#3
import { useHoneycombInstrumentationClient } from "@workleap/honeycomb/react";

const client = useHoneycombInstrumentationClient();

client.setGlobalSpanAttributes({
    "app.user_id": "123"
});
```

## `useHoneycombInstrumentationClient`

Retrieve a `HoneycombInstrumentationClient` instance.

```ts
const client = useHoneycombInstrumentationClient(options?: { throwOnUndefined? })
```

### Parameters

- `options`: An optional object literal of options:
    - `throwOnUndefined`: Whether or not an exception should be thrown if a client instance hasn't been provided.

### Returns

A [HoneycombInstrumentationClient](#honeycombinstrumentationclient) instance.

### Usage

```ts !#3
import { useHoneycombInstrumentationClient } from "@workleap/honeycomb/react";

const client = useHoneycombInstrumentationClient();

client.setGlobalSpanAttributes({
    "app.user_id": "123"
});
```

## `createTelemetryContext`

Creates a `TelemetryContext` instance containing the telemetry correlation ids.

```ts
const telemetryContext = createTelemetryContext(options?: { identityCookieExpiration?, identityCookieDomain?, verbose?, loggers? })
```

### Parameters

- `productFamily`: `wlp` or `sg`.
- `options`: An optional object literal of options:
    - `identityCookieExpiration`: The expiration date of the `wl-identity` cookie if the cookie hasn't been already written. The default value is 365 days.
    - `verbose`: If no loggers are configured, verbose mode will automatically send logs to the console. In some cases, enabling verbose mode also produces additional debug information.
    - `loggers`: An optional array of `Logger` instances.

### Returns

A `TelemetryContext` instance.

### Create a telemetry context

```ts !#3
import { createTelemetryContext } from "@workleap/honeycomb/react";

const context = createTelemetryContext("sg");
```

### Set a custom cookie expiration

```ts !#4
import { createTelemetryContext } from "@workleap/honeycomb/react";

const context = createTelemetryContext("wlp", {
    identityCookieExpiration: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
});
```

### Verbose mode

```ts !#4
import { createTelemetryContext } from "@workleap/honeycomb/react";

const context = createTelemetryContext("wlp", {
    verbose: true
});
```

### Loggers

```ts !#5
import { createTelemetryContext, LogRocketLogger } from "@workleap/honeycomb/react";
import { BrowserConsoleLogger, LogLevel } from "@workleap/logging";

const context = createTelemetryContext("sg", {
    loggers: [new BrowserConsoleLogger(), new LogRocketLogger({ logLevel: LogLevel.information })]
});
```
