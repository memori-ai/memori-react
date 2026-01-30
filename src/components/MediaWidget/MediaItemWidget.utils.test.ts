import {
  formatBytes,
  getFileExtensionFromUrl,
  getFileExtensionFromMime,
  countLines,
  shouldUseDarkFileCard,
  fetchLinkPreview,
  getContentSize,
  isValidUrl,
  normalizeUrl,
  getImageDisplaySource,
  FILE_EXTENSIONS_DARK_CARD,
  FILE_MIME_TYPES_DARK_CARD,
  TEXT_FILE_EXTENSIONS,
  IMAGE_MIME_TYPES,
  FALLBACK_IMAGE_BASE64,
} from './MediaItemWidget.utils';
import type { Medium } from '@memori.ai/memori-api-client/dist/types';

describe('MediaItemWidget.utils', () => {
  describe('formatBytes', () => {
    it('returns "0 Bytes" for undefined or 0', () => {
      expect(formatBytes(undefined)).toBe('0 Bytes');
      expect(formatBytes(0)).toBe('0 Bytes');
    });

    it('formats bytes correctly', () => {
      expect(formatBytes(1)).toBe('1 Bytes');
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(1536)).toBe('1.5 KB');
      expect(formatBytes(1024 * 1024)).toBe('1 MB');
      expect(formatBytes(1024 * 1024 * 1024)).toBe('1 GB');
    });
  });

  describe('getFileExtensionFromUrl', () => {
    it('returns null for undefined or empty url', () => {
      expect(getFileExtensionFromUrl(undefined)).toBeNull();
      expect(getFileExtensionFromUrl('')).toBeNull();
    });

    it('extracts extension from url', () => {
      expect(getFileExtensionFromUrl('https://example.com/file.pdf')).toBe('PDF');
      expect(getFileExtensionFromUrl('https://example.com/doc.xlsx?token=abc')).toBe('XLSX');
      expect(getFileExtensionFromUrl('image.png')).toBe('PNG');
      expect(getFileExtensionFromUrl('file.Md')).toBe('MD');
    });

    it('returns null when no extension', () => {
      expect(getFileExtensionFromUrl('https://example.com/path')).toBeNull();
    });
  });

  describe('getFileExtensionFromMime', () => {
    it('maps known mime types to extensions', () => {
      expect(getFileExtensionFromMime('application/pdf')).toBe('PDF');
      expect(getFileExtensionFromMime('text/html')).toBe('HTML');
      expect(getFileExtensionFromMime('text/plain')).toBe('TXT');
      expect(getFileExtensionFromMime('application/json')).toBe('JSON');
      expect(getFileExtensionFromMime('application/vnd.ms-excel')).toBe('XLS');
      expect(getFileExtensionFromMime('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')).toBe('XLSX');
    });

    it('uses subtype when not in MIME_TO_EXT map', () => {
      expect(getFileExtensionFromMime('application/octet-stream')).toBe('OCTET-STREAM');
      expect(getFileExtensionFromMime('image/jpeg')).toBe('JPEG');
    });

    it('falls back to FILE when mime has no subtype', () => {
      expect(getFileExtensionFromMime('unknown')).toBe('FILE');
    });
  });

  describe('countLines', () => {
    it('returns 0 for undefined or empty', () => {
      expect(countLines(undefined)).toBe(0);
      expect(countLines('')).toBe(0);
    });

    it('counts lines with \\n', () => {
      expect(countLines('a')).toBe(1);
      expect(countLines('a\nb')).toBe(2);
      expect(countLines('a\nb\nc')).toBe(3);
    });

    it('counts lines with \\r\\n', () => {
      expect(countLines('a\r\nb')).toBe(2);
    });

    it('counts lines with \\r', () => {
      expect(countLines('a\rb')).toBe(2);
    });
  });

  describe('shouldUseDarkFileCard', () => {
    const dummyItem: Medium = {
      mediumID: 'id',
      mimeType: 'text/plain',
      title: 'File',
      url: 'https://example.com/file.txt',
    };

    it('returns true when file extension is in FILE_EXTENSIONS_DARK_CARD', () => {
      (FILE_EXTENSIONS_DARK_CARD as readonly string[]).forEach((ext) => {
        expect(shouldUseDarkFileCard(dummyItem, ext, 'application/octet-stream')).toBe(true);
      });
    });

    it('returns true when mime type is in FILE_MIME_TYPES_DARK_CARD', () => {
      (FILE_MIME_TYPES_DARK_CARD as readonly string[]).forEach((mime) => {
        expect(shouldUseDarkFileCard(dummyItem, null, mime)).toBe(true);
      });
    });

    it('returns false for unknown extension and mime', () => {
      expect(shouldUseDarkFileCard(dummyItem, null, 'application/octet-stream')).toBe(false);
      expect(shouldUseDarkFileCard(dummyItem, 'XYZ', 'application/octet-stream')).toBe(false);
    });
  });

  describe('fetchLinkPreview', () => {
    const originalFetch = globalThis.fetch;

    afterEach(() => {
      globalThis.fetch = originalFetch;
    });

    it('returns link preview when fetch succeeds', async () => {
      const mockData = {
        title: 'Example',
        description: 'A site',
        image: 'https://example.com/og.png',
      };
      globalThis.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await fetchLinkPreview('https://example.com');
      expect(result).toEqual(mockData);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/linkpreview/')
      );
    });

    it('uses provided baseUrl', async () => {
      globalThis.fetch = jest.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });
      await fetchLinkPreview('https://example.com', 'https://custom.api');
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/^https:\/\/custom\.api\/api\/linkpreview\//)
      );
    });

    it('returns null when fetch fails', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      globalThis.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      const result = await fetchLinkPreview('https://example.com');
      expect(result).toBeNull();
      consoleSpy.mockRestore();
    });
  });

  describe('getContentSize', () => {
    it('returns blob size when content is present', () => {
      const item: Medium = {
        mediumID: 'id',
        mimeType: 'text/plain',
        title: 'File',
        content: 'hello',
      };
      expect(getContentSize(item)).toBe(5);
    });

    it('returns properties.size when no content', () => {
      const item: Medium = {
        mediumID: 'id',
        mimeType: 'application/pdf',
        title: 'Doc',
        url: 'https://example.com/doc.pdf',
        properties: { size: 1024 },
      };
      expect(getContentSize(item)).toBe(1024);
    });

    it('returns undefined when no content and no size property', () => {
      const item: Medium = {
        mediumID: 'id',
        mimeType: 'text/plain',
        title: 'File',
      };
      expect(getContentSize(item)).toBeUndefined();
    });
  });

  describe('isValidUrl', () => {
    it('returns false for undefined or empty', () => {
      expect(isValidUrl(undefined)).toBe(false);
      expect(isValidUrl('')).toBe(false);
    });

    it('returns true for valid URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://localhost:3000')).toBe(true);
      expect(isValidUrl('https://memori.ai/path')).toBe(true);
    });

    it('returns false for invalid URLs', () => {
      expect(isValidUrl('not a url')).toBe(false);
      expect(isValidUrl('ftp://')).toBe(false);
    });
  });

  describe('normalizeUrl', () => {
    it('returns undefined for undefined or empty', () => {
      expect(normalizeUrl(undefined)).toBeUndefined();
      expect(normalizeUrl('')).toBe('');
    });

    it('leaves http URLs unchanged', () => {
      expect(normalizeUrl('https://example.com')).toBe('https://example.com');
      expect(normalizeUrl('http://example.com')).toBe('http://example.com');
    });

    it('prepends https when no protocol', () => {
      expect(normalizeUrl('example.com')).toBe('https://example.com');
      expect(normalizeUrl('memori.ai/path')).toBe('https://memori.ai/path');
    });
  });

  describe('getImageDisplaySource', () => {
    it('returns resource URL when resourceUrl is valid', () => {
      const item: Medium & { type?: string } = {
        mediumID: 'id',
        mimeType: 'image/png',
        title: 'Image',
        url: 'https://example.com/img.png',
      };
      const resourceUrl = 'https://cdn.example.com/img.png';
      expect(getImageDisplaySource(item, resourceUrl)).toEqual({
        src: resourceUrl,
        isRgb: false,
      });
    });

    it('returns item.url when resourceUrl is empty but item.url is valid', () => {
      const item: Medium & { type?: string } = {
        mediumID: 'id',
        mimeType: 'image/jpeg',
        title: 'Image',
        url: 'https://example.com/photo.jpg',
      };
      expect(getImageDisplaySource(item, '')).toEqual({
        src: 'https://example.com/photo.jpg',
        isRgb: false,
      });
    });

    it('returns rgb/rgba as src and isRgb true', () => {
      const item: Medium & { type?: string } = {
        mediumID: 'id',
        mimeType: 'image/png',
        title: 'Swatch',
        url: 'rgb(255, 0, 0)',
      };
      expect(getImageDisplaySource(item, '')).toEqual({
        src: 'rgb(255, 0, 0)',
        isRgb: true,
      });
      const itemRgba: Medium & { type?: string } = {
        ...item,
        url: 'rgba(0, 128, 255, 0.5)',
      };
      expect(getImageDisplaySource(itemRgba, '')).toEqual({
        src: 'rgba(0, 128, 255, 0.5)',
        isRgb: true,
      });
    });

    it('returns base64 data URL when content is present and no valid URL', () => {
      const item: Medium & { type?: string } = {
        mediumID: 'id',
        mimeType: 'image/png',
        title: 'Inline',
        content: 'abc123',
      };
      expect(getImageDisplaySource(item, '')).toEqual({
        src: 'data:image/png;base64,abc123',
        isRgb: false,
      });
    });

    it('returns undefined src when no valid URL, no rgb, no content', () => {
      const item: Medium & { type?: string } = {
        mediumID: 'id',
        mimeType: 'image/png',
        title: 'Missing',
      };
      expect(getImageDisplaySource(item, '')).toEqual({
        src: undefined,
        isRgb: false,
      });
    });
  });

  describe('constants', () => {
    it('FALLBACK_IMAGE_BASE64 is a data URL', () => {
      expect(FALLBACK_IMAGE_BASE64).toMatch(/^data:image\/svg\+xml;base64,/);
    });

    it('TEXT_FILE_EXTENSIONS includes expected extensions', () => {
      expect(TEXT_FILE_EXTENSIONS).toContain('TXT');
      expect(TEXT_FILE_EXTENSIONS).toContain('HTML');
      expect(TEXT_FILE_EXTENSIONS).toContain('MD');
      expect(TEXT_FILE_EXTENSIONS).toContain('JSON');
    });

    it('IMAGE_MIME_TYPES includes image types', () => {
      expect(IMAGE_MIME_TYPES).toContain('image/jpeg');
      expect(IMAGE_MIME_TYPES).toContain('image/png');
      expect(IMAGE_MIME_TYPES).toContain('image/gif');
    });
  });
});
