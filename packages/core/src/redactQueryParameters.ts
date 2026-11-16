export const DefaultPrivateQueryParameterNames = ["token", "email", "password"];

const RedactedValue = "**redacted**";

// A value that is still percent-encoded after this number of decoding passes is redacted rather than decoded further.
const MaxDecodingDepth = 5;

function escapeRegExp(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function decodeOnce(value: string) {
    try {
        return decodeURIComponent(value);
    } catch {
        // An ASCII escape is decoded on its own, so a malformed or non UTF-8 escape doesn't prevent the decoding of its neighbours, such as the "%3D" of "%3D%E9".
        return value.replace(/%[0-7][0-9a-f]|(?:%[89a-f][0-9a-f])+/gi, x => {
            try {
                return decodeURIComponent(x);
            } catch {
                return x;
            }
        });
    }
}

function decodeFully(value: string) {
    let decodedValue = value;

    for (let i = 0; i <= MaxDecodingDepth; i += 1) {
        const nextValue = decodeOnce(decodedValue);

        if (nextValue === decodedValue) {
            return decodedValue;
        }

        decodedValue = nextValue;
    }

    return undefined;
}

// A private query parameter can be nested in a percent-encoded value, such as "returnUrl=https%3A%2F%2Fapp%2Fcallback%3Ftoken%3DABCDEF", or have a percent-encoded name, such as "to%6Ben".
// The percent-encoded value is redacted as a whole rather than rewritten, because encoding it again could alter the parts that are not private.
function redactPercentEncodedQueryParameters(url: string, queryParameterNames: string[]) {
    const privateQueryParameterRegExp = new RegExp(`(?:${queryParameterNames.map(escapeRegExp).join("|")})=`, "i");

    const includesPrivateQueryParameter = (value: string) => {
        const decodedValue = decodeFully(value);

        return decodedValue === undefined || privateQueryParameterRegExp.test(decodedValue);
    };

    const redactPart = (part: string) => {
        if (!part.includes("%") || !includesPrivateQueryParameter(part)) {
            return part;
        }

        const separatorIndex = part.indexOf("=");

        if (separatorIndex === -1) {
            return RedactedValue;
        }

        const name = part.slice(0, separatorIndex);

        // When the private query parameter is nested in the name itself, the name cannot be kept.
        return includesPrivateQueryParameter(name) ? RedactedValue : `${name}=${RedactedValue}`;
    };

    // The query starts at the first "?" or "#". A query can also be provided without its leading "?", in which case it starts at the segment that includes the first "=".
    const delimiterIndex = url.search(/[?#=]/);
    const queryIndex = url[delimiterIndex] === "=" ? url.lastIndexOf("/", delimiterIndex) + 1 : delimiterIndex;
    const path = queryIndex === -1 ? url : url.slice(0, queryIndex);
    const queryAndFragment = queryIndex === -1 ? "" : url.slice(queryIndex);

    // The path is split by segment, so a private query parameter that is percent-encoded in a segment doesn't redact the whole path.
    // The query is only split on its leading "?", because a "?" or a "/" can be part of the value of a query parameter.
    return [...path.split(/(\/)/), ...queryAndFragment.split(/(^\?|[&#])/)].map(redactPart).join("");
}

export function redactQueryParameters(url: string, queryParameterNames: string[]) {
    let redactedUrl = url;

    for (const x of queryParameterNames) {
        // A name can include regular expression special characters, and can be percent-encoded in the URL, such as "user[email]" and "user%5Bemail%5D".
        const escapedNames = [x, encodeURIComponent(x)].map(escapeRegExp);

        redactedUrl = redactedUrl.replace(new RegExp(`(?:${escapedNames.join("|")})=([^&]*)`, "gi"), () => `${x}=${RedactedValue}`);
    }

    if (queryParameterNames.length === 0 || !redactedUrl.includes("%")) {
        return redactedUrl;
    }

    return redactPercentEncodedQueryParameters(redactedUrl, queryParameterNames);
}
