---
order: 90
label: Privacy
---

# Privacy

By default, this instrumentation hides a wide range of Personally Identifiable Information (PII) from session replays to protect user privacy:

- [LogRocket's DOM sanitization](https://docs.logrocket.com/reference/dom) hide sensitive text elements from session replays.
- [LogRocket's network data sanitization](https://docs.logrocket.com/reference/network) strip sensitive information from request/response headers and body from session replays.
- [LogRocket's URLs sanitization](https://docs.logrocket.com/reference/browser) strip sensitive information from URLs' query parameters exposed in session replays.

### Record elements

By default, **no DOM elements are recorded**. To record the content of an element and its children, explicitly add the `data-public` property to the element. When this attribute is present, the content inside the element, including child elements, will be captured in the session replay:

```html !#1
<div data-public>
    This text will be visible in the session replay.
</div>
```

### Block elements

To prevent an element and its child elements from being recorded, use the `data-private` attribute.. This is especially useful when you want to selectively exclude sensitive parts of an element tree while allowing others to be captured.

```html !#1,6
<div data-public>
    <ul>
        <li>Page 1</li>
        <li>Page 2</li>
    </ul>
    <div data-private>
        This text will be not be visible in the session replay.
    </div>
</div>
```
