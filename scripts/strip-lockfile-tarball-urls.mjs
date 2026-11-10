// Dependencies are installed through the gsoft GitHub package firewall (see .npmrc). The firewall metadata points
// tarballs at registry.npmjs.org, so every lockfile re-resolution writes a direct "tarball: https://registry.npmjs.org/..."
// URL into each lockfile entry. Frozen installs would then download from npmjs and bypass the firewall.
//
// Runs as the root "postinstall" script to strip those URLs after every install or update.
// With "--check", fails instead when the lockfile contains such a URL (used by CI).

import { readFileSync, writeFileSync } from "node:fs";

const LockfilePath = new URL("../pnpm-lock.yaml", import.meta.url);
const TarballUrlRegex = /, tarball: https:\/\/registry\.npmjs\.org\/[^}]*\}/g;

const content = readFileSync(LockfilePath, "utf8");
const stripped = content.replace(TarballUrlRegex, "}");

if (stripped !== content) {
    if (process.argv.includes("--check")) {
        console.error('pnpm-lock.yaml contains registry.npmjs.org tarball URLs, which bypass the package firewall. Run "pnpm install" to strip them.');
        process.exit(1);
    }

    writeFileSync(LockfilePath, stripped);
    console.log("Stripped registry.npmjs.org tarball URLs from pnpm-lock.yaml.");
}
