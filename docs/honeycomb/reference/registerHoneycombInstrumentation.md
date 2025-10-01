---
order: 100
label: registerHoneycombInstrumentation
meta:
    title: registerHoneycombInstrumentation - Honeycomb
toc:
    depth: 2-3
---

# registerHoneycombInstrumentation

Initializes an instance of [Honeycomb Web SDK](https://docs.honeycomb.io/send-data/javascript-browser/honeycomb-distribution) with Workleap's default settings.

## Reference

```ts
const client = registerHoneycombInstrumentation(namespace, serviceName, apiServiceUrls: [string | Regex], options?: {})
```

### Parameters

- `namespace`: The service namespace. Will be added to traces as a `service.namespace` custom attribute.
- `serviceName`: Honeycomb application service name.
- `apiServiceUrls`: A `RegExp` or `string` that matches the URLs of the application's backend services. If unsure, start with the temporary regex `/.+/g,` to match all URLs.
- `options`: An optional object literal of [predefined options](#predefined-options).

### Returns

A [HoneycombInstrumentationClient](./HoneycombInstrumentationClient.md) instance.

### Default instrumentation

The `registerHoneycombInstrumentation` function registers the following OpenTelemetry instrumentations by default:

- [@opentelemetry/instrumentation-fetch](https://github.com/open-telemetry/opentelemetry-js/tree/main/experimental/packages/opentelemetry-instrumentation-fetch)
- [@opentelemetry/instrumentation-document-load](https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/plugins/web/opentelemetry-instrumentation-document-load)

For more details, refer to the [registerHoneycombInstrumentation.ts](https://github.com/workleap/wl-telemetry/blob/main/packages/honeycomb/src/registerHoneycombInstrumentation.ts) file on GitHub.

## Customize backend URLs

!!!warning
Avoid using `/.+/g,` in production as it could expose customer data to third parties.
!!!

Specify values for the `apiServiceUrls` argument that matches your application's backend URLs. For example, if your backend services are hosted at `https://workleap.com/api`:

```ts !#6
import { registerHoneycombInstrumentation } from "@workleap/honeycomb";

const client = registerHoneycombInstrumentation(
    "sample",
    "my-app",
    [/https:\/\/workleap.com\/api\.*/], 
    { proxy: "https://sample-proxy" }
);
```

## Predefined options

The `registerHoneycombInstrumentation(namespace, serviceName, apiServiceUrls, options)` function can be used as shown in the previous example, however, if you wish to customize the default configuration, the function also accepts a few predefined options to help with that 👇

### `proxy`

- **Type**: `string`
- **Default**: `undefined`

Set the URL to an [OpenTelemetry collector](https://docs.honeycomb.io/send-data/opentelemetry/collector/) proxy. Either `proxy` or `apiKey` option must be provided.

```ts !#4
import { registerHoneycombInstrumentation } from "@workleap/honeycomb";

const client = registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    proxy: "https://sample-proxy"
});
```

When a `proxy` option is provided, the current session credentials are automatically sent with the OTel trace requests.

### `apiKey`

!!!warning
Prefer using an [OpenTelemetry collector](https://docs.honeycomb.io/send-data/opentelemetry/collector/) with an authenticated proxy over an ingestion [API key](https://docs.honeycomb.io/get-started/configure/environments/manage-api-keys/#create-api-key), as API keys can expose Workleap to potential attacks.
!!!

Set an Honeycomb ingestion [API key](https://docs.honeycomb.io/get-started/configure/environments/manage-api-keys/#create-api-key). Either `proxy` or `apiKey` option must be provided.

- **Type**: `string`
- **Default**: `undefined`

```ts !#4
import { registerHoneycombInstrumentation } from "@workleap/honeycomb";

const client = registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    apiKey: "123"
});
```

### `instrumentations`

- **Type**: An array of [instrumentation](https://opentelemetry.io/docs/languages/js/instrumentation/) objects
- **Default**: `[]`

Append the provided [instrumentation](https://opentelemetry.io/docs/languages/js/instrumentation/) instances to the configuration.

```ts !#6-8
import { registerHoneycombInstrumentation } from "@workleap/honeycomb";
import { LongTaskInstrumentation } from "@opentelemetry/instrumentation-long-task";

const client = registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    proxy: "https://sample-proxy",
    instrumentations: [
        new LongTaskInstrumentation()
    ]
});
```

### `spanProcessors`

- **Type**: An array of [span processor](https://docs.honeycomb.io/send-data/javascript-browser/honeycomb-distribution/#custom-span-processing) objects
- **Default**: `[]`

Append the provided [span processor](https://docs.honeycomb.io/send-data/javascript-browser/honeycomb-distribution/#custom-span-processing) instances to the configuration.

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
import { registerHoneycombInstrumentation } from "@workleap/honeycomb";
import { CustomSpanProcessor } from "./CustomSpanProcessor.ts";

const client = registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    proxy: "https://sample-proxy",
    spanProcessors: [
        new CustomSpanProcessor()
    ]
});
```

### `fetchInstrumentation`

- **Type**: `false` or `(defaultOptions: FetchInstrumentationConfig) => FetchInstrumentationConfig`
- **Default**: `{ ... }`

Replace the default [@opentelemetry/instrumentation-fetch](https://github.com/open-telemetry/opentelemetry-js/tree/main/experimental/packages/opentelemetry-instrumentation-fetch) options by providing a function that returns an object literal with the desired options. This function will receive an object literal containing the default options, which you can either extend or replace.

```ts !#5-10
import { registerHoneycombInstrumentation } from "@workleap/honeycomb";

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
import { registerHoneycombInstrumentation } from "@workleap/honeycomb";

const client = registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    proxy: "https://sample-proxy",
    fetchInstrumentation: false
});
```

### `documentLoadInstrumentation`

- **Type**: `false` or `(defaultOptions: DocumentLoadInstrumentationConfig) => DocumentLoadInstrumentationConfig`
- **Default**: `{ ... }`

Replace the default [@opentelemetry/instrumentation-document-load](https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/plugins/web/opentelemetry-instrumentation-document-load#document-load-instrumentation-options) options by providing a function that returns an object literal with the desired options. This function will receive an object literal containing the default options, which you can either extend or replace.

```ts !#5-10
import { registerHoneycombInstrumentation } from "@workleap/honeycomb";

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
import { registerHoneycombInstrumentation } from "@workleap/honeycomb";

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

### `xmlHttpRequestInstrumentation`

- **Type**: `boolean` or `(defaultOptions: XMLHttpRequestInstrumentationConfig) => XMLHttpRequestInstrumentationConfig`
- **Default**: `false`

By default, [@opentelemetry/instrumentation-xml-http-request](https://github.com/open-telemetry/opentelemetry-js/tree/main/experimental/packages/opentelemetry-instrumentation-xml-http-request) is disabled. To enable this instrumentation, provide a function that returns an object literal with the desired options. This function will receive an object literal of default options, which you can extend or replace as needed.

```ts !#5-10
import { registerHoneycombInstrumentation } from "@workleap/honeycomb";

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
import { registerHoneycombInstrumentation } from "@workleap/honeycomb";

const client = registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    proxy: "https://sample-proxy",
    xmlHttpRequestInstrumentation: true
});
```

### `userInteractionInstrumentation`

- **Type**: `boolean` or `(defaultOptions: UserInteractionInstrumentationConfig) => UserInteractionInstrumentationConfig`
- **Default**: `false`

By default, [@opentelemetryinstrumentation-user-interaction](https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/plugins/web/opentelemetry-instrumentation-user-interaction) is disabled. To enable this instrumentation, provide a function that returns an object literal with the desired options. This function will receive an object literal of default options, which you can extend or replace as needed.

```ts !#5-10
import { registerHoneycombInstrumentation } from "@workleap/honeycomb";

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

### `telemetryContext`

- **Type**: `TelemetryContext`
- **Default**: `undefined`

A [TelemetryContext](./createTelemetryContext.md#telemetrycontext) instance containing the telemetry colleration ids to attach to Honeycomb traces. Starting with version `7.0`, if no telemetry context is provided, the correlation ids will not be attached to Honeycomb traces.

```ts !#3,6
import { registerHoneycombInstrumentation, createTelemetryContext } from "@workleap/honeycomb/react";

const telemetryContext = createTelemetryContext();

const client = registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    proxy: "https://sample-proxy"
});
```

### `logRocketInstrumentationClient`

- **Type**: `LogRocketInstrumentationClient`
- **Default**: `undefined`

A [LogRocketInstrumentationClient](../../logrocket/reference/LogRocketInstrumentationClient.md) instance to integrate Honeycomb traces with LogRocket session replays. Starting with version `7.0`, if no LogRocket instrumentation client is provided, the Honeycomb traces will not integrate with LogRocket session replays.

```ts !#4,8
import { registerHoneycombInstrumentation, createTelemetryContext } from "@workleap/honeycomb/react";
import { registerLogRocketInstrumentation } from "@workleap/logrocket/react";

const logRocketInstrumentationClient = registerLogRocketInstrumentation("my-app-id");

const honeycombClient = registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    proxy: "https://sample-proxy",
    logRocketInstrumentationClient
});
```

### `verbose`

- **Type**: `boolean`
- **Default**: `false`

If no `loggers` are configured, verbose mode will automatically send logs to the console. In some cases, enabling verbose mode also produces additional debug information.

```ts !#5
import { registerHoneycombInstrumentation } from "@workleap/honeycomb";

const client = registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    proxy: "https://sample-proxy",
    verbose: true
});
```

### `loggers`

- **Type**: `RootLogger[]`
- **Default**: `undefined`

The logger instances that will output messages.

```ts !#6
import { registerHoneycombInstrumentation } from "@workleap/honeycomb";
import { LogRocketLogger } from "@workleap/logrocket";
import { BrowserConsoleLogger, LogLevel } from "@workleap/logging";

const client = registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    loggers: [new BrowserConsoleLogger(), new LogRocketLogger({ logLevel: LogLevel.information })]
});
```

## Configuration transformers

!!!warning
We do not guarantee that your configuration transformers won't break after an update. It's your responsibility to keep them up to date with new releases.
!!!

The [predefined options](#predefined-options) are useful to quickly customize the default configuration of the [Honeycomb Web SDK](https://docs.honeycomb.io/send-data/javascript-browser/honeycomb-distribution), but only covers a subset of the [options](https://docs.honeycomb.io/send-data/javascript-browser/honeycomb-distribution/#advanced-configuration). If you need full control over the configuration, you can provide configuration transformer functions through the `transformers` option of the `registerHoneycombInstrumentation` function. Remember, **no locked in** :heart::v:.

To view the default configuration of `registerHoneycombInstrumentation`, have a look at the [registerHoneycombInstrumentation.ts](https://github.com/workleap/wl-telemetry/blob/main/packages/honeycomb/src/registerHoneycombInstrumentation.ts) file on GitHub.

### `transformers`

- **Type**: `((options: HoneycombSdkOptions, context: HoneycombSdkOptionsTransformerContext) => HoneycombSdkOptions)[]`
- **Default**: `[]`

```ts
transformer(options: HoneycombSdkOptions, context: HoneycombSdkOptionsTransformerContext) => HoneycombSdkOptions;
```

```tsx !#3-7,11
import { registerHoneycombInstrumentation, type HoneycombSdkOptionsTransformer } from "@workleap/honeycomb";

const skipOptionsValidationTransformer: HoneycombSdkOptionsTransformer = config => {
    config.skipOptionsValidation = true;

    return config;
};

const client = registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    proxy: "https://sample-proxy",
    transformers: [skipOptionsValidationTransformer]
});
```

### Execution context

Generic transformers can use the `context` argument to gather additional information about their execution context:

```ts !#4 transformer.js
import type { HoneycombSdkOptionsTransformer } from "@workleap/honeycomb";

const debugTransformer: HoneycombSdkOptionsTransformer = (config, context) => {
    if (context.verbose) {
        config.debug = true;
        context.logger.debug("Debug mode has been activated.");
    }

    return config;
}
```

- `verbose`: `boolean`
- `logger`: `Logger`
