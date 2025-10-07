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
            - `transformers`: An array of transformer functions to update the default LogRocket options.
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
            - `transformers`: An array of transformer functions to update the default Honeycomb options.
    - `mixpanel`: An optional Mixpanel initialization options object. If provided, Mixpanel is initialized, if omitted, it is skipped.
        - `productId`: The product id.
        - `envOrTrackingApiBaseUrl`: The environment to get the navigation url from or a base URL.
        - `options`: An optional object literal of options:
            - `trackingEndpoint`: An optional tracking endpoint.
    - `verbose`: If no `loggers` are configured, verbose mode will automatically send logs to the console. In some cases, enabling verbose mode also produces additional debug information.
    - `loggers`: An optional array of `RootLogger` instances.

### Returns

A [TelemetryClient](./TelemetryClient.md) instance.

## Initialize all telemetry platforms

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

## LogRocket

### Set a root hostname

```ts !#7
import { initializeTelemetry } from "@workleap/telemetry/react";

const client = initializeTelemetry({
    logRocket: {
        appId: "my-app-id",
        options: {
            rootHostname: "an-host.com"
        }
    }
});
```

### Remove custom private fields

```ts !#7
import { initializeTelemetry } from "@workleap/telemetry/react";

const client = initializeTelemetry({
    logRocket: {
        appId: "my-app-id",
        options: {
            privateFieldNames: ["a-custom-field"]
        }
    }
});
```

