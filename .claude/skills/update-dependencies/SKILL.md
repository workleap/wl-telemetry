---
name: update-dependencies
description: |
  Update this monorepo's npm dependencies to their latest versions and validate the update locally before it goes to a PR.

  Use when the user asks to:
  (1) "update the dependencies", "bump deps", "update outdated deps", or run `update-outdated-deps`
  (2) validate a dependency update locally (build, lint, run the sample apps in a browser)
  (3) reproduce/debug the weekly "Update dependencies" workflow on their machine

  This is the LOCAL, interactive counterpart to the CI automation in `.github/prompts/update-dependencies.md`. It does NOT open a PR — it updates, rebuilds from a clean slate, lints, and verifies all three sample apps in a real browser using the developer's `.env.local` credentials.
metadata:
  version: "1.0"
---

# Update dependencies (local validation)

Run the full dependency-update workflow on the developer's machine and prove that the packages and all three sample apps still work. Stop and report; do not create a changeset or PR unless explicitly asked.

## Prerequisites (verify, don't assume)

- Clean-ish git tree (`git status --short`). Warn if there are unrelated pending changes.
- `.env.local` exists at the repo root with `LOGROCKET_APP_ID`, `HONEYCOMB_API_KEY`, `MIXPANEL_PROJECT_TOKEN` set. `COMMON_ROOM_SITE_ID` is normally **empty** (no sandbox) — that is expected.
- Node `>=24`, pnpm `12.x`.
- For the `all-platforms` sample only: `127.0.0.1 local.workleap.com` in the hosts file, a trusted mkcert CA, and `samples/all-platforms/local.workleap.com*.pem`. If missing, skip all-platforms browser validation and say so (build still validates it).

## Step 1 — Update dependencies

```bash
pnpm update-outdated-deps
```

This runs three sub-steps in order: `pnpm update -r --latest` (respecting the `!eslint !@eslint/js !logrocket-fuzzy-search-sanitizer !typescript` exclusions), `syncpack fix`, then `eslint --fix` on the `package.json` files.

> **Why `typescript` is excluded.** `--latest` used to bump it from `6.x` to `7.x` (the native/Go compiler) every run. `typescript-eslint` does not support the TS 7 API, so ESLint config loading crashed with `TypeError: Cannot read properties of undefined (reading 'Cjs')`, taking out the `eslint --fix` sub-step and `pnpm lint` with it, and the bump had to be reverted by hand each time. The exclusion in the root `package.json` prevents the bump, so that crash no longer occurs through this script. See "Known pins" below.

Check whether anything actually changed:

```bash
git diff --name-only -- '**/package.json' package.json
```

If empty, there are no updates — STOP and report "already up to date".

## Step 2 — Clean reinstall

The developer's flow is a **full reset**, not an in-place install, so the lockfile is regenerated from scratch:

```bash
pnpm reset      # deletes dist, caches, node_modules, and pnpm-lock.yaml
pnpm install
```

If the `eslint --fix` sub-step crashed in Step 1 for any reason, complete it now — this formats the `package.json` files that the crash skipped, so `pnpm lint` won't fail on formatting:

```bash
pnpm run update-outdated-deps:fix-pkg-json
```

## Step 3 — Build

There is **no root `build` script** — `pnpm build` fails. Use:

```bash
pnpm build-pkg   # turbo run build — builds every package AND every sample app
```

All tasks must succeed.

## Step 4 — Lint

```bash
pnpm lint        # turbo: eslint + typecheck (tsgo) + syncpack across the monorepo
```

Must be green. Ignore the benign `React version was set to "detect" ... "react" package is not installed` warnings from the Express/proxy backend packages.

## Step 5 — Test

```bash
pnpm test        # turbo run test --continue
```

All tests must pass. This is a CI gate — skipping it lets a local run go green and then fail CI. If a package fails, run it directly for clearer output: `pnpm --filter <package> test`.

## Step 6 — Validate the sample apps in a browser

Use `agent-browser` (installed as a workspace devDependency). Add `node_modules/.bin` to PATH so `agent-browser` is a bare command, or prefix with `pnpm exec`. Learn commands from its own skill: `agent-browser skills get core --full`. Use `snapshot` (DOM) + `console`; do **not** rely on screenshots.

Validate **each** sample: start its dev server in the background, poll until ready, drive the routes, check the console, then kill the ports.

