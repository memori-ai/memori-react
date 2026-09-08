export const convertDocument = async (file, sessionID, baseUrl = '') => {
    if (!sessionID) {
        throw new Error('Session ID is required to convert documents');
    }
    const body = new FormData();
    body.append('file', file);
    const origin = baseUrl.replace(/\/+$/, '');
    const response = await fetch(`${origin}/api/convert/${encodeURIComponent(sessionID)}`, {
        method: 'POST',
        body,
    });
    const payload = (await response
        .json()
        .catch(() => null));
    if (!response.ok || !(payload === null || payload === void 0 ? void 0 : payload.text)) {
        throw new Error((payload === null || payload === void 0 ? void 0 : payload.error) || 'Document conversion failed');
    }
    return payload.text;
};
//# sourceMappingURL=convertDocument.js.map