---
"@workleap/honeycomb": minor
---

Trace requests sent to a `proxy` include the session credentials again.

Since version 1.5 of `@honeycombio/opentelemetry-web`, the SDK exports the traces with the Fetch API and without the session cookies that the proxies rely on to authenticate the requests, which resulted in `401` responses. The `XMLHttpRequest` patch that previously added the credentials no longer had any effect.

- In proxy mode, the default trace exporter of the Honeycomb SDK is replaced by an exporter sending the requests with `credentials: "include"`. The default metric and log exporters are disabled since the proxies only accept traces.
- New `credentials` option to change the credentials mode of the requests sent to the proxy.
- The minimum version of `@honeycombio/opentelemetry-web` is now `1.5.1`.
- The `XMLHttpRequest.prototype.open` patch is removed. Application requests to the proxy URL sent with `XMLHttpRequest` no longer get `withCredentials` set as a side effect.
