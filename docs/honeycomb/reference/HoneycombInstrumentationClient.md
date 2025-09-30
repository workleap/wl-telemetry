---
order: 90
label: HoneycombInstrumentationClient
meta:
    title: HoneycombInstrumentationClient - Honeycomb
toc:
    depth: 2-3
---

# HoneycombInstrumentationClient

!!!warning
Don't instanciate your own instance of `HoneycombInstrumentationClient`, use the `registerHoneycombInstrumentation` function instead.
!!!

A lightweight client providing access to Honeycomb instrumentation utilities.

## Reference

```ts
const client = new HoneycombInstrumentationClient(globalAttributeSpanProcessor?, fetchRequestPipeline?);
```

### Parameters

- `globalAttributeSpanProcessor`: A [SpanProcessor](https://docs.honeycomb.io/send-data/javascript-browser/honeycomb-distribution/#custom-span-processing) to attach global attributes to all traces.
- `fetchRequestPipeline`: A pipeline instance to dynamically add [@opentelemetry/instrumentation-fetch](https://github.com/open-telemetry/opentelemetry-js/tree/main/experimental/packages/opentelemetry-instrumentation-fetch) request hooks.

### Methods

- `setGlobalSpanAttribute(key, value)`: Set a single global attribute to be included in all traces.
- `setGlobalSpanAttributes(attributes)`: Set a single or multiple global attributes to be included in all traces.
- `registerFetchRequestHook(hook)`: Dynamically registers fetch request hook at the end of the pipeline.
- `registerFetchRequestHookAtStart(hook)`: Dynamically registers a fetch request hook at the start of the pipeline.

## Usage

### Register global attributes

```ts !#7-9
import { registerHoneycombInstrumentation } from "@workleap/honeycomb/react";

const client = registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    proxy: "https://sample-proxy"
});

client.setGlobalSpanAttributes({
    "app.user_id": "123"
});
```

### Register a dynamic request hook

```ts !#7-17
import { registerHoneycombInstrumentation } from "@workleap/honeycomb/react";

const client = registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    proxy: "https://sample-proxy"
});

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

```ts !#7-17
import { registerHoneycombInstrumentation } from "@workleap/honeycomb/react";

const client = registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    proxy: "https://sample-proxy"
});

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

```ts !#17
import { registerHoneycombInstrumentation } from "@workleap/honeycomb/react";

const client = registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    proxy: "https://sample-proxy"
});

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
