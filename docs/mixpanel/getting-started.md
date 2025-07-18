---
order: 100
label: Getting started
meta:
    title: Getting started - Mixpanel
toc:
    depth: 2
---

# Getting started

To make data-informed decisions, understand user behavior, and measure product impact, Workleap has adopted [Mixpanel](https://mixpanel.com/), an analytics platform that helps **understand how users interact with** a **product**.

This package add basic Mixpanel tracking capabilities to an application. It provides a single `track` function that sends `POST` requests to a dedicated tracking endpoint compliant with the Workleap platform tracking API.

## Install the packages

First, open a terminal at the root of the application and install the following packages:

```bash
pnpm add @workleap/telemetry @workleap/mixpanel
```

## Initialize Mixpanel

Then, initialize Mixpanel using the [initializeMixpanel](./reference/initializeMixpanel.md) function:

```ts
import { initializeMixpanel } from "@workleap/mixpanel";

initializeMixpanel("wlp", "development", {
    verbose: true
});
```

!!!tip
It's recommended to **log** as much **relevant information** as possible to the **console**, as LogRocket includes console output in its session replays.

This applies not only to Mixpanel, but also to **any frontend code or libraries in use**. However, make sure not to log any _Personally Identifiable Information (PII)_.
!!!

## Create a track function

Then create a `track` function using the [useTrackingFunction](./reference//) hook if the host application is in React:

```ts
import { useTrackingFunction } from "@workleap/mixpanel/react";

const track = useTrackingFunction();

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

Otherwise use the `createTrackingFunction` directly:

```ts
import { createTrackingFunction } from "@workleap/mixpanel";

const track = createTrackingFunction();

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

## Track an event

Finally, using the retrieved `track` function, send a telemetry event:

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

## Set custom user events

Most applications need to set custom properties on events about the current user environment. To help with that, `@workleap/mixpanel` expose the [setSuperProperties](./reference/setSuperProperties.md) function.

Update your application code to include the `setSuperProperties` function:

```ts
import { setSuperProperties } from "@workleap/mixpanel";

setSuperProperties({
    "User Id": "123" 
})
```

Now, every event recorded after the execution of `setSuperProperties` will include the custom property `User Id`.

## Try it :rocket:

Start the application in a development environment using the dev script. Render a page, then navigate to your [Mixpanel](https://mixpanel.com/) instance. Go to "Events" page. If you are tracking events, you should see a new event appear.

You can try filtering the event list using different properties, such as:

- `User Id`

### Troubleshoot issues

If you are experiencing issues with this guide:

- Set the [verbose](./reference/initializeMixpanel.md#verbose-mode) predefined option to `true`.
- Open the [DevTools](https://developer.chrome.com/docs/devtools/) console and look for logs starting with `[mixpanel]`.
- Refer to the sample on [GitHub](https://github.com/workleap/wl-telemetry/tree/main/samples/all-platforms).

## Filter by correlation ids

The `initializeMixpanel` function automatically adds two properties to every event to **unify** Mixpanel with the **other telemetry platforms**:

- `Telemetry Id`: Identifies a single application load. It's primarily used to correlate with Honeycomb traces.
- `Device Id`: Identifies the user's device across sessions. This value is extracted from the shared `wl-identity` cookie, which is used across Workleap's marketing sites and web applications.

To correlate a session with other telemetry platforms, filter the session list using these user traits.

## Migrate

To benefit from the new integrated experience, follow the [migration guide](./updating/migrate-to-v2.0.md) for `v2.0`.



