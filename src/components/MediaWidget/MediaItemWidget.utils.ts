import type { Medium } from '@memori.ai/memori-api-client/dist/types';
import {
  officeExtensionShortLabels,
  officeMimeShortLabels,
} from '../../helpers/constants';
import type { LinkPreviewInfo } from './MediaItemWidget.types';

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
] as const;

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

export const DATA_PREVIEW_MIME_TYPES = [
  'application/json',
  'text/csv',
  'text/xml',
  'application/xml',
] as const;

export type DataPreviewRow = { label: string; value: string };

const MIME_TO_EXT: Record<string, string> = {
  'application/pdf': 'PDF',
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

function normalizeMimeType(mimeType: string): string {
  return mimeType.split(';')[0].trim();
}

export function getFileExtensionFromMime(mimeType: string): string {
  const normalized = normalizeMimeType(mimeType);
  const normalizedLower = normalized.toLowerCase();

  const officeLabel =
    officeMimeShortLabels[normalized] ||
    officeMimeShortLabels[normalizedLower];
  if (officeLabel) return officeLabel;

  return (
    MIME_TO_EXT[normalized] ||
    MIME_TO_EXT[normalizedLower] ||
    MIME_TO_EXT[mimeType] ||
    normalized.split('/')[1]?.toUpperCase() ||
    'FILE'
  );
}

export function getDocumentBadgeLabel(
  mimeType: string,
  filename?: string | null,
  url?: string | null
): string {
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

export function isDataPreviewMime(mimeType: string): boolean {
  const normalized = normalizeMimeType(mimeType).toLowerCase();
  return (DATA_PREVIEW_MIME_TYPES as readonly string[]).includes(normalized);
}

export function parseDataPreviewRows(
  content: string | undefined,
  mimeType: string
): DataPreviewRow[] {
  if (!content?.trim()) return [];
  const normalized = normalizeMimeType(mimeType).toLowerCase();
  try {
    if (normalized === 'application/json') {
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return Object.entries(parsed)
          .slice(0, 4)
          .map(([label, value]) => ({
            label,
            value: value == null ? '' : String(value),
          }));
      }
      if (Array.isArray(parsed)) {
        return parsed.slice(0, 4).map((row, i) => ({
          label: String(i),
          value: typeof row === 'object' ? JSON.stringify(row) : String(row),
        }));
      }
      return [];
    }
    if (normalized === 'text/csv') {
      return content
        .trim()
        .split(/\r?\n/)
        .slice(0, 4)
        .map(line => {
          const [label, ...rest] = line.split(',');
          return { label: label?.trim() ?? '', value: rest.join(',').trim() };
        });
    }
    if (normalized === 'text/xml' || normalized === 'application/xml') {
      const pairs = [
        ...content.matchAll(/<([A-Za-z_][\w.-]*)>([^<]{1,80})<\/\1>/g),
      ].slice(0, 4);
      return pairs.map(m => ({ label: m[1], value: m[2].trim() }));
    }
  } catch {
    return [];
  }
  return [];
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

// ---------------------------------------------------------------------------
// Image source resolution (single source of truth for widget + modal)
// ---------------------------------------------------------------------------

export type ImageDisplaySource = {
  /** Resolved URL or data URL for <img src>; undefined if no displayable source */
  src: string | undefined;
  /** True when item.url is a CSS color (rgb/rgba) — render as colored swatch, not <img> */
  isRgb: boolean;
};

/**
 * Resolves the display source for an image medium. Used by both the grid thumbnail
 * and the preview modal so they stay in sync (resource URL, base64 content, or rgb/rgba).
 */
export function getImageDisplaySource(
  item: Medium & { type?: string },
  resourceUrl: string
): ImageDisplaySource {
  const hasValidUrl =
    isValidUrl(resourceUrl) || isValidUrl(item.url);
  const isRgb =
    !!item.url &&
    (item.url.startsWith('rgb(') || item.url.startsWith('rgba('));

  let src: string | undefined;
  if (hasValidUrl) {
    src = resourceUrl || item.url;
  } else if (isRgb) {
    src = item.url;
  } else if (item.content) {
    src = `data:${item.mimeType};base64,${item.content}`;
  } else {
    src = undefined;
  }

  return { src, isRgb };
}
