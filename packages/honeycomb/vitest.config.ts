import { defineConfig } from "vitest/config";

export default defineConfig({
    resolve: {
        // The Honeycomb Web SDK ships an inert build for the "node" export condition. Resolving the "browser"
        // condition loads the real SDK so the tests can validate how the SDK options are honored.
        // The other conditions are the Vite defaults for the web, which this setting replaces.
        conditions: ["browser", "module", "development|production"],
        // The OTLP exporters select their browser build with the legacy "browser" package.json field.
        mainFields: ["browser", "module", "jsnext:main", "jsnext"]
    },
    test: {
        environment: "happy-dom",
        include: ["tests/**/*.test.{ts,tsx}"],
        exclude: ["node_modules", "dist"],
        reporters: "verbose",
        server: {
            deps: {
                // Dependencies loaded by Node instead of Vite ignore the "browser" condition above. The Honeycomb Web SDK
                // and the OTLP exporters it depends on are inlined so their browser builds are used. Otherwise, the SDK
                // uses the Node exporters, which cannot be stubbed with the Fetch API and send real requests.
                inline: [
                    "@honeycombio/opentelemetry-web",
                    /@opentelemetry\/exporter-(logs|metrics|trace)-otlp-http/,
                    /@opentelemetry\/otlp-exporter-base/
                ]
            }
        }
    },
    cacheDir: "./node_modules/.cache/vitest"
});
