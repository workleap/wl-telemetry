# Contributing

The following documentation is only for the maintainers of this repository.

- [Monorepo setup](#monorepo-setup)
- [Project overview](#project-overview)
- [Installation](#installation)
- [Develop the packages](#develop-the-packages)
- [Release the packages](#release-the-packages)
- [Update the agent skill](#update-the-agent-skill)
- [Available commands](#commands)
- [CI](#ci)
- [Add a new package to the monorepo](#add-a-new-package-to-the-monorepo)

## Monorepo setup

This repository is managed as a monorepo with [PNPM workspace](https://pnpm.io/workspaces) to handle the installation of the npm dependencies and manage the packages interdependencies.

It's important to note that PNPM workspace doesn't hoist the npm dependencies at the root of the workspace as most package manager does. Instead, it uses an advanced [symlinked node_modules structure](https://pnpm.io/symlinked-node-modules-structure). This means that you'll find a `node_modules` directory inside the packages folders as well as at the root of the repository.

The main difference to account for is that the `devDependencies` must now be installed locally in every package `package.json` file rather than in the root `package.json` file.

### Turborepo

This repository uses [Turborepo](https://turbo.build/repo/docs) to execute its commands. Turborepo helps save time with its built-in cache but also ensures the packages' topological order is respected when executing commands.

To be understand the relationships between the commands, have a look at this repository [turbo.json](./turbo.json) configuration file.

## Project overview

This project is split into two major sections, [packages/](./packages) and [samples/](./samples).

### Packages

Under [packages/](./packages/) are the actual telemetry libraries.

### Samples

Under [samples/](samples/) are applications to test the Squide functionalities while developing.

You'll find 3 samples:

- `all-platforms`: A sample application showcasing the integrations of all Workleap's telemetry platforms.
- `honeycomb-api-key`: A sample application authenticating traces with an Honeycomb [API key](https://docs.honeycomb.io/get-started/configure/environments/manage-api-keys/).
- `honeycomb-proxy`: A sample application using a proxy to forward traces to Honeycomb

## Installation

This project uses PNPM workspace, therefore, you must [install PNPM](https://pnpm.io/installation):

To install the project, open a terminal at the root of the workspace and execute the following command:

```bash
pnpm install
```

### Setup environment variables

Ids, keys and tokens must set to send data to the different development environment of the telemetry platforms.

First, create a file named `.env.local` at the root of the workspace:

```
workspace
├── package.json
├── .env.local
```

Then, add the following key/values to the newly created `.env.local` file:

- `LOGROCKET_APP_ID`: The application id of the `frontend-platform-team-dev` LogRocket project.
- `HONEYCOMB_API_KEY`: The API key of the `frontend-platform-team-dev` Honeycomb environment.
- `MIXPANEL_PROJECT_TOKEN`: The token of the `Frontend-Platform-Team-Dev` Mixpanel project.
- `COMMON_ROOM_SITE_ID`: The site id of the `Workleap` room. We don't have any sandbox environment at the moment.

> [!NOTE]
> The `.env.local` file is configured to be ignored by Git and will not be pushed to the remote repository.

### Setup hostname and SSL certificates

Because [Common Room](https://www.commonroom.io/) filters out traces that are not bound to `*.workleap.com`, the [all-platforms](./samples/all-platforms/) sample app and servers are set up with a custom hostname and are on "https".

#### Windows

##### Hostname

First, set up the custom hostname by adding an entry into the `C:\Windows\System32\drivers\etc\hosts` file for `local.workleap.com`:

```
# Copyright (c) 1993-2009 Microsoft Corp.
#
# This is a sample HOSTS file used by Microsoft TCP/IP for Windows.
#
# This file contains the mappings of IP addresses to host names. Each
# entry should be kept on an individual line. The IP address should
# be placed in the first column followed by the corresponding host name.
# The IP address and the host name should be separated by at least one
# space.
#
# Additionally, comments (such as these) may be inserted on individual
# lines or following the machine name denoted by a '#' symbol.
#
# For example:
#
#      102.54.94.97     rhino.acme.com          # source server
#       38.25.63.10     x.acme.com              # x client host

# localhost name resolution is handled within DNS itself.
#	127.0.0.1       localhost
#	::1             localhost

127.0.0.1 local.workleap.com
```

##### Generate a local certificate

Then, install [mkcert](https://github.com/FiloSottile/mkcert) using [Chocolatey](https://chocolatey.org/) if it's not already installed. Open a terminal **as an administrator** and execute the following command:

```bash
choco install mkcert
```

Then, using the same terminal, install a local CA in the system trust store using `mkcert`:

```bash
mkcert -install
```

Finally, navigate to the [samples/all-platforms](./samples/all-platforms/) folder of this repository and execute the following command to generate the certificate:

```bash
mkcert local.workleap.com
```

That's it! You can test your setup by opening a [VSCode terminals](https://code.visualstudio.com/docs/terminal/basics#_managing-multiple-terminals) and starting the [all-platforms](./samples/all-platforms/) sample:

```bash
pnpm dev-all-platforms
```

#### Unix

TBD

### Setup Retype

[Retype](https://retype.com/) is the documentation platform that this repository is using for its documentation. As this project is leveraging a few [Pro features](https://retype.com/pro/) of Retype.

Everything should work fine as-is but there are a few limitations to use Retype Pro features without a wallet with a licence. If you want to circumvent these limitations, you can optionally, setup your [Retype wallet](https://retype.com/guides/cli/#retype-wallet).

To do so, first make sure that you retrieve the Retype license from your Vault (or ask IT).

Then, open a terminal at the root of the workspace and execute the following command:

```bash
npx retype wallet --add <your-license-key-here>
```

## Develop the packages

Open a [VSCode terminals](https://code.visualstudio.com/docs/terminal/basics#_managing-multiple-terminals) and start one of the sample applications with either of the following scripts:

```bash
pnpm dev-all-platforms
```

```bash
pnpm dev-honeycomb-api-key
```

```bash
pnpm dev-honeycomb-proxy
```

You can then open your favorite browser and navigate to `http://localhost:8080/` to get a live preview of your code.

### LogRocket

The sample applications' telemetry data is sent to the `frontend-platform-team-dev` project in LogRocket.

### Honeycomb

Depending on the sample application, traces are sent to the corresponding project within the `frontend-platform-team-dev` environment in Honeycomb:

- `all-platforms`: `all-platforms-sample`
- `honeycomb-api-key`: `honeycomb-api-key-sample`
- `honeycomb-proxy`: `honeycomb-proxy-sample`

### Mixpanel

The sample applications' telemetry data is sent to the `Frontend-Platform-Team-Dev` project in Mixpanel.

### Common Room

The sample applications' data is sent to the `Workleap` room in Common Room.

To view the data, go the `Activity` page, remove all the default filters and look for any entry matching the email address or name you used to identified the session.

> [!WARNING]  
> It can take up to 10 minutes before the activity data is visible in Common Room.

## Release the packages

When you are ready to release the packages, you must follow the following steps:
1. Run `pnpm changeset` and follow the prompt. For versioning, always follow the [SemVer standard](https://semver.org/).
2. Commit the newly generated file in your branch and submit a new Pull Request(PR). Changesets will automatically detect the changes and post a message in your pull request telling you that once the PR closes, the versions will be released.
3. Find someone to review your PR.
4. Merge the Pull request into `main`. A GitHub action will automatically trigger and update the version of the packages and publish them to [npm](https://www.npmjs.com/). A tag will also be created on GitHub tagging your PR merge commit.

### Troubleshooting

#### GitHub

Make sure you're Git is clean (No pending changes).

#### npm

Make sure GitHub Action has **write access** to the selected npm packages.

#### Compilation

If the packages failed to compile, it's easier to debug without executing the full release flow every time. To do so, instead, execute the following command:

```bash
pnpm build
```

By default, packages compilation output will be in their respective *dist* directory.

## Update the agent skill

By default, the [sync-agent-skill](.github/workflows/sync-agent-skill.yml) workflow updates the skill automatically. If changes are required, it opens a pull request with the appropriate modifications.

If the workflow does not behave as expected, the simplest way to update an agent skill is to use an agent:

1. Start your preferred agent.
2. Copy the content of [UPDATE_SKILL.md](./prompts/UPDATE_SKILL.md) into the agent prompt.
3. Commit the changes and merge the pull request.

NOTE: Skills installed using [skills.sh](https://skills.sh/) are sourced directly from the repository files. Merging the pull request is therefore sufficient to update the installed skill.

## Commands

From the project root, you have access to many commands the main ones are:

### dev-all-platforms

Build the all-platforms sample application for development and start the dev servers.

```bash
pnpm dev-all-platforms
```

### dev-honeycomb-api-key

Build the honeycomb-api-key sample application for development and start the dev servers.

```bash
pnpm dev-honeycomb-api-key
```

### dev-honeycomb-proxy

Build the honeycomb-proxy sample application for development and start the dev servers.

```bash
pnpm dev-honeycomb-proxy
```

### dev-docs

Start the [Retype](https://retype.com/) dev server. If you are experiencing issue with the license, refer to the [setup Retype section](#setup-retype).

```bash
pnpm dev-docs
```

### build-pkg

Build the packages for release.

```bash
pnpm build-pkg
```

### build-all-platforms

Build the all-platforms sample application for release.

```bash
pnpm build-all-platforms
```

### build-honeycomb-api-key

Build the honeycomb-api-key sample application for release.

```bash
pnpm build-honeycomb-api-key
```

### build-honeycomb-proxy

Build the honeycomb-proxy sample application for release.

```bash
pnpm build-honeycomb-proxy
```

### serve-all-platforms

Build the all-platforms sample application for deployment and start a local web server to serve the application.

```bash
pnpm serve-all-platforms
```

### serve-honeycomb-api-key

Build the honeycomb-api-key sample application for deployment and start a local web server to serve the application.

```bash
pnpm serve-honeycomb-api-key
```

### serve-honeycomb-proxy

Build the honeycomb-proxy sample application for deployment and start a local web server to serve the application.

```bash
pnpm serve-honeycomb-proxy
```

### lint

Lint the packages files.

```bash
pnpm lint
```

### test

Run the packages unit tests.

```bash
pnpm test
```

### changeset

To use when you want to publish a new package version. Will display a prompt to fill in the information about your new release.

```bash
pnpm changeset
```

### clean

Clean the shell packages (delete `dist` folder, clear caches, etc..)

```bash
pnpm clean
```

### reset

Reset the monorepo installation (delete `dist` folders, clear caches, delete `node_modules` folders, etc..)

```bash
pnpm reset
```

### list-outdated-deps

Checks for outdated dependencies. For more information, view [PNPM documentation](https://pnpm.io/cli/outdated).

```bash
pnpm list-outdated-deps
```

### update-outdated-deps

Updated outdated dependencies to their latest version. For more information, view [PNPM documentation](https://pnpm.io/cli/update).

```bash
pnpm update-outdated-deps
```

## Workflows

The following workflows are available with GitHub:

| Workflow | File | Trigger | Purpose |
|----------|------|---------|---------|
| CI | `.github/workflows/ci.yml` | Push to main, PRs | Build, lint, typecheck, test |
| Changeset | `.github/workflows/changeset.yml` | Push to main | Version bumps and npm publish |
| PR packages | `.github/workflows/pr-pkg.yml` | PRs | Publish preview packages |
| Update dependencies | `.github/workflows/update-dependencies.yml` | Weekly (Tue 14:00 UTC) | Automated dependency updates |
| Code review | `.github/workflows/code-review.yml` | PRs | Automated code review |
| Claude | `.github/workflows/claude.yml` | @claude mentions | Interactive AI assistance |
| Sync agent skill | `.github/workflows/sync-agent-skill.yml` | Push to main (docs/) | Sync telemetry skill with docs |
| Retype | `.github/workflows/retype-action.yml` | Push to main, PRs | Build and deploy documentation site |
| Audit monorepo | `.github/workflows/audit-monorepo.yml` | First day of month | Best practices audit |

## CI

We use [GitHub Actions](https://docs.github.com/en/actions) for this repository.

You can find the configuration is in the `.github/workflows` folder and the build results are available [here](https://github.com/workleap/wl-web-configs/actions).

We currently have 2 builds configured:

### Changesets

This action runs on a push on the `main` branch. If there is a file present in the `.changeset` folder, it will publish the new package version on npm.

### CI

This action will trigger when a commit is done in a PR to `main` or after a push to `main`. The action will run `build`, `lint` and `test` commands on the source code.

### Retype

This action will trigger when a commit is done in a PR to `main` or after a push to `main`. The action will generate the documentation website into the `retype` branch. This repository [Github Pages](https://github.com/workleap/wl-telemetry/settings/pages) is configured to automatically deploy the website from the `retype` branch.

## Add a new package to the monorepo

There are a few steps to add new packages to the monorepo.

Before you add a new package, please read the [Workleap GitHub guidelines](https://github.com/workleap/github-guidelines#npm-package-name).

### Create the package

First, create a new folder matching the package name in the [packages](/packages) directory.

Open a terminal, navigate to the newly created directory, and execute the following command:

```bash
pnpm init
```

Answer the CLI questions.

Once the *package.json* is generated, please read again the [Workleap GitHub guidelines](https://github.com/workleap/github-guidelines#npm-package-name) and make sure the package name, author and license are valid.

Don't forget to add the [npm scope](https://docs.npmjs.com/about-scopes) *"@workleap"* before the package name. For example, if the project name is "foo", your package name should be "@workleap/foo".

Make sure the package publish access is *public* by adding the following to the *package.json* file:

```json
{
  "publishConfig": {
    "access": "public"
  }
}
```

### Dependencies

npm *dependencies* and *peerDependencies* must be added to the package own *package.json* file.
