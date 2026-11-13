export function redactQueryParameters(url: string, queryParameterNames: string[]) {
    let redactedUrl = url;

    for (const x of queryParameterNames) {
        // A name can include regular expression special characters, and can be percent-encoded in the URL, such as "user[email]" and "user%5Bemail%5D".
        const escapedNames = [x, encodeURIComponent(x)].map(y => y.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

        redactedUrl = redactedUrl.replace(new RegExp(`(?:${escapedNames.join("|")})=([^&]*)`, "gi"), () => `${x}=**redacted**`);
    }

    return redactedUrl;
}
