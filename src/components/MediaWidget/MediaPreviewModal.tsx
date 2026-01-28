import type { Medium } from '@memori.ai/memori-api-client/dist/types';
import React from 'react';
import { getResourceUrl } from '../../helpers/media';
import { prismSyntaxLangs } from '../../helpers/constants';
import { stripHTML, stripDocumentAttachmentTags, withLinksOpenInNewTab } from '../../helpers/utils';
import Snippet from '../Snippet/Snippet';
import ContentPreviewModal from '../ContentPreviewModal';
import ModelViewer from '../CustomGLBModelViewer/ModelViewer';
import { IMAGE_MIME_TYPES } from './MediaItemWidget.utils';

/*
 * Media types handled in MediaPreviewModal and recommended UX:
 *
 * 1. IMAGES (image/jpeg, image/png, image/jpg, image/gif)
 *    → Full-size in modal with title. Object-fit contain, optional alt.
 *
 * 2. CODE (text/javascript, text/ecmascript, application/json, text/css, application/xml,
 *    application/x-sh, text/x-python, text/x-c++src, application/x-php, text/x-ruby, text/x-sql)
 *    → Snippet with syntax highlighting and copy button.
 *
 * 3. PDF (application/pdf)
 *    → Inline iframe preview; base64 or resource URL.
 *
 * 4. EXCEL (application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)
 *    → Inline iframe preview; base64 or resource URL.
 *
 * 5. HTML WITH CONTENT (text/html + content)
 *    → Snippet showing stripped HTML as plain text.
 *
 * 6. HTML LINK (text/html + url only)
 *    → Iframe loading the URL (https normalized).
 *
 * 7. VIDEO (video/mp4, video/quicktime, video/avi, video/mpeg)
 *    → Native <video> with controls; base64 or resource URL.
 *
 * 8. AUDIO (audio/mpeg3, audio/wav, audio/mpeg)
 *    → Native <audio> with controls; clear label and optional poster.
 *
 * 9. 3D MODEL (model/gltf-binary)
 *    → ModelViewer in modal with fixed height and camera controls.
 *
 * 10. PLAIN TEXT (text/plain)
 *     → Snippet (language-text) for readable, copyable content.
 *
 * 11. MARKDOWN (text/markdown)
 *     → Snippet for now (readable as text); can be upgraded to rendered markdown later.
 *
 * 12. WORD / OTHER DOCS (application/msword, application/vnd...wordprocessingml.document, etc.)
 *     → No reliable in-browser preview; show “Preview not available” + Open in new tab + Download.
 *
 * 13. UNKNOWN / FALLBACK
 *     → Never empty: show title, type, and Open in new tab / Download.
 */

// Collect supported code mime types for quick lookup
const CODE_MIME_TYPES = prismSyntaxLangs.map((l) => l.mimeType);

// Constants for file type mime types
const MIME_PDF = 'application/pdf';
const MIME_EXCEL_XLS = 'application/vnd.ms-excel';
const MIME_EXCEL_XLSX =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const MIME_HTML = 'text/html';
const MIME_PLAIN = 'text/plain';
const MIME_MARKDOWN = 'text/markdown';
const MIME_WORD_DOC = 'application/msword';
const MIME_WORD_DOCX =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

const VIDEO_MIME_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/avi',
  'video/mpeg',
] as const;

const AUDIO_MIME_TYPES = [
  'audio/mpeg3',
  'audio/wav',
  'audio/mpeg',
] as const;

const MIME_3D_GLB = 'model/gltf-binary';

// Placeholder for 3D model loading (gray 200x200 SVG)
const DEFAULT_GLB_POSTER =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2U1ZTdlYiIvPjwvc3ZnPg==';

function isVideo(mimeType: string): boolean {
  return (VIDEO_MIME_TYPES as readonly string[]).includes(mimeType);
}

function isAudio(mimeType: string): boolean {
  return (AUDIO_MIME_TYPES as readonly string[]).includes(mimeType);
}

function isWordDoc(mimeType: string): boolean {
  return mimeType === MIME_WORD_DOC || mimeType === MIME_WORD_DOCX;
}

// Document attachments (PDF, XLSX, TXT, CSV, etc.) are extracted as text, not binary.
// Detect when content is actually plain text / XML from document_attachment so we render it as text.
function isDocumentAttachmentContent(content: string | null | undefined): boolean {
  if (!content || typeof content !== 'string') return false;
  const trimmed = content.trim();
  return (
    trimmed.includes('document_attachment') ||
    trimmed.includes('<document_attachment') ||
    trimmed.includes('</document_attachment>') ||
    trimmed.includes('&lt;document_attachment') ||
    trimmed.includes('&lt;/document_attachment&gt;') ||
    (trimmed.startsWith('<') && trimmed.includes('>') && trimmed.length < 10000) // Likely XML/text, not binary
  );
}

