import { officeExtensionShortLabels, officeMimeShortLabels, } from '../../helpers/constants';
export const FILE_EXTENSIONS_DARK_CARD = [
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
export const FILE_MIME_TYPES_DARK_CARD = [
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
export const TEXT_FILE_EXTENSIONS = [
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
export const IMAGE_MIME_TYPES = [
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
export const FALLBACK_IMAGE_BASE64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';
export function formatBytes(bytes) {
    if (!bytes || bytes === 0)
        return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
export function getFileExtensionFromUrl(url) {
    if (!url)
        return null;
    const match = url.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
    return match ? match[1].toUpperCase() : null;
}
function normalizeMimeType(mimeType) {
    return mimeType.split(';')[0].trim();
}
export function getFileExtensionFromMime(mimeType) {
    var _a;
    const normalized = normalizeMimeType(mimeType);
    const normalizedLower = normalized.toLowerCase();
    const officeLabel = officeMimeShortLabels[normalized] ||
        officeMimeShortLabels[normalizedLower];
    if (officeLabel)
        return officeLabel;
    return (MIME_TO_EXT[normalized] ||
        MIME_TO_EXT[normalizedLower] ||
        MIME_TO_EXT[mimeType] ||
        ((_a = normalized.split('/')[1]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) ||
        'FILE');
}
export function getDocumentBadgeLabel(mimeType, filename, url) {
    const fromUrl = getFileExtensionFromUrl(url || undefined);
    if (fromUrl) {
        return officeExtensionShortLabels[fromUrl] || fromUrl;
    }
    const fromFilename = getFileExtensionFromUrl(filename || undefined);
    if (fromFilename) {
        return officeExtensionShortLabels[fromFilename] || fromFilename;
    }
    return getFileExtensionFromMime(mimeType);
}
export function countLines(content) {
    if (!content)
        return 0;
    return content.split(/\r\n|\r|\n/).length;
}
export function shouldUseDarkFileCard(_item, fileExtension, mimeType) {
    if (fileExtension &&
        FILE_EXTENSIONS_DARK_CARD.includes(fileExtension)) {
        return true;
    }
    return FILE_MIME_TYPES_DARK_CARD.includes(mimeType);
}
const LINK_PREVIEW_BASE_URL = 'https://aisuru.com';
export async function fetchLinkPreview(url, baseUrl) {
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
export function getContentSize(item) {
    var _a;
    if (item.content != null) {
        return new Blob([item.content]).size;
    }
    return (_a = item.properties) === null || _a === void 0 ? void 0 : _a.size;
}
export function isValidUrl(urlString) {
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
export function normalizeUrl(url) {
    if (!url || url.length === 0)
        return url;
    return url.startsWith('http') ? url : `https://${url}`;
}
export function getImageDisplaySource(item, resourceUrl) {
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
//# sourceMappingURL=MediaItemWidget.utils.js.map