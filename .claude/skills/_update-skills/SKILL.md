---
name: update-skills
description: Refresh installed agent skills, but only when the matching monorepo package is on the latest minor (patch ignored). Skills with no package gate are always eligible.
model: sonnet
effort: medium
metadata:
  internal: true
---

# Update Skills

Re-pull each skill listed in `skills-lock.json` whose upstream moved, but only when the matching package in the repo's `package.json` files is on the latest `major.minor`, and only past the cooldown. Print the eligibility table before running anything; on lag, skip + warn (never auto-bump deps).

## Cooldown

Nothing is installed until it has sat unchanged upstream for 7 days: a skill's folder, and the `skills` CLI release that installs it. Step 2's listing applies the cooldown and offers what cleared it as `cli` and, per skill, `latest` — the only version and the only commit a command takes.

## Skills

Every skill lives in `.claude/skills/<name>` only; `.agents/` must not exist, because pnpm would also link package skills into it. Every command passes `-a claude-code`, so the CLI writes only that folder, and `--copy`: the CLI's default is a symlink with an absolute path, which breaks on every other machine. `<cli>` and `<latest>` are the listing's. A command names the skill's own folder at `<latest>`: the folder is what cooled, and `--skill` alone installs the first skill of that name anywhere in the repo. Only `workleap-*` skills use `--full-depth`.

Skills that a dependency ships for pnpm (approved under `permissions` in `pnpm-workspace.yaml`: `agent-browser`, `workleap-logging` and the `workleap-*-config(s)` skills) are linked into `.claude/skills/` by `pnpm install` and listed in the `# pnpm` block of `.claude/skills/.gitignore`. They are out of scope: never install them with the skills CLI.

| Skill | Package gate (grep all `package.json`) | Update command |
|---|---|---|
| `accessibility` | — | `pnpm dlx skills@<cli> add https://github.com/addyosmani/web-quality-skills/tree/<latest>/skills/accessibility --skill accessibility -a claude-code --copy -y` |
| `best-practices` | — | `pnpm dlx skills@<cli> add https://github.com/addyosmani/web-quality-skills/tree/<latest>/skills/best-practices --skill best-practices -a claude-code --copy -y` |
| `git-commit` | — | `pnpm dlx skills@<cli> add https://github.com/github/awesome-copilot/tree/<latest>/skills/git-commit --skill git-commit -a claude-code --copy -y` |
| `pnpm` | — | `pnpm dlx skills@<cli> add https://github.com/antfu/skills/tree/<latest>/skills/pnpm --skill pnpm -a claude-code --copy -y` |
| `turborepo` | `turbo` | `pnpm dlx skills@<cli> add https://github.com/vercel/turborepo/tree/<latest>/skills/turborepo --skill turborepo -a claude-code --copy -y` |
| `vitest` | `vitest` | `pnpm dlx skills@<cli> add https://github.com/antfu/skills/tree/<latest>/skills/vitest --skill vitest -a claude-code --copy -y` |
| `workleap-react-best-practices` | — | `pnpm dlx skills@<cli> add https://github.com/workleap/wl-web-configs/tree/<latest>/agent-skills/workleap-react-best-practices --skill workleap-react-best-practices -a claude-code --copy --full-depth -y` |

## Process

### 0. Audit drift

First, `.agents/` must not exist → otherwise **stop**. Print `.agents/ exists — move its skills to .claude/skills/ and delete it, then re-run.`

Then compare three sets: the keys of `skills-lock.json`, the folders in `.claude/skills/`, and the `Skill` column above. Filter out of the folders the `_`-prefixed ones (project-local skills, not `skills add` installs) and the skills listed in the `# pnpm` block of `.claude/skills/.gitignore` (package skills linked by pnpm, if any).

- Lock entry or folder present, no table row → **stop**. Print `unknown skill "<name>" — add a row to SKILL.md and re-run.`
- Table row present, no lock entry or folder → **stop**. Print `stale row "<name>" — remove the row or reinstall the skill, then re-run.`

Only proceed once the sets match exactly.

### 1. Read installed versions

For each gated skill, grep every `package.json` under the repo (root, `packages/*`, `samples/**`, excluding `node_modules`) for the listed package name(s) and collect every **pinned** (exact) version. A gate with no pinned occurrence -> `SKIP` with that reason. Ignore ranges (`^`, `~`, `workspace:`): published packages declare `^` ranges on `dependencies`/`peerDependencies` as a consumer contract (see `.syncpackrc.js`), while devDependencies and samples are pinned and reflect what's actually installed. For dynamic gates (`@workleap/*-configs`), grep the scope/suffix — the table names the pattern, not the full set.

### 2. Fetch latest versions

For each unique package: `pnpm view <package> version`. Parallelize.

List `cli` and each skill's `pinned`, `latest` and `settled`:

```
node .claude/skills/_update-skills/scripts/listSkillPins.ts
```

A non-zero exit → **stop** and print its message.

### 3. Compute eligibility

For each gated package: extract `major.minor` from installed vs latest (ignore patch and prereleases) → `current` or `lagging`. A skill is eligible only if every mapped package is `current` **and** every pinned occurrence across the repo matches. Untied skills (`—` gate) are always eligible.

An eligible skill then takes the listing's verdict:

- `settled: false` → `WAIT`: still in cooldown, no `latest` yet.
- `latest` equals `pinned` → `UNCHANGED`: no pull.
- otherwise → `UPDATE`.

A gate excluded from `update-outdated-deps` (the `!…` filters in the root `package.json`) lags by design — its `SKIP` is expected; say so in the details.

### 4. Print eligibility table

Print before running anything. Use `UPDATE`, `UNCHANGED`, `WAIT` or `SKIP` (gated package lagging).

```
skill                          | status     | details
turborepo                      | UPDATE     | turbo 2.11.9 vs latest 2.11.12 (minor matches); b19f6a5 -> 4c1d2e9
accessibility                  | UNCHANGED  | no package gate; pinned c6b06ad is latest
git-commit                     | WAIT       | no package gate; in cooldown
vitest                         | SKIP       | vitest lagging: 5.0.5 vs latest 5.1.0
...
```

### 5. Run updates

Run the matching command from the table for each `UPDATE` row, `<cli>` and the full 40-character `<latest>` filled in, sequentially — the skill installer mutates `skills-lock.json` and a shared store. The CLI rewrites `skills-lock.json` (2-space indent); that's expected — the file is ignored by oxfmt.

A pull is done when the skill's `skills-lock.json` entry carries `latest` as its `ref`, under the `skillPath` it had; any other outcome is a failed `skills add`. The CLI release changes from one run to the next, so the checks below are what catches a change to its install defaults.

Before each pull, capture `git status --porcelain` as a baseline — the tree may already hold dependency edits or earlier skill pulls. After each pull:

- Diff `git status --porcelain` against that baseline; any path the pull introduced outside the skill's folders and `skills-lock.json` (e.g. a new `.agents/` folder) is unexpected — flag it in the report; never delete it yourself. Paths already in the baseline are never unexpected.
- Grep the skill's new `SKILL.md` frontmatter for `model:`. An upstream-added override switches the conversation model mid-turn for whatever invokes the skill — flag it in the report; never strip it yourself.

### 6. Report

- Skills updated (count + list, each with `<source>` and its pin move `<old commit> -> <new commit>`; note which ones actually changed on disk)
- Skills unchanged
- Skills in cooldown
- Skills skipped (with the lagging package: installed vs latest)
- Skills whose pulled `SKILL.md` declares `model:` frontmatter
- Unexpected paths touched by the installer
- Any `skills add` failures (full error)
