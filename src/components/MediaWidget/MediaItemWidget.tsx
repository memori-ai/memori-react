// MediaItemWidget.tsx — Main Media Item Widget file for rendering various types of media inside Memori
import type { Medium } from '@memori.ai/memori-api-client/dist/types';
import React, { useCallback, useEffect, useMemo, useState, memo, useRef } from 'react';
import { getResourceUrl } from '../../helpers/media';
import { withLinksOpenInNewTab, stripDocumentAttachmentTags } from '../../helpers/utils';
import { getTranslation } from '../../helpers/translations';
import { prismSyntaxLangs } from '../../helpers/constants';
import ModelViewer from '../CustomGLBModelViewer/ModelViewer';
import Snippet from '../Snippet/Snippet';
import Card from '../ui/Card';
import Modal from '../ui/Modal';
import File from '../icons/File';
import { Transition } from '@headlessui/react';
import cx from 'classnames';
import Sound from '../icons/Sound';
import Link from '../icons/Link';
import { ellipsis } from 'ellipsed';

import type {
  MediaItemWidgetProps as Props,
  RenderMediaItemProps,
  RenderSnippetItemProps,
  LinkPreviewInfo,
} from './MediaItemWidget.types';
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
  FALLBACK_IMAGE_BASE64,
  TEXT_FILE_EXTENSIONS,
  IMAGE_MIME_TYPES,
} from './MediaItemWidget.utils';
import { DocumentCard } from './DocumentCard';
import { MediaPreviewModal } from './MediaPreviewModal';

export type { LinkPreviewInfo, ILinkPreviewInfo } from './MediaItemWidget.types';
export type { Props };

// List of code mime types from Prism's available languages
const CODE_MIME_TYPES = prismSyntaxLangs.map((l) => l.mimeType);

// Helper: Get image src handling legacy, RGB, data, and resourceUrl
function getImageSrc(
  item: Medium & { type?: string },
  resourceUrl: string,
  isValidResourceUrl: boolean
): string | undefined {
  if (isValidResourceUrl || isValidUrl(item.url)) {
    return resourceUrl || item.url;
  }
  if (item.url?.startsWith('rgb(') || item.url?.startsWith('rgba(')) {
    return item.url;
  }
  if (item.content) {
    return `data:${item.mimeType};base64,${item.content}`;
  }
  return undefined;
}

