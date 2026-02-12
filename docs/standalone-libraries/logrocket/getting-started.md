---
order: 100
label: Getting started
title: Getting started - LogRocket
---

# Getting started

!!!warning
Prefer using the [@workleap/telemetry](../../introduction/getting-started.md) umbrella package over this standalone library.
!!!

While we recommend using the `@workleap/telemetry` umbrella package, Workleap's LogRocket instrumentation can also be used as a standalone [@worleap/logrocket](https://www.npmjs.com/package/@workleap/logrocket) package.

To set it up, follow these steps :point_down:

## Install the packages

First, open a terminal at the root of the application and install the following packages:

```bash
pnpm add @workleap/logrocket logrocket
```

## Register instrumentation

Then, update the application bootstrapping code to register LogRocket instrumentation using the [registerLogRocketInstrumentation](./reference.md#registerlogrocketinstrumentation) function and forward the client using a React context provider:

```tsx !#6-8,14,16 index.tsx
import { registerLogRocketInstrumentation, LogRocketInstrumentationProvider, createTelemetryContext } from "@workleap/logrocket/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

const client = registerLogRocketInstrumentation("my-app-id", {
    telemetryContext: createTelemetryContext()
});

const root = createRoot(document.getElementById("root")!);

root.render(
    <StrictMode>
        <LogRocketInstrumentationProvider client={client}>
            <App />
        </LogRocketInstrumentationProvider>
    </StrictMode>
);
```

## Identify a Workleap Platform user

Most Workleap Platform applications need to identify the current user environment. To help with that, [LogRocketInstrumentationClient](./reference.md#logrocketinstrumentationclient) expose the [createWorkleapPlatformDefaultUserTraits](./reference.md#methods) method. When used with [LogRocket.identify](https://docs.logrocket.com/reference/identify), it provides all the tools to identify a  user with the key information that we track at Workleap:

```tsx index.tsx
import { registerLogRocketInstrumentation, LogRocketInstrumentationProvider, createTelemetryContext } from "@workleap/logrocket/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

const client = registerLogRocketInstrumentation("my-app-id", {
    telemetryContext: createTelemetryContext()
});

const root = createRoot(document.getElementById("root")!);

root.render(
    <StrictMode>
        <LogRocketInstrumentationProvider client={client}>
            <App />
        </LogRocketInstrumentationProvider>
    </StrictMode>
);
```

```ts !#6-13,15
import { useLogRocketInstrumentationClient } from "@workleap/logrocket/react";
import LogRocket from "logrocket";

const client = useLogRocketInstrumentationClient();

const traits = client.createWorkleapPlatformDefaultUserTraits({
    userId: "6a5e6b06-0cac-44ee-8d2b-00b9419e7da9",
    organizationId: "e6bb30f8-0a00-4928-8943-1630895a3f14",
    organizationName: "Acme",
    isMigratedToWorkleap: true,
    isOrganizationCreator: false,
    isAdmin: false
});

LogRocket.identify(traits.userId, traits);
```

## Identify a ShareGate user

Most ShareGate applications need to identify the current user environment. To help with that, [LogRocketInstrumentationClient](./reference.md#logrocketinstrumentationclient) expose the [createShareGateDefaultUserTraits](./reference.md#methods) method. When used with [LogRocket.identify](https://docs.logrocket.com/reference/identify), it provides all the tools to identify a  user with the key information that we track at Workleap:

```tsx index.tsx
import { registerLogRocketInstrumentation, LogRocketInstrumentationProvider, createTelemetryContext } from "@workleap/logrocket/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

const client = registerLogRocketInstrumentation("my-app-id", {
    telemetryContext: createTelemetryContext()
});

const root = createRoot(document.getElementById("root")!);

root.render(
    <StrictMode>
        <LogRocketInstrumentationProvider client={client}>
            <App />
        </LogRocketInstrumentationProvider>
    </StrictMode>
);
```

```ts !#6-11,13
import { useLogRocketInstrumentationClient } from "@workleap/logrocket/react";
import LogRocket from "logrocket";

const client = useLogRocketInstrumentationClient();

const traits = client.createWorkleapPlatformDefaultUserTraits({
    shareGateAccountId: "cd7fb5ca-f13d-420f-9a87-637b3419d242",
    microsoftUserId: "e9bb1688-a68b-4235-b514-95a59a7bf8bc",
    microsoftTenantId: "86bea6e5-5dbb-43c9-93a4-b10bf91cc6db",
    workspaceId: "225e6494-c008-4086-ac80-3770aa47085b"
});

LogRocket.identify(traits.shareGateAccountId, traits);
```

## Get the session URL

Every session replay is associated with a unique URL. To register a callback receiving the session replay once it's available, use the [LogRocket.getSessionURL](https://docs.logrocket.com/reference/get-session-url) function: 

```ts !#3-5 index.tsx
import LogRocket from "logrocket";

LogRocket.getSessionUrl(url => {
    console.log(url);
});
```

## Try it :rocket:

Start the application in a development environment using the dev script. Render a page, then navigate to your [LogRocket](https://app.logrocket.com/) instance. Go to "Session Replay" page, you should see a new session appear.

You can try filtering the session list using different user traits, such as:

- `User Id`
- `Organization Id`
- `Is Admin`

### Troubleshoot issues

If you are experiencing issues with this guide:

- Set the [verbose](./reference.md#verbose-mode) predefined option to `true`.
- Open the [DevTools](https://developer.chrome.com/docs/devtools/) console and look for logs starting with `[logrocket]`.
- Refer to the sample on [GitHub](https://github.com/workleap/wl-telemetry/tree/main/samples/all-platforms).
