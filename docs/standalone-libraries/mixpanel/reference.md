---
order: 90
label: Reference
title: Reference - Mixpanel
toc:
    depth: 2-3
---

# Reference

## `initializeMixpanel`

Initialize [Mixpanel](https://mixpanel.com) with Workleap's default settings.

```ts
const client = initializeMixpanel(productId, envOrTrackingApiBaseUrl, options?: { 
    trackingEndpoint?,
    telemetryContext?,
    logRocketInstrumentationClient?,
    verbose?,
    loggers?
})
```

### Parameters

- `envOrTrackingApiBaseUrl`: The environment to get the navigation url from or a base URL.
- `options`: An optional object literal of options:
    - `productId`: An optional product id.
    - `trackingEndpoint`: An optional tracking endpoint.
    - `telemetryContext`: A `TelemetryContext` instance containing the telemetry correlation ids to attach to Honeycomb traces.
    - `logRocketInstrumentationClient`: A `LogRocketInstrumentationClient` instance to integrate Honeycomb traces with LogRocket session replays.
    - `verbose`: If no `loggers` are configured, verbose mode will automatically send logs to the console. In some cases, enabling verbose mode also produces additional debug information.
    - `loggers`: An optional array of `RootLogger` instances.

### Returns

A [MixpanelClient](#mixpanelclient) instance.

### Environments

Supported environments are:

- `production`
- `staging`
- `development`
- `local`
- `msw`

### Initialize with a predefined environment

Mixpanel can be initialized for any of the following predefined environments:

```ts !#3
import { initializeMixpanel } from "@workleap/mixpanel/react";

const client = initializeMixpanel("development");
```

### Initialize with a base url

```ts !#3
import { initializeMixpanel } from "@workleap/mixpanel/react";

const client = initializeMixpanel("https://my-tracking-api");
```

### Initialize with a product id

```ts !#4
import { initializeMixpanel } from "@workleap/mixpanel/react";

const client = initializeMixpanel("development", {
    productId: "wlp"
});
```

### Use a custom tracking endpoint

```ts !#4
import { initializeMixpanel } from "@workleap/mixpanel/react";

const client = initializeMixpanel("development", {
    trackingEndpoint: "custom/tracking/track"
});
```

### Initialize with a telemetry context

```ts !#6
import { initializeMixpanel, createTelemetryContext } from "@workleap/mixpanel/react";

const telemetryContext = createTelemetryContext();

const client = initializeMixpanel("development", {
    telemetryContext
});
```

### Integrate with LogRocket

```ts !#4,7
import { initializeMixpanel } from "@workleap/mixpanel/react";
import { registerLogRocketInstrumentation } from "@workleap/logrocket/react";

const logRocketInstrumentationClient = registerLogRocketInstrumentation("my-app-id");

const client = initializeMixpanel("development", {
    logRocketInstrumentationClient
});
```

### Verbose mode

```ts !#4
import { initializeMixpanel } from "@workleap/mixpanel/react";

const client = initializeMixpanel("development", {
    verbose: true
});
```

### Use loggers

```ts !#6
import { initializeMixpanel } from "@workleap/mixpanel/react";
import { LogRocketLogger } from "@workleap/logrocket/react";
import { BrowserConsoleLogger, LogLevel } from "@workleap/logging";

const client = initializeMixpanel("development", {
    loggers: [new BrowserConsoleLogger(), new LogRocketLogger({ logLevel: LogLevel.information })]
});
```

## `MixpanelClient`

A lightweight client providing access to Mixpanel utilities.

```ts
const client = new MixpanelClient(endpoint, superProperties, logger, options?);
```

### Parameters

- `productId`: The product id.
- `endpoint`: The Mixpanel endpoint URL.
- `globalProperties`: Properties to attach to all events.
- `logger`: A `Logger` instance.
- `options`: An optional object literal of options:
    - `productId`: An optional product id.

### Methods

- `createTrackingFunction(options?: { productId?, targetProductId? })`: Returns a [TrackingFunction](#trackingfunction) function sending `POST` requests to a dedicated tracking endpoint fully compliant with the Workleap platform tracking API.
- `setGlobalProperty(key, value)`: Set a single global property that will be attached to all events.
- `setGlobalProperties(values)`: Set one or multiple global properties that will be attached to all events.

### `TrackingFunction`

A `TrackingFunction` have the following signature: `(eventName, properties: {}, options?: { keepAlive }) => Promise<void>`.

- `eventName`: The event name.
- `properties`: The event properties.
- `options`: An optional object literal of options:
    - `keepAlive`: Whether or not to keep the connection alive for the tracking request. It is mostly used for tracking links where the user might navigate away before the request is completed.

!!!tip
The body size for keepalive requests is [limited to 64 kibibytes](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#keepalive).
!!!

### Track events

```ts !#5,7
import { useMixpanelClient } from "@workleap/mixpanel/react";

const client = useMixpanelClient();

const track = client.createTrackingFunction();

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

### Specify a product id

To track an action targeting a specific product, use the `productId` option:

```ts !#6
import { useMixpanelClient } from "@workleap/mixpanel/react";

const client = useMixpanelClient();

const track = client.createTrackingFunction({
    productId: "wlp"
});

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

### Specify a target product

To track an action targeting another product, use the `targetProductId` option:

```ts !#6
import { useMixpanelClient } from "@workleap/mixpanel/react";

const client = useMixpanelClient();

const track = client.createTrackingFunction({
    targetProductId: "wov"
});

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

### Track a link

To track a link click, use the `keepAlive` option to keep the page alive while the tracking request is being processed:

```ts !#8
import { useMixpanelClient } from "@workleap/mixpanel/react";

const client = useMixpanelClient();

const track = client.createTrackingFunction();

track("LinkClicked", { "Trigger": "ChangePlan", "Location": "Header" }, {
    keepAlive: true
});
```

### Register global properties

```ts !#5-7
import { useMixpanelClient } from "@workleap/mixpanel/react";

const client = useMixpanelClient();

client.setGlobalEventProperties({
    "User Id": "123"
});
```

## `NoopMixpanelClient`

A fake implementation of [NoopMixpanelClient](#mixpanelclient) for use in non-standard contexts such as unit tests and Storybook.

```ts
import { NoopMixpanelClient } from "@workleap/mixpanel/react";

const client = new NoopMixpanelClient();
```

## `MixpanelProvider`

React provider to share a `MixpanelClient` instance with the application code.

```tsx
<MixpanelProvider client={client}>
    <App />
</MixpanelProvider>
```

### Properties

- `client`: A [MixpanelClient](#mixpanelclient) instance.

### Provide a client instance

```tsx !#10-12
import { initializeMixpanel, MixpanelProvider } from "@workleap/mixpanel/react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

const client = initializeMixpanel("development");

const root = createRoot(document.getElementById("root"));

root.render(
    <MixpanelProvider client={client}>
        <App />
    </MixpanelProvider>
);
```

### Retrieve a client instance

```ts !#3
import { useMixpanelClient } from "@workleap/mixpanel/react";

const client = initializeMixpanel("development");

client.setGlobalEventProperties({
    "User Id": "123"
});
```

## `useMixpanelClient`

Retrieve a `MixpanelClient` instance.

```ts
const client = useMixpanelClient(options?: { throwOnUndefined? })
```

### Parameters

- `options`: An optional object literal of options:
    - `throwOnUndefined`: Whether or not an exception should be thrown if a client instance hasn't been provided.

### Returns

A [MixpanelClient](#mixpanelclient) instance.

### Usage

```ts !#3
import { useMixpanelClient } from "@workleap/mixpanel/react";

const client = useMixpanelClient();

client.setGlobalEventProperties({
    "User Id": "123"
});
```

## `useTrackingFunction`

Returns a function sending `POST` requests to a dedicated tracking endpoint fully compliant with the Workleap platform tracking API.

```ts
const track = useTrackingFunction(options?: { productId?, targetProductId? })
```

### Parameters

- `options`: An optional object literal of options:
    - `productId`: An optional product id.
    - `targetProductId`: An optional product id of the target product. Useful to track an event for another product.

### Returns

A `TrackingFunction` with the following signature: `(eventName, properties: {}, options?: { keepAlive }) => Promise<void>`.

- `eventName`: The event name.
- `properties`: The event properties.
- `options`: An optional object literal of options:
    - `keepAlive`: Whether or not to keep the connection alive for the tracking request. It is mostly used for tracking links where the user might navigate away before the request is completed.

!!!tip
The body size for keepalive requests is [limited to 64 kibibytes](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#keepalive).
!!!

### Track events

```ts !#3,5
import { useTrackingFunction } from "@workleap/mixpanel/react";

const track = useTrackingFunction();

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

### Specify a product id

To track an action targeting a specific product, use the `productId` option:

```ts !#4
import { useTrackingFunction } from "@workleap/mixpanel/react";

const track = useTrackingFunction({
    productId: "wlp"
});

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

### Specify a target product

To track an action targeting another product, use the `targetProductId` option:

```ts !#4
import { useTrackingFunction } from "@workleap/mixpanel/react";

const track = useTrackingFunction({
    targetProductId: "wov"
});

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

### Track a link

To track a link click, use the `keepAlive` option to keep the page alive while the tracking request is being processed:

```ts !#6
import { useTrackingFunction } from "@workleap/mixpanel/react";

const track = useTrackingFunction();

track("LinkClicked", { "Trigger": "ChangePlan", "Location": "Header" }, {
    keepAlive: true
});
```

## `MixpanelPropertiesProvider`

A React provider used to define Mixpanel properties for nested components. These properties are automatically included in events tracked by nested components, provided the events are tracked using functions created with the [useTrackingFunction](#usetrackingfunction) hook.

!!!tip
Ensure that the value passed to `MixpanelPropertiesProvider` is a **static object**, either defined outside components scope or memoized. Otherwise, the `useTrackingFunction` hook will create a new tracking function on every render.
!!!

### Properties

- `value`: A **static object** literal of Mixpanel properties to track.

### Define a provider

```tsx !#9,11
import { MixpanelPropertiesProvider } from "@workleap/mixpanel/react";

const MixpanelProperties = {
    section: "User Form"
};

function App() {
    return (
        <MixpanelPropertiesProvider value={MixpanelProperties}>
            <NestedComponent />
        </MixpanelPropertiesProvider>
    )
}
```

### Track an event with additional properties

```tsx !#9,13,19-21
import { MixpanelPropertiesProvider, useTrackingFunction } from "@workleap/mixpanel/react";
import { useEffect } from "react";

const MixpanelProperties = {
    section: "User Form"
};

function NestedComponent() {
    const track = useTrackingFunction();

    // Please don't track in a "useEffect", it's strictly for demo purpose.
    useEffect(() => {
        track("LinkClicked", { "Trigger": "ChangePlan", "Location": "Header" });
    }, [track]);
}

function App() {
    return (
        <MixpanelPropertiesProvider value={MixpanelProperties}>
            <NestedComponent />
        </MixpanelPropertiesProvider>
    )
}
```

### Retrieve the provider properties

```ts !#3
import { useMixpanelProviderProperties } from "@workleap/mixpanel/react";

const props = useMixpanelProviderProperties();
```

## `createTelemetryContext`

Creates a `TelemetryContext` instance containing the telemetry correlation ids.

```ts
const telemetryContext = createTelemetryContext(productFamily, options?: { identityCookieExpiration?, verbose?, loggers? })
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
import { createTelemetryContext } from "@workleap/mixpanel/react";

const context = createTelemetryContext("sg");
```

### Set a custom cookie expiration

```ts !#4
import { createTelemetryContext } from "@workleap/mixpanel/react";

const context = createTelemetryContext("wlp", {
    identityCookieExpiration: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
});
```

### Verbose mode

```ts !#4
import { createTelemetryContext } from "@workleap/mixpanel/react";

const context = createTelemetryContext("sg", {
    verbose: true
});
```

### Loggers

```ts !#5
import { createTelemetryContext, LogRocketLogger } from "@workleap/mixpanel/react";
import { BrowserConsoleLogger, LogLevel } from "@workleap/logging";

const context = createTelemetryContext("wlp", {
    loggers: [new BrowserConsoleLogger(), new LogRocketLogger({ logLevel: LogLevel.information })]
});
```
