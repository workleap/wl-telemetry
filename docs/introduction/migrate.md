---
order: 0
label: Migrate
meta:
    title: Migrate - Introduction
toc:
    depth: 2-3
---

# Migrate

## Standalone libraries

To migrate standalone telemetry libraries, follow the migration guide for each library:

| Name | Minimum version | Migration guide |
| --- | --- | --- |
| ![](../static/logos/logrocket.svg){ class="h-5 w-5 mr-2 -mt-1" }[LogRocket](https://logrocket.com/) | ≥ v1.0.0 | [Migrate to v2.0](../logrocket/updating/migrate-to-v2.0.md) |
| ![](../static/logos/honeycomb.svg){ class="h-5 w-5 mr-2 -mt-1" }[Honeycomb](https://www.honeycomb.io/) | ≥ v6.0.0 | [Migrate to v7.0](../honeycomb/updating/migrate-to-v7.0.md) |
| ![](../static/logos/mixpanel.svg){ class="h-5 w-5 mr-2 -mt-1" }[Mixpanel](https://mixpanel.com/) | ≥ v2.0.0 | [Migration to v3.0](../mixpanel/updating/migrate-to-v3.0.md) 

## Umbrella package

To migrate to the new [@workleap/telemetry](https://www.npmjs.com/package/@workleap/telemetry) umbrella package, follow these steps :point_down:


Un summary de ce qui est NEW I guess?!?!


-> Removed the standalone libraries packages

-> Update the initialization code

-> Import the hooks from `@workleap/telemetry/react` rather than the standalone libraries

-> Do not use the standalone functions anymore, use the clients


----------


For the standalone libraries migration guide, there should probably be a section for every standalone function that has been moved to the client
