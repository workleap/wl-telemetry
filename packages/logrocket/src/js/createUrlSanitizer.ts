export type UrlSanitizerFunction = (url: string) => string;

export function createUrlSanitizer(queryParametersToRemove: string[]) {
    return (url: string | URL) => {
        // A network request made with XMLHttpRequest can provide a URL object rather than a string.
        let sanitizedUrl = String(url);

        for (const x of queryParametersToRemove) {
            sanitizedUrl = sanitizedUrl.replace(new RegExp(`${x}=([^&]*)`, "gi"), `${x}=**redacted**`);
        }

        return sanitizedUrl;
    };
}
