const shouldAppendSessionId = (resourceURI, apiURL) => {
    const url = new URL(resourceURI);
    const { hostname, pathname } = url;
    if (/\/api\/v\d+\/asset\//i.test(pathname)) {
        return true;
    }
    if (apiURL) {
        try {
            if (new URL(apiURL).hostname === hostname) {
                return true;
            }
        }
        catch (_a) {
        }
    }
    return false;
};
export const getResourceUrl = ({ type, resourceURI, sessionID, baseURL = '', apiURL = '', }) => {
    let defaultUri = type === 'cover'
        ? `${baseURL}/images/memoriCover.png`
        : `${baseURL}/images/memoriAvatar.png?v=20231208`;
    try {
        if (!resourceURI || resourceURI.length === 0) {
            return defaultUri;
        }
        else if (resourceURI.includes('memoriai/memory') &&
            !resourceURI.includes('memori-ai-session-id') &&
            sessionID) {
            return `${resourceURI}?memori-ai-session-id=${sessionID}`;
        }
        else if ((resourceURI.startsWith('https://') ||
            resourceURI.startsWith('http://')) &&
            shouldAppendSessionId(resourceURI, apiURL)) {
            return `${resourceURI}${resourceURI.endsWith('/') || !sessionID ? '' : '/'}${sessionID || ''}`;
        }
        else if (resourceURI.startsWith('cloud://')) {
            return `${(apiURL === null || apiURL === void 0 ? void 0 : apiURL.replace(/v2/, 'v1')) || ''}/CloudAsset/${resourceURI.replace('cloud://', '')}`;
        }
        else if (resourceURI.startsWith('guid://')) {
            return `${(apiURL === null || apiURL === void 0 ? void 0 : apiURL.replace(/v2/, 'v1')) || ''}/GuidAsset/${resourceURI.replace('guid://', '')}`;
        }
        else {
            return resourceURI || defaultUri;
        }
    }
    catch (e) {
        return resourceURI || defaultUri;
    }
};
//# sourceMappingURL=media.js.map