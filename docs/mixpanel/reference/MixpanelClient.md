---
order: 90
label: MixpanelClient
meta:
    title: MixpanelClient - Mixpanel
toc:
    depth: 2-3
---

# MixpanelClient

!!!warning
Don't create your own instance of `MixpanelClient`, use the `initializeMixpanel` function instead.
!!!

A lightweight client providing access to Mixpanel utilities.

## Reference

```ts
const client = new MixpanelClient(productId, endpoint, superProperties, logger);
```

### Parameters

- `productId`: The product id.
- `endpoint`: The Mixpanel endpoint URL.
- `globalProperties`: Properties to attach to all events.
- `logger`: A `Logger` instance.

### Methods

- `createTrackingFunction(options?: { targetProductId? })`: Returns a [TrackingFunction](#trackingfunction) function sending `POST` requests to a dedicated tracking endpoint fully compliant with the Workleap platform tracking API.
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

## Usage

### Track events

```ts !#5,7
import { useMixpanelClient } from "@workleap/mixpanel/react";

const client = useMixpanelClient();

const track = client.createTrackingFunction();

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