// RenderMediaItem — Renders the suitable content for a Medium (images, files, html, code, audio, video…)
export const RenderMediaItem = memo(function RenderMediaItem({
  isChild: _isChild = false,
  item,
  sessionID,
  tenantID,
  preview = false,
  baseURL,
  apiURL,
  onClick: _onClick,
  customMediaRenderer,
  descriptionOneLine = false,
  onLinkPreviewInfo,
}: RenderMediaItemProps): React.ReactElement | null {
  // State for "copy to clipboard" notification for snippets
  const [copyNotification, setCopyNotification] = useState(false);
  // State for fallback image
  const [imageError, setImageError] = useState(false);
  // Link preview info (site title, description, image, etc)
  const [link, setLink] = useState<(LinkPreviewInfo & { urlKey: string }) | null>(null);
  // Persistent ref for onLinkPreviewInfo callback
  const onLinkPreviewInfoRef = useRef(onLinkPreviewInfo);
  onLinkPreviewInfoRef.current = onLinkPreviewInfo;

  // Get URL with possible session/tenant/base/api
  const resourceUrl = getResourceUrl({
    resourceURI: item.url,
    sessionID,
    tenantID,
    baseURL,
    apiURL,
  });

  // Normalize URL (strip protocol, etc)
  const normURL = normalizeUrl(item.url);

  // Fetch link preview info for HTML links, only if relevant and not already loaded
  useEffect(() => {
    if (
      item.mimeType !== 'text/html' ||
      !normURL ||
      normURL === link?.urlKey ||
      !baseURL
    ) {
      return;
    }
    let cancelled = false;
    fetchLinkPreview(normURL, baseURL).then((siteInfo) => {
      if (cancelled) return;
      setLink(
        siteInfo
          ? ({ ...siteInfo, urlKey: normURL } as LinkPreviewInfo & { urlKey: string })
          : null
      );
      if (siteInfo && onLinkPreviewInfoRef.current) {
        onLinkPreviewInfoRef.current(siteInfo);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [item?.url, baseURL, item.mimeType, normURL, link?.urlKey]);

  // Custom renderer for media type, overrides our logic
  const customRenderer = customMediaRenderer?.(item.mimeType);
  if (customRenderer) {
    return customRenderer;
  }

  // Media type detection flags
  const isCodeSnippet = CODE_MIME_TYPES.includes(item.mimeType);
  const isHTML = item.mimeType === 'text/html';
  const isDocumentAttachment = item.properties?.isDocumentAttachment === true;
  const isAttachedFile = item.properties?.isAttachedFile === true;
  const isImageRGB =
    item.url?.startsWith('rgb(') || item.url?.startsWith('rgba(');

  // Get resolved image src
  const imageSrc = getImageSrc(
    item,
    resourceUrl,
    isValidUrl(resourceUrl) || isValidUrl(item.url)
  );

  // Link preview fields (title, description, video, image)
  const linkTitle =
    item.title && item.title.length > 0 ? item.title : link?.title;
  const linkDescription = link?.description;
  const linkVideo = link?.video;
  const linkImage = link?.image ?? link?.images?.[0];

  /**
   * Render the actual content for a media item based on its MIME type
   */
  const renderMediaContent = useCallback(
    (medium: Medium & { type?: string }) => {
      // Get resource url for this medium
      const url = getResourceUrl({
        resourceURI: medium.url,
        sessionID,
        tenantID,
        baseURL,
        apiURL,
      });

      switch (medium.mimeType) {
        // Render images (RGB images as colored swatches)
        case 'image/jpeg':
        case 'image/png':
        case 'image/jpg':
        case 'image/gif':
          return isImageRGB ? (
            <picture className="memori-media-item--figure">
              <div
                className="memori-media-item--rgb-item"
                style={{ backgroundColor: medium.url }}
              />
            </picture>
          ) : (
            <picture className="memori-media-item--figure">
              {!preview && imageSrc && (
                <source srcSet={imageSrc} type={medium.mimeType} />
              )}
              <img
                alt={medium.title}
                src={imageError || !imageSrc ? FALLBACK_IMAGE_BASE64 : imageSrc}
                onError={() => setImageError(true)}
              />
            </picture>
          );

        // Render video types
        case 'video/mp4':
        case 'video/quicktime':
        case 'video/avi':
        case 'video/mpeg':
          return (
            <div className="memori-media-item--video-container">
              <video
                className="memori-media-item--video-player"
                controls
                src={url}
                title={medium.title}
              >
                {/* Quicktime special fallback for .mp4 */}
                {medium.mimeType === 'video/quicktime' && (
                  <source src={medium.url} type="video/mp4" />
                )}
                <source src={medium.url} type={medium.mimeType} />
                Your browser does not support this video format.
              </video>
              {/* Play overlay icon (hidden by default) */}
              <div className="memori-media-item--video-overlay hidden">
                <svg
                  className="memori-media-item--play-icon"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          );

        // Render audio types (shows a sound icon + audio controls)
        case 'audio/mpeg3':
        case 'audio/wav':
        case 'audio/mpeg':
          return (
            <div className="memori-media-item--audio-container">
              <div className="memori-media-item--audio-icon">
                <Sound />
              </div>
              <audio
                className="memori-media-item--audio-player"
                controls
                src={url}
              />
            </div>
          );

        // Render 3D models (GLB only)
        case 'model/gltf-binary':
          return (
            <div className="memori-media-item--model-container">
              <div className="memori-media-item--model-viewer">
                <ModelViewer
                  src={url}
                  alt=""
                  poster="data:image/png;base64,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"
                />
              </div>
            </div>
          );

        // HTML files are now handled as file cards (rendered above in the isFile check)
        // This case is kept for backwards compatibility but should not be reached
        case 'text/html':
          // Fallback to file card - HTML files are handled in the file card section above
          return (
            <DocumentCard
              title={medium.title || 'File'}
              badge={getFileExtensionFromMime(medium.mimeType)}
              meta={
                (() => {
                  const size = getContentSize(medium);
                  return size != null && size > 0 ? formatBytes(size) : null;
                })()
              }
              icon={<Link className="memori-media-item--document-icon-svg" />}
            />
          );

        // Generic fallback: Render a document card for unknown types
        default:
          return (
            <DocumentCard
              title={medium.title || 'File'}
              badge={getFileExtensionFromMime(medium.mimeType)}
              meta={
                (() => {
                  const size = getContentSize(medium);
                  return size != null && size > 0 ? formatBytes(size) : null;
                })()
              }
              icon={<File className="memori-media-item--document-icon-svg" />}
            />
          );
      }
    },
    [
      sessionID,
      tenantID,
      baseURL,
      apiURL,
      preview,
      imageSrc,
      imageError,
      isImageRGB,
      linkImage,
      linkVideo,
    ]
  );

  // Extension and file detection helpers
  const fileExtensionFromUrl = getFileExtensionFromUrl(normURL || item.url);
  const fileExtensionFromMime = getFileExtensionFromMime(item.mimeType);
  const fileExtension = fileExtensionFromUrl || fileExtensionFromMime;
  const isFile = shouldUseDarkFileCard(
    item,
    fileExtensionFromUrl,
    item.mimeType
  );
  // Text file detection for line counting
  const isTextFile = (TEXT_FILE_EXTENSIONS as readonly string[]).includes(
    fileExtension || ''
  );

  // Derive line count and line label for text files
  const lineCount =
    isTextFile && item.content ? countLines(item.content) : null;
  const lineText =
    lineCount !== null
      ? lineCount === 1
        ? '1 line'
        : `${lineCount} lines`
      : null;

  // File-like cards that are NOT code: render as clickable file cards
  if (isFile && !isCodeSnippet) {
    const contentSize = getContentSize(item);
    const sizeText =
      contentSize != null && contentSize > 0 ? formatBytes(contentSize) : null;
    const displayName = item.title || linkTitle || 'File';
    const metaParts = [lineText, sizeText].filter(Boolean);
    const metaLine = metaParts.length > 0 ? metaParts.join(' · ') : null;

    // Document attachments and attached files should open in modal, not as links
    if ((isDocumentAttachment || isAttachedFile) && item.mediumID && _onClick) {
      return (
        <div
          onClick={() => {
            _onClick(item.mediumID!);
          }}
          className="memori-media-item--link memori-media-item--document-link"
          style={{ cursor: 'pointer' }}
          title={displayName}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              _onClick(item.mediumID!);
            }
          }}
        >
          <DocumentCard
            title={displayName}
            badge={
              item.mimeType === 'text/html' && !!item.url ? 'Link' : fileExtension
            }
            meta={metaLine}
            icon={item.mimeType === 'text/html' ? <Link className="memori-media-item--document-icon-svg" /> : <File className="memori-media-item--document-icon-svg" />}
          />
        </div>
      );
    }

    // Build href: open in new tab (never modal). Use URL, or blob for content-only items.
    const getFileCardHref = (): string => {
      if (item.url) {
        return getResourceUrl({
          resourceURI: item.url,
          sessionID,
          tenantID,
          baseURL,
          apiURL,
        }) || item.url || '#';
      }
      if (isHTML && item.content) {
        let htmlContent = item.content;
        if (item.properties?.isDocumentAttachment ||
            htmlContent.includes('document_attachment') ||
            htmlContent.includes('<document_attachment')) {
          if (htmlContent.includes('&lt;') || htmlContent.includes('&quot;')) {
            const div = document.createElement('div');
            div.innerHTML = htmlContent;
            htmlContent = div.textContent || div.innerText || htmlContent;
          }
          htmlContent = stripDocumentAttachmentTags(htmlContent);
        }
        const blob = new Blob([htmlContent], { type: 'text/html' });
        return URL.createObjectURL(blob);
      }
      if (item.content) {
        const blob = new Blob([item.content], { type: item.mimeType || 'text/plain' });
        return URL.createObjectURL(blob);
      }
      return '#';
    };

    const hrefUrl = getFileCardHref();

    return (
      <a
        href={hrefUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="memori-media-item--link memori-media-item--document-link"
        title={displayName}
      >
        <DocumentCard
          title={displayName}
          badge={
            item.mimeType === 'text/html' && !!item.url ? 'Link' : fileExtension
          }
          meta={metaLine}
          icon={item.mimeType === 'text/html' ? <Link className="memori-media-item--document-icon-svg" /> : <File className="memori-media-item--document-icon-svg" />}
        />
      </a>
    );
  }

  // Inline previews for code snippets: open in new tab (blob URL if no resource URL)
  if (isCodeSnippet && item.content) {
    const snippetHref =
      resourceUrl && resourceUrl !== '#'
        ? resourceUrl
        : (() => {
            const blob = new Blob([item.content || ''], {
              type: item.mimeType || 'text/plain',
            });
            return URL.createObjectURL(blob);
          })();
    return (
      <a
        className="memori-media-item--link"
        href={snippetHref}
        target="_blank"
        rel="noopener noreferrer"
        title={item.title}
      >
        <Card hoverable cover={renderMediaContent(item)} title={item.title} />
      </a>
    );
  }

  // HTML file with link info / preview or video/image: render card with link preview (image, video, description)
  if (isHTML && (linkImage || linkVideo || linkDescription)) {
    // Compute card cover image/video src
    const coverSrc =
      linkImage?.includes('data:image') === true
        ? undefined
        : linkImage?.startsWith('https')
          ? linkImage
          : linkImage
            ? `https://${linkImage.replace('http://', '')}`
            : undefined;

    return (
      <a
        href={item.url || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="memori-media-item--link"
        title={linkTitle}
      >
        <Card
          hoverable
          className={cx('memori-media-item--card', {
            'memori-media-item--card-description-oneline': descriptionOneLine,
            'memori-media-item--card-has-image': !!linkImage,
            'memori-media-item--card-has-video': !!linkVideo,
          })}
          cover={
            linkVideo ? (
              <iframe
                width="100%"
                height="100%"
                src={linkVideo}
                title="Video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : linkImage ? (
              <img
                className="memori-media-item--card-cover-img"
                src={coverSrc}
                alt={linkTitle}
              />
            ) : (
              <div className="memori-media-item--card-cover-icon">
                <Link className="memori-media-item--icon" />
              </div>
            )
          }
          title={linkTitle}
          description={linkDescription}
        />
      </a>
    );
  }

  // Run ellipsed.js to clamp link card description, only when a linkDescription is present
  useEffect(() => {
    if (!linkDescription) return;
    const t = setTimeout(() => {
      ellipsis('.memori-media-item--card .memori-card--description', 3, {
        responsive: true,
      });
    }, 300);
    return () => clearTimeout(t);
  }, [linkDescription, item.mediumID]);

  // Fallback: Image, video, model, or unknown file types
  switch (item.mimeType) {
    // Image file types: open in modal when onClick/mediumID available, otherwise no link
    case 'image/jpeg':
    case 'image/png':
    case 'image/jpg':
    case 'image/gif':
      if (isImageRGB) {
        return (
          <Card
            hoverable
            className="memori-media-item--card memori-media-item--image"
            cover={renderMediaContent(item)}
          />
        );
      }
      if (item.mediumID && _onClick) {
        return (
          <div
            onClick={() => _onClick(item.mediumID!)}
            className="memori-media-item--link memori-media-item--image-link"
            style={{ cursor: 'pointer' }}
            title={item.title}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                _onClick(item.mediumID!);
              }
            }}
          >
            <Card
              hoverable
              className="memori-media-item--card memori-media-item--image"
              cover={renderMediaContent(item)}
            />
          </div>
        );
      }
      return (
        <Card
          hoverable
          className="memori-media-item--card memori-media-item--image"
          cover={renderMediaContent(item)}
        />
      );

    // Video files: open URL in new tab when available
    case 'video/mp4':
    case 'video/quicktime':
    case 'video/avi':
    case 'video/mpeg':
      return (
        <a
          className="memori-media-item--link"
          href={resourceUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          title={item.title}
        >
          {renderMediaContent(item)}
        </a>
      );

    // Audio and 3D models: open URL in new tab when available
    case 'audio/mpeg3':
    case 'audio/wav':
    case 'audio/mpeg':
    case 'model/gltf-binary':
      if (resourceUrl) {
        return (
          <a
            className="memori-media-item--link"
            href={resourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={item.title}
          >
            {renderMediaContent(item)}
          </a>
        );
      }
      return renderMediaContent(item);

    // All other files: open URL in new tab (never modal)
    default:
      return (
        <a
          className="memori-media-item--link"
          href={resourceUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          title={item.title}
        >
          {renderMediaContent(item)}
        </a>
      );
  }
});

// RenderSnippetItem: Renders a single code snippet (opens in new tab via href)
export const RenderSnippetItem = memo(function RenderSnippetItem({
  item,
  onClick: _onClick, // kept for API compatibility; links open in new tab, not modal
  sessionID,
  tenantID,
  baseURL,
  apiURL,
}: RenderSnippetItemProps): React.ReactElement {
  void _onClick;
  const resourceUrl = getResourceUrl({
    resourceURI: item.url,
    sessionID,
    tenantID,
    baseURL,
    apiURL,
  });
  const hasUrl = !!(resourceUrl && resourceUrl !== '#');

  // Count lines, chars, determine "short" snippet
  const lineCount = countLines(item.content);
  const contentLength = item.content?.length ?? 0;
  const isShortSnippet = lineCount <= 5 && contentLength <= 200;
  const lineText = lineCount === 1 ? '1 riga' : `${lineCount} righe`;

  if (isShortSnippet) {
    return (
      <div className="memori-media-item--snippet-direct">
        <Card className="memori-media-item--card memori-media-item--snippet">
          <div className="memori-media-item--snippet-body">
            <div className="memori-media-item--snippet-header">
              <span className="memori-media-item--snippet-meta">{lineText}</span>
            </div>
            <div className="memori-media-item--snippet-preview">
              <Snippet showCopyButton preview={false} medium={item} />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Long snippet: open in new tab (resource URL or blob URL from content)
  const snippetHref =
    hasUrl
      ? resourceUrl
      : item.content
        ? (() => {
            const blob = new Blob([item.content], {
              type: item.mimeType || 'text/plain',
            });
            return URL.createObjectURL(blob);
          })()
        : '#';

  return (
    <a
      href={snippetHref}
      target="_blank"
      rel="noopener noreferrer"
      className="memori-media-item--link"
      title={item.title}
    >
      <Card
        hoverable
        className="memori-media-item--card memori-media-item--snippet"
      >
        <div className="memori-media-item--snippet-body">
          <div className="memori-media-item--snippet-header">
            <span className="memori-media-item--snippet-meta">{lineText}</span>
          </div>
          <div className="memori-media-item--snippet-preview">
            <Snippet showCopyButton={false} preview medium={item} />
          </div>
        </div>
      </Card>
    </a>
  );
});

// Main MediaItemWidget component: renders all media, overlays, and preview modals
const MediaItemWidget: React.FC<Props> = ({
  items,
  sessionID,
  tenantID,
  translateTo,
  baseURL,
  apiURL,
  customMediaRenderer,
  fromUser = false,
  descriptionOneLine = false,
  onLinkPreviewInfo,
}) => {
  // Internal tracked media set (may be translated versions)
  const [media, setMedia] = useState(items);
  // Modal state (holds currently open medium)
  const [openModalMedium, setOpenModalMedium] = useState<Medium | undefined>();

  // Update component-local media when prop changes (reset modal to current items)
  useEffect(() => {
    setMedia(items);
  }, [items]);

  // Optional: Translate all media captions/titles if translateTo provided
  const translateMediaCaptions = useCallback(async () => {
    if (!translateTo) return;
    const translated = await Promise.all(
      (items ?? []).map(async (m) => {
        if (!m.title) return m;
        try {
          const t = await getTranslation(m.title, translateTo);
          return { ...m, title: t.text ?? m.title };
        } catch (e) {
          console.error(e);
          return m;
        }
      })
    );
    setMedia(translated);
  }, [translateTo, items]);

  useEffect(() => {
    if (translateTo) translateMediaCaptions();
  }, [translateTo, translateMediaCaptions]);

  // Derive top-level "display" lists:
  // 1. All non-code, non-executable media sorted by timestamp (displayed as document, images, video, etc)
  const nonCodeDisplayMedia = useMemo(
    () =>
      media
        .filter(
          (m) =>
            !m.properties?.executable &&
            !CODE_MIME_TYPES.includes(m.mimeType)
        )
        .sort((a, b) => {
          const at = a.creationTimestamp ?? 0;
          const bt = b.creationTimestamp ?? 0;
          return at > bt ? 1 : at < bt ? -1 : 0;
        }),
    [media]
  );

  // 2. Only code snippets (unless marked as executable)
  const codeSnippets = useMemo(
    () =>
      media.filter(
        (m) =>
          !m.properties?.executable && CODE_MIME_TYPES.includes(m.mimeType)
      ),
    [media]
  );

  // 3. Only CSS code marked as executable (to inject as <style>)
  const cssExecutableCode = useMemo(
    () =>
      media.filter(
        (m) => m.mimeType === 'text/css' && !!m.properties?.executable
      ),
    [media]
  );

  // How many images are present for determining layout
  const imageCount = useMemo(
    () =>
      nonCodeDisplayMedia.filter((m) =>
        (IMAGE_MIME_TYPES as readonly string[]).includes(m.mimeType)
      ).length,
    [nonCodeDisplayMedia]
  );

  // Media "card open"/preview modal logic for non-code
  const handleMediaItemClick = useCallback(
    (mediumID: string) => {
      setOpenModalMedium(
        nonCodeDisplayMedia.find((m) => m.mediumID === mediumID)
      );
    },
    [nonCodeDisplayMedia]
  );

  // Modal for code snippets
  const handleSnippetClick = useCallback(
    (mediumID: string) => {
      setOpenModalMedium(
        codeSnippets.find((m) => m.mediumID === mediumID)
      );
    },
    [codeSnippets]
  );

  // Simple close modal action callback
  const handleCloseModal = useCallback(() => {
    setOpenModalMedium(undefined);
  }, []);

  // Navigate to another media in modal (by mediumID) — used by modal carousel/nav
  const handleModalNavigate = useCallback(
    (mediumID: string) => {
      setOpenModalMedium(media.find((m) => m.mediumID === mediumID));
    },
    [media]
  );

  // Render transitions and the main grid layouts for media
  return (
    <Transition appear show as="div" className="memori-media-items">
      {/* Main media grid: non-code media (images, files, html, video, etc) */}
      {nonCodeDisplayMedia.length > 0 && (
        <div
          className={cx('memori-media-items--grid memori-chat-scroll-item', {
            'memori-media-items--user': fromUser,
            'memori-media-items--agent': !fromUser,
            'memori-media-items--single': imageCount === 1,
            'memori-media-items--few': imageCount >= 2 && imageCount <= 4,
            'memori-media-items--many': imageCount >= 5,
          })}
        >
          {nonCodeDisplayMedia.map((item, index) => (
            <Transition.Child
              key={item.mediumID ?? `${item.url}&index=${index}`}
              as="div"
              className="memori-media-item"
              enter={`ease-out duration-500 delay-${index * 100}`}
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-1 scale-100"
              leave="ease-in duration-300"
              leaveFrom="opacity-1 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <RenderMediaItem
                isChild
                sessionID={sessionID}
                tenantID={tenantID}
                baseURL={baseURL}
                apiURL={apiURL}
                onClick={handleMediaItemClick}
                item={{
                  ...item,
                  title: item.title,
                  url: item.url,
                  content: item.content,
                  type: 'document',
                }}
                customMediaRenderer={customMediaRenderer}
                descriptionOneLine={descriptionOneLine}
                onLinkPreviewInfo={onLinkPreviewInfo}
              />
            </Transition.Child>
          ))}
        </div>
      )}

      {/* Grid of pure code snippets, shown as cards or compact snippets */}
      {codeSnippets.length > 0 && (
        <div
          className={cx('memori-media-items--grid memori-chat-scroll-item', {
            'memori-media-items--user': fromUser,
            'memori-media-items--agent': !fromUser,
          })}
        >
          {codeSnippets.map((item, index) => (
            <Transition.Child
              key={item.mediumID ?? `${item.url}&index=${index}`}
              as="div"
              className="memori-media-item"
              enter={`ease-out duration-500 delay-${index * 100}`}
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-1 scale-100"
              leave="ease-in duration-300"
              leaveFrom="opacity-1 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <RenderSnippetItem
                sessionID={sessionID}
                tenantID={tenantID}
                baseURL={baseURL}
                apiURL={apiURL}
                onClick={handleSnippetClick}
                item={{
                  ...item,
                  title: item.title,
                  url: item.url,
                  content: item.content,
                  type: 'document',
                }}
              />
            </Transition.Child>
          ))}
        </div>
      )}

      {/* CSS executables: Inject as <style> (only shared to DOM, not shown visually) */}
      {cssExecutableCode.map((m) => (
        <style
          key={m.mediumID}
          dangerouslySetInnerHTML={{ __html: m.content || '' }}
        />
      ))}

      {/* Modal preview: shows when openModalMedium set */}
      {openModalMedium && (
        <MediaPreviewModal
          medium={openModalMedium}
          onClose={handleCloseModal}
          sessionID={sessionID}
          tenantID={tenantID}
          baseURL={baseURL}
          apiURL={apiURL}
          customMediaRenderer={customMediaRenderer}
          descriptionOneLine={descriptionOneLine}
          onLinkPreviewInfo={onLinkPreviewInfo}
          onMediumClick={handleModalNavigate}
        />
      )}
    </Transition>
  );
};

export default memo(MediaItemWidget);
