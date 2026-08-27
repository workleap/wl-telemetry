---
"@workleap/logrocket": major
"@workleap/telemetry": major
---

Fixed the default user traits so they can be forwarded to `LogRocket.identify` as documented, and removed the ShareGate partner program trait.

## Breaking changes

- The `isInPartnerProgram` option of `LogRocketShareGateIdentification` and the `Is In Partner Program` trait it produced have been removed.
- `LogRocketWorkleapPlatformUserTraits` and `LogRocketShareGateUserTraits` are no longer extending `Record<string, unknown>`. The `unknown` index signature made them incompatible with LogRocket `IUserTraits` type, causing a `TS2345` error when the traits were passed to `LogRocket.identify`. They are now declared as type aliases, which means accessing an unknown trait is a compilation error rather than an `unknown` value.

## Improvements

- The `microsoftUserId`, `microsoftTenantId` and `workspaceId` options of `LogRocketShareGateIdentification` are now optional. The matching traits fall back to `N/A` when no value is provided, as the correlation ids already do.
- `LogRocketWorkleapPlatformUserTraits` now includes the `Is Executive - Compensation`, `Is Collaborator - Compensation` and `Plan Code - Compensation` traits, which `createWorkleapPlatformDefaultUserTraits` was already returning.
