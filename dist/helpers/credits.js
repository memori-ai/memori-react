"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCredits = void 0;
const getCredits = async ({ operation = 'session_creation', baseUrl, userID, userName, tenant, characters, }) => {
    if (!userID && !userName) {
        throw new Error('Either userID or userName must be provided');
    }
    if (operation === 'import_document' && characters == null) {
        throw new Error('characters must be provided for import_document');
    }
    const resp = await fetch(`${baseUrl}/api/verify-tokens`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            operation,
            userID,
            userName,
            tenant,
            ...(operation === 'import_document' ? { characters } : {}),
        }),
    });
    if (!resp.ok) {
        throw new Error('Failed to fetch credits');
    }
    return resp.json();
};
exports.getCredits = getCredits;
//# sourceMappingURL=credits.js.map