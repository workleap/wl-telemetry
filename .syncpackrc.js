// @ts-check

/** @type {import("syncpack").RcFile} */
export default {
    "lintFormatting": false,
    "semverGroups": [
        {
            // Only the version "0.0.2" of the dependency seems to work.
            "packages": ["@workleap/*"],
            "dependencies": ["logrocket-fuzzy-search-sanitizer"],
            "isIgnored": true
        },
        {
            "packages": ["@workleap/*"],
            "dependencyTypes": ["prod", "peer"],
            "range": "^",
            "label": "Packages should use ^ for dependencies and peerDependencies."
        },
        {
            "packages": ["@workleap/*"],
            "dependencyTypes": ["dev"],
            "range": "",
            "label": "Packages should pin devDependencies."
        },
        {
            "packages": ["@all-platforms/*", "@honeycomb-api-key/*", "@honeycomb-proxy/*"],
            "dependencyTypes": ["prod", "dev"],
            "range": "",
            "label": "Samples should pin dependencies and devDependencies."
        },
        {
            "packages": ["workspace-root"],
            "dependencyTypes": ["dev"],
            "range": "",
            "label": "Workspace root should pin devDependencies."
        }
    ],
    "versionGroups": [
        {
            // "react" and "react-dom" declares ranges to support React 18 and 19.
            // It's messing up with syncpack.
            "packages": [
                "@workleap/telemetry",
                "@workleap/logrocket",
                "@workleap/honeycomb",
                "@workleap/mixpanel",
                "@workleap/common-room"
            ],
            "dependencies": ["react", "react-dom"],
            "dependencyTypes": ["peer"],
            "isIgnored": true
        },
        {
            "packages": ["**"],
            "dependencyTypes": ["prod", "dev", "peer"],
            "preferVersion": "highestSemver",
            "label": "Packages should have a single version across the repository."
        }
    ]
};
