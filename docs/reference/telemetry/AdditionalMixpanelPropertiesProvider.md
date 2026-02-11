---
order: 90
label: AdditionalMixpanelPropertiesProvider
toc:
    depth: 2-3
---

# AdditionalMixpanelPropertiesProvider

A React provider used to define additional Mixpanel properties. These properties are automatically included in events triggered by nested components, provided the events are tracked using functions created with the [useMixpanelTrackingFunction](./useMixpanelTrackingFunction.md) hook.

!!!warning
Ensure that the value passed to `AdditionalMixpanelPropertiesProvider` is a **static object**, either defined outside the component scope or memoized. Otherwise, the `useMixpanelTrackingFunction` hook ill create a new tracking function on every render.
!!!

## Reference

```tsx
<AdditionalMixpanelPropertiesProvider value={StaticObjectOfProperties}>
    <App />
</AdditionalMixpanelPropertiesProvider>
```

### Properties

- `value`: A static object literal of the additional properties to track.

## Usage

### Define a provider

```tsx !#9,11
import { AdditionalMixpanelPropertiesProvider } from "@workleap/telemetry/react";

const AdditionalProperties = {
    foo: "bar"
};

function App() {
    return (
        <AdditionalMixpanelPropertiesProvider value={AdditionalProperties}>
            <ComponentWithTracking />
        </AdditionalMixpanelPropertiesProvider>
    )
}
```

### Track an event with additional properties

```tsx !#10,14
import { AdditionalMixpanelPropertiesProvider, useMixpanelTrackingFunction } from "@workleap/telemetry/react";
import { useEffect } from "react";

const AdditionalProperties = {
    foo: "bar",
    john: "doe"
};

function ComponentWithTracking() {
    const track = useMixpanelTrackingFunction();

    // Please don't track in a "useEffect", it's strictly for demo purpose.
    useEffect(() => {
        track("event", {});
    }, [track]);
}

function App() {
    return (
        <AdditionalMixpanelPropertiesProvider value={AdditionalProperties}>
            <ComponentWithTracking />
        </AdditionalMixpanelPropertiesProvider>
    )
}
```

### Retrieve additional properties

```ts !#3
import { useAdditionalMixpanelProperties } from "@workleap/telemetry/react";

const props = useAdditionalMixpanelProperties();
```
