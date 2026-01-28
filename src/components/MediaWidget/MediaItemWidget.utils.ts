import type { Medium } from '@memori.ai/memori-api-client/dist/types';
import type { LinkPreviewInfo } from './MediaItemWidget.types';

export const FILE_EXTENSIONS_DARK_CARD = [
  'TXT',
  'HTML',
  'PDF',
  'DOC',
  'DOCX',
  'XLS',
  'XLSX',
  'JSON',
  'XML',
  'MD',
  'CSS',
  'JS',
  'TS',
  'PY',
] as const;

export const FILE_MIME_TYPES_DARK_CARD = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/html',
  'text/plain',
  'text/css',
  'text/javascript',
  'application/json',
  'application/xml',
  'text/markdown',
] as const;

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
] as const;

export const IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/gif',
] as const;

const MIME_TO_EXT: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/msword': 'DOC',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    'DOCX',
  'application/vnd.ms-excel': 'XLS',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
  'text/html': 'HTML',
  'text/plain': 'TXT',
  'text/css': 'CSS',
  'text/javascript': 'JS',
  'application/json': 'JSON',
  'application/xml': 'XML',
  'text/markdown': 'MD',
};

export const FALLBACK_IMAGE_BASE64 =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';

export function formatBytes(bytes: number | undefined): string {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function getFileExtensionFromUrl(
  url: string | undefined
): string | null {
  if (!url) return null;
  const match = url.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
  return match ? match[1].toUpperCase() : null;
}

export function getFileExtensionFromMime(mimeType: string): string {
  return (
    MIME_TO_EXT[mimeType] ||
    mimeType.split('/')[1]?.toUpperCase() ||
    'FILE'
  );
}

export function countLines(content: string | undefined): number {
  if (!content) return 0;
  return content.split(/\r\n|\r|\n/).length;
}

export function shouldUseDarkFileCard(
  _item: Medium,
  fileExtension: string | null,
  mimeType: string
): boolean {
  if (
    fileExtension &&
    (FILE_EXTENSIONS_DARK_CARD as readonly string[]).includes(fileExtension)
  ) {
    return true;
  }
  return (FILE_MIME_TYPES_DARK_CARD as readonly string[]).includes(mimeType);
}

const LINK_PREVIEW_BASE_URL = 'https://aisuru.com';

export async function fetchLinkPreview(
  url: string,
  baseUrl?: string
): Promise<LinkPreviewInfo | null> {
  try {
    const res = await fetch(
      `${baseUrl || LINK_PREVIEW_BASE_URL}/api/linkpreview/${encodeURIComponent(url)}`
    );
    const data: LinkPreviewInfo = await res.json();
    return data;
  } catch (err) {
    console.error('fetchLinkPreview', err);
    return null;
  }
}

export function getContentSize(item: Medium): number | undefined {
  if (item.content != null) {
    return new Blob([item.content]).size;
  }
  return item.properties?.size as number | undefined;
}

export function isValidUrl(urlString: string | undefined): boolean {
  if (!urlString) return false;
  try {
    new URL(urlString);
    return true;
  } catch {
    return false;
  }
}

export function normalizeUrl(url: string | undefined): string | undefined {
  if (!url || url.length === 0) return url;
  return url.startsWith('http') ? url : `https://${url}`;
}
