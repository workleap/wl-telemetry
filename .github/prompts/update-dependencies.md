# Update Dependencies

You are an automated agent responsible for updating the dependencies and agent skills of this monorepo and validating that everything still works correctly.

## Constraints

- You have a maximum of **10 attempts** to pass all validation steps. If you exhaust all attempts, go to Step 5 (Failure).
- When Step 1 produced dependency changes, you MUST execute every validation step (2a, 2b, 2c, 2d) in order. Do NOT skip any step.
- Do NOT create new source files as part of a dependency update. Only modify existing files when migrating to a newer API.
- Do NOT read `AGENTS.md` or `agent-docs/`.
- Do NOT bump `@opentelemetry/*` packages to OpenTelemetry JS 3.x / `0.300.x` (or `@opentelemetry/api` to `1.10.x`). They are excluded from `update-outdated-deps` until `@honeycombio/opentelemetry-web` supports them; the full lift checklist is under "Known pins" in `.claude/skills/_update-dependencies/SKILL.md`.
- **Avoid rabbit holes**: If you spend more than 3 attempts or 10 tool calls investigating a single issue without progress, stop. Revert the problematic package to its previous version, open an issue, and move on.

---

## Step 1: Update dependencies

Invoke the `_update-dependencies` skill via the `Skill` tool. You are running unattended in CI: never prompt — skip the skill's step-1 prompt entirely and proceed as if neither follow-up was selected (this prompt's Step 2 is the validation). A stop per the skill's own rules ends the skill only — continue here.

Then, check if any `package.json` files were modified:

```bash
git diff --name-only -- '**/package.json' ':!node_modules'
```

If the output is empty, there are no dependency updates. Discard any lockfile re-resolution the update made (`git checkout -- pnpm-lock.yaml`) — it would otherwise reach the PR without being validated. Skip Step 2 and go to Step 3.

Otherwise — including when the skill reported a failure but `package.json` files did change (a partial update, or a pnpm release-age violation) — install the updated dependencies, then continue to Step 2; the validation loop decides what to fix or revert:

```bash
pnpm install --no-frozen-lockfile
```

## Step 2: Validation loop

Run steps 2a through 2d in order. If ANY step fails, diagnose and fix the issue before retrying. Read error messages carefully, inspect failing source code, look up changelogs or migration guides for packages with breaking changes, then apply the fix and restart from Step 2a.

**When fixing breaking changes:**

- Migrate code to use the newer API or pattern introduced by the updated package.
- Do NOT add polyfills, shims, or workarounds for features already available in the runtime.
- Do NOT patch or monkey-patch libraries to suppress errors.
- If a breaking change cannot be resolved by a clean migration, revert that specific package to its previous version, open an issue using the template below, then continue with the remaining updates.

```bash
gh issue create \
  --title "[agent] Failed to update <package-name>" \
  --body "## Failed dependency update

**Package**: \`<package-name>\`
**From**: \`<old-version>\` → **To**: \`<new-version>\`

## Error

<Error messages and which validation step failed>

## What was tried

<Brief description of migration attempts>

## Workflow run

$GITHUB_SERVER_URL/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID"
```

### Step 2a: Linting

```bash
pnpm lint
```

All checks must pass with zero errors.

### Step 2b: Tests

```bash
pnpm test
```

All tests must pass. If a test fails, run the failing package's tests directly (e.g., `pnpm --filter <package> test`) to get clearer output instead of re-running the full suite.

### Step 2c: Validate the "all-platforms" sample app

```bash
pnpm build-all-platforms
```

The build must complete successfully with zero errors. This step validates that all publishable packages (`@workleap/telemetry`, `@workleap/honeycomb`, `@workleap/logrocket`, `@workleap/mixpanel`, `@workleap/common-room`) compile and integrate correctly. Running the dev server is NOT possible for this sample because it requires HTTPS certificates that are not available in CI.

### Step 2d: Validate the "honeycomb/api-key" sample app

Use `agent-browser` for all browser interactions in this step. It is installed as a workspace devDependency. Read the locally installed agent skill at `.agents/skills/agent-browser/` to learn the available commands. **Important**: Do NOT use `agent-browser screenshot` — screenshots are not used by this workflow. Use `agent-browser snapshot` (DOM snapshot) instead. Running a build is NOT sufficient — you must start the dev server and validate in a real browser.

1. Start the dev server in the background using the shell `&` operator (do NOT use `run_in_background: true`): `pnpm dev-honeycomb-api-key > /tmp/honeycomb-dev.log 2>&1 &`
2. The app listens on port **8080** and the Express server on port **1234**. Wait for both to be ready — do NOT use `sleep`, do NOT write polling loops, do NOT parse the log file for a URL. Instead, immediately run: `curl --retry 30 --retry-delay 5 --retry-connrefused --silent --output /dev/null http://localhost:8080 && curl --retry 30 --retry-delay 5 --retry-connrefused --silent --output /dev/null http://localhost:1234/api/subscription`
3. Navigate to the following pages and check that each renders without errors:
   - `/` (Home page)
   - `/movies`
   - `/subscription`
4. For each page, use `agent-browser snapshot` to verify the page rendered content, and use `agent-browser console` to check for console errors. Ignore these specific console messages — they are expected in CI: (1) network errors to `api.honeycomb.io` (trace export failures with the CI dummy API key), (2) OpenTelemetry SDK warnings about dropped spans or failed exports, (3) `[honeycomb]` or `[telemetry]` verbose debug messages. Treat any OTHER console errors as real failures. Do NOT inspect the dev server log file (`/tmp/honeycomb-dev.log`) — only check the browser console.
5. Stop the dev server processes when done: `kill $(lsof -t -i:8080) 2>/dev/null || true; kill $(lsof -t -i:1234) 2>/dev/null || true; fuser -k 8080/tcp 2>/dev/null || true; fuser -k 1234/tcp 2>/dev/null || true`

