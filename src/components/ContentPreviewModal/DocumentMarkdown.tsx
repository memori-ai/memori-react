import React, { useMemo } from 'react';
import { renderMsg } from '../../helpers/message';
import {
  stripDocumentAttachmentTags,
  stripHTML,
} from '../../helpers/utils';

export function prepareDocumentPreviewContent(content: string): string {
  if (!content) return '';

  let displayContent = content;
  if (
    displayContent.includes('&lt;') ||
    displayContent.includes('&quot;')
  ) {
    displayContent = stripHTML(displayContent) || displayContent;
  }
  displayContent = stripDocumentAttachmentTags(displayContent);

  return displayContent.replace(/\n{3,}/g, '\n\n').trim();
}

/** Trailing `[…]` block UploadButton appends after truncated excerpts. */
const TRAILING_BRACKET_NOTE_RE = /\n\n\[([^\]]+)\]\s*$/;

/**
 * Known truncation-note shapes from upload.truncationExcerpt /
 * upload.truncationGeneric (IT/EN/DE/FR/ES). Requires more than a bare `[…]`.
 */
const TRUNCATION_NOTE_SHAPE_RE =
  /^(?:(?:Estratto:|Excerpt:|Auszug:|Extrait\s*:|Extracto:).*\d+.*\d+|Contenuto troncato per limiti di dimensione\.|Content truncated due to size limits\.|Inhalt wegen Größenbeschränkung gekürzt\.|Contenu tronqué en raison des limites de taille\.|Contenido truncado por límites de tamaño\.)/i;

export type PreviewTruncationSplit = {
  body: string;
  note?: string;
};

/**
 * Preview-only: peel the UploadButton truncation note off prepared content
 * so it can be rendered as a callout instead of markdown body copy.
 */
export function splitPreviewTruncationNote(
  prepared: string
): PreviewTruncationSplit {
  if (!prepared) return { body: '' };

  const match = prepared.match(TRAILING_BRACKET_NOTE_RE);
  if (!match) return { body: prepared };

  const note = match[1].trim();
  if (!TRUNCATION_NOTE_SHAPE_RE.test(note)) {
    return { body: prepared };
  }

  return {
    body: prepared.slice(0, match.index).trimEnd(),
    note,
  };
}

type DocumentMarkdownProps = {
  content: string;
};

const DocumentMarkdown: React.FC<DocumentMarkdownProps> = ({ content }) => {
  const { bodyHtml, note } = useMemo(() => {
    const prepared = prepareDocumentPreviewContent(content);
    if (!prepared) return { bodyHtml: '', note: undefined as string | undefined };

    const { body, note: truncationNote } = splitPreviewTruncationNote(prepared);
    if (!body) {
      return { bodyHtml: '', note: truncationNote };
    }

    return {
      bodyHtml: renderMsg(body, false, 'Reasoning...', false).text,
      note: truncationNote,
    };
  }, [content]);

  if (!bodyHtml && !note) return null;

  return (
    <>
      {bodyHtml ? (
        <div
          className="memori-content-preview-modal--markdown"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      ) : null}
      {note ? (
        <aside
          className="memori-content-preview-modal--truncation-note"
          role="note"
        >
          {note}
        </aside>
      ) : null}
    </>
  );
};

export default DocumentMarkdown;
