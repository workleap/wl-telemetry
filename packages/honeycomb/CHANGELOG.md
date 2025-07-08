# @workleap/honeycomb

## 5.2.1

### Patch Changes

- [#59](https://github.com/workleap/wl-honeycomb-web/pull/59) [`b2cba06`](https://github.com/workleap/wl-honeycomb-web/commit/b2cba06bf5dbb70fdcfc53fbc4bfb3d55b14967c) Thanks [@patricklafrance](https://github.com/patricklafrance)! - Renamed {id} for {shortid}

## 5.2.0

### Minor Changes

- [#57](https://github.com/workleap/wl-honeycomb-web/pull/57) [`ae5c0d2`](https://github.com/workleap/wl-honeycomb-web/commit/ae5c0d209ca8222c242d35fad18f0f95cd6ad3ba) Thanks [@patricklafrance](https://github.com/patricklafrance)! - Added a templated `http.router` attribute to Fetch and XHR requests. The goal of this attribute is to generalized the URLs used for Honeycomb's Launchpad features like ""slowest requests by endpoint" and "pages with most events".

## 5.1.1

### Patch Changes

- [#53](https://github.com/workleap/wl-honeycomb-web/pull/53) [`a750cd2`](https://github.com/workleap/wl-honeycomb-web/commit/a750cd2366c767cadabe191a04727fb02b51ecbd) Thanks [@patricklafrance](https://github.com/patricklafrance)! - Normalizing HTTP attributes for good.

## 5.1.0

### Minor Changes

- [#51](https://github.com/workleap/wl-honeycomb-web/pull/51) [`9fabcf3`](https://github.com/workleap/wl-honeycomb-web/commit/9fabcf3692c13295d24b30a660f58c7f16671c41) Thanks [@patricklafrance](https://github.com/patricklafrance)! - - Added a session id span attribute (`app.session.id`) to correlate anonynous and authenticated traces.
  - Normalized a few of open telemetry http span attributes. Related to https://github.com/workleap/wl-honeycomb-web/issues/37.

## 5.0.2

### Patch Changes

- [#49](https://github.com/workleap/wl-honeycomb-web/pull/49) [`3e83452`](https://github.com/workleap/wl-honeycomb-web/commit/3e83452029427013f4f34c371d342f3786b4e703) Thanks [@patricklafrance](https://github.com/patricklafrance)! - Fix release v5.0.1.

## 5.0.1

### Patch Changes

- [#48](https://github.com/workleap/wl-honeycomb-web/pull/48) [`0d19b7f`](https://github.com/workleap/wl-honeycomb-web/commit/0d19b7f1cacbcfb3eac1afe6aba7d9e24b9c05ef) Thanks [@patricklafrance](https://github.com/patricklafrance)! - The fetch request hook pipeline can now register a dynamic hook at the start position rather than always appending.

## 5.0.0

### Major Changes

- [#44](https://github.com/workleap/wl-honeycomb-web/pull/44) [`9cc216e`](https://github.com/workleap/wl-honeycomb-web/commit/9cc216ef84d834471017a8a2918713c23fd0a62e) Thanks [@patricklafrance](https://github.com/patricklafrance)! - Request hook for the fetch instrumentation can now be registered dynamically rather than only being specified at initialization. This feature is not documented because it's for library integration code only but since it does define by default a request hook with the fetch instrumentation, it seems to be worth of being a major in case it breaks some code.

## 4.0.0

### Major Changes

- [#40](https://github.com/workleap/wl-honeycomb-web/pull/40) [`d91b5b5`](https://github.com/workleap/wl-honeycomb-web/commit/d91b5b561b4f4b2fcb3346bc69c3b43827530aa9) Thanks [@patricklafrance](https://github.com/patricklafrance)! - A "namespace" value is now required. See https://github.com/workleap/wl-honeycomb-web/issues/31.

## 3.0.0

### Major Changes

- [#35](https://github.com/workleap/wl-honeycomb-web/pull/35) [`c3e54be`](https://github.com/workleap/wl-honeycomb-web/commit/c3e54bed9618c1c9916561e99fda2075492d56fa) Thanks [@patricklafrance](https://github.com/patricklafrance)! - Updated dependency versions and moved the following `peerDependencies` to `dependencies`:

  - @honeycombio/opentelemetry-web
  - @opentelemetry/auto-instrumentations-web
  - @opentelemetry/instrumentation-document-load
  - @opentelemetry/instrumentation-fetch
  - @opentelemetry/instrumentation-user-interaction
  - @opentelemetry/instrumentation-xml-http-request
  - @opentelemetry/sdk-trace-web

## 2.1.2

### Patch Changes

- [#27](https://github.com/workleap/wl-honeycomb-web/pull/27) [`2ce054f`](https://github.com/workleap/wl-honeycomb-web/commit/2ce054f06fdbc90f5def97982113cabe3b86e067) Thanks [@patricklafrance](https://github.com/patricklafrance)! - Updated dependencies.

## 2.1.1

### Patch Changes

- [#23](https://github.com/workleap/wl-honeycomb-web/pull/23) [`1a67049`](https://github.com/workleap/wl-honeycomb-web/commit/1a67049c86c623795a1fd502e64e348bbfb4fd36) Thanks [@patricklafrance](https://github.com/patricklafrance)! - Added JSDoc comments linking to the document website.

## 2.1.0

### Minor Changes

- [#20](https://github.com/workleap/wl-honeycomb-web/pull/20) [`1d79f83`](https://github.com/workleap/wl-honeycomb-web/commit/1d79f834fe2398eaadd2bbf3d7abfb8aa21f3564) Thanks [@JGpGH](https://github.com/JGpGH)! - adding latest http attributes according to latest semantics

## 2.0.2

### Patch Changes

- [#18](https://github.com/workleap/wl-honeycomb-web/pull/18) [`3d33423`](https://github.com/workleap/wl-honeycomb-web/commit/3d3342394b84e2c3de4460ded8e6ed14eae2341c) Thanks [@patricklafrance](https://github.com/patricklafrance)! - Updated dependencies versions

## 2.0.1

### Patch Changes

- [#15](https://github.com/workleap/wl-honeycomb-web/pull/15) [`bd6ef55`](https://github.com/workleap/wl-honeycomb-web/commit/bd6ef555cb2f117e02a7f86704ee2fd7d0af6be0) Thanks [@patricklafrance](https://github.com/patricklafrance)! - Default options are now applied to the XML HTTP Request instrumentation as well.

## 2.0.0

### Major Changes

- [#13](https://github.com/workleap/wl-honeycomb-web/pull/13) [`23c0db1`](https://github.com/workleap/wl-honeycomb-web/commit/23c0db1a51b1cc16eb3463d7a01a33db1f285ce2) Thanks [@patricklafrance](https://github.com/patricklafrance)! - Rename the `endpoint` option for `proxy`.

## 1.0.1

### Patch Changes

- [#7](https://github.com/workleap/wl-honeycomb-web/pull/7) [`d2c7deb`](https://github.com/workleap/wl-honeycomb-web/commit/d2c7deb257b1cdb0cf43d8d791f87b5817024dbc) Thanks [@patricklafrance](https://github.com/patricklafrance)! - Added source code and source maps to the package.

## 1.0.0

### Major Changes

- [#2](https://github.com/workleap/wl-honeycomb-web/pull/2) [`4af1451`](https://github.com/workleap/wl-honeycomb-web/commit/4af145152fcefa651ef44df13013b77d7157caca) Thanks [@patricklafrance](https://github.com/patricklafrance)! - Initial release.
