import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MediaPreviewModal } from './MediaPreviewModal';
import type { Medium } from '@memori.ai/memori-api-client/dist/types';

beforeAll(() => {
  if (typeof window !== 'undefined' && !window.IntersectionObserver) {
    (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  }
  if (typeof global !== 'undefined' && !globalThis.IntersectionObserver) {
    (globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  }
});

jest.mock('../../helpers/media', () => ({
  getResourceUrl: jest.fn(({ resourceURI }: { resourceURI?: string }) =>
    resourceURI ? `https://resolved.example.com/${resourceURI}` : ''
  ),
}));

describe('MediaPreviewModal', () => {
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('images', () => {
    it('renders image in ContentPreviewModal with title and src', () => {
      const medium: Medium = {
        mediumID: 'img-1',
        mimeType: 'image/jpeg',
        title: 'Photo',
        url: 'https://example.com/photo.jpg',
      };
      render(
        <MediaPreviewModal medium={medium} onClose={onClose} />
      );
      expect(screen.getByAltText('Photo')).toBeInTheDocument();
      expect(screen.getByAltText('Photo')).toHaveAttribute('src', expect.stringContaining('photo.jpg'));
    });

    it('uses base64 data URL when image has content', () => {
      const medium: Medium = {
        mediumID: 'img-2',
        mimeType: 'image/png',
        title: 'Inline',
        content: 'base64content',
      };
      render(
        <MediaPreviewModal medium={medium} onClose={onClose} />
      );
      const img = screen.getByAltText('Inline');
      expect(img).toHaveAttribute('src', expect.stringMatching(/^data:image\/png;base64,/));
    });
  });

  describe('code', () => {
    it('renders code snippet with Snippet component', () => {
      const medium: Medium = {
        mediumID: 'code-1',
        mimeType: 'text/javascript',
        title: 'Script',
        content: 'console.log("hello");',
      };
      render(
        <MediaPreviewModal medium={medium} onClose={onClose} />
      );
      expect(screen.getByText(/console\.log/)).toBeInTheDocument();
    });
  });

  describe('PDF', () => {
    it('renders PDF in iframe when url or content present', () => {
      const medium: Medium = {
        mediumID: 'pdf-1',
        mimeType: 'application/pdf',
        title: 'Document',
        url: 'https://example.com/doc.pdf',
      };
      render(
        <MediaPreviewModal medium={medium} onClose={onClose} sessionID="s1" baseURL="https://api.example.com" />
      );
      const iframe = screen.getByTitle('Document');
      expect(iframe).toBeInTheDocument();
      expect(iframe.tagName).toBe('IFRAME');
    });
  });

  describe('Excel', () => {
    it('renders Excel in iframe when url or content present', () => {
      const medium: Medium = {
        mediumID: 'xls-1',
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        title: 'Sheet',
        url: 'https://example.com/sheet.xlsx',
      };
      render(
        <MediaPreviewModal medium={medium} onClose={onClose} />
      );
      const iframe = screen.getByTitle('Sheet');
      expect(iframe).toBeInTheDocument();
    });
  });

  describe('HTML', () => {
    it('renders HTML link in iframe when only url', () => {
      const medium: Medium = {
        mediumID: 'html-1',
        mimeType: 'text/html',
        title: 'Page',
        url: 'example.com/page',
      };
      render(
        <MediaPreviewModal medium={medium} onClose={onClose} />
      );
      const iframe = screen.getByTitle('Page');
      expect(iframe).toBeInTheDocument();
      expect(iframe).toHaveAttribute('src', 'https://example.com/page');
    });

    it('renders HTML with content as stripped text in Snippet', () => {
      const medium: Medium = {
        mediumID: 'html-2',
        mimeType: 'text/html',
        title: 'Inline HTML',
        content: '<p>Hello world</p>',
      };
      render(
        <MediaPreviewModal medium={medium} onClose={onClose} />
      );
      expect(screen.getByText(/Hello world/)).toBeInTheDocument();
    });
  });

  describe('video and audio', () => {
    it('renders video with native controls', () => {
      const medium: Medium = {
        mediumID: 'vid-1',
        mimeType: 'video/mp4',
        title: 'Clip',
        url: 'https://example.com/video.mp4',
      };
      render(
        <MediaPreviewModal medium={medium} onClose={onClose} />
      );
      const video = document.querySelector('video');
      expect(video).toBeInTheDocument();
      expect(video).toHaveAttribute('src', expect.stringContaining('video.mp4'));
    });

    it('renders audio with title and controls', () => {
      const medium: Medium = {
        mediumID: 'aud-1',
        mimeType: 'audio/mpeg',
        title: 'Track',
        url: 'https://example.com/audio.mp3',
      };
      render(
        <MediaPreviewModal medium={medium} onClose={onClose} />
      );
      expect(screen.getAllByText('Track').length).toBeGreaterThan(0);
      const audio = document.querySelector('audio');
      expect(audio).toBeInTheDocument();
    });
  });

  describe('plain text and markdown', () => {
    it('renders plain text in Snippet', () => {
      const medium: Medium = {
        mediumID: 'txt-1',
        mimeType: 'text/plain',
        title: 'Notes',
        content: 'Some plain text.',
      };
      render(
        <MediaPreviewModal medium={medium} onClose={onClose} />
      );
      expect(screen.getByText(/Some plain text/)).toBeInTheDocument();
    });

    it('renders markdown in Snippet', () => {
      const medium: Medium = {
        mediumID: 'md-1',
        mimeType: 'text/markdown',
        title: 'Readme',
        content: '# Title\n\nParagraph.',
      };
      render(
        <MediaPreviewModal medium={medium} onClose={onClose} />
      );
      expect(screen.getByText(/# Title/)).toBeInTheDocument();
    });
  });

  describe('Word / fallback', () => {
    it('shows "Preview not available" for Word docs with Open and Download', () => {
      const medium: Medium = {
        mediumID: 'doc-1',
        mimeType: 'application/msword',
        title: 'Report.doc',
        url: 'https://example.com/report.doc',
      };
      render(
        <MediaPreviewModal medium={medium} onClose={onClose} />
      );
      expect(screen.getByText(/Preview not available for this document/)).toBeInTheDocument();
      expect(screen.getByText(/Open in new tab/)).toBeInTheDocument();
      expect(screen.getByText(/Download/)).toBeInTheDocument();
    });

    it('shows generic fallback for unknown file type', () => {
      const medium: Medium = {
        mediumID: 'unk-1',
        mimeType: 'application/octet-stream',
        title: 'file.bin',
        url: 'https://example.com/file.bin',
      };
      render(
        <MediaPreviewModal medium={medium} onClose={onClose} />
      );
      expect(screen.getByText(/Preview not available for this file type/)).toBeInTheDocument();
    });
  });

  describe('document attachment content', () => {
    it('renders document attachment text in Snippet', () => {
      const medium: Medium = {
        mediumID: 'att-1',
        mimeType: 'text/plain',
        title: 'Extracted',
        content: 'Extracted text from PDF',
        properties: { isDocumentAttachment: true },
      };
      render(
        <MediaPreviewModal medium={medium} onClose={onClose} />
      );
      expect(screen.getByText(/Extracted text from PDF/)).toBeInTheDocument();
    });
  });

  describe('onClose', () => {
    it('modal can be closed via ContentPreviewModal', () => {
      const medium: Medium = {
        mediumID: 'img-1',
        mimeType: 'image/jpeg',
        title: 'Photo',
        url: 'https://example.com/photo.jpg',
      };
      render(
        <MediaPreviewModal medium={medium} onClose={onClose} />
      );
      const closeWrapper = document.querySelector('.memori-modal--close');
      expect(closeWrapper).toBeInTheDocument();
      const closeButton = closeWrapper?.querySelector('button');
      if (closeButton) {
        fireEvent.click(closeButton);
        expect(onClose).toHaveBeenCalled();
      }
    });
  });
});
