---
order: 90
label: MixpanelPropertiesProvider
toc:
    depth: 2-3
---

# MixpanelPropertiesProvider

A React provider used to define Mixpanel properties for nested components. These properties are automatically included in events tracked by nested components, provided the events are tracked using functions created with the [useMixpanelTrackingFunction](./useMixpanelTrackingFunction.md) hook.

!!!tip
Ensure that the value passed to `MixpanelPropertiesProvider` is a **static object**, either defined outside components scope or memoized. Otherwise, the `useMixpanelTrackingFunction` hook will create a new tracking function on every render.
!!!

## Reference

```tsx
<MixpanelPropertiesProvider value={StaticObjectOfProperties}>
    <App />
</MixpanelPropertiesProvider>
```

### Properties

- `value`: A **static object** literal of Mixpanel properties to track.

## Usage

### Define a provider

```tsx !#9,11
import { MixpanelPropertiesProvider } from "@workleap/telemetry/react";

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
import { MixpanelPropertiesProvider, useMixpanelTrackingFunction } from "@workleap/telemetry/react";
import { useEffect } from "react";

const MixpanelProperties = {
    section: "User Form"
};

function NestedComponent() {
    const track = useMixpanelTrackingFunction();

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
import { useMixpanelProviderProperties } from "@workleap/telemetry/react";

const props = useMixpanelProviderProperties();
```
