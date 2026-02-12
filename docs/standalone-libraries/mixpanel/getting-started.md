---
order: 100
label: Getting started
title: Getting started - Mixpanel
---

# Getting started

!!!warning
Prefer using the [@workleap/telemetry](../../introduction/getting-started.md) umbrella package over this standalone library.
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

const client = initializeMixpanel("development", {
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

Then create a `track` function using the [useTrackingFunction](./reference.md#usetrackingfunction) hook if the host application is in React:

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

Most applications need to set custom properties about the current user environment on all events. To help with that, [MixpanelClient](./reference.md#mixpanelclient) expose the [setGlobalEventProperties](./reference.md#methods) method:

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

const mixpanelClient = initializeMixpanel("development", {
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

- Set the [verbose](./reference.md#verbose-mode) predefined option to `true`.
- Open the [DevTools](https://developer.chrome.com/docs/devtools/) console and look for logs starting with `[mixpanel]`.
- Refer to the sample on [GitHub](https://github.com/workleap/wl-telemetry/tree/main/samples/all-platforms).
