---
"@workleap/telemetry": patch
"@workleap/honeycomb": patch
"@workleap/logrocket": patch
"@workleap/mixpanel": patch
---

Declare `@types/react` as an optional peer dependency, so the React types in the package declarations resolve under installs that link packages from outside the project, such as pnpm's global virtual store.
