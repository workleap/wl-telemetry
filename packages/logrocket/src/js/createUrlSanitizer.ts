export function createUrlSanitizer(queryParametersToRemove: string[]) {
    return (url: string) => {
        let sanitizedUrl = url;

        for (const x of queryParametersToRemove) {
            sanitizedUrl = sanitizedUrl.replace(new RegExp(`${x}=([^&]*)`, "i"), `${x}=**redacted**`);
        }

        return sanitizedUrl;
    };
}
