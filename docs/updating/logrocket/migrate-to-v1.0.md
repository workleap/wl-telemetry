---
order: 200
label: Migrate to v1.0
meta:
    title: Migrate to v1.0 - LogRocket
toc:
    depth: 2-3
---

# Migrate to v1.0

This rewrite of Workleap's [LogRocket](https://logrocket.com/) instrumentation focuses on leveraging the native [LogRocket library](https://www.npmjs.com/package/logrocket) directly, rather than abstracting it away and on adding two correlation ids, `telemetryId` and `deviceId`, to help unify and correlate data across [LogRocket](https://logrocket.com/), [Honeycomb](https://www.honeycomb.io/) and [Mixpanel](https://mixpanel.com/). Finally a new built-in integration allow other telemetry libraries to automatically add the LogRocket session replay URL to their traces/events.

Follow this guide to migrate from `@workleap-tracking/logrocket` :point_down:

## Breaking changes

:rotating_light: The new package name is `@workleap/logrocket`.

### Removed

- The `registerAnonymousLogRocketInstrumentation` function doesn't exist anymore, use `registerLogRocketInstrumentation` instead.
- The `getTrackingIdentifier` function doesn't exist anymore. A similar identifier is now automatically added as a user trait for every session replay.
- The `registerLogRocketInstrumentation` function `trackingIdentifier`, `identifyOptions` and `onSessionUrlInitialized` options doesn't exist anymore.

### Renamed

- The `WorkleapLogRocketIdentification` TypeScript interface has been renamed to `LogRocketIdentification`.
- The `WorkleapUserTraits` TypeScript interface has been renamed to `LogRocketUserTraits`.

### Others

- The `logrocket` package is a new peer dependency of the `@workleap/logrocket` package.

### Changes to `registerLogRocketInstrumentation`

- The `getTrackingIdentifier` function and `trackingIdentifier` option do not exist anymore. A similar identifier is now automatically added as a user trait for every session replay.
- The `identifyOptions` option has been removed, use `createDefaultUserTraits` and the native [LogRocket.identify](https://docs.logrocket.com/reference/identify) function instead.
- The `onSessionUrlInitialized` option has been removed, use the native [LogRocket.getSessionURL](https://docs.logrocket.com/reference/get-session-url) function instead.
- The function arguments changed from `(options: {})` to `(appId, options: {})`.

Before:

```ts
import { getTrackingIdentifier, registerLogRocketInstrumentation } from "@workleap-tracking/logrocket";

const user = {
    userId: "6a5e6b06-0cac-44ee-8d2b-00b9419e7da9",
    organizationId: "e6bb30f8-0a00-4928-8943-1630895a3f14",
    organizationName: "Acme",
    isMigratedToWorkleap: true,
    isAdmin: false,
    isOrganizationCreator: false,
    isReportingManager: false,
    isTeamManager: false,
    isExecutive: { wov: true },
    isCollaborator: { wov: true },
    planCode: { wov: "wov-essential-monthly-std" }
};

const trackingIdentifier = getTrackingIdentifier({ 
    generateCookieOnDefault: true,
    pregeneratedTrackingIdentifier: user.userId
});

registerLogRocketInstrumentation({
    appId,
    trackingIdentifier,
    identifyOptions: user,
    onSessionUrlInitialized: async (sessionUrl) => sendSessionUrlToTrackingService(...)
});
```

Now:

```ts
import { registerLogRocketInstrumentation, createDefaultUserTraits } from "@workleap/logrocket";
import LogRocket from "logrocket";

const traits = createDefaultUserTraits({
    userId: "6a5e6b06-0cac-44ee-8d2b-00b9419e7da9",
    organizationId: "e6bb30f8-0a00-4928-8943-1630895a3f14",
    organizationName: "Acme",
    isMigratedToWorkleap: true,
    isAdmin: false,
    isOrganizationCreator: false,
    isReportingManager: false,
    isTeamManager: false,
    isExecutive: { wov: true },
    isCollaborator: { wov: true },
    planCode: { wov: "wov-essential-monthly-std" }
});

registerLogRocketInstrumentation(appId);

LogRocket.getSessionURL((sessionUrl) => sendSessionUrlToTrackingService(sessionUrl));
LogRocket.identify(traits.userId, traits);
```

### Removed `registerAnonymousLogRocketInstrumentation`

The `registerAnonymousLogRocketInstrumentation` function doesn't exist anymore, use `registerLogRocketInstrumentation` instead.

Before:

```ts
import { getTrackingIdentifier, registerAnonymousLogRocketInstrumentation } from "@workleap-tracking/logrocket";

const trackingIdentifier = getTrackingIdentifier({ 
    generateCookieOnDefault: true
});

registerAnonymousLogRocketInstrumentation({
    appId,
    trackingIdentifier
});
```

Now:

```ts
import { registerLogRocketInstrumentation } from "@workleap/logrocket";
import LogRocket from "logrocket";

registerLogRocketInstrumentation(appId);
```

### Add new dependencies

- Add the `logrocket` dependency to the host application.

## Improvements

### Correlation ids

To help unify and correlate data across LogRocket, Honeycomb, and Mixpanel, the `registerLogRocketInstrumentation` function now automatically adds two correlation ids as user traits to every session replay:

- `telemetryId` is a new identifier that represents a single application load.
- `deviceId` replaces the former `trackingId` and reuses the original name from the `wl-identity` cookie, better reflecting its purpose as a persistent device identifier.

### Session URL enrichment

A built-in integration now automatically allows other telemetry libraries to include the LogRocket session replay URL in their traces or events.

For example, with the Honeycomb integration, once the LogRocket session URL is retrieved, each trace is enriched with an `app.logrocket_session_url` attribute:

:::align-image-left
![Honeycomb enrichment example](../../static/logrocket/honeycomb-logrocket-session-url.png){width=328}
:::

## Migrate from `@workleap-tracking/logrocket`

Follow these steps to migrate an existing application `@workleap-tracking/logrocket` to `@workleap/logrocket`:

- Rename `registerAnonymousLogRocketInstrumentation` to `registerLogRocketInstrumentation`.
- Remove all usage of `getTrackingIdentifier`. The new `registerLogRocketInstrumentation` function automatically sets the tracking identifier as a correlation id under the `Device Id` name.
- Remove the `trackingIdentifier` and `identifyOptions` options. To identify a user, use `createDefaultUserTraits` in combination to [LogRocket.identify](https://docs.logrocket.com/reference/identify).
- Replace the `onSessionUrlInitialized` option with the [LogRocket.getSessionUrl](https://docs.logrocket.com/reference/get-session-url) function.
- Rename any instances of `WorkleapLogRocketIdentification` to `LogRocketIdentification`.
- Rename any instances of `WorkleapUserTraits` to `LogRocketUserTraits`.


