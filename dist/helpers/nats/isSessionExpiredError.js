"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSessionExpiredNatsResponse = exports.isSessionExpiredNatsError = void 0;
const SESSION_NOT_FOUND = -101;
const SESSION_EXPIRED = -103;
const SESSION_NOT_FOUND_MESSAGE = /session\s+with\s+id\s+["']?[^"']+["']?\s+not\s+found/i;
function isExpiredResultCode(resultCode) {
    return (resultCode === 404 ||
        resultCode === SESSION_EXPIRED ||
        resultCode === SESSION_NOT_FOUND);
}
function isExpiredErrorMessage(message) {
    if (!message)
        return false;
    return SESSION_NOT_FOUND_MESSAGE.test(message);
}
function isSessionExpiredNatsError(event) {
    if (isExpiredResultCode(event.errorCode)) {
        return true;
    }
    if (typeof event.errorCode === 'string') {
        const code = event.errorCode.toUpperCase();
        if (code.includes('SESSION_EXPIRED') || code.includes('SESSION_NOT_FOUND')) {
            return true;
        }
    }
    return isExpiredErrorMessage(event.errorMessage);
}
exports.isSessionExpiredNatsError = isSessionExpiredNatsError;
function isSessionExpiredNatsResponse(event) {
    if (isExpiredResultCode(event.resultCode)) {
        return true;
    }
    return isExpiredErrorMessage(event.resultMessage);
}
exports.isSessionExpiredNatsResponse = isSessionExpiredNatsResponse;
//# sourceMappingURL=isSessionExpiredError.js.map