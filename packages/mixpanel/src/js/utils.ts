// This code is adapted from https://github.com/mixpanel/mixpanel-js/blob/master/src/utils.js
export function browserName(userAgent: string, vendor?: string, opera?: object) {
    // vendor is undefined for at least IE9
    vendor = vendor || ""; // eslint-disable-line no-param-reassign

    if (opera || userAgent.includes(" OPR/")) {
        if (userAgent.includes("Mini")) {
            return "Opera Mini";
        }

        return "Opera";
    } else if (/(BlackBerry|PlayBook|BB10)/i.test(userAgent)) {
        return "BlackBerry";
    } else if (userAgent.includes("IEMobile") || userAgent.includes("WPDesktop")) {
        return "Internet Explorer Mobile";
    } else if (userAgent.includes("Edge")) {
        return "Microsoft Edge";
    } else if (userAgent.includes("FBIOS")) {
        return "Facebook Mobile";
    } else if (userAgent.includes("Chrome")) {
        return "Chrome";
    } else if (userAgent.includes("CriOS")) {
        return "Chrome iOS";
    } else if (userAgent.includes("UCWEB") || userAgent.includes("UCBrowser")) {
        return "UC Browser";
    } else if (userAgent.includes("FxiOS")) {
        return "Firefox iOS";
    } else if (vendor.includes("Apple")) {
        if (userAgent.includes("Mobile")) {
            return "Mobile Safari";
        }

        return "Safari";
    } else if (userAgent.includes("Android")) {
        return "Android Mobile";
    } else if (userAgent.includes("Konqueror")) {
        return "Konqueror";
    } else if (userAgent.includes("Firefox")) {
        return "Firefox";
    } else if (userAgent.includes("MSIE") || userAgent.includes("Trident/")) {
        return "Internet Explorer";
    } else if (userAgent.includes("Gecko")) {
        return "Mozilla";
    }

    return "";
}

/**
 * This function detects which browser version is running this script,
 * parsing major and minor version (e.g., 42.1). User agent strings from:
 * http://www.useragentstring.com/pages/useragentstring.php
 */
export function browserVersion(userAgent: string, vendor?: string, opera?: object) {
    const browser = browserName(userAgent, vendor, opera);
    const versionRegexs: { [key: string]: RegExp } = {
        "Internet Explorer Mobile": /rv:(\d+(\.\d+)?)/,
        "Microsoft Edge": /Edge\/(\d+(\.\d+)?)/,
        "Chrome": /Chrome\/(\d+(\.\d+)?)/,
        "Chrome iOS": /CriOS\/(\d+(\.\d+)?)/,
        "UC Browser": /(UCBrowser|UCWEB)\/(\d+(\.\d+)?)/,
        "Safari": /Version\/(\d+(\.\d+)?)/,
        "Mobile Safari": /Version\/(\d+(\.\d+)?)/,
        "Opera": /(Opera|OPR)\/(\d+(\.\d+)?)/,
        "Firefox": /Firefox\/(\d+(\.\d+)?)/,
        "Firefox iOS": /FxiOS\/(\d+(\.\d+)?)/,
        "Konqueror": /Konqueror:(\d+(\.\d+)?)/,
        "BlackBerry": /BlackBerry (\d+(\.\d+)?)/,
        "Android Mobile": /android\s(\d+(\.\d+)?)/,
        "Internet Explorer": /(rv:|MSIE )(\d+(\.\d+)?)/,
        "Mozilla": /rv:(\d+(\.\d+)?)/
    };
    const regex = versionRegexs[browser];
    if (regex === undefined) {
        return null;
    }
    const matches = userAgent.match(regex);
    if (!matches) {
        return null;
    }

    return parseFloat(matches[matches.length - 2]);
}

export function osName(userAgent: string) {
    const a = userAgent;
    if (/Windows/i.test(a)) {
        // eslint-disable-next-line @typescript-eslint/prefer-includes
        if (/Phone/.test(a) || /WPDesktop/.test(a)) {
            return "Windows Phone";
        }

        return "Windows";
    } else if (/(iPhone|iPad|iPod)/.test(a)) {
        return "iOS";
    // eslint-disable-next-line @typescript-eslint/prefer-includes
    } else if (/Android/.test(a)) {
        return "Android";
    } else if (/(BlackBerry|PlayBook|BB10)/i.test(a)) {
        return "BlackBerry";
    } else if (/Mac/i.test(a)) {
        return "Mac OS X";
    // eslint-disable-next-line @typescript-eslint/prefer-includes
    } else if (/Linux/.test(a)) {
        return "Linux";
    // eslint-disable-next-line @typescript-eslint/prefer-includes
    } else if (/CrOS/.test(a)) {
        return "Chrome OS";
    }

    return "";
}

export function deviceType(userAgent: string) {
    // eslint-disable-next-line @typescript-eslint/prefer-includes
    if (/Windows Phone/i.test(userAgent) || /WPDesktop/.test(userAgent)) {
        return "Windows Phone";
    // eslint-disable-next-line @typescript-eslint/prefer-includes
    } else if (/iPad/.test(userAgent)) {
        return "iPad";
    // eslint-disable-next-line @typescript-eslint/prefer-includes
    } else if (/iPod/.test(userAgent)) {
        return "iPod Touch";
    // eslint-disable-next-line @typescript-eslint/prefer-includes
    } else if (/iPhone/.test(userAgent)) {
        return "iPhone";
    } else if (/(BlackBerry|PlayBook|BB10)/i.test(userAgent)) {
        return "BlackBerry";
    // eslint-disable-next-line @typescript-eslint/prefer-includes
    } else if (/Android/.test(userAgent)) {
        return "Android";
    }

    return "";
}

export function referringDomain(referrer: string) {
    const split = referrer.split("/");
    if (split.length >= 3) {
        return split[2];
    }

    return "";
}
