import { Medium } from '@memori.ai/memori-api-client/dist/types';
import React, { useCallback, useEffect, useState, memo } from 'react';
import { getResourceUrl } from '../../helpers/media';
import { getTranslation } from '../../helpers/translations';
import { prismSyntaxLangs } from '../../helpers/constants';
import ModelViewer from '../CustomGLBModelViewer/ModelViewer';
import Snippet from '../Snippet/Snippet';
import Card from '../ui/Card';
import Modal from '../ui/Modal';
import File from '../icons/File';
import { Transition } from '@headlessui/react';
import { stripHTML } from '../../helpers/utils';
import cx from 'classnames';
import Sound from '../icons/Sound';
import Link from '../icons/Link';
import { ellipsis } from 'ellipsed';

// Helper function to format file size
const formatBytes = (bytes: number | undefined): string => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper to get file extension from URL
const getFileExtensionFromUrl = (url: string | undefined): string | null => {
  if (!url) return null;
  const match = url.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
  return match ? match[1].toUpperCase() : null;
};

// Helper to get file extension from mime type
const getFileExtensionFromMime = (mimeType: string): string => {
  const mimeToExt: Record<string, string> = {
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
  return mimeToExt[mimeType] || mimeType.split('/')[1]?.toUpperCase() || 'FILE';
};

// Helper to count lines in content
const countLines = (content: string | undefined): number => {
  if (!content) return 0;
  return content.split(/\r\n|\r|\n/).length;
};

// Link preview types
export declare type ILinkPreviewInfo = {
  title?: string | undefined;
  siteName?: string | undefined;
  description?: string | undefined;
  mediaType?: string | undefined;
  image?: string | undefined;
  imageWidth?: number | undefined;
  imageHeight?: number | undefined;
  favicon?: string | undefined;
  images?: string[] | undefined;
  video?: string | undefined;
  videos?: string[] | undefined;
};

const getSiteInfo = async (url: string, baseUrl?: string) => {
  try {
    const data = await fetch(
      `${baseUrl || 'https://aisuru.com'}/api/linkpreview/${encodeURIComponent(
        url
      )}`
    );
    const siteInfo: ILinkPreviewInfo = await data.json();
    return siteInfo;
  } catch (err) {
    console.error('getSiteInfo', err);
    return null;
  }
};

export interface Props {
  items: (Medium & { type?: string })[];
  sessionID?: string;
  tenantID?: string;
  translateTo?: string;
  baseURL?: string;
  apiURL?: string;
  customMediaRenderer?: (mimeType: string) => JSX.Element | null;
  fromUser?: boolean;
  descriptionOneLine?: boolean;
  onLinkPreviewInfo?: (linkPreviewInfo: ILinkPreviewInfo) => void;
}

// Determine if item should use dark file card
const shouldUseDarkFileCard = (
  _: Medium,
  fileExtension: string | null,
  mimeType: string
): boolean => {
  // Check URL extension first
  const fileExtensions = [
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
  ];
  if (fileExtension && fileExtensions.includes(fileExtension)) {
    return true;
  }

  // Check mimeType for file types
  const fileMimeTypes = [
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
  ];

  return fileMimeTypes.includes(mimeType);
};

export const RenderMediaItem = ({
  isChild = false,
  item,
  sessionID,
  tenantID,
  preview = false,
  baseURL,
  apiURL,
  onClick,
  customMediaRenderer,
  descriptionOneLine = false,
  onLinkPreviewInfo,
}: {
  isChild?: boolean;
  item: Medium & { type?: string };
  sessionID?: string;
  tenantID?: string;
  preview?: boolean;
  baseURL?: string;
  apiURL?: string;
  onClick?: (mediumID: string) => void;
  customMediaRenderer?: (mimeType: string) => JSX.Element | null;
  descriptionOneLine?: boolean;
  onLinkPreviewInfo?: (linkPreviewInfo: ILinkPreviewInfo) => void;
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [copyNotification, setCopyNotification] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [link, setLink] = useState<
    (ILinkPreviewInfo & { urlKey: string }) | null
  >(null);

  const url = getResourceUrl({
    resourceURI: item.url,
    sessionID,
    tenantID,
    baseURL,
    apiURL,
  });

  const normURL =
    item.url?.startsWith('http') || !item.url || item.url?.length === 0
      ? item.url
      : `https://${item.url}`;

  // Fetch link preview info for HTML links
  useEffect(() => {
    if (
      item.mimeType === 'text/html' &&
      normURL &&
      normURL !== link?.urlKey &&
      baseURL
    ) {
      getSiteInfo(normURL, baseURL).then(siteInfo => {
        setLink(
          siteInfo
            ? ({ ...siteInfo, urlKey: normURL } as ILinkPreviewInfo & {
                urlKey: string;
              })
            : null
        );
        if (onLinkPreviewInfo && siteInfo) onLinkPreviewInfo(siteInfo);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.url, baseURL, onLinkPreviewInfo, item.mimeType]);

  const customRenderer = customMediaRenderer?.(item.mimeType);

  if (customRenderer) {
    return customRenderer;
  }

  const isCodeSnippet = prismSyntaxLangs
    .map(l => l.mimeType)
    .includes(item.mimeType);
  const isHTML = item.mimeType === 'text/html';
  const isImageRGB =
    item.url?.startsWith('rgb(') || item.url?.startsWith('rgba(');

  // Helper to validate if a string is a valid URL
  const isValidUrl = (urlString: string | undefined): boolean => {
    if (!urlString) return false;
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  // Helper to get valid image src
  const getImageSrc = (): string | undefined => {
    if (isValidUrl(url) || isValidUrl(item.url)) {
      return url || item.url;
    } else if (item.url?.startsWith('rgb(') || item.url?.startsWith('rgba(')) {
      return item.url;
    } else if (item.content) {
      return `data:${item.mimeType};base64,${item.content}`;
    }
    return undefined;
  };

  const imageSrc = getImageSrc();
  const fallbackImage =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';

  // Render media content helper
  const renderMediaContent = (item: Medium) => {
    switch (item.mimeType) {
      case 'image/jpeg':
      case 'image/png':
      case 'image/jpg':
      case 'image/gif':
        return isImageRGB ? (
          <picture className="memori-media-item--figure">
            <div
              className="memori-media-item--rgb-item"
              style={{
                backgroundColor: item.url,
              }}
            />
            {item.title && (
              <figcaption className="memori-media-item--figure-caption">
                {item.title}
              </figcaption>
            )}
          </picture>
        ) : (
          <picture className="memori-media-item--figure">
            {!preview && imageSrc && (
              <source srcSet={imageSrc} type={item.mimeType} />
            )}
            <img
              alt={item.title}
              src={imageError || !imageSrc ? fallbackImage : imageSrc}
              onError={() => setImageError(true)}
            />
            {item.title && (
              <figcaption className="memori-media-item--figure-caption">
                {item.title}
              </figcaption>
            )}
          </picture>
        );

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
              title={item.title}
            >
              {item.mimeType === 'video/quicktime' && (
                <source src={item.url} type="video/mp4" />
              )}
              <source src={item.url} type={item.mimeType} />
              Your browser does not support this video format.
            </video>
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

      case 'text/html':
        if (item.content && !linkImage && !linkVideo) {
          return (
            <div className="memori-media-item--html-preview">
              <div className="memori-media-item--html-preview-header">
                <div className="memori-media-item--html-preview-title">
                  HTML Preview
                </div>
              </div>
              <div
                className="memori-media-item--html-preview-content"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            </div>
          );
        }
        // For HTML without content, use document card structure
        // @ts-ignore - return statement prevents fallthrough
        {
          const htmlFileExtension = getFileExtensionFromMime(item.mimeType);
          const htmlContentSize =
            item.content != null
              ? new Blob([item.content]).size
              : (item.properties?.size as number | undefined);
          const htmlSizeText =
            htmlContentSize != null && htmlContentSize > 0
              ? formatBytes(htmlContentSize)
              : null;
          const htmlDisplayName = item.title || 'File';

          return (
            <div className="memori-media-item--document">
              <div className="memori-media-item--document-icon" aria-hidden>
                <File className="memori-media-item--document-icon-svg" />
              </div>
              <div className="memori-media-item--document-info">
                <div className="memori-media-item--document-title">
                  {htmlDisplayName}
                </div>
                {htmlSizeText && (
                  <div className="memori-media-item--document-meta">
                    {htmlSizeText}
                  </div>
                )}
              </div>
              <span className="memori-media-item--document-badge">
                {htmlFileExtension}
              </span>
            </div>
          );
        }

      default: {
        // Return Claude-style document card structure for unknown file types
        const defaultFileExtension = getFileExtensionFromMime(item.mimeType);
        const defaultContentSize =
          item.content != null
            ? new Blob([item.content]).size
            : (item.properties?.size as number | undefined);
        const defaultSizeText =
          defaultContentSize != null && defaultContentSize > 0
            ? formatBytes(defaultContentSize)
            : null;
        const defaultDisplayName = item.title || 'File';

        return (
          <div className="memori-media-item--document">
            <div className="memori-media-item--document-icon" aria-hidden>
              <File className="memori-media-item--document-icon-svg" />
            </div>
            <div className="memori-media-item--document-info">
              <div className="memori-media-item--document-title">
                {defaultDisplayName}
              </div>
              {defaultSizeText && (
                <div className="memori-media-item--document-meta">
                  {defaultSizeText}
                </div>
              )}
            </div>
            <span className="memori-media-item--document-badge">
              {defaultFileExtension}
            </span>
          </div>
        );
      }
    }
  };
  // Detect file type
  const fileExtensionFromUrl = getFileExtensionFromUrl(normURL || item.url);
  const fileExtensionFromMime = getFileExtensionFromMime(item.mimeType);
  const fileExtension = fileExtensionFromUrl || fileExtensionFromMime;
  const isFile = shouldUseDarkFileCard(
    item,
    fileExtensionFromUrl,
    item.mimeType
  );
  const isTextFile = [
    'TXT',
    'HTML',
    'MD',
    'CSS',
    'JS',
    'TS',
    'PY',
    'JSON',
    'XML',
  ].includes(fileExtension || '');

  // Count lines for text files
  const lineCount =
    isTextFile && item.content ? countLines(item.content) : null;
  const lineText =
    lineCount !== null
      ? lineCount === 1
        ? '1 line'
        : `${lineCount} lines`
      : null;

  // Get link preview data
  const linkTitle =
    item.title && item.title.length > 0 ? item.title : link?.title;
  const linkDescription = link?.description;
  const linkVideo = link?.video;
  const linkImage = link?.image ?? link?.images?.[0];

  // Render document card (Claude-style UX: filename, file type icon, optional meta)
  if (isFile && !isCodeSnippet) {
    const handleClick = (e: React.MouseEvent) => {
      if (item.mimeType === 'text/html') return;
      if (isChild && onClick) {
        e.preventDefault();
        console.log('item.mediumID', item.mediumID);
        onClick(item.mediumID);
      }
    };

    // Optional file size from content (approximate)
    const contentSize =
      item.content != null
        ? new Blob([item.content]).size
        : (item.properties?.size as number | undefined);
    const sizeText =
      contentSize != null && contentSize > 0 ? formatBytes(contentSize) : null;
    const displayName = item.title || linkTitle || 'File';
    const metaParts = [lineText, sizeText].filter(Boolean);
    const metaLine = metaParts.length > 0 ? metaParts.join(' · ') : null;

    return (
      <a
        href={url || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="memori-media-item--link memori-media-item--document-link"
        onClick={handleClick}
        title={displayName}
      >
        <div className="memori-media-item--document">
          <div className="memori-media-item--document-icon" aria-hidden>
            <File className="memori-media-item--document-icon-svg" />
          </div>
          <div className="memori-media-item--document-info">
            <div className="memori-media-item--document-title">{displayName}</div>
            {metaLine && (
              <div className="memori-media-item--document-meta">{metaLine}</div>
            )}
          </div>
          <span className="memori-media-item--document-badge">
            {item.mimeType === 'text/html' && !!item.url ? 'Link' : fileExtension}
          </span>
        </div>
      </a>
    );
  }

  // Handle code snippets with modal
  if (
    (isCodeSnippet && item.content) ||
    (isHTML && item.content && !linkImage && !linkVideo)
  ) {
    return (
      <>
        <a
          className="memori-media-item--link"
          href="#"
          onClick={e => {
            e.preventDefault();
            setModalOpen(true);
          }}
          title={item.title}
        >
          <Card hoverable cover={renderMediaContent(item)} title={item.title} />
        </a>

        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={item.title}
          className="memori-media-item-preview--modal"
          width="80%"
          widthMd="90%"
        >
          <div className="memori-media-item-preview--content">
            <Snippet medium={item} showCopyButton={true} />
          </div>
        </Modal>
      </>
    );
  }

  // Handle link previews (HTML with preview data) - open in new tab, do not open modal
  if (isHTML && (linkImage || linkVideo || linkDescription)) {
    return (
      <a
        href={url || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="memori-media-item--link"
        title={linkTitle}
      >
        <Card
          hoverable
          className={cx('memori-media-item--card', {
            'memori-media-item--card-description-oneline': descriptionOneLine,
            'memori-media-item--card-has-image': linkImage,
            'memori-media-item--card-has-video': linkVideo,
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
                src={
                  linkImage.includes('data:image')
                    ? undefined
                    : linkImage.startsWith('https')
                    ? linkImage
                    : `https://${linkImage.replace('http://', '')}`
                }
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

  // Apply ellipsis to descriptions
  useEffect(() => {
    if (linkDescription) {
      setTimeout(() => {
        ellipsis('.memori-media-item--card .memori-card--description', 3, {
          responsive: true,
        });
      }, 300);
    }
  }, [linkDescription, item.mediumID]);

  // Render light preview cards for images, videos, audio, 3D models
  switch (item.mimeType) {
    case 'image/jpeg':
    case 'image/png':
    case 'image/jpg':
    case 'image/gif':
      return isImageRGB ? (
        <Card
          hoverable
          className="memori-media-item--card memori-media-item--image"
          cover={renderMediaContent(item)}
        />
      ) : (
        <a
          className="memori-media-item--link"
          href={imageSrc || '#'}
          onClick={e => {
            if (isChild) {
              e.preventDefault();
            }
            if (onClick) {
              e.preventDefault();
              onClick(item.mediumID);
            }
            if (!imageSrc || imageError) {
              e.preventDefault();
            }
          }}
          target="_blank"
          rel="noopener noreferrer"
          title={item.title}
        >
          <Card
            hoverable
            className="memori-media-item--card memori-media-item--image"
            cover={renderMediaContent(item)}
          />
        </a>
      );

    case 'video/mp4':
    case 'video/quicktime':
    case 'video/avi':
    case 'video/mpeg':
      return (
        <div
          onClick={() => {
            if (onClick) {
              onClick(item.mediumID);
            }
          }}
          title={item.title}
        >
          {renderMediaContent(item)}
        </div>
      );

    case 'audio/mpeg3':
    case 'audio/wav':
    case 'audio/mpeg':
      return renderMediaContent(item);

    case 'model/gltf-binary':
      return renderMediaContent(item);

    default:
      return (
        <a
          className="memori-media-item--link"
          href={url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          title={item.title}
          onClick={e => {
            if (isChild) {
              e.preventDefault();
            }
            if (onClick) {
              e.preventDefault();
              onClick(item.mediumID);
            }
          }}
        >
          {renderMediaContent(item)}
        </a>
      );
  }
};

// Helper function to count lines in content
const countLinesForSnippet = (content: string | undefined): number => {
  if (!content) return 0;
  return content.split(/\r\n|\r|\n/).length;
};

export const RenderSnippetItem = ({
  item,
  sessionID: _sessionID,
  tenantID: _tenantID,
  baseURL: _baseURL,
  apiURL: _apiURL,
  onClick,
}: {
  item: Medium & { type: string };
  sessionID?: string;
  tenantID?: string;
  baseURL?: string;
  apiURL?: string;
  onClick?: (mediumID: string) => void;
}) => {
  const lineCount = countLinesForSnippet(item.content);
  const contentLength = item.content?.length ?? 0;
  const isShortSnippet = lineCount <= 5 && contentLength <= 200;
  const lineText =
    lineCount === 1 ? '1 riga' : `${lineCount} righe`;

  if (isShortSnippet) {
    return (
      <div className="memori-media-item--snippet-direct">
        <Card className="memori-media-item--card memori-media-item--snippet">
          <div className="memori-media-item--snippet-body">
            <div className="memori-media-item--snippet-header">
              <span className="memori-media-item--snippet-meta">{lineText}</span>
            </div>
            <div className="memori-media-item--snippet-preview">
              <Snippet showCopyButton={true} preview={false} medium={item} />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <a
        href="#"
        onClick={e => {
          e.preventDefault();
          if (onClick) {
            onClick(item.mediumID);
          }
        }}
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
              <Snippet showCopyButton={false} preview={true} medium={item} />
            </div>
          </div>
        </Card>
      </a>
    </>
  );
};

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
}: Props) => {
  const [media, setMedia] = useState(items);
  const [openModalMedium, setOpenModalMedium] = useState<Medium>();

  useEffect(() => {
    setMedia(items);
  }, [items]);

  const translateMediaCaptions = useCallback(async () => {
    if (!translateTo) return;

    const translatedMedia = await Promise.all(
      (items ?? []).map(async media => {
        if (media.title) {
          try {
            const tTitle = await getTranslation(media.title, translateTo);
            return { ...media, title: tTitle.text ?? media.title };
          } catch (e) {
            console.error(e);
            return media;
          }
        } else {
          return media;
        }
      })
    );

    setMedia(translatedMedia);
  }, [translateTo, items]);

  useEffect(() => {
    if (translateTo) translateMediaCaptions();
  }, [translateTo, translateMediaCaptions]);

  const nonCodeDisplayMedia = media
    .filter(
      m =>
        !m.properties?.executable &&
        !prismSyntaxLangs.map(l => l.mimeType).includes(m.mimeType)
    )
    .sort((a, b) => {
      return a.creationTimestamp! > b.creationTimestamp!
        ? 1
        : a.creationTimestamp! < b.creationTimestamp!
        ? -1
        : 0;
    });

  const codeSnippets = media.filter(
    m =>
      !m.properties?.executable &&
      prismSyntaxLangs.map(l => l.mimeType).includes(m.mimeType)
  );

  const cssExecutableCode = media.filter(
    m => m.mimeType === 'text/css' && !!m.properties?.executable
  );

  // Count images for dynamic grid layout
  const imageCount = nonCodeDisplayMedia.filter(item =>
    ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].includes(
      item.mimeType
    )
  ).length;

  return (
    <Transition appear show as="div" className="memori-media-items">
      {!!nonCodeDisplayMedia.length && (
        <div
          className={cx('memori-media-items--grid memori-chat-scroll-item', {
            'memori-media-items--user': fromUser,
            'memori-media-items--agent': !fromUser,
            'memori-media-items--single': imageCount === 1,
            'memori-media-items--few': imageCount >= 2 && imageCount <= 4,
            'memori-media-items--many': imageCount >= 5,
          })}
        >
          {nonCodeDisplayMedia.map((item: Medium, index: number) => (
            <Transition.Child
              as="div"
              className="memori-media-item"
              key={item.url + '&index=' + index}
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
                onClick={mediumID => {
                  setOpenModalMedium(
                    nonCodeDisplayMedia.find(m => m.mediumID === mediumID)
                  );
                }}
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
      {!!codeSnippets.length && (
        <div
          className={cx('memori-media-items--grid memori-chat-scroll-item', {
            'memori-media-items--user': fromUser,
            'memori-media-items--agent': !fromUser,
          })}
        >
          {codeSnippets.map((item: Medium, index: number) => (
            <Transition.Child
              as="div"
              className="memori-media-item"
              key={item.mediumID + '&index=' + index}
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
                onClick={mediumID => {
                  const foundMedium = codeSnippets.find(
                    m => m.mediumID === mediumID
                  );
                  setOpenModalMedium(foundMedium);
                }}
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
      {cssExecutableCode.map(medium => (
        <style
          key={medium.mediumID}
          dangerouslySetInnerHTML={{ __html: medium.content || '' }}
        ></style>
      ))}

      {openModalMedium && (
        <Modal
          width="100%"
          widthMd="100%"
          className="memori-media-item--modal"
          open={!!openModalMedium}
          onClose={() => setOpenModalMedium(undefined)}
          footer={null}
        >
          {prismSyntaxLangs
            .map(l => l.mimeType)
            .includes(openModalMedium.mimeType) ? (
            <div
              style={{
                minHeight: '100%',
                background: 'none',
              }}
              className="memori-media-item-preview--content"
            >
              <Snippet preview={false} medium={openModalMedium} />
            </div>
          ) : openModalMedium.mimeType === 'text/html' &&
            openModalMedium.url ? (
            <div className="memori-media-item-preview--content memori-media-item--modal-iframe-wrap">
              <iframe
                title={openModalMedium.title || 'Link preview'}
                src={
                  openModalMedium.url?.startsWith('http') || !openModalMedium.url
                    ? openModalMedium.url
                    : `https://${openModalMedium.url}`
                }
                className="memori-media-item--modal-iframe"
              />
            </div>
          ) : (
            <RenderMediaItem
              isChild={false}
              sessionID={sessionID}
              tenantID={tenantID}
              baseURL={baseURL}
              apiURL={apiURL}
              item={{
                ...openModalMedium,
                title: openModalMedium.title,
                url: openModalMedium.url,
                content: openModalMedium.content,
                type: 'document',
              }}
              customMediaRenderer={customMediaRenderer}
              descriptionOneLine={descriptionOneLine}
              onLinkPreviewInfo={onLinkPreviewInfo}
              onClick={mediumID => {
                setOpenModalMedium(
                  media.find(m => m.mediumID === mediumID)
                );
              }}
            />
          )}
        </Modal>
      )}
    </Transition>
  );
};

export default memo(MediaItemWidget);
