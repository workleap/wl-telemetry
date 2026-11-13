---
"@workleap/logrocket": minor
---

A name provided with the `privateQueryParameterNames` option is now matched literally, and is also matched in its percent-encoded form. Previously, a name was used as a regular expression without being escaped: a name such as `user[email]` was not redacted, and a name that is not a valid regular expression made the sanitizer throw. A name that relied on the regular expression syntax, such as `(sid|key)`, no longer matches and must be replaced by the actual names.