// Props for the MediaPreviewModal component
export interface MediaPreviewModalProps {
  medium: Medium;
  onClose: () => void;
  sessionID?: string;
  tenantID?: string;
  baseURL?: string;
  apiURL?: string;
  customMediaRenderer?: (mimeType: string) => JSX.Element | null;
  descriptionOneLine?: boolean;
  onLinkPreviewInfo?: (info: import('./MediaItemWidget.types').LinkPreviewInfo) => void;
  onMediumClick?: (mediumID: string) => void;
}

// MediaPreviewModal displays a modal preview of a media file, including special handling for code, PDF, HTML, etc.
export function MediaPreviewModal({
  medium,
  onClose,
  sessionID,
  tenantID,
  baseURL,
  apiURL,
  customMediaRenderer: _customMediaRenderer,
  descriptionOneLine: _descriptionOneLine,
  onLinkPreviewInfo: _onLinkPreviewInfo,
  onMediumClick: _onMediumClick,
}: MediaPreviewModalProps): React.ReactElement {
  // Determine the preview url for the medium based on its properties and the current session
  const previewUrl = getResourceUrl({
    resourceURI: medium.url,
    sessionID,
    tenantID,
    baseURL,
    apiURL,
  });

  // Check if this is a document attachment (extracted text, not binary file)
  // Document attachments can be PDF, XLSX, TXT, CSV, HTML, JSON, MD - all converted to text
  const isDocumentAttachment =
    medium.properties?.isDocumentAttachment === true ||
    isDocumentAttachmentContent(medium.content);

  // Detect the type of the medium for custom rendering logic
  const isImage = IMAGE_MIME_TYPES.includes(medium.mimeType as (typeof IMAGE_MIME_TYPES)[number]);
  const isCode = CODE_MIME_TYPES.includes(medium.mimeType);
  const isPdf = medium.mimeType === MIME_PDF && !isDocumentAttachment;
  const isExcel =
    (medium.mimeType === MIME_EXCEL_XLS || medium.mimeType === MIME_EXCEL_XLSX) &&
    !isDocumentAttachment;
  const isHtmlWithContent = medium.mimeType === MIME_HTML && !!medium.content;
  const isHtmlLink =
    medium.mimeType === MIME_HTML && !!medium.url;
  const isVideoType = isVideo(medium.mimeType);
  const isAudioType = isAudio(medium.mimeType);
  const is3D = medium.mimeType === MIME_3D_GLB;
  const isPlainText = medium.mimeType === MIME_PLAIN || isDocumentAttachment;
  const isMarkdown = medium.mimeType === MIME_MARKDOWN;
  const isWordType = isWordDoc(medium.mimeType);

  // Video/audio src: data URL from content or resource URL
  const mediaSrc =
    medium.content != null
      ? `data:${medium.mimeType};base64,${medium.content}`
      : previewUrl;
  const hasMediaSrc = !!mediaSrc;
  const glbSrc =
    medium.content != null
      ? `data:model/gltf-binary;base64,${medium.content}`
      : previewUrl;

  // Image src: resource URL or data URL
  const imageSrc = isImage
    ? medium.content
      ? `data:${medium.mimeType};base64,${medium.content}`
      : previewUrl
    : undefined;

  // For Excel and similar types, prepare an iframe src using either content (data URL) or preview url
  const iframeSrcFromContent = medium.content
    ? `data:${medium.mimeType};base64,${medium.content}`
    : previewUrl;

  // For HTML links, ensure the link src starts with "http" or prepend "https://"
  const htmlLinkSrc =
    !medium.url || medium.url.startsWith('http')
      ? medium.url
      : `https://${medium.url}`;

  // HTML/content as text: render inside Snippet (converted to text)
  const htmlAsTextMedium: Medium = {
    ...medium,
    mimeType: 'text/plain',
    content: stripHTML(medium.content || ''),
  };

  if (isImage && imageSrc) {
    return (
      <ContentPreviewModal
        open
        onClose={onClose}
        title={medium.title ?? undefined}
        isImage
        imageSrc={imageSrc}
        imageAlt={medium.title ?? ''}
      />
    );
  }

  return (
    <ContentPreviewModal
      open
      onClose={onClose}
      title={medium.title ?? undefined}
    >
      {isCode ? (
        <Snippet preview={false} medium={medium} />
      ) : isDocumentAttachment && medium.content ? (
        // Document attachments contain extracted text, not binary data
        // For HTML document attachments, open in new tab; for others, render as plain text
        (() => {
          const isHtmlDocumentAttachment = 
            medium.mimeType === MIME_HTML && isDocumentAttachment;
          
          if (isHtmlDocumentAttachment) {
            // HTML document attachment: display HTML content in a code-like format
            let htmlContent = medium.content || '';
            if (htmlContent.includes('&lt;') || htmlContent.includes('&quot;')) {
              const div = document.createElement('div');
              div.innerHTML = htmlContent;
              htmlContent = div.textContent || div.innerText || htmlContent;
            } else {
              htmlContent = stripDocumentAttachmentTags(htmlContent);
            }
            
            // Create a medium object for HTML content to display in Snippet
            // Use 'application/xml' mimeType so Prism highlights it (maps to tsx/HTML highlighting)
            const htmlMedium: Medium = {
              ...medium,
              mimeType: 'application/xml', // Maps to HTML/XML highlighting in Prism
              content: htmlContent,
            };
            
            return (
              <Snippet preview={false} medium={htmlMedium} />
            );
          } else {
            // Other document attachments: render as plain text
            let displayContent = medium.content;
            if (displayContent.includes('&lt;') || displayContent.includes('&quot;')) {
              const div = document.createElement('div');
              div.innerHTML = displayContent;
              displayContent = div.textContent || div.innerText || displayContent;
            } else {
              displayContent = stripDocumentAttachmentTags(displayContent);
            }
            return (
              <Snippet
                preview={false}
                medium={{
                  ...medium,
                  mimeType: 'text/plain',
                  content: displayContent,
                }}
              />
            );
          }
        })()
      ) : isPdf && (previewUrl || medium.content) ? (
        <div className="memori-media-item-preview--content memori-media-item--modal-iframe-wrap">
          <iframe
            title={medium.title || 'PDF preview'}
            src={
              medium.content
                ? `data:application/pdf;base64,${medium.content}`
                : previewUrl
            }
            className="memori-media-item--modal-iframe"
          />
        </div>
      ) : isExcel && (previewUrl || medium.content) ? (
        <div className="memori-media-item-preview--content memori-media-item--modal-iframe-wrap">
          <iframe
            title={medium.title || 'Spreadsheet preview'}
            src={iframeSrcFromContent}
            className="memori-media-item--modal-iframe"
          />
        </div>
      ) : isHtmlWithContent && !isDocumentAttachment ? (
        // HTML with content (not a document attachment) - show as text
        <Snippet preview={false} medium={htmlAsTextMedium} />
      ) : isHtmlLink ? (
        <div className="memori-media-item-preview--content memori-media-item--modal-iframe-wrap">
          <iframe
            title={medium.title || 'Link preview'}
            src={htmlLinkSrc}
            className="memori-media-item--modal-iframe"
          />
        </div>
      ) : isVideoType && hasMediaSrc ? (
        <div className="memori-media-item-preview--content memori-media-item--modal-video-wrap">
          <video
            className="memori-media-item--modal-video"
            controls
            src={mediaSrc}
            title={medium.title || 'Video preview'}
          >
            {medium.mimeType === 'video/quicktime' && (
              <source src={mediaSrc} type="video/mp4" />
            )}
            Your browser does not support this video format.
          </video>
        </div>
      ) : isAudioType && hasMediaSrc ? (
        <div className="memori-media-item-preview--content memori-media-item--modal-audio-wrap">
          <p className="memori-media-item--modal-audio-title">
            {medium.title || 'Audio'}
          </p>
          <audio
            className="memori-media-item--modal-audio"
            controls
            src={mediaSrc}
            title={medium.title || 'Audio preview'}
          >
            Your browser does not support this audio format.
          </audio>
        </div>
      ) : is3D && glbSrc ? (
        <div className="memori-media-item-preview--content memori-media-item--modal-3d-wrap">
          <ModelViewer
            src={glbSrc}
            poster={DEFAULT_GLB_POSTER}
            alt={medium.title || '3D model'}
          />
        </div>
      ) : isPlainText && medium.content ? (
        <Snippet preview={false} medium={medium} />
      ) : isMarkdown && medium.content ? (
        <Snippet preview={false} medium={medium} />
      ) : (
        <div className="memori-media-item-preview--content memori-media-item--modal-fallback">
          <p className="memori-media-item--modal-fallback-message">
            {isWordType
              ? 'Preview not available for this document.'
              : 'Preview not available for this file type.'}
          </p>
          <p className="memori-media-item--modal-fallback-hint">
            You can open it in a new tab or download it.
          </p>
          {previewUrl && (
            <div className="memori-media-item--modal-fallback-actions">
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="memori-media-item--modal-fallback-link"
              >
                Open in new tab
              </a>
              <a
                href={previewUrl}
                download={medium.title || undefined}
                className="memori-media-item--modal-fallback-link"
              >
                Download
              </a>
            </div>
          )}
        </div>
      )}
    </ContentPreviewModal>
  );
}
