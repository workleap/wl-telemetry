import { defineConfig } from "oxlint";

export default defineConfig({
    // Vendored agent skills are replaced wholesale on update, and the Retype docs hold no lintable code.
    ignorePatterns: [".claude/**", "agent-skills/**", "docs/**", "**/dist/**"],
    // Setting `plugins` overwrites oxlint's default plugin set (eslint, typescript, unicorn, oxc),
    // so the defaults must be listed explicitly alongside the extras we want enabled.
    plugins: ["eslint", "typescript", "unicorn", "oxc", "react", "import", "jsx-a11y", "promise", "vitest"],
    // Type-aware rules run through oxlint-tsgolint.
    options: { typeAware: true },
    categories: {
        suspicious: "warn",
        perf: "warn"
    },
    rules: {
        "oxc/no-barrel-file": "warn",
        // It replaces a spread by Object.assign which often breaks the behavior since it update the source object rather than cloning.
        "oxc/no-map-spread": "off",
        // Express 5 forwards rejected promises from async handlers to the error handler.
        "oxc/no-async-endpoint-handlers": "off",
        "unicorn/consistent-function-scoping": "off",
        "eslint/array-callback-return": "warn",
        "eslint/curly": "warn",
        "eslint/eqeqeq": ["warn", "smart"],
        "eslint/no-caller": "warn",
        "eslint/no-console": "off",
        "eslint/no-eval": "warn",
        "eslint/no-extend-native": "warn",
        "eslint/no-extra-bind": "warn",
        "eslint/no-lone-blocks": "warn",
        "eslint/no-loop-func": "warn",
        "eslint/no-new-wrappers": "warn",
        "eslint/no-param-reassign": "warn",
        "eslint/no-script-url": "warn",
        "eslint/no-self-compare": "warn",
        "eslint/no-sequences": "warn",
        "eslint/no-template-curly-in-string": "warn",
        "eslint/no-throw-literal": "warn",
        // Leading underscores are intentional: `__resetRegistrationGuard` test hooks and OpenTelemetry's `_attributes`.
        "eslint/no-underscore-dangle": "off",
        "eslint/no-unneeded-ternary": "warn",
        "eslint/no-useless-computed-key": "warn",
        "eslint/no-useless-concat": "warn",
        "eslint/no-useless-constructor": "warn",
        "eslint/no-useless-rename": "warn",
        "eslint/no-var": "warn",
        "eslint/prefer-const": "warn",
        "import/no-cycle": "warn",
        "import/no-duplicates": "warn",
        "import/no-self-import": "warn",
        "import/no-unassigned-import": "off",
        "react/button-has-type": "warn",
        "react/jsx-key": "warn",
        "react/jsx-no-constructed-context-values": "warn",
        "react/jsx-no-duplicate-props": "warn",
        "react/no-array-index-key": "warn",
        "react/react-in-jsx-scope": "off",
        "react/rules-of-hooks": "warn",
        "react/exhaustive-deps": "warn",
        // Flags render-time impurities as React Compiler bailouts, but the samples don't use the React Compiler.
        "react/purity": "off",
        "react-perf/jsx-no-new-function-as-prop": "off",
        "typescript/consistent-type-imports": "warn",
        "typescript/no-import-type-side-effects": "error",
        "typescript/no-explicit-any": "warn",
        "typescript/no-unsafe-type-assertion": "off",
        "typescript/consistent-return": "off",
        "typescript/no-misused-promises": ["warn", { checksVoidReturn: { attributes: false } }],
        "typescript/return-await": "warn",
        // A `default` branch is a deliberate catch-all; only a switch that can fall through is a finding.
        "typescript/switch-exhaustiveness-check": ["warn", { considerDefaultExhaustiveForUnions: true }],
        "typescript/use-unknown-in-catch-callback-variable": "warn",
        "jsx-a11y/no-autofocus": "off",
        // Requires a type parameter on every vi.fn(); the inferred types are good enough for these tests.
        "vitest/require-mock-type-parameters": "off"
    },
    overrides: [
        {
            // The packages' public entry points are barrels by design.
            files: ["packages/*/src/**/index.ts"],
            rules: {
                "oxc/no-barrel-file": "off"
            }
        },
        {
            files: ["*.test.ts", "*.test.tsx"],
            rules: {
                "jest/no-conditional-expect": "off",
                "vitest/no-conditional-expect": "off",
                "typescript/no-explicit-any": "off",
                // `expect(spy.method)` reads the method unbound by design.
                "typescript/unbound-method": "off"
            }
        }
    ]
});
