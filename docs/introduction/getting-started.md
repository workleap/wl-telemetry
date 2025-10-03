---
order: 100
label: Getting started
meta:
    title: Getting started - Introduction
---

# Getting started

Welcome to `workleap/telemetry`, a collection of telemetry libraries for building web applications at Workleap. On this getting started page, you'll find an overview of the project and a list of [supported platforms](#supported-platforms).

## An integrated experience

Without a unified and cohesive telemetry setup, debugging issues or analyzing product behavior often requires **jumping between** tools with **disconnected data**. Session replays in [LogRocket](https://logrocket.com/), traces in [Honeycomb](https://www.honeycomb.io/), and user events in [Mixpanel](https://mixpanel.com/) each offer valuable insights, but without shared identifiers or cross-platform context, it becomes difficult to correlate events, reconstruct user journeys, or measure the full impact of a technical issue in production.

This integrated experience brings together LogRocket, Honeycomb, and Mixpanel. By linking session data, performance traces, and user interactions through consistent identifiers. It becomes possible to **trace** a **single** application **event across systems**, from backend performance to frontend behavior to product impact. This integration streamlines will hopefully enables faster, and more informed decision-making.

## Supported platforms

{.supported-platforms-table}
| Name | Description | NPM | Documentation |
| --- | --- | --- |
| ![](../static/logos/logrocket.svg){ class="h-5 w-5 mr-2 -mt-1" }[LogRocket](https://logrocket.com/) | Records frontend sessions and logs to help debug and resolve issues in production and surface critical issues. | [![npm version](https://img.shields.io/npm/v/@workleap/logrocket)](https://www.npmjs.com/package/@workleap/logrocket) | [Getting started](../logrocket/getting-started.md) |
| ![](../static/logos/honeycomb.svg){ class="h-5 w-5 mr-2 -mt-1" }[Honeycomb](https://www.honeycomb.io/) | Captures and analyzes distributed traces and metrics to understand and monitor complex systems, application behaviors, and performance. | [![npm version](https://img.shields.io/npm/v/@workleap/honeycomb)](https://www.npmjs.com/package/@workleap/honeycomb) | [Getting started](../honeycomb/getting-started.md) |
| ![](../static/logos/mixpanel.svg){ class="h-5 w-5 mr-2 -mt-1" }[Mixpanel](https://mixpanel.com/) | Tracks user interactions to analyze behavior and measure product impact. | [![npm version](https://img.shields.io/npm/v/@workleap/mixpanel)](https://www.npmjs.com/package/@workleap/mixpanel) | [Getting started](../mixpanel/getting-started.md) |
| ![](../static/logos/common-room.svg){ class="h-5 w-5 mr-2 -mt-1" }[Common Room](https://www.commonroom.io/) | Connects user activity across platforms to provide insight into community engagement and behavior.<br/><br/>_(Common Room is not part of the integrated experience, as it is a standalone tool used by marketers for a completely different purpose.)_ | [![npm version](https://img.shields.io/npm/v/@workleap/common-room)](https://www.npmjs.com/package/@workleap/common-room) | [Getting started](../common-room/getting-started.md) |

## Umbrella package

!!!tip
Although Workleap provides a standalone package for each platform, we recommend using the umbrella package [@workleap/telemetry](https://www.npmjs.com/package/@workleap/telemetry) for LogRocket, Honeycomb, and Mixpanel. This simplifies the integration, compared to relying on the individual standalone packages for these.
!!!

## Setup a project

First, open a terminal at the root of the application and install the telemetry umbrella package:

```bash
pnpm add @workleap/telemetry @workleap/common-room @opentelemetry/api logrocket
```

Then, update the application bootstrapping code to initialize the libraries:

```tsx !#7-23,25,31-32,34-35 index.tsx
import { initializeTelemetry, TelemetryProvider } from "@workleap/telemetry/react";
import { registerCommonRoomInstrumentation, CommonRoomInstrumentationProvider } from "@workleap/common-room/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

const telemetryClient = initializeTelemetry({
    logRocket: {
        appId: "my-app-id"
    },
    honeycomb: {
        namespace: "sample",
        serviceName: "my-app",
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

const commonRoomClient = registerCommonRoomInstrumentation("my-site-id");

const root = createRoot(document.getElementById("root")!);

root.render(
    <StrictMode>
        <TelemetryProvider client={telemetryClient}>
            <CommonRoomInstrumentationProvider client={commonRoomClient}>
                <App />
            </CommonRoomInstrumentationProvider>
        </TelemetryProvider>
    </StrictMode>
);
```

!!!warning
For Honeycomb, avoid using `/.+/g`, in production, as it could expose customer data to third parties. Instead, ensure you specify values that accurately matches your application's backend URLs.
!!!

## Identify a user for LogRocket

To identify the current user environment for LogRocket, [LogRocketInstrumentationClient](../logrocket/reference/LogRocketInstrumentationClient.md) expose the [createWorkleapPlatformDefaultUserTraits](../logrocket/reference/LogRocketInstrumentationClient.md#methods) method. When used with [LogRocket.identify](https://docs.logrocket.com/reference/identify), it provides all the tools to identify a  user with the key information that we track at Workleap.

```ts !#6-13
import { useLogRocketInstrumentationClient } from "@workleap/telemetry/react";
import LogRocket from "logrocket";

const client = useLogRocketInstrumentationClient();

const traits = client.createWorkleapPlatformDefaultUserTraits({
    userId: "6a5e6b06-0cac-44ee-8d2b-00b9419e7da9",
    organizationId: "e6bb30f8-0a00-4928-8943-1630895a3f14",
    organizationName: "Acme",
    isMigratedToWorkleap: true,
    isOrganizationCreator: false,
    isAdmin: false
});

Logrocket.identify(traits.userId, traits);
```

!!!tip
For more details, see the LogRocket client [reference](../logrocket/reference/LogRocketInstrumentationClient.md) documentation.
!!!

## Get LogRocket session replay URL

Every LogRocket session replay is associated with a unique URL. To register a callback receiving the session replay once it's available, use the [LogRocket.getSessionURL](https://docs.logrocket.com/reference/get-session-url) function: 

```ts !#3-5
import LogRocket from "logrocket";

LogRocket.getSessionUrl(url => {
    console.log(url);
});
```

## Set Honeycomb custom user attributes

To set custom attributes about the current user environment on all Honeycomb traces, [HoneycombInstrumentationClient](../honeycomb/reference/HoneycombInstrumentationClient.md) expose the [setGlobalSpanAttributes](../honeycomb/reference/HoneycombInstrumentationClient.md#methods) method:

```ts !#5-7
import { useHoneycombInstrumentationClient } from "@workleap/telemetry/react";

const client = useHoneycombInstrumentationClient();

client.setGlobalSpanAttributes({
    "app.user_id": "123"
});
```

!!!tip
For more details, see the Honeycomb client [reference](../honeycomb/reference/HoneycombInstrumentationClient.md) documentation.
!!!

## Create a Mixpanel track function

To create a tracking function for Mixpanel, use the [useMixpanelTrackingFunction](./reference/useMixpanelTrackingFunction.md) hook:

```ts !#3
import { useMixpanelTrackingFunction } from "@workleap/telemetry/react";

const track = useMixpanelTrackingFunction();

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

## Track a Mixpanel event

Use the retrieved `track` function to send a telemetry event:

```ts !#5
import { useTrackingFunction } from "@workleap/telemetry/react";

const track = useTrackingFunction();

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

!!!tip
For more details, see the Mixpanel client [reference](../mixpanel/reference/MixpanelClient.md) documentation.
!!!

## Track a link with Mixpanel

Tracking link clicks with Mixpanel requires to keep the page alive while the tracking request is being processed. To do so, set the `keepAlive` option of the `track` function:

```ts !#6
import { useTrackingFunction } from "@workleap/telemetry/react";

const track = useTrackingFunction();

track("LinkClicked", { "Trigger": "ChangePlan", "Location": "Header" }, {
    keepAlive: true
});
```

!!!tip
For more details, see the Mixpanel client [reference](../mixpanel/reference/MixpanelClient.md) documentation.
!!!

## Set Mixpanel custom user properties 

To set custom properties about the current user environment on all events, [MixpanelClient](../mixpanel/reference/MixpanelClient.md) expose the [setGlobalEventProperties](../mixpanel/reference/MixpanelClient.md#methods) method:

```ts !#5-7
import { useMixpanelClient } from "@workleap/telemetry/react";

const client = useMixpanelClient();

client.setGlobalEventProperties({
    "User Id": "123" 
})
```

!!!tip
For more details, see the Mixpanel client [reference](../mixpanel/reference/MixpanelClient.md) documentation.
!!!

## Set up loggers

Providing loggers to the initialization/registration functions is optional, but recommended to simplify troubleshooting.

First install the missing packages (`@workleap/logrocket` is optionnal):

```bash
pnpm add @workleap/logging @workleap/logrocket
```

Then update the application bootstrapping code to set up the loggers:

```tsx !#13,31-32,36-37 index.tsx
import { initializeTelemetry, TelemetryProvider } from "@workleap/telemetry/react";
import { LogRocketLogger } from "@workleap/logrocket/react";
import { BrowserConsoleLogger, LogLevel, type RootLogger } from "@workleap/logging";
import { registerCommonRoomInstrumentation, CommonRoomInstrumentationProvider } from "@workleap/common-room/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

// Do not do this, it's only for demo purpose.
const isDev = process.env === "development";

// Only add LogRocket logger if your product is set up with LogRocket.
const loggers: RootLogger[] = [isDev ? new BrowserConsoleLogger() : new LogRocketLogger({ logLevel: LogLevel.information })];

const telemetryClient = initializeTelemetry({
    logRocket: {
        appId: "my-app-id"
    },
    honeycomb: {
        namespace: "sample",
        serviceName: "my-app",
        apiServiceUrls: [/.+/g],
        options: {
            proxy: "https://sample-proxy"
        }
    },
    mixpanel: {
        productId: "wlp",
        envOrTrackingApiBaseUrl: "development"
    },
    verbose: isDev,
    loggers
});

const commonRoomClient = registerCommonRoomInstrumentation("my-site-id", {
    verbose: isDev,
    loggers
});

const root = createRoot(document.getElementById("root")!);

root.render(
    <StrictMode>
        <TelemetryProvider client={telemetryClient}>
            <CommonRoomInstrumentationProvider client={commonRoomClient}>
                <App />
            </CommonRoomInstrumentationProvider>
        </TelemetryProvider>
    </StrictMode>
);
```

To troubleshoot production issues, remove the `LogLevel` from the `LogRocketLogger` constructor options and set the `verbose` option to `true`:

```tsx !#13,31,36 index.tsx
import { initializeTelemetry, TelemetryProvider } from "@workleap/telemetry/react";
import { LogRocketLogger } from "@workleap/logrocket/react";
import { BrowserConsoleLogger, LogLevel, type RootLogger } from "@workleap/logging";
import { registerCommonRoomInstrumentation, CommonRoomInstrumentationProvider } from "@workleap/common-room/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

// Do not do this, it's only for demo purpose.
const isDev = process.env === "development";

// Only add LogRocket logger if your product is set up with LogRocket.
const loggers: RootLogger[] = [isDev ? new BrowserConsoleLogger() : new LogRocketLogger({ logLevel })];

const telemetryClient = initializeTelemetry({
    logRocket: {
        appId: "my-app-id"
    },
    honeycomb: {
        namespace: "sample",
        serviceName: "my-app",
        apiServiceUrls: [/.+/g],
        options: {
            proxy: "https://sample-proxy"
        }
    },
    mixpanel: {
        productId: "wlp",
        envOrTrackingApiBaseUrl: "development"
    },
    verbose: true,
    loggers
});

const commonRoomClient = registerCommonRoomInstrumentation("my-site-id", {
    verbose: true,
    loggers
});

const root = createRoot(document.getElementById("root")!);

root.render(
    <StrictMode>
        <TelemetryProvider client={telemetryClient}>
            <CommonRoomInstrumentationProvider client={commonRoomClient}>
                <App />
            </CommonRoomInstrumentationProvider>
        </TelemetryProvider>
    </StrictMode>
);
```

## Try it :rocket:

To test the telemetry setup, follow the _try it_ section in each package's documentation:

- [LogRocket](../logrocket/getting-started.md#try-it-)
- [Honeycomb](../honeycomb/getting-started.md#try-it-)
- [Mixpanel](../mixpanel/getting-started.md#try-it-)
- [Common Room](../common-room/getting-started.md#try-it-)




