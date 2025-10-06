---
order: 100
label: Features
meta:
    title: LogRocket features
---

# LogRocket features

To gain full visibility into **frontend behavior** in **production**, Workleap has adopted [LogRocket](https://logrocket.com/), a tool that combines session replay, performance tracking, and error logging to help **understand** and resolve **issues** in **production**.

The `@workleap/telemetry` package provides default LogRocket instrumentation tailored to Workleap's applications' needs, including the **removal** of **sensitive information** from HTML documents, HTTP requests/responses and URLs.

## Session replays

With instrumentation in place, [session replays](https://docs.logrocket.com/docs/session-replay) are now available in LogRocket:

:::align-image-left
![Available session replays](../../static/logrocket/logrocket-session-replays.png)
:::

Session replays offer a wide range of features to help debug production issues, including the following :point_down:

#### Playback

:::align-image-left
![](../../static/logrocket/logrocket-playback.png)
:::

#### Console logs

:::align-image-left
![](../../static/logrocket/logrocket-console-logs.png){width=794}
:::

#### Network requests

:::align-image-left
![](../../static/logrocket/logrocket-network-requests.png)
:::

#### DOM interactions

:::align-image-left
![](../../static/logrocket/logrocket-dom-interactions.png)
:::

## Record elements

By default, this package instrumentation sanitizes all user-provided text inputs and content. This includes:

- Form fields (like `<input>`, `<textarea>`)
- Text content inside HTML elements
- Dynamic DOM mutations containing text

Use `data-public` to explicitly allow LogRocket to record the content of an element. When this attribute is present, the content inside the element (including child elements) will be captured in the session replay:

```html
<div data-public>
    This text will be visible in the session replay.
</div>
```

!!!tip
To learn more about the built-in privacy settings of this instrumentation, refer to the [Privacy](./privacy.md) page.
!!!

## Correlation ids

Two correlation ids are automatically added to each session and can be used to filter sessions by user traits:

- `Telemetry Id`: Identifies a single application load. It's primarily used to correlate Honeycomb traces with the other telemetry platforms.
- `Device Id`: Identifies the user's device across sessions. This value is extracted from the shared `wl-identity` cookie, which is used across Workleap's marketing sites and web applications.

## Identify a user

Most applications need to identify the current user environment. To help with that, [LogRocketInstrumentationClient](../../reference/telemetry/LogRocketInstrumentationClient.md) expose the [createWorkleapPlatformDefaultUserTraits](../../reference/telemetry/LogRocketInstrumentationClient.md#methods) method. When used with [LogRocket.identify](https://docs.logrocket.com/reference/identify), it provides all the tools to identify a  user with the key information that we track at Workleap:

```ts !#6-13,15
import { useLogRocketInstrumentationClient } from "@workleap/telemetry/react";
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

## Get the session URL

Every session replay is associated with a unique URL. To register a callback receiving the session replay once it's available, use the [LogRocket.getSessionURL](https://docs.logrocket.com/reference/get-session-url) function: 

```ts !#3-5 index.tsx
import LogRocket from "logrocket";

LogRocket.getSessionUrl(url => {
    console.log(url);
});
```

## Capture logs

By default, Workleap's LogRocket configuration does not capture console logs. To send loggers output to LogRocket, use the [LogRocketLogger](../../reference/LogRocketLogger.md) class.

```tsx !#9,27,31 index.tsx
import { initializeTelemetry, TelemetryProvider } from "@workleap/telemetry/react";
import { registerCommonRoomInstrumentation, CommonRoomInstrumentationProvider } from "@workleap/common-room/react";
import { LogLevel, type RootLogger } from "@workleap/logging";
import { LogRocketLogger } from "@workleap/logger";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

const loggers: RootLogger[] = [new LogRocketLogger({ logLevel: LogLevel.information })];

const telemetryClient = initializeTelemetry({
    logRocket: {
        appId: "my-app-id"
    },
    honeycomb: {
        namespace: "sample",
        serviceName: "my-app",
        apiServiceUrls: [/.+/g],
        options: {
            proxy: "https://sample-proxy"
        }
    },
    mixpanel: {
        productId: "wlp",
        envOrTrackingApiBaseUrl: "development"
    },
    loggers
});

const commonRoomClient = registerCommonRoomInstrumentation("my-site-id", {
    loggers
});

const root = createRoot(document.getElementById("root")!);

root.render(
    <StrictMode>
        <TelemetryProvider client={telemetryClient}>
            <CommonRoomInstrumentationProvider client={commonRoomClient}>
                <App />
            </CommonRoomInstrumentationProvider>
        </TelemetryProvider>
    </StrictMode>
);
```

!!!info
Console logs are not captured by default to reduce the risk of exposing Personally Identifiable Information (PII) in LogRocket session replays.
!!!

To troubleshoot an production issue, remove the `LogLevel` from the `LogRocketLogger` constructor options and set the `verbose` option to `true`:

```tsx !#9,27,32 index.tsx
import { initializeTelemetry, TelemetryProvider } from "@workleap/telemetry/react";
import { registerCommonRoomInstrumentation, CommonRoomInstrumentationProvider } from "@workleap/common-room/react";
import { type RootLogger } from "@workleap/logging";
import { LogRocketLogger } from "@workleap/logger";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

const loggers: RootLogger[] = [new LogRocketLogger()];

const telemetryClient = initializeTelemetry({
    logRocket: {
        appId: "my-app-id"
    },
    honeycomb: {
        namespace: "sample",
        serviceName: "my-app",
        apiServiceUrls: [/.+/g],
        options: {
            proxy: "https://sample-proxy"
        }
    },
    mixpanel: {
        productId: "wlp",
        envOrTrackingApiBaseUrl: "development"
    },
    verbose: true,
    loggers
});

const commonRoomClient = registerCommonRoomInstrumentation("my-site-id", {
    verbose: true,
    loggers
});

const root = createRoot(document.getElementById("root")!);

root.render(
    <StrictMode>
        <TelemetryProvider client={telemetryClient}>
            <CommonRoomInstrumentationProvider client={commonRoomClient}>
                <App />
            </CommonRoomInstrumentationProvider>
        </TelemetryProvider>
    </StrictMode>
);
```