| Sample | Start command | App URL | Other ports | Routes to check |
|--------|---------------|---------|-------------|-----------------|
| honeycomb/api-key | `pnpm dev-honeycomb-api-key` | `http://localhost:8080` | Express `1234` | `/`, `/movies`, `/subscription` |
| all-platforms | `pnpm dev-all-platforms` | `https://local.workleap.com` (443) | Express `1234`, Mixpanel proxy `5678` (https) | `/`, `/movies`, `/subscription`, `/mixpanel` (+ click a Track button) |
| honeycomb/proxy | `pnpm dev-honeycomb-proxy` | `http://localhost:8080` | Express `1234`, trace proxy `5678` | `/`, `/movies`, `/subscription` |

For each sample:

```bash
# 1. Start (set TURBO_UI=stream so turbo streams instead of using its TUI).
#    Background it; the process is persistent and never exits on its own.
TURBO_UI=stream pnpm dev-<sample> > "$SCRATCH/<sample>.log" 2>&1 &   # or run_in_background

# 2. Poll until ready — no sleeps, no log parsing. Use -k for the HTTPS all-platforms app.
curl [-k] --retry 40 --retry-delay 2 --retry-connrefused --silent --output /dev/null <app-url>
curl --retry 30 --retry-delay 2 --retry-connrefused --silent --output /dev/null http://localhost:1234/api/subscription
# all-platforms only: also wait on the https Mixpanel proxy before clicking a Track button:
#   curl -k --retry 30 --retry-delay 2 --retry-connrefused --silent --output /dev/null https://local.workleap.com:5678

# 3. For each route: open, wait for network idle, snapshot, check console.
agent-browser console --clear
agent-browser open <app-url>/<route>
agent-browser wait --load networkidle
agent-browser snapshot -i -c      # confirm heading + content rendered
agent-browser console             # check for errors
```

Confirm each page renders its heading and content (movies list, subscription details, etc.) and that the platforms initialize in the console (`[logrocket] ... registered`, `[honeycomb] ... registered`, `[mixpanel] ... initialized`). On the all-platforms `/mixpanel` page, click a "Track ..." button and confirm Honeycomb trace links appear in the console (proves traces export).

<!-- Keep the ports/routes table and the ignorable-message list below in sync with
     `.github/prompts/update-dependencies.md` (the CI counterpart) if either changes. -->

### Expected / ignorable console messages (NOT failures)

- `[common-room] Failed to load Common Room script at ".../v1/site//signals.js"` — `COMMON_ROOM_SITE_ID` is empty by design; the empty site id yields a bad URL. Pre-existing, not a regression.
- Network/export errors to `api.honeycomb.io` and OpenTelemetry "dropped span"/"failed export" warnings.
- `[telemetry]`, `[honeycomb]`, `[logrocket]`, `[mixpanel]` verbose logs; rsbuild WebSocket messages; the React DevTools tip.

Treat **any other** `[error]`/uncaught exception as a real failure to diagnose.

### Stop the dev server (Windows)

`lsof`/`fuser` are not available; kill by port with PowerShell:

```powershell
foreach ($port in 8080,1234,5678,443) {
  try { (Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction Stop).OwningProcess |
        Sort-Object -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue } } catch {}
}
```

Then `agent-browser close --all`.

## Handling breaking changes

If build/lint/test/browser validation fails after the update:

1. Read the error; identify the offending package and whether it's a real breaking change.
2. Prefer a clean migration to the new API (edit existing source only — do **not** add polyfills/shims or create new files just for the bump).
3. If it can't be resolved quickly (rule of thumb: > ~3 attempts on one package), **revert that single package to its previous version** across all `package.json` files, note it, and continue with the rest. On CI this opens a GitHub issue; locally, just report it.

## Known pins / recurring reverts

- **`typescript` must stay on `6.x` (currently `6.0.3`).** `typescript-eslint` does not support the native TS 7 compiler yet, which crashes ESLint. This is now enforced by the `!typescript` exclusion on `update-outdated-deps:update-version` in the root `package.json`, so `--latest` no longer re-bumps it and there is nothing to revert by hand.
  (`@typescript/native-preview` / `tsgo` is what actually typechecks — it is fine to bump.)
- `list-outdated-deps` deliberately does **not** carry the `!typescript` filter, so a new TypeScript release still shows up in the report. That is the signal to re-check whether `typescript-eslint` has gained TS 7 support and the hold can be lifted. Tracked in [#220](https://github.com/workleap/wl-telemetry/issues/220).

## Report

Summarize: the deduped list of `name: old → new` version changes (`git diff -- '**/package.json'`), any reverts/pins applied, build/lint (and test) results, and the browser validation outcome per sample (routes checked + console clean aside from the expected messages).
