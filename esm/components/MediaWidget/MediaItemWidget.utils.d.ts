import type { Medium } from '@memori.ai/memori-api-client/dist/types';
import type { LinkPreviewInfo } from './MediaItemWidget.types';
export declare const FILE_EXTENSIONS_DARK_CARD: readonly ["TXT", "HTML", "PDF", "DOC", "DOCX", "DOTX", "XLS", "XLSX", "JSON", "XML", "MD", "CSS", "JS", "TS", "PY"];
export declare const FILE_MIME_TYPES_DARK_CARD: readonly ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.wordprocessingml.template", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/html", "text/plain", "text/css", "text/javascript", "application/json", "application/xml", "text/markdown"];
export declare const TEXT_FILE_EXTENSIONS: readonly ["TXT", "HTML", "MD", "CSS", "JS", "TS", "PY", "JSON", "XML"];
export declare const IMAGE_MIME_TYPES: readonly ["image/jpeg", "image/png", "image/jpg", "image/gif"];
export declare const FALLBACK_IMAGE_BASE64 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==";
export declare function formatBytes(bytes: number | undefined): string;
export declare function getFileExtensionFromUrl(url: string | undefined): string | null;
export declare function getFileExtensionFromMime(mimeType: string): string;
export declare function getDocumentBadgeLabel(mimeType: string, filename?: string | null, url?: string | null): string;
export declare function countLines(content: string | undefined): number;
export declare function shouldUseDarkFileCard(_item: Medium, fileExtension: string | null, mimeType: string): boolean;
export declare function fetchLinkPreview(url: string, baseUrl?: string): Promise<LinkPreviewInfo | null>;
export declare function getContentSize(item: Medium): number | undefined;
export declare function isValidUrl(urlString: string | undefined): boolean;
export declare function normalizeUrl(url: string | undefined): string | undefined;
export type ImageDisplaySource = {
    src: string | undefined;
    isRgb: boolean;
};
export declare function getImageDisplaySource(item: Medium & {
    type?: string;
}, resourceUrl: string): ImageDisplaySource;
