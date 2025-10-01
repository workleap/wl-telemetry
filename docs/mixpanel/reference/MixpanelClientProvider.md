---
order: 80
label: MixpanelClientProvider
meta:
    title: MixpanelClientProvider - Mixpanel
toc:
    depth: 2-3
---

# MixpanelClientProvider

React provider to share a `MixpanelClient` instance with the application code.

## Reference

```tsx
<MixpanelClientProvider value={client}>
    <App />
</MixpanelClientProvider>
```

### Properties

- `value`: A [MixpanelClient](./MixpanelClient.md) instance.

## Usage

### Provide a client instance

```tsx !#10-12
import { initializeMixpanel, MixpanelClientProvider } from "@workleap/mixpanel/react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

const client = initializeMixpanel("wlp", "development");

const root = createRoot(document.getElementById("root"));

root.render(
    <MixpanelClientProvider value={client}>
        <App />
    </MixpanelClientProvider>
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
