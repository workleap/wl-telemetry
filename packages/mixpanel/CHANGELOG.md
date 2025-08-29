# @workleap/mixpanel

## 2.1.7

### Patch Changes

- [#72](https://github.com/workleap/wl-telemetry/pull/72) [`baf14c4`](https://github.com/workleap/wl-telemetry/commit/baf14c474e4cac0eab8fa15bf3986c4f27f40342) Thanks [@patricklafrance](https://github.com/patricklafrance)! - Added a global variables indicating that Mixpanel has been initialized.

## 2.1.6

### Patch Changes

- [#68](https://github.com/workleap/wl-telemetry/pull/68) [`80c1f39`](https://github.com/workleap/wl-telemetry/commit/80c1f39747ac689d6e175ff6b880a2b8c8fa9abd) Thanks [@patricklafrance](https://github.com/patricklafrance)! - LogRocketLogger refactor.

- Updated dependencies [[`80c1f39`](https://github.com/workleap/wl-telemetry/commit/80c1f39747ac689d6e175ff6b880a2b8c8fa9abd)]:
  - @workleap/telemetry@1.1.6

## 2.1.5

### Patch Changes

- [#66](https://github.com/workleap/wl-telemetry/pull/66) [`6b79793`](https://github.com/workleap/wl-telemetry/commit/6b79793e26937f562f51193aedec1a7f57b1578c) Thanks [@patricklafrance](https://github.com/patricklafrance)! - Bumped dependencies and LogRocketLogger refactor.

- Updated dependencies [[`6b79793`](https://github.com/workleap/wl-telemetry/commit/6b79793e26937f562f51193aedec1a7f57b1578c)]:
  - @workleap/telemetry@1.1.5

## 2.1.4

### Patch Changes

- [#60](https://github.com/workleap/wl-telemetry/pull/60) [`ed078b6`](https://github.com/workleap/wl-telemetry/commit/ed078b698cfb78e9299f53d0580bf5c5751b9294) Thanks [@patricklafrance](https://github.com/patricklafrance)! - Improved debug vs information logs.

- Updated dependencies [[`ed078b6`](https://github.com/workleap/wl-telemetry/commit/ed078b698cfb78e9299f53d0580bf5c5751b9294)]:
  - @workleap/telemetry@1.1.4

## 2.1.3

### Patch Changes

- [#58](https://github.com/workleap/wl-telemetry/pull/58) [`10d0c3f`](https://github.com/workleap/wl-telemetry/commit/10d0c3fe6e7565a2a95aeed9f3bc83274d90f1ad) Thanks [@patricklafrance](https://github.com/patricklafrance)! - LogRocketLogger object segment type is now unknown.

- Updated dependencies [[`10d0c3f`](https://github.com/workleap/wl-telemetry/commit/10d0c3fe6e7565a2a95aeed9f3bc83274d90f1ad)]:
  - @workleap/telemetry@1.1.3

## 2.1.2

### Patch Changes

- [#56](https://github.com/workleap/wl-telemetry/pull/56) [`7be6e06`](https://github.com/workleap/wl-telemetry/commit/7be6e06b0f1f42e549ff043dc9b68db91ceb8d15) Thanks [@patricklafrance](https://github.com/patricklafrance)! - LogRocket logger now supports optional segments.

- Updated dependencies [[`7be6e06`](https://github.com/workleap/wl-telemetry/commit/7be6e06b0f1f42e549ff043dc9b68db91ceb8d15)]:
  - @workleap/telemetry@1.1.2

## 2.1.1

### Patch Changes

- [#54](https://github.com/workleap/wl-telemetry/pull/54) [`79ce028`](https://github.com/workleap/wl-telemetry/commit/79ce028f2418cc43ed18017e82ce9599e97d0e40) Thanks [@patricklafrance](https://github.com/patricklafrance)! - Added support for line change segments to the LogRocket logger.

- Updated dependencies [[`79ce028`](https://github.com/workleap/wl-telemetry/commit/79ce028f2418cc43ed18017e82ce9599e97d0e40)]:
  - @workleap/telemetry@1.1.1

## 2.1.0

### Minor Changes

- [#52](https://github.com/workleap/wl-telemetry/pull/52) [`4affd67`](https://github.com/workleap/wl-telemetry/commit/4affd670d7c5c0495eb41a700e6fe9af1f9f4e0f) Thanks [@patricklafrance](https://github.com/patricklafrance)! - Added a `loggers` option and removed the peerDependency to `@workleap/telemetry`.

### Patch Changes

- Updated dependencies [[`4affd67`](https://github.com/workleap/wl-telemetry/commit/4affd670d7c5c0495eb41a700e6fe9af1f9f4e0f)]:
  - @workleap/telemetry@1.1.0

## 2.0.2

### Patch Changes

- [#50](https://github.com/workleap/wl-telemetry/pull/50) [`e53857a`](https://github.com/workleap/wl-telemetry/commit/e53857a6c1ba13894f643076f3675dc2b61a9cc5) Thanks [@alexasselin008](https://github.com/alexasselin008)! - Add the trackingEndpoint options to the initializeMixpanel function to allow specifying a custom endpoint for tracking events.

## 2.0.1

### Patch Changes

- [#36](https://github.com/workleap/wl-telemetry/pull/36) [`85f432b`](https://github.com/workleap/wl-telemetry/commit/85f432bb1c45433d24a765da7249fef4abb949d4) Thanks [@patricklafrance](https://github.com/patricklafrance)! - Minor fixes to the API.

## 2.0.0

### Major Changes

- [#29](https://github.com/workleap/wl-telemetry/pull/29) [`812f691`](https://github.com/workleap/wl-telemetry/commit/812f691676c60a7748b0db87e38e3b86591e2a85) Thanks [@patricklafrance](https://github.com/patricklafrance)! - Those new packages provides an integration experience for telemetry. By linking session data, performance traces, and user interactions through consistent identifiers. It becomes possible to trace a single application event across systems, from backend performance to frontend behavior to product impact. This integration streamlines will hopefully enables faster, and more informed decision-making.

  For migration instruction, visit the [migrate](https://workleap.github.io/wl-telemetry/introduction/migrate/) page.

### Patch Changes

- Updated dependencies [[`812f691`](https://github.com/workleap/wl-telemetry/commit/812f691676c60a7748b0db87e38e3b86591e2a85)]:
  - @workleap/telemetry@1.0.0

### Patch Changes

- Updated dependencies [[`c46c378`](https://github.com/workleap/wl-telemetry/commit/c46c3783079835063d1969f547b0d4947d7bd573)]:
  - @workleap/telemetry@1.0.0

## 1.1.2

### Patch Changes

- [#22](https://github.com/workleap/wl-telemetry/pull/22) [`0c437d0`](https://github.com/workleap/wl-telemetry/commit/0c437d055a2f0fcdfd5130a9a2239631d6cdfc4d) Thanks [@patricklafrance](https://github.com/patricklafrance)! - Updated dependencies.

## 1.1.1

### Patch Changes

- [#14](https://github.com/workleap/wl-telemetry/pull/14) [`a639574`](https://github.com/workleap/wl-telemetry/commit/a639574d5d9f1f3a4227db6e356e6a71fad6af1d) Thanks [@alexasselin008](https://github.com/alexasselin008)! - Fixed an issue where the payload had the wrong name for productIdentifier and targetProductIdentifier

## 1.1.0

### Minor Changes

- [#8](https://github.com/workleap/wl-telemetry/pull/8) [`5199dc1`](https://github.com/workleap/wl-telemetry/commit/5199dc1cce5d9ab05c0cda84be2ac81cdf6a9456) Thanks [@alexasselin008](https://github.com/alexasselin008)! - Add the possibility to specify only the environment to use, and the tracking function will provide the correct URL

### Patch Changes

- [#6](https://github.com/workleap/wl-telemetry/pull/6) [`e26a764`](https://github.com/workleap/wl-telemetry/commit/e26a764282f881b4ab50009db1f88879e8a02776) Thanks [@alexasselin008](https://github.com/alexasselin008)! - Export types from the packages

## 1.0.2

### Patch Changes

- [#4](https://github.com/workleap/wl-telemetry/pull/4) [`3430c6d`](https://github.com/workleap/wl-telemetry/commit/3430c6dc2ccf381a96f8d1d03e7f695670d9e9d2) Thanks [@alexasselin008](https://github.com/alexasselin008)! - Added cjs entry point to our package

## 1.0.1

### Patch Changes

- [#2](https://github.com/workleap/wl-telemetry/pull/2) [`5e904ad`](https://github.com/workleap/wl-telemetry/commit/5e904ad5117d86d0d7e7a727bfabe3f2db427f62) Thanks [@alexasselin008](https://github.com/alexasselin008)! - Add readme to package
