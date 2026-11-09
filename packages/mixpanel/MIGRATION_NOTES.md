# Migration Notes

## @workleap/tracking to 1.0.0

`buildTrackingFunction` has been renamed to `createTrackingFunction`.

createTrackingFunction now takes:

- `productId` as the first argument
- `baseUrl` as the second argument
- `options` as the third argument

```diff
- const track = buildTrackingFunction(productId, environmentVariables.navigationApiBaseUrl);
+ const track = createTrackingFunction(productId, environmentVariables.navigationApiBaseUrl);
```

the buildTrackingFunction had multiple overloads, the new createTrackingFunction has a single signature, with an options object.

```diff
- const track = buildTrackingFunction(productId, targetProductIdentifier, environmentVariables.navigationApiBaseUrl);
+ const track = createTrackingFunction(productId, environmentVariables.navigationApiBaseUrl, {
+    targetProductId
+});
```
