---
order: 100
label: useMixpanelTrackingFunction
toc:
    depth: 2-3
---

# useMixpanelTrackingFunction

Returns a function sending `POST` requests to a dedicated tracking endpoint fully compliant with the Workleap platform tracking API.

## Reference

```ts
const track = useMixpanelTrackingFunction(options?: { productId?, targetProductId? })
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

## Usage

### Track events

```ts !#3,5
import { useMixpanelTrackingFunction } from "@workleap/telemetry/react";

const track = useMixpanelTrackingFunction();

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

### Specific a product id

To track an action targeting a specific product, use the `productId` option:

```ts !#6
import { useMixpanelClient } from "@workleap/telemetry/react";

const client = useMixpanelClient();

const track = client.createTrackingFunction({
    productId: "wlp"
});

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

### Specify a target product

To track an action targeting another product, use the `targetProductId` option:

```ts !#4
import { useMixpanelTrackingFunction } from "@workleap/telemetry/react";

const track = useMixpanelTrackingFunction({
    targetProductId: "wov"
});

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

### Track a link

To track a link click, use the `keepAlive` option to keep the page alive while the tracking request is being processed:

```ts !#6
import { useMixpanelTrackingFunction } from "@workleap/telemetry/react";

const track = useMixpanelTrackingFunction();

track("LinkClicked", { "Trigger": "ChangePlan", "Location": "Header" }, {
    keepAlive: true
});
```
