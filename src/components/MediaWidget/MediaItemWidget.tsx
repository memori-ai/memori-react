import { Medium } from '@memori.ai/memori-api-client/dist/types';
import React, { useCallback, useEffect, useState, memo } from 'react';
import { getResourceUrl } from '../../helpers/media';
import { getTranslation } from '../../helpers/translations';
import { prismSyntaxLangs } from '../../helpers/constants';
import ModelViewer from '../CustomGLBModelViewer/ModelViewer';
import Snippet from '../Snippet/Snippet';
import Card from '../ui/Card';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import File from '../icons/File';
import FilePdf from '../icons/FilePdf';
import FileExcel from '../icons/FileExcel';
import FileWord from '../icons/FileWord';
import Copy from '../icons/Copy';
import { Transition } from '@headlessui/react';
import { stripHTML } from '../../helpers/utils';
import cx from 'classnames';
export interface Props {
  items: (Medium & { type?: string })[];
  sessionID?: string;
  tenantID?: string;
  translateTo?: string;
  baseURL?: string;
  apiURL?: string;
  customMediaRenderer?: (mimeType: string) => JSX.Element | null;
  fromUser?: boolean;
}

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
}: {
  isChild?: boolean;
  item: Medium & { type: string };
  sessionID?: string;
  tenantID?: string;
  preview?: boolean;
  baseURL?: string;
  apiURL?: string;
  onClick?: (mediumID: string) => void;
  customMediaRenderer?: (mimeType: string) => JSX.Element | null;
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [copyNotification, setCopyNotification] = useState(false);

  const url = getResourceUrl({
    resourceURI: item.url,
    sessionID,
    tenantID,
    baseURL,
    apiURL,
  });

  const customRenderer = customMediaRenderer?.(item.mimeType);

  if (customRenderer) {
    return customRenderer;
  }

  const isCodeSnippet = prismSyntaxLangs.map(l => l.mimeType).includes(item.mimeType);

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
            {!preview && (
              <source
                srcSet={[url, item.url, item.content].join(', ')}
                type={item.mimeType}
              />
            )}
            <img
              alt={item.title}
              src="data:image/png;base64,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"
            />
            {item.title && (
              <figcaption className="memori-media-item--figure-caption">
                {item.title}
              </figcaption>
            )}
          </picture>
        );

      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return <FileWord className="memori-media-item--icon" />;

      case 'application/vnd.ms-excel':
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return <FileExcel className="memori-media-item--icon" />;

      case 'application/pdf':
        return <FilePdf className="memori-media-item--icon" />;

      case 'video/mp4':
      case 'video/quicktime':
      case 'video/avi':
      case 'video/mpeg':
        return (
          <video
            style={{ width: '100%', height: '100%' }}
            controls
            src={url}
            title={item.title}
          >
            {item.mimeType === 'video/quicktime' && (
              <source src={item.url} type="video/mp4" />
            )}
            <source src={item.url} type={item.mimeType} />
            Your browser does not support this video format.
            <br />
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              Download the video
            </a>
          </video>
        );

      case 'audio/mpeg3':
      case 'audio/wav':
      case 'audio/mpeg':
        return (
          <audio style={{ width: '100%', height: '100%' }} controls src={url} />
        );

      case 'model/gltf-binary':
        return (
          <ModelViewer
            src={url}
            alt=""
            poster="data:image/png;base64,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"
          />
        );

      default:
        return <File className="memori-media-item--icon" />;
    }
  };

  // Handle code snippets with modal
  if (isCodeSnippet && item.content) {
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
            <Snippet  medium={item} showCopyButton={true} />
          </div>
        </Modal>
      </>
    );
  }

  if (!item.url && item?.type === 'document' && item.content) {
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
          width="60%"
          widthMd="70%"
          footer={
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.5rem',
              }}
            >
              <Button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(item.content || '');
                    setCopyNotification(true);
                    setTimeout(() => setCopyNotification(false), 2000);
                  } catch (err) {
                    console.error('Failed to copy content:', err);
                  }
                }}
                icon={<Copy />}
              >
                {copyNotification ? 'Copied!' : 'Copy Content'}
              </Button>
            </div>
          }
        >
          <div className="memori-media-item-preview--content">
            <div
              className="memori-media-item-preview--text"
              dangerouslySetInnerHTML={{
                __html: stripHTML(item.content || ''),
              }}
            />
          </div>
        </Modal>
      </>
    );
  }

  const isImageRGB =
    item.url?.startsWith('rgb(') || item.url?.startsWith('rgba(');

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
          href={item.url}
          onClick={e => {
            if (isChild) {
              e.preventDefault();
            }
            if (onClick) {
              e.preventDefault();
              onClick(item.mediumID);
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

    case 'application/msword':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    case 'application/vnd.ms-excel':
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    case 'application/pdf':
      return (
        <a
          className="memori-media-item--link"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          title={item.title}
        >
          <Card hoverable cover={renderMediaContent(item)} title={item.title} />
        </a>
      );

    case 'video/mp4':
    case 'video/quicktime':
    case 'video/avi':
    case 'video/mpeg':
      return (
        <a
          className="memori-media-item--link"
          href={url}
          onClick={e => {
            if (isChild) {
              e.preventDefault();
            }
            if (onClick) {
              e.preventDefault();
              onClick(item.mediumID);
            }
          }}
          target="_blank"
          rel="noopener noreferrer"
          title={item.title}
        >
          <Card hoverable cover={renderMediaContent(item)} title={item.title} />
        </a>
      );

    case 'audio/mpeg3':
    case 'audio/wav':
    case 'audio/mpeg':
      return (
        <a
          className="memori-media-item--link"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          title={item.title}
        >
          <Card hoverable cover={renderMediaContent(item)} title={item.title} />
        </a>
      );

    case 'model/gltf-binary':
      return <Card hoverable cover={renderMediaContent(item)} />;

    default:
      return (
        <a
          className="memori-media-item--link"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          title={item.title}
        >
          <Card hoverable cover={renderMediaContent(item)} title={item.title} />
        </a>
      );
  }
};

// Helper function to count lines in content
const countLines = (content: string | undefined): number => {
  if (!content) return 0;
  return content.split('\n').length;
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
  const lineCount = countLines(item.content);
  const isShortSnippet = lineCount <= 5;

  // For short snippets, show them directly without the clickable link
  if (isShortSnippet) {
    return (
      <div className="memori-media-item--snippet-direct">
        <Card className="memori-media-item--card memori-media-item--snippet">
          <div className="memori-media-item--snippet-preview">
            <Snippet showCopyButton={true} preview={false} medium={item} />
          </div>
        </Card>
      </div>
    );
  }

  // For longer snippets, show preview with click to open modal
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
          // onClick={() => setModalOpen(true)}
          className="memori-media-item--card memori-media-item--snippet"
        >
          <div className="memori-media-item--snippet-preview">
            <Snippet showCopyButton={false} preview={true} medium={item} />
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
}: Props) => {
  const [media, setMedia] = useState(items);
  const [openModalMedium, setOpenModalMedium] = useState<Medium>();

  // Sync items prop with media state
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

  return (
    <Transition appear show as="div" className="memori-media-items">
      {!!nonCodeDisplayMedia.length && (
        <div
          className={cx('memori-media-items--grid', {
            'memori-media-items--user': fromUser,
            'memori-media-items--agent': !fromUser,
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
                  setOpenModalMedium(nonCodeDisplayMedia.find(m => m.mediumID === mediumID));
                }}
                item={{
                  ...item,
                  title: item.title,
                  url: item.url,
                  content: item.content,
                  type: 'document',
                }}
                customMediaRenderer={customMediaRenderer}
              />
            </Transition.Child>
          ))}
        </div>
      )}
      {!!codeSnippets.length && (
        <div
          className={cx('memori-media-items--grid', {
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
                  console.log('Snippet clicked, mediumID:', mediumID);
                  const foundMedium = codeSnippets.find(m => m.mediumID === mediumID);
                  console.log('Found medium:', foundMedium);
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
            className="memori-media-item-preview--content">
              <Snippet preview={false} medium={openModalMedium} />
            </div>
          ) : (
            <RenderMediaItem
              isChild
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
            />
          )}
        </Modal>
      )}
    </Transition>
  );
};

export default memo(MediaItemWidget);
