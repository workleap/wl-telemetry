---
order: 80
label: MixpanelProvider
meta:
    title: MixpanelProvider - Mixpanel
toc:
    depth: 2-3
---

# MixpanelProvider

React provider to share a `MixpanelClient` instance with the application code.

## Reference

```tsx
<MixpanelProvider client={client}>
    <App />
</MixpanelProvider>
```

### Properties

- `client`: A [MixpanelClient](./MixpanelClient.md) instance.

## Usage

### Provide a client instance

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

### Retrieve a client instance

```ts !#3
import { useMixpanelClient } from "@workleap/mixpanel/react";

const client = initializeMixpanel("wlp", "development");

client.setGlobalEventProperties({
    "User Id": "123"
});
```
