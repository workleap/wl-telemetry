---
order: 190
label: Migrate to v2.0
meta:
    title: Migrate to v2.0 - Mixpanel
---

# Migrate to v2.0

This new version introduces two correlation ids, `telemetryId` and `deviceId`, to help unify and correlate data across [LogRocket](https://logrocket.com/), [Honeycomb](https://www.honeycomb.io/) and [Mixpanel](https://mixpanel.com/) and a new automatic enrichment of the events with the LogRocket session url if the [LogRocket instrumentation](../../logrocket/getting-started.md) is registered.

To support these new automations, a new [initializeMixpanel](../reference/initializeMixpanel.md) function has been introduced. This setup function should be called only once per load, during the application's bootstrap phase.

## Breaking changes

- The [initializeMixpanel](../reference/initializeMixpanel.md) function must be executed during the bootstrapping of the application and must be called prior to the [useTrackingFunction](../reference/useTrackingFunction.md) hook or `createTrackingFunction`.
- The `createTrackingFunction` signature do not include the `productId` and `env` arguments anymore.

Before:

```ts
import { createTrackingFunction } from "@workleap/mixpanel";

const track = createTrackingFunction("wlp", "development", {
    targetProductId: "ov"
});

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

After:

```ts
import { initializeMixpanel, createTrackingFunction } from "@workleap/mixpanel";

// Must be executed once.
initializeMixpanel("wlp", "development");

...

const track = createTrackingFunction();

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

Or for a React application:

```ts
import { initializeMixpanel } from "@workleap/mixpanel";
import { useTrackingFunction } from "@workleap/mixpanel/react";

// Must be executed once.
initializeMixpanel("wlp", "development");

...

const track = useTrackingFunction();

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

## Improvements

### Correlation ids

To help unify and correlate data across LogRocket, Honeycomb, and Mixpanel, the [initializeMixpanel](../reference/initializeMixpanel.md) function now automatically adds two correlation ids as attributes to every event:

- `telemetryId` is a new identifier that represents a single application load.
- `deviceId` is an identifier that represents a single device across multiple loads.

### Session URL enrichment

A built-in integration now automatically allows other telemetry libraries to include the LogRocket session replay URL in their traces.

Once the LogRocket session URL is retrieved, each event is enriched with an `LogRocket Session Url` property:

:::align-image-left
![Enrichment example](../../static/mixpanel/mixpanel-logrocket-session-url.png){width=464}
:::

### Super properties

You can now use a new function to add super properties, global event properties that are defined once and automatically included with all events:

```ts
import { setSuperProperties } from "@workleap/mixpanel";

setSuperProperties({
    "User Id": "123"
});
```

## Migrate from `v1.0`

Follow these steps to migrate an existing application `v1.0` to `v2.0`:

- Add the [initializeMixpanel](../reference/initializeMixpanel.md) function to the bootstrapping code of the application.
- Remove the `productId` and `env` arguments from `createTrackingFunction`.
- If the host application is in React, consider replacing `createTrackingFunction` by the [useTrackingFunction](../reference/useTrackingFunction.md) hook.
