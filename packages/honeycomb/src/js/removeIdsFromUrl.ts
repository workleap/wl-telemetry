const RegEx = /\b(?:([0-9a-f]{24})|([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}))\b/gi;

export function removeIdsFromUrl(url: string) {
    return url.toString().replace(RegEx, (_, shortId, guid) =>
        guid ? "{guid}" : "{shortid}"
    );
}
