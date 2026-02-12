---
order: 100
label: Getting started
---

# Getting started

Welcome to `@workleap/telemetry`, a collection of telemetry packages for building web applications at Workleap. On this getting started page, you'll find an overview of the project and a list of [supported platforms](#supported-platforms).

## An integrated experience

Without a unified and cohesive telemetry setup, debugging issues or analyzing product behavior often requires **jumping between** tools with **disconnected data**. Session replays in [LogRocket](https://logrocket.com/), traces in [Honeycomb](https://www.honeycomb.io/), and user events in [Mixpanel](https://mixpanel.com/) each offer valuable insights, but without shared identifiers or cross-platform context, it becomes difficult to correlate events, reconstruct user journeys, or measure the full impact of a technical issue in production.

This integrated experience brings together LogRocket, Honeycomb, and Mixpanel. By linking session data, performance traces, and user interactions through consistent identifiers, it becomes possible to **trace** a **single** application **event across systems**, from backend performance to frontend behavior to product impact. This integration streamlines will hopefully enables faster, and more informed decision-making.

## A new umbrella package

Although Workleap provides a standalone package for each platform, **we recommend** going forward **using** the `@workleap/telemetry` umbrella package for LogRocket, Honeycomb, and Mixpanel. This simplifies the integration, compared to relying on the individual standalone packages for these. To migrate to the `@workleap/telemetry` umbrella package, refer to the [migration guide](../updating/migrate-to-umbrella-package.md).

## Supported platforms

{.supported-platforms-table}
| Name | Description | Documentation |
| --- | --- | --- |
| ![](../static/logos/logrocket.svg){ class="h-5 w-5 mr-2 -mt-1" }[LogRocket](https://logrocket.com/) | Records frontend sessions and logs to help debug and resolve issues in production and surface critical issues. | [Learn more](./learn-logrocket/features.md) |
| ![](../static/logos/honeycomb.svg){ class="h-5 w-5 mr-2 -mt-1" }[Honeycomb](https://www.honeycomb.io/) | Captures and analyzes distributed traces and metrics to understand and monitor complex systems, application behaviors, and performance. | [Learn more](./learn-honeycomb/features.md) |
| ![](../static/logos/mixpanel.svg){ class="h-5 w-5 mr-2 -mt-1" }[Mixpanel](https://mixpanel.com/) | Tracks user interactions to analyze behavior and measure product impact. | [Learn more](./learn-mixpanel/features.md) |
| ![](../static/logos/common-room.svg){ class="h-5 w-5 mr-2 -mt-1" }[Common Room](https://www.commonroom.io/) | Connects user activity across platforms to provide insight into community engagement and behavior.<br/><br/>_(Common Room is not part of the integrated experience, as it is a standalone tool used by marketers for a completely different purpose.)_ | [Getting started](../standalone-libraries/common-room/getting-started.md) |

## Setup your project

👉 To get started, follow the [quick start](./setup-project.md) guide to set up your project with Workleap's supported telemetry platforms.
