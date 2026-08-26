---
order: 180
label: Migrate to umbrella v4.0
toc:
    depth: 2-3
---

# Migrate to umbrella v4.0

This major version removes the ShareGate partner program trait and makes the default user traits assignable to [LogRocket.identify](https://docs.logrocket.com/reference/identify).

## Breaking changes

### Removed

- The `isInPartnerProgram` option of the [createShareGateDefaultUserTraits](../reference/telemetry/LogRocketInstrumentationClient.md#methods) `identification` argument has been removed, along with the `Is In Partner Program` user trait it produced. Remove the option from your identification object:

```ts !#5
const traits = client.createShareGateDefaultUserTraits({
    shareGateAccountId: "cd7fb5ca-f13d-420f-9a87-637b3419d242",
    microsoftUserId: "e9bb1688-a68b-4235-b514-95a59a7bf8bc",
    microsoftTenantId: "86bea6e5-5dbb-43c9-93a4-b10bf91cc6db",
    workspaceId: "225e6494-c008-4086-ac80-3770aa47085b"
});
```

### The user traits types no longer accept unknown traits

`LogRocketWorkleapPlatformUserTraits` and `LogRocketShareGateUserTraits` used to extend `Record<string, unknown>`. That index signature made them incompatible with the LogRocket `IUserTraits` type, so passing the traits to `LogRocket.identify` failed to compile:

```
Argument of type '{ [x: string]: unknown; ... }' is not assignable to parameter of type 'IUserTraits'.
```

They are now type aliases declaring only the traits they return. Reading a trait that isn't declared is now a compilation error rather than an `unknown` value:

Before:

```ts
// Never compiled: "userId" is not a trait name, it resolved to "unknown".
LogRocket.identify(traits.userId, traits);
```

Now:

```ts !#1
LogRocket.identify(traits["User Id"], traits);
```

Merging [additional traits](../reference/telemetry/LogRocketInstrumentationClient.md#send-additional-traits) still works, as long as their values are of type `string`, `number` or `boolean`. If you were annotating a variable with one of those types while adding custom traits to it, drop the annotation and let the type be inferred.

## Improvements

### New Compensation user traits

`LogRocketWorkleapPlatformUserTraits` now declares the `Is Executive - Compensation`, `Is Collaborator - Compensation` and `Plan Code - Compensation` traits. [createWorkleapPlatformDefaultUserTraits](../reference/telemetry/LogRocketInstrumentationClient.md#methods) was already returning them from the `isExecutive.cmp`, `isCollaborator.cmp` and `planCode.cmp` identification values.
