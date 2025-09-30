---
order: 0
label: createTrackingFunction
meta:
    title: createTrackingFunction - Mixpanel
toc:
    depth: 2-3
---

# createTrackingFunction

!!!warning
This standalone is deprecated, use [client.createTrackingFunction](./MixpanelClient.md) instead.
!!!

Returns a function sending `POST` requests to a dedicated tracking endpoint fully compliant with the Workleap platform tracking API.

## Reference

```ts
const track = createTrackingFunction(options?: { targetProductId })
```

### Parameters

- `options`: An optional object literal of options:
    - `targetProductId`: The product id of the target product. Useful to track an event for another product.

### Returns

A `TrackingFunction` with the following signature: `(eventName, properties: {}, options?: { keepAlive }) => Promise<void>`.

- `eventName`: The event name.
- `properties`: The event properties.
- `options`: An optional object literal of options:
    - `keepAlive`: Whether or not to keep the connection alive for the tracking request. It is mostly used for tracking links where the user might navigate away before the request is completed.

!!!tip
The body size for keepalive requests is [limited to 64 kibibytes](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#keepalive).
!!!

### Throws

If the [initializeMixpanel](./initializeMixpanel.md) function hasn't been executed yet and the Mixpanel context is not available, an `Error` is thrown.

## Usage

### Track events

```ts !#5
import { createTrackingFunction } from "@workleap/mixpanel";

const track = createTrackingFunction();

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

### Specify a target product

To track an action targeting another product, use the `targetProductId` option:

```ts !#4
import { createTrackingFunction } from "@workleap/mixpanel";

const track = createTrackingFunction({
    targetProductId: "wov"
});

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

### Track a link

To track a link click, use the `keepAlive` option to keep the page alive while the tracking request is being processed:

```ts !#6
import { createTrackingFunction } from "@workleap/mixpanel";

const track = createTrackingFunction();

track("LinkClicked", { "Trigger": "ChangePlan", "Location": "Header" }, {
    keepAlive: true
});
```

