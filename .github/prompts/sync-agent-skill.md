# Sync Workleap Telemetry Skill

You are an automated agent responsible for keeping the `workleap-telemetry` agent skill in sync with the documentation in `./docs`.

## Constraints

When updating the skill:

- Do NOT change the format of existing skill files.
- You MAY create new `references/*.md` files when new content does not fit any existing reference file.
- Do NOT embed metadata in skill files.
- Do NOT add "Sources:" lines to skill files.
- Do NOT create or modify any files outside `agent-skills/workleap-telemetry/`.
- Do NOT use TodoWrite, TaskCreate, or any task tracking tools.
- Never update a versioned skill. You can identify a versioned skill with its folder name pattern, e.g. `workleap-telemetry-v*`.
- Never change skill content unless you can point to a specific line in `./docs` that contradicts the current skill text. If you cannot identify the exact discrepancy, do not touch the content.
- The SKILL.md body must stay under ~250 lines. New API content goes in the appropriate `references/` file, not in the body. Only add to the body if the content is a critical pattern that agents need in nearly every conversation.

## Excluded docs

The following docs are **not** part of the skill and must be ignored:

- `docs/updating/` — migration guides
- `docs/standalone-libraries/` — standalone packages (skill covers the umbrella package only)
- `docs/reference/common-room/` — separate tool not part of the umbrella package
- `docs/introduction/use-with-agents.md` — meta-doc about using the skill itself
- `docs/static/` — images and assets
- Site configuration files: `index.yml`, `default.md`, `about.md`, `samples.md`

All other `.md` files under `docs/` are in scope.

## Docs-to-skill file routing

Use this table to determine which skill file to update when a doc change is found:

| Skill file | Docs |
|---|---|
| `SKILL.md` | `docs/introduction/getting-started.md`, `docs/introduction/use-correlation-values.md` |
| `references/api.md` | `docs/reference/telemetry/*`, `docs/reference/LogRocketLogger.md` |
| `references/integrations.md` | `docs/introduction/learn-honeycomb/*`, `docs/introduction/learn-logrocket/*`, `docs/introduction/learn-mixpanel/*` |
| `references/examples.md` | `docs/introduction/setup-project.md`, `docs/guides/*` |

If a doc does not match any row above, use your best judgment to route it to the most relevant skill file. Always respect the "Excluded docs" section — never sync content from excluded paths.

---

## Step 1: Update skill

Review the existing `workleap-telemetry` skill in `./agent-skills/workleap-telemetry/` and make sure that all API definitions and examples match the current documentation available in `./docs`. Use the routing table above to determine which skill file to update. Ignore any docs listed in the "Excluded docs" section.

## Step 2: Check for changes

After updating the skill, check whether any files were actually modified:

```bash
git diff --name-only HEAD -- agent-skills/workleap-telemetry/
git ls-files --others --exclude-standard -- agent-skills/workleap-telemetry/
```

If both commands produce empty output (no changes at all), STOP immediately. Print "No skill changes needed — skill is already in sync." You are done.

## Step 3: Validate

Spawn a subagent with the `Task` tool using the **opus** model to validate the updated skill with a fresh context. The subagent validates from two angles: (1) can the skill answer key questions, and (2) are the API signatures and examples factually correct compared to the actual docs.

Use the following prompt for the subagent:

> You are a validator for the `workleap-telemetry` agent skill. Your job is to verify both **coverage** and **accuracy**.
>
> ## Part A — Coverage
>
> Read all files in `./agent-skills/workleap-telemetry/`. Using ONLY those files, determine whether the skill can adequately answer each question below. For each, respond PASS or FAIL with a brief explanation.
>
> 1. What is `@workleap/telemetry` and what problems does it solve?
> 2. How do you initialize telemetry in a frontend application using `initializeTelemetry`?
> 3. What is `productFamily` and what values are valid (`"wlp"`, `"sg"`)?
> 4. How does automatic correlation work across Honeycomb, LogRocket, and Mixpanel?
> 5. What are Telemetry Id and Device Id, and how are they propagated?
> 6. How do you configure Honeycomb tracing and what is automatically instrumented?
> 7. How do you add custom Honeycomb spans and attributes using OpenTelemetry?
> 8. How do you configure LogRocket session replay?
> 9. What privacy controls does LogRocket provide (`data-public`/`data-private`)?
> 10. How do you identify users in LogRocket using trait helpers?
> 11. How do you configure Mixpanel analytics?
> 12. How do you track custom events in Mixpanel?
> 13. How do you use `MixpanelPropertiesProvider` for scoped properties?
> 14. What React hooks are available (`useTelemetryClient`, `useHoneycombInstrumentationClient`, `useLogRocketInstrumentationClient`, `useMixpanelClient`)?
> 15. How do you set up `NoopTelemetryClient` for Storybook and tests?
> 16. How do you configure `LogRocketLogger` for diagnostic logging?
> 17. What is `TelemetryProvider` and how is it used in React?
> 18. How do you troubleshoot missing or inconsistent telemetry?
>
> ## Part B — Accuracy
>
> Now read all `.md` files under `./docs/`, excluding the paths listed in the "Excluded docs" section. For each code example and API signature in the skill files, verify it matches the docs. Report any discrepancies: wrong parameter names, missing arguments, incorrect types, outdated patterns.
>
> ## Output
>
> End with:
> - `COVERAGE: X/18 PASSED`
> - `ACCURACY: list of discrepancies (or "No discrepancies found")`

If any coverage question is marked FAIL or accuracy discrepancies are found, go back to Step 1 and fix the gaps. Retry at most 3 times. If validation passes, proceed to Step 4. If validation still fails after 3 retries, proceed to Step 4 anyway but include the unresolved issues in the PR (see Step 4c).

## Step 4: Success

### 4a: Increment version

Read the `metadata.version` field in the YAML frontmatter of `agent-skills/workleap-telemetry/SKILL.md`. Increment the **minor** part of the version (e.g., `3.2` → `3.3`, `5.3` → `5.4`). Update the file with the new version.

### 4b: Create branch and commit

```bash
BRANCH_NAME="agent/skill-sync-$(date -u +%Y%m%d-%H%M%S)-$(git rev-parse --short HEAD)"
git checkout -b "$BRANCH_NAME"
git add agent-skills/workleap-telemetry/
git commit -m "chore(skill): sync workleap-telemetry skill with docs [skip ci]"
git push origin "$BRANCH_NAME"
```

### 4c: Create pull request

If validation passed cleanly:

```bash
gh pr create \
  --base main \
  --head "$BRANCH_NAME" \
  --title "chore(skill): sync workleap-telemetry skill" \
  --body "## Summary

<Write a short summary of what was updated in the skill>"
```

If validation still had failures after 3 retries, create the PR anyway but include a warnings section:

```bash
gh pr create \
  --base main \
  --head "$BRANCH_NAME" \
  --title "chore(skill): sync workleap-telemetry skill" \
  --body "## Summary

<Write a short summary of what was updated in the skill>

## ⚠️ Validation Warnings

The following issues could not be resolved after 3 retries:

<List the failed coverage questions and/or accuracy discrepancies>"
```

Then STOP. You are done.