## Step 3: Update agent skills

Skills are refreshed after validation so their package gates see the final dependency versions (including any package reverted in Step 2).

Use the `Agent` tool to dispatch a subagent with this brief:

> Invoke the `_update-skills` skill via the `Skill` tool; never read-and-inline its SKILL.md. You are running unattended in CI: never prompt. A stop per the skill's own rules -> report it. End your final message with the skill's report.

Keep the skill's report for the PR body. A stop or a failed skill pull does NOT block the dependency PR — report it there instead. Skill files are documentation for agents and need no validation.

If the report lists unexpected paths touched by the installer, discard them (`git checkout -- <path>` for tracked files, `git clean -fd -- <path>` for untracked ones) so they don't land in the PR; mention them in the PR body. Only discard paths under `.agents/` or `.claude/` — never a `package.json`, `pnpm-lock.yaml`, or source file changed in Steps 1–2.

Then check whether anything changed at all:

```bash
git status --porcelain
```

If the output is empty (no dependency updates in Step 1 and no skill updates), STOP immediately. You are done.

## Step 4: Success

All validations passed (or there were no dependency changes to validate).

### 4a: Create a changeset (if needed)

Only include publishable packages (`@workleap/*` or `@workleap-telemetry/*`) whose `dependencies` or `peerDependencies` have actually changed. Do NOT include packages where only `devDependencies` changed — devDependency-only changes do not affect the published package. If no publishable packages qualify (i.e., every change is devDependency-only), skip this step entirely — do NOT create a changeset file.

Create a changeset file at `.changeset/update-deps-<YYYYMMDD-HHMMSS>.md` (use the current UTC date-time to avoid filename collisions with unreleased changesets). Use `patch` as the default bump level, but use your judgment to bump as `minor` or `major` if warranted by the dependency changes.

Example format:

```markdown
---
"@workleap/telemetry": patch
"@workleap/honeycomb": patch
---

Updated dependencies to their latest versions.
```

### 4b: Commit and create pull request

Close any existing open dependency-update PRs before creating a new one:

```bash
gh pr list --search "chore: update dependencies" --state open --json number --jq '.[].number' | xargs -I{} gh pr close {} --comment "Superseded by a newer dependency update run."
```

Then create the new PR with the body described below.

#### How to write the Summary section

Before writing the summary, run `git diff main -- '**/package.json'` to see the actual changes. Then apply these rules:

1. In unified diff output, context lines start with a SPACE character, removed lines start with a single `-`, and added lines start with a single `+`. Only `-` and `+` lines represent actual changes — do NOT include dependencies that only appear on space-prefixed context lines.
2. Deduplicate: list each dependency name + version change only once, even if it appears in multiple package.json files.
3. If a dependency appears in different categories across packages (e.g., peerDependencies in a library and devDependencies in a sample), list all categories it belongs to (e.g., "peerDependencies, devDependencies").
4. Format each as: `package-name`: `old-version` → `new-version` (category), where category is dependencies, peerDependencies, or devDependencies.
5. Sort by category priority: peerDependencies first, then dependencies, then devDependencies. If a dependency belongs to multiple categories, sort it by its highest-priority category.
6. Highlight any peerDependency range narrowing with "(range narrowed — may break consumers)" — these affect consumers.
7. Do NOT mention transitive dependencies (pnpm-lock.yaml only).
8. If Step 1 produced no dependency changes, write "No dependency updates." instead.

#### How to write the Agent skills section

From the `_update-skills` report: list the updated skills, the skipped skills with their lagging package (installed vs latest), any skill whose pulled `SKILL.md` declares `model:` frontmatter, any unexpected path touched by the installer, and any stop or `skills add` failure (with its error). If no skill changed on disk, write "No agent skill updates." followed by any stop or failure.

#### PR body template

```markdown
## Summary

<list the updated dependencies here, following the rules above>

## Agent skills

<summarize the skills update here, following the rules above>

## Validation checklist
- [x] Step 2a: Linting
- [x] Step 2b: Tests
- [x] Step 2c: All-platforms sample app
- [x] Step 2d: Honeycomb API key sample app
```

If Step 2 was skipped (no dependency changes), replace the checklist with "Skipped — no dependency changes to validate."

#### Create the PR

```bash
BRANCH_NAME="agent/update-deps-$(date -u +%Y%m%d-%H%M%S)"
git checkout -b "$BRANCH_NAME"
git add -A
git commit -m "chore: update dependencies"
git push origin "$BRANCH_NAME"

gh pr create \
  --base main \
  --head "$BRANCH_NAME" \
  --title "chore: update dependencies $(date -u +%Y-%m-%d)" \
  --body "<use the PR body template above>"
```

Then STOP. You are done.

## Step 5: Failure

You have exhausted 10 validation attempts. Do NOT create a pull request. Step 3 never ran, so agent skills were not refreshed this run — say so in the issue.

```bash
gh issue create \
  --title "[agent] Cannot update dependencies" \
  --body "<Include: which step(s) failed, error messages, what fixes were attempted, and a link to: $GITHUB_SERVER_URL/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID>"
```

Then STOP. You are done.
