"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImageDisplaySource = exports.normalizeUrl = exports.isValidUrl = exports.getContentSize = exports.fetchLinkPreview = exports.shouldUseDarkFileCard = exports.countLines = exports.getDocumentBadgeLabel = exports.getFileExtensionFromMime = exports.getFileExtensionFromUrl = exports.formatBytes = exports.FALLBACK_IMAGE_BASE64 = exports.IMAGE_MIME_TYPES = exports.TEXT_FILE_EXTENSIONS = exports.FILE_MIME_TYPES_DARK_CARD = exports.FILE_EXTENSIONS_DARK_CARD = void 0;
const constants_1 = require("../../helpers/constants");
exports.FILE_EXTENSIONS_DARK_CARD = [
    'TXT',
    'HTML',
    'PDF',
    'DOC',
    'DOCX',
    'DOTX',
    'XLS',
    'XLSX',
    'JSON',
    'XML',
    'MD',
    'CSS',
    'JS',
    'TS',
    'PY',
];
exports.FILE_MIME_TYPES_DARK_CARD = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/html',
    'text/plain',
    'text/css',
    'text/javascript',
    'application/json',
    'application/xml',
    'text/markdown',
];
exports.TEXT_FILE_EXTENSIONS = [
    'TXT',
    'HTML',
    'MD',
    'CSS',
    'JS',
    'TS',
    'PY',
    'JSON',
    'XML',
];
exports.IMAGE_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/gif',
];
const MIME_TO_EXT = {
    'application/pdf': 'PDF',
    'text/html': 'HTML',
    'text/plain': 'TXT',
    'text/css': 'CSS',
    'text/javascript': 'JS',
    'application/json': 'JSON',
    'application/xml': 'XML',
    'text/markdown': 'MD',
};
exports.FALLBACK_IMAGE_BASE64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';
function formatBytes(bytes) {
    if (!bytes || bytes === 0)
        return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
exports.formatBytes = formatBytes;
function getFileExtensionFromUrl(url) {
    if (!url)
        return null;
    const match = url.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
    return match ? match[1].toUpperCase() : null;
}
exports.getFileExtensionFromUrl = getFileExtensionFromUrl;
function normalizeMimeType(mimeType) {
    return mimeType.split(';')[0].trim();
}
function getFileExtensionFromMime(mimeType) {
    var _a;
    const normalized = normalizeMimeType(mimeType);
    const normalizedLower = normalized.toLowerCase();
    const officeLabel = constants_1.officeMimeShortLabels[normalized] ||
        constants_1.officeMimeShortLabels[normalizedLower];
    if (officeLabel)
        return officeLabel;
    return (MIME_TO_EXT[normalized] ||
        MIME_TO_EXT[normalizedLower] ||
        MIME_TO_EXT[mimeType] ||
        ((_a = normalized.split('/')[1]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) ||
        'FILE');
}
exports.getFileExtensionFromMime = getFileExtensionFromMime;
function getDocumentBadgeLabel(mimeType, filename, url) {
    const fromUrl = getFileExtensionFromUrl(url || undefined);
    if (fromUrl) {
        return constants_1.officeExtensionShortLabels[fromUrl] || fromUrl;
    }
    const fromFilename = getFileExtensionFromUrl(filename || undefined);
    if (fromFilename) {
        return constants_1.officeExtensionShortLabels[fromFilename] || fromFilename;
    }
    return getFileExtensionFromMime(mimeType);
}
exports.getDocumentBadgeLabel = getDocumentBadgeLabel;
function countLines(content) {
    if (!content)
        return 0;
    return content.split(/\r\n|\r|\n/).length;
}
exports.countLines = countLines;
function shouldUseDarkFileCard(_item, fileExtension, mimeType) {
    if (fileExtension &&
        exports.FILE_EXTENSIONS_DARK_CARD.includes(fileExtension)) {
        return true;
    }
    return exports.FILE_MIME_TYPES_DARK_CARD.includes(mimeType);
}
exports.shouldUseDarkFileCard = shouldUseDarkFileCard;
const LINK_PREVIEW_BASE_URL = 'https://aisuru.com';
async function fetchLinkPreview(url, baseUrl) {
    try {
        const res = await fetch(`${baseUrl || LINK_PREVIEW_BASE_URL}/api/linkpreview/${encodeURIComponent(url)}`);
        const data = await res.json();
        return data;
    }
    catch (err) {
        console.error('fetchLinkPreview', err);
        return null;
    }
}
exports.fetchLinkPreview = fetchLinkPreview;
function getContentSize(item) {
    var _a;
    if (item.content != null) {
        return new Blob([item.content]).size;
    }
    return (_a = item.properties) === null || _a === void 0 ? void 0 : _a.size;
}
exports.getContentSize = getContentSize;
function isValidUrl(urlString) {
    if (!urlString)
        return false;
    try {
        new URL(urlString);
        return true;
    }
    catch (_a) {
        return false;
    }
}
exports.isValidUrl = isValidUrl;
function normalizeUrl(url) {
    if (!url || url.length === 0)
        return url;
    return url.startsWith('http') ? url : `https://${url}`;
}
exports.normalizeUrl = normalizeUrl;
function getImageDisplaySource(item, resourceUrl) {
    const hasValidUrl = isValidUrl(resourceUrl) || isValidUrl(item.url);
    const isRgb = !!item.url &&
        (item.url.startsWith('rgb(') || item.url.startsWith('rgba('));
    let src;
    if (hasValidUrl) {
        src = resourceUrl || item.url;
    }
    else if (isRgb) {
        src = item.url;
    }
    else if (item.content) {
        src = `data:${item.mimeType};base64,${item.content}`;
    }
    else {
        src = undefined;
    }
    return { src, isRgb };
}
exports.getImageDisplaySource = getImageDisplaySource;
//# sourceMappingURL=MediaItemWidget.utils.js.map