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

type DocumentMarkdownProps = {
  content: string;
};

const DocumentMarkdown: React.FC<DocumentMarkdownProps> = ({ content }) => {
  const html = useMemo(() => {
    const prepared = prepareDocumentPreviewContent(content);
    if (!prepared) return '';
    return renderMsg(prepared, false, 'Reasoning...', false).text;
  }, [content]);

  if (!html) return null;

  return (
    <div
      className="memori-content-preview-modal--markdown"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default DocumentMarkdown;
