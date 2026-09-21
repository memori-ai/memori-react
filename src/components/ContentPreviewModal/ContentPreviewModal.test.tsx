import React from 'react';
import fs from 'fs';
import path from 'path';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContentPreviewModal from './ContentPreviewModal';
import DocumentMarkdown, {
  prepareDocumentPreviewContent,
} from './DocumentMarkdown';

describe('prepareDocumentPreviewContent', () => {
  it('strips document attachment tags and keeps markdown', () => {
    const raw =
      '<document_attachment filename="note.md" type="text/markdown"># Hello\n\n**bold**</document_attachment>';
    expect(prepareDocumentPreviewContent(raw)).toBe('# Hello\n\n**bold**');
  });

  it('collapses extra blank lines', () => {
    expect(prepareDocumentPreviewContent('a\n\n\n\nb')).toBe('a\n\nb');
  });
});

describe('DocumentMarkdown', () => {
  it('renders headings, bold and inline code', () => {
    render(
      <DocumentMarkdown content={'# Obiettivo\n\nCambia **questa** frase (`code`).'} />
    );
    expect(
      screen.getByRole('heading', { level: 1, name: 'Obiettivo' })
    ).toBeInTheDocument();
    expect(screen.getByText('questa').tagName).toBe('STRONG');
    expect(screen.getByText('code').tagName).toBe('CODE');
  });
});

describe('ContentPreviewModal', () => {
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('wraps a long title so it stays readable', () => {
    render(
      <ContentPreviewModal
        open
        onClose={onClose}
        title="artifact-targeted-edits-with-a-very-long-filename.md"
        description="MD"
        headerIcon={<span data-testid="file-icon" />}
        contentKind="document"
      >
        <p>Body</p>
      </ContentPreviewModal>
    );

    const title = screen.getByText(
      'artifact-targeted-edits-with-a-very-long-filename.md'
    );
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('memori-content-preview-modal--heading-title');
    expect(screen.getByText('MD')).toBeInTheDocument();
    expect(screen.getByTestId('file-icon')).toBeInTheDocument();
  });

  it('shows a scroll cue when content overflows and hides it at the bottom', () => {
    render(
      <ContentPreviewModal open onClose={onClose} title="Notes">
        <p>Long body</p>
      </ContentPreviewModal>
    );

    const wrap = screen.getByTestId('content-preview-scroll-body');

    let scrollTop = 0;
    Object.defineProperty(wrap, 'scrollHeight', {
      configurable: true,
      get: () => 900,
    });
    Object.defineProperty(wrap, 'clientHeight', {
      configurable: true,
      get: () => 200,
    });
    Object.defineProperty(wrap, 'scrollTop', {
      configurable: true,
      get: () => scrollTop,
      set: (value: number) => {
        scrollTop = value;
      },
    });
    wrap.scrollBy = ((options?: { top?: number }) => {
      wrap.scrollTop += options?.top ?? 0;
    }) as typeof wrap.scrollBy;

    expect(wrap.scrollHeight - wrap.clientHeight).toBeGreaterThan(8);
    fireEvent.scroll(wrap);

    const cue = screen.getByRole('button', {
      name: 'scrollToContinueReading',
    });
    expect(cue).toBeInTheDocument();

    fireEvent.click(cue);
    expect(scrollTop).toBeGreaterThan(0);
  });

  it('caps the popup to the visible viewport so the close control stays reachable', () => {
    const css = fs.readFileSync(
      path.join(__dirname, 'ContentPreviewModal.css'),
      'utf8'
    );
    const popupRule = css.match(
      /\.memori-content-preview-modal\.memori-modal__viewport \.memori-modal__popup \{[\s\S]*?\n\}/
    )?.[0];

    expect(popupRule).toBeDefined();
    expect(popupRule).toMatch(/min-height:\s*0;/);
    expect(popupRule).toMatch(/100dvh/);
    expect(popupRule).toMatch(/max-height:/);
    expect(css).not.toMatch(
      /\.memori-modal__popup \{[\s\S]*?min-height:\s*auto;/
    );
  });
});
