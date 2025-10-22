---
order: 80
label: Setup Mixpanel
---

# Setup Mixpanel

!!!warning
Prefer using the [@workleap/telemetry](../introduction/getting-started.md) umbrella package over this standalone library.
!!!

While we recommend using the `@workleap/telemetry` umbrella package, Workleap's LogRocket instrumentation can also be used as a standalone [@worleap/mixpanel](https://www.npmjs.com/package/@workleap/mixpanel) package.

To set it up, follow these steps :point_down:

## Install the packages

First, open a terminal at the root of the application and install the following packages:

```bash
pnpm add @workleap/mixpanel
```

## Initialize Mixpanel

Then, initialize Mixpanel using the [initializeMixpanel](#initialize-mixpanel) function:

```tsx !#6-8,14,16
import { initializeMixpanel, MixpanelProvider, createTelemetryContext } from "@workleap/mixpanel/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

const client = initializeMixpanel("wlp", "development", {
    telemetryContext: createTelemetryContext()
});

const root = createRoot(document.getElementById("root")!);

root.render(
    <StrictMode>
        <MixpanelProvider client={client}>
            <App />
        </MixpanelProvider>
    </StrictMode>
);
```

## Create a track function

Then create a `track` function using the [useTrackingFunction](#usetrackingfunction) hook if the host application is in React:

```ts !#3
import { useTrackingFunction } from "@workleap/mixpanel/react";

const track = useTrackingFunction();

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

## Track an event

Finally, using the retrieved `track` function to send a telemetry event:

```ts !#5
import { useTrackingFunction } from "@workleap/mixpanel/react";

const track = useTrackingFunction();

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

## Track a link

Link clicks requires to keep the page alive while the tracking request is being processed. To do so, set the `keepAlive` option of the `track` function:

```ts !#6
import { useTrackingFunction } from "@workleap/mixpanel/react";

const track = useTrackingFunction();

track("LinkClicked", { "Trigger": "ChangePlan", "Location": "Header" }, {
    keepAlive: true
});
```

## Set custom user properties

Most applications need to set custom properties about the current user environment on all events. To help with that, [MixpanelClient](#mixpanelclient) expose the [setGlobalEventProperties](#methods) method:

```ts !#5-7
import { useMixpanelClient } from "@workleap/mixpanel/react";

const client = useMixpanelClient();

client.setGlobalEventProperties({
    "User Id": "123" 
})
```

Now, every event recorded after the execution of `setGlobalEventProperties` will include the custom property `User Id`.

## Integrate with LogRocket

Starting with version `3.0`, attaching LogRocket session replays to Mixpanel events requires providing a `LogRocketInstrumentationClient` to the registration function:

```tsx !#7,11
import { initializeMixpanel, MixpanelProvider, createTelemetryContext } from "@workleap/mixpanel/react";
import { registerLogRocketInstrumentation } from "@workleap/logrocket/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

const logRocketInstrumentationClient = registerLogRocketInstrumentation("my-app-id");

const mixpanelClient = initializeMixpanel("wlp", "development", {
    telemetryContext: createTelemetryContext(),
    logRocketInstrumentationClient
});

const root = createRoot(document.getElementById("root")!);

root.render(
    <StrictMode>
        <MixpanelProvider client={mixpanelClient}>
            <App />
        </MixpanelProvider>
    </StrictMode>
);
```

## Try it :rocket:

Start the application in a development environment using the dev script. Render a page, then navigate to your [Mixpanel](https://mixpanel.com/) instance. Go to "Events" page. If you are tracking events, you should see a new event appear.

You can try filtering the event list using different properties, such as:

- `User Id`

### Troubleshoot issues

If you are experiencing issues with this guide:

- Set the [verbose](#verbose-mode) predefined option to `true`.
- Open the [DevTools](https://developer.chrome.com/docs/devtools/) console and look for logs starting with `[mixpanel]`.
- Refer to the sample on [GitHub](https://github.com/workleap/wl-telemetry/tree/main/samples/all-platforms).

## Reference

### initializeMixpanel

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

#### Parameters

- `productId`: The product id.
- `envOrTrackingApiBaseUrl`: The environment to get the navigation url from or a base URL.
- `options`: An optional object literal of options:
    - `trackingEndpoint`: An optional tracking endpoint.
    - `telemetryContext`: A `TelemetryContext` instance containing the telemetry correlation ids to attach to Honeycomb traces. Starting with version `7.0`, if no telemetry context is provided, the correlation ids will not be attached to Honeycomb traces.
    - `logRocketInstrumentationClient`: A `LogRocketInstrumentationClient` instance to integrate Honeycomb traces with LogRocket session replays. Starting with version `7.0`, if no LogRocket instrumentation client is provided, the Honeycomb traces will not integrate with LogRocket session replays.
    - `verbose`: If no `loggers` are configured, verbose mode will automatically send logs to the console. In some cases, enabling verbose mode also produces additional debug information.
    - `loggers`: An optional array of `RootLogger` instances.

#### Returns

A [MixpanelClient](#mixpanelclient) instance.

#### Environments

Supported environments are:

- `production`
- `staging`
- `development`
- `local`
- `msw`

#### Initialize with a predefined environment

Mixpanel can be initialized for any of the following predefined environments:

```ts !#3
import { initializeMixpanel } from "@workleap/mixpanel/react";

const client = initializeMixpanel("wlp", "development");
```

#### Initialize with a base url

```ts !#3
import { initializeMixpanel } from "@workleap/mixpanel/react";

const client = initializeMixpanel("wlp", "https://my-tracking-api");
```

#### Use a custom tracking endpoint

```ts !#4
import { initializeMixpanel } from "@workleap/mixpanel/react";

const client = initializeMixpanel("wlp", "development", {
    trackingEndpoint: "custom/tracking/track"
});
```

#### Initialize with a telemetry context

```ts !#6
import { initializeMixpanel, createTelemetryContext } from "@workleap/mixpanel/react";

const telemetryContext = createTelemetryContext();

const client = initializeMixpanel("wlp", "development", {
    telemetryContext
});
```

#### Integrate with LogRocket

```ts !#4,7
import { initializeMixpanel } from "@workleap/mixpanel/react";
import { registerLogRocketInstrumentation } from "@workleap/logrocket/react";

const logRocketInstrumentationClient = registerLogRocketInstrumentation("my-app-id");

const client = initializeMixpanel("wlp", "development", {
    logRocketInstrumentationClient
});
```

#### Verbose mode

```ts !#4
import { initializeMixpanel } from "@workleap/mixpanel/react";

const client = initializeMixpanel("wlp", "development", {
    verbose: true
});
```

#### Use loggers

```ts !#6
import { initializeMixpanel } from "@workleap/mixpanel/react";
import { LogRocketLogger } from "@workleap/logrocket/react";
import { BrowserConsoleLogger, LogLevel } from "@workleap/logging";

const client = initializeMixpanel("wlp", "development", {
    loggers: [new BrowserConsoleLogger(), new LogRocketLogger({ logLevel: LogLevel.information })]
});
```

### MixpanelClient

A lightweight client providing access to Mixpanel utilities.

```ts
const client = new MixpanelClient(productId, endpoint, superProperties, logger);
```

#### Parameters

- `productId`: The product id.
- `endpoint`: The Mixpanel endpoint URL.
- `globalProperties`: Properties to attach to all events.
- `logger`: A `Logger` instance.

#### Methods

- `createTrackingFunction(options?: { targetProductId? })`: Returns a [TrackingFunction](#trackingfunction) function sending `POST` requests to a dedicated tracking endpoint fully compliant with the Workleap platform tracking API.
- `setGlobalProperty(key, value)`: Set a single global property that will be attached to all events.
- `setGlobalProperties(values)`: Set one or multiple global properties that will be attached to all events.

#### `TrackingFunction`

A `TrackingFunction` have the following signature: `(eventName, properties: {}, options?: { keepAlive }) => Promise<void>`.

- `eventName`: The event name.
- `properties`: The event properties.
- `options`: An optional object literal of options:
    - `keepAlive`: Whether or not to keep the connection alive for the tracking request. It is mostly used for tracking links where the user might navigate away before the request is completed.

!!!tip
The body size for keepalive requests is [limited to 64 kibibytes](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#keepalive).
!!!

#### Track events

```ts !#5,7
import { useMixpanelClient } from "@workleap/mixpanel/react";

const client = useMixpanelClient();

const track = client.createTrackingFunction();

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

#### Specify a target product

To track an action targeting another product, use the `targetProductId` option:

```ts !#6
import { useMixpanelClient } from "@workleap/mixpanel/react";

const client = useMixpanelClient();

const track = client.createTrackingFunction({
    targetProductId: "wov"
});

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

#### Track a link

To track a link click, use the `keepAlive` option to keep the page alive while the tracking request is being processed:

```ts !#8
import { useMixpanelClient } from "@workleap/mixpanel/react";

const client = useMixpanelClient();

const track = client.createTrackingFunction();

track("LinkClicked", { "Trigger": "ChangePlan", "Location": "Header" }, {
    keepAlive: true
});
```

#### Register global properties

```ts !#5-7
import { useMixpanelClient } from "@workleap/mixpanel/react";

const client = useMixpanelClient();

client.setGlobalEventProperties({
    "User Id": "123"
});
```

### NoopMixpanelClient

A fake implementation of [NoopMixpanelClient](#mixpanelclient) for use in non-standard contexts such as unit tests and Storybook.

```ts
import { NoopMixpanelClient } from "@workleap/mixpanel/react";

const client = new NoopMixpanelClient();
```

### MixpanelProvider

React provider to share a `MixpanelClient` instance with the application code.

```tsx
<MixpanelProvider client={client}>
    <App />
</MixpanelProvider>
```

#### Properties

- `client`: A [MixpanelClient](#mixpanelclient) instance.

#### Provide a client instance

```tsx !#10-12
import { initializeMixpanel, MixpanelProvider } from "@workleap/mixpanel/react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

const client = initializeMixpanel("wlp", "development");

const root = createRoot(document.getElementById("root"));

root.render(
    <MixpanelProvider client={client}>
        <App />
    </MixpanelProvider>
);
```

#### Retrieve a client instance

```ts !#3
import { useMixpanelClient } from "@workleap/mixpanel/react";

const client = initializeMixpanel("wlp", "development");

client.setGlobalEventProperties({
    "User Id": "123"
});
```

### useMixpanelClient

Retrieve a `MixpanelClient` instance.

```ts
const client = useMixpanelClient(options?: { dontThrowOnUndefined? })
```

#### Parameters

- `options`: An optional object literal of options:
    - `dontThrowOnUndefined`: Whether or not an exception should be throw if a client instance hasn't been provided.

#### Returns

A [MixpanelClient](#mixpanelclient) instance.

#### Usage

```ts !#3
import { useMixpanelClient } from "@workleap/mixpanel/react";

const client = useMixpanelClient();

client.setGlobalEventProperties({
    "User Id": "123"
});
```

### useTrackingFunction

Returns a function sending `POST` requests to a dedicated tracking endpoint fully compliant with the Workleap platform tracking API.

```ts
const track = useTrackingFunction(options?: { targetProductId })
```

#### Parameters

- `options`: An optional object literal of options:
    - `targetProductId`: The product id of the target product. Useful to track an event for another product.

#### Returns

A `TrackingFunction` with the following signature: `(eventName, properties: {}, options?: { keepAlive }) => Promise<void>`.

- `eventName`: The event name.
- `properties`: The event properties.
- `options`: An optional object literal of options:
    - `keepAlive`: Whether or not to keep the connection alive for the tracking request. It is mostly used for tracking links where the user might navigate away before the request is completed.

!!!tip
The body size for keepalive requests is [limited to 64 kibibytes](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#keepalive).
!!!

#### Track events

```ts !#3,5
import { useTrackingFunction } from "@workleap/mixpanel/react";

const track = useTrackingFunction();

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

#### Specify a target product

To track an action targeting another product, use the `targetProductId` option:

```ts !#4
import { useTrackingFunction } from "@workleap/mixpanel/react";

const track = useTrackingFunction({
    targetProductId: "wov"
});

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

#### Track a link

To track a link click, use the `keepAlive` option to keep the page alive while the tracking request is being processed:

```ts !#6
import { useTrackingFunction } from "@workleap/mixpanel/react";

const track = useTrackingFunction();

track("LinkClicked", { "Trigger": "ChangePlan", "Location": "Header" }, {
    keepAlive: true
});
```

### createTelemetryContext

Creates a `TelemetryContext` instance containing the telemetry correlation ids.

```ts
const telemetryContext = createTelemetryContext(options?: { identityCookieExpiration?, identityCookieDomain?, verbose?, loggers? })
```

#### Parameters

- `options`: An optional object literal of options:
    - `identityCookieExpiration`: The expiration date of the `wl-identity` cookie if the cookie hasn't been already written. The default value is 365 days.
    - `identityCookieDomain`: The domain of the `wl-identity` cookie if the cookie hasn't been already written. The default value is `*.workleap`
    - `verbose`: If no loggers are configured, verbose mode will automatically send logs to the console. In some cases, enabling verbose mode also produces additional debug information.
    - `loggers`: An optional array of `Logger` instances.

#### Returns

A `TelemetryContext` instance.

#### Create a telemetry context

```ts !#3
import { createTelemetryContext } from "@workleap/mixpanel/react";

const context = createTelemetryContext();
```

#### Set a custom cookie expiration

```ts !#4
import { createTelemetryContext } from "@workleap/mixpanel/react";

const context = createTelemetryContext({
    identityCookieExpiration: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
});
```

#### Set a custom cookie domain

```ts !#4
import { createTelemetryContext } from "@workleap/mixpanel/react";

const context = createTelemetryContext({
    identityCookieDomain: ".contso.com";
});
```

#### Verbose mode

```ts !#4
import { createTelemetryContext } from "@workleap/mixpanel/react";

const context = createTelemetryContext({
    verbose: true
});
```

#### Loggers

```ts !#5
import { createTelemetryContext, LogRocketLogger } from "@workleap/mixpanel/react";
import { BrowserConsoleLogger, LogLevel } from "@workleap/logging";

const context = createTelemetryContext({
    loggers: [new BrowserConsoleLogger(), new LogRocketLogger({ logLevel: LogLevel.information })]
});
```