To view the default private fields, have a look at the [registerLogRocketInstrumentation.ts](https://github.com/workleap/wl-telemetry/blob/main/packages/logrocket/src/registerLogRocketInstrumentation.ts) file on GitHub.

### Remove custom query parameters

```ts !#7
import { initializeTelemetry } from "@workleap/telemetry/react";

const client = initializeTelemetry({
    logRocket: {
        appId: "my-app-id",
        options: {
            privateQueryParameterNames: ["a-custom-param"]
        }
    }
});
```

To view the default private query parameters, have a look at the [registerLogRocketInstrumentation.ts](https://github.com/workleap/wl-telemetry/blob/main/packages/logrocket/src/registerLogRocketInstrumentation.ts) file on GitHub.

### Use transformer functions

The predefined options are useful to quickly customize the default configuration of the [LogRocket SDK](https://docs.logrocket.com/reference/init), but only covers a subset of the options. If you need full control over the configuration, you can provide configuration transformer functions through the `logrocket.transformers` option of the [initializeTelemetry](./initializeTelemetry.md) function. Remember, **no locked in** :heart::v:.

To view the default configuration, have a look at the [registerLogRocketInstrumentation.ts](https://github.com/workleap/wl-telemetry/blob/main/packages/logrocket/src/registerLogRocketInstrumentation.ts) file on GitHub.

```ts !#3-8,14
import { initializeTelemetry, type LogRocketSdkOptionsTransformer } from "@workleap/telemetry/react";

const disableConsoleLogging: LogRocketSdkOptionsTransformer = config => {
    config.console = ...(config.console || {});
    config.console.isEnabled = false;

    return config;
};

const client = initializeTelemetry({
    logRocket: {
        appId: "my-app-id",
        options: {
            transformers: [disableConsoleLogging]
        }
    }
});
```

Generic transformers can use the `context` argument to gather additional information about their execution context:

```ts !#4,8 transformer.ts
import type { LogRocketSdkOptionsTransformer } from "@workleap/telemetry/react";

const disableConsoleLogging: LogRocketSdkOptionsTransformer = (config, context) => {
    if (!context.verbose) {
        config.console = ...(config.console || {});
        config.shouldDebugLog = false;

        context.logger.debug("Disabling LogRocket SDK debug logs.");
    }

    return config;
}
```

## Honeycomb

### Use a proxy

```ts !#9
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

When a `proxy` option is provided, the current session credentials are automatically sent with the OTel trace requests.

### Use an API key

!!!warning
Prefer using an [OpenTelemetry collector](https://docs.honeycomb.io/send-data/opentelemetry/collector/) with an authenticated proxy over an ingestion [API key](https://docs.honeycomb.io/get-started/configure/environments/manage-api-keys/#create-api-key), as API keys can expose Workleap to potential attacks.
!!!

```ts !#9
import { initializeTelemetry } from "@workleap/telemetry/react";

const client = initializeTelemetry({
    honeycomb: {
        namespace: "sample",
        serviceName: "my-app-name",
        apiServiceUrls: [/.+/g],
        options: {
            apiKey: "123"
        }
    }
});
```

### Use custom instrumentations

```ts !#11-13
import { initializeTelemetry } from "@workleap/telemetry/react";
import { LongTaskInstrumentation } from "@opentelemetry/instrumentation-long-task";

const client = initializeTelemetry({
    honeycomb: {
        namespace: "sample",
        serviceName: "my-app-name",
        apiServiceUrls: [/.+/g],
        options: {
            proxy: "https://sample-proxy",
            instrumentations: [
                new LongTaskInstrumentation()
            ]
        }
    }
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

```ts !#11-13
import { initializeTelemetry } from "@workleap/telemetry/react";
import { CustomSpanProcessor } from "./CustomSpanProcessor.ts";

const client = initializeTelemetry({
    honeycomb: {
        namespace: "sample",
        serviceName: "my-app-name",
        apiServiceUrls: [/.+/g],
        options: {
            proxy: "https://sample-proxy",
            spanProcessors: [
                new CustomSpanProcessor()
            ]
        }
    }
});
```

### Customize `fetchInstrumentation`

```ts !#10-15
import { initializeTelemetry } from "@workleap/telemetry/react";

const client = initializeTelemetry({
    honeycomb: {
        namespace: "sample",
        serviceName: "my-app-name",
        apiServiceUrls: [/.+/g],
        options: {
            proxy: "https://sample-proxy",
            fetchInstrumentation: (defaultOptions) => {
                return {
                    ...defaultOptions,
                    ignoreNetworkEvents: false
                }
            }
        }
    }
});
```

To disable [@opentelemetry/instrumentation-fetch](https://github.com/open-telemetry/opentelemetry-js/tree/main/experimental/packages/opentelemetry-instrumentation-fetch), set the option to `false`.

```ts !#10
import { initializeTelemetry } from "@workleap/telemetry/react";

const client = initializeTelemetry({
    honeycomb: {
        namespace: "sample",
        serviceName: "my-app-name",
        apiServiceUrls: [/.+/g],
        options: {
            proxy: "https://sample-proxy",
            fetchInstrumentation: false
    }
});
```

### Customize `documentLoadInstrumentation`

```ts !#10-15
import { initializeTelemetry } from "@workleap/telemetry/react";

const client = initializeTelemetry({
    honeycomb: {
        namespace: "sample",
        serviceName: "my-app-name",
        apiServiceUrls: [/.+/g],
        options: {
            proxy: "https://sample-proxy",
            documentLoadInstrumentation: (defaultOptions) => {
                return {
                    ...defaultOptions,
                    ignoreNetworkEvents: false
                }
            }
        }
    }
});
```

To disable [@opentelemetry/instrumentation-document-load](https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/plugins/web/opentelemetry-instrumentation-document-load#document-load-instrumentation-options), set the option to `false`.

```ts !#10
import { initializeTelemetry } from "@workleap/telemetry/react";

const client = initializeTelemetry({
    honeycomb: {
        namespace: "sample",
        serviceName: "my-app-name",
        apiServiceUrls: [/.+/g],
        options: {
            proxy: "https://sample-proxy",
            documentLoadInstrumentation: false
        }
    }
});
```

### Customize `xmlHttpRequestInstrumentation`

```ts !#10-15
import { initializeTelemetry } from "@workleap/telemetry/react";

const client = initializeTelemetry({
    honeycomb: {
        namespace: "sample",
        serviceName: "my-app-name",
        apiServiceUrls: [/.+/g],
        options: {
            proxy: "https://sample-proxy",
            xmlHttpRequestInstrumentation: (defaultOptions) => {
                return {
                    ...defaultOptions,
                    ignoreNetworkEvents: false
                }
            }
        }
    }
});
```

Or set the option to `true` to enable [@opentelemetry/instrumentation-xml-http-request](https://github.com/open-telemetry/opentelemetry-js/tree/main/experimental/packages/opentelemetry-instrumentation-xml-http-request) with the default options.

```ts !#10
import { initializeTelemetry } from "@workleap/telemetry/react";

const client = initializeTelemetry({
    honeycomb: {
        namespace: "sample",
        serviceName: "my-app-name",
        apiServiceUrls: [/.+/g],
        options: {
            proxy: "https://sample-proxy",
            xmlHttpRequestInstrumentation: true
        }
    }
});
```

### Customize `userInteractionInstrumentation`

```ts !#10-15
import { initializeTelemetry } from "@workleap/telemetry/react";

const client = initializeTelemetry({
    honeycomb: {
        namespace: "sample",
        serviceName: "my-app-name",
        apiServiceUrls: [/.+/g],
        options: {
            proxy: "https://sample-proxy",
            userInteractionInstrumentation: (defaultOptions) => {
                return {
                    ...defaultOptions,
                    eventNames: ["submit", "click", "keypress"]
                }
            }
        }
    }
});
```

Or set the option to `true` to enable [@opentelemetryinstrumentation-user-interaction](https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/plugins/web/opentelemetry-instrumentation-user-interaction) with the default options.

```ts !#10
import { initializeTelemetry } from "@workleap/telemetry/react";

const client = initializeTelemetry({
    honeycomb: {
        namespace: "sample",
        serviceName: "my-app-name",
        apiServiceUrls: [/.+/g],
        options: {
            proxy: "https://sample-proxy",
            userInteractionInstrumentation: true
        }
    }
});
```

### Use transformer functions

The predefined options are useful to quickly customize the default configuration of the [Honeycomb Web SDK](https://docs.honeycomb.io/send-data/javascript-browser/honeycomb-distribution), but only covers a subset of the [options](https://docs.honeycomb.io/send-data/javascript-browser/honeycomb-distribution/#advanced-configuration). If you need full control over the configuration, you can provide configuration transformer functions through the `honeycomb.transformers` option of the [initializeTelemetry](./initializeTelemetry.md) function. Remember, **no locked in** :heart::v:.

To view the default configuration, have a look at the [registerHoneycombInstrumentation.ts](https://github.com/workleap/wl-telemetry/blob/main/packages/honeycomb/src/registerHoneycombInstrumentation.ts) file on GitHub.

```tsx !#3-7,16
import { initializeTelemetry, type HoneycombSdkOptionsTransformer } from "@workleap/telemetry/react";

const skipOptionsValidationTransformer: HoneycombSdkOptionsTransformer = config => {
    config.skipOptionsValidation = true;

    return config;
};

const client = initializeTelemetry({
    honeycomb: {
        namespace: "sample",
        serviceName: "my-app-name",
        apiServiceUrls: [/.+/g],
        options: {
            proxy: "https://sample-proxy",
            transformers: [skipOptionsValidationTransformer]
        }
    }
});
```

Generic transformers can use the `context` argument to gather additional information about their execution context:

```ts !#4 transformer.ts
import type { HoneycombSdkOptionsTransformer } from "@workleap/telemetry/react";

const debugTransformer: HoneycombSdkOptionsTransformer = (config, context) => {
    if (context.verbose) {
        config.debug = true;
        context.logger.debug("Debug mode has been activated.");
    }

    return config;
}
```

## Mixpanel

### Initialize with a predefined environment

```ts !#6
import { initializeTelemetry } from "@workleap/telemetry/react";

const client = initializeTelemetry({
    mixpanel: {
        productId: "wlp",
        envOrTrackingApiBaseUrl: "development"
    }
});
```

### Initialize with a base url

```ts !#6
import { initializeTelemetry } from "@workleap/telemetry/react";

const client = initializeTelemetry({
    mixpanel: {
        productId: "wlp",
        envOrTrackingApiBaseUrl: "https://my-tracking-api"
    }
});
```

### Use a custom tracking endpoint

```ts !#8
import { initializeTelemetry } from "@workleap/telemetry/react";

const client = initializeTelemetry({
    mixpanel: {
        productId: "wlp",
        envOrTrackingApiBaseUrl: "development",
        options: {
            trackingEndpoint: "custom/tracking/track"
        }
    }
});
```

## Verbose mode

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

## Use loggers

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


