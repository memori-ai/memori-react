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
import FilePdf from '../icons/FilePdf';
import FileExcel from '../icons/FileExcel';
import FileWord from '../icons/FileWord';
import { Transition } from '@headlessui/react';

export interface Props {
  items: Medium[];
  sessionID?: string;
  tenantID?: string;
  translateTo?: string;
  baseURL?: string;
  apiURL?: string;
  customMediaRenderer?: (mimeType: string) => JSX.Element | null;
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
  item: Medium;
  sessionID?: string;
  tenantID?: string;
  preview?: boolean;
  baseURL?: string;
  apiURL?: string;
  onClick?: (mediumID: string) => void;
  customMediaRenderer?: (mimeType: string) => JSX.Element | null;
}) => {
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
          cover={
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
          }
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
            cover={
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
            }
          />
        </a>
      );

    case 'application/msword':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return (
        <a
          className="memori-media-item--link"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          title={item.title}
        >
          <Card
            hoverable
            cover={<FileWord className="memori-media-item--icon" />}
            title={item.title}
          />
        </a>
      );

    case 'application/vnd.ms-excel':
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      return (
        <a
          className="memori-media-item--link"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          title={item.title}
        >
          <Card
            hoverable
            cover={<FileExcel className="memori-media-item--icon" />}
            title={item.title}
          />
        </a>
      );

    case 'application/pdf':
      return (
        <a
          className="memori-media-item--link"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          title={item.title}
        >
          <Card
            hoverable
            cover={<FilePdf className="memori-media-item--icon" />}
            title={item.title}
          />
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
          <Card
            hoverable
            cover={
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
            }
            title={item.title}
          />
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
          <Card
            hoverable
            cover={
              <audio
                style={{ width: '100%', height: '100%' }}
                controls
                src={url}
              />
            }
            title={item.title}
          />
        </a>
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
      return (
        <a
          className="memori-media-item--link"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          title={item.title}
        >
          <Card
            hoverable
            cover={<File className="memori-media-item--icon" />}
            title={item.title}
          />
        </a>
      );
  }
};

const MediaItemWidget: React.FC<Props> = ({
  items,
  sessionID,
  tenantID,
  translateTo,
  baseURL,
  apiURL,
  customMediaRenderer,
}: Props) => {
  const [media, setMedia] = useState(items);
  const [openModalMedium, setOpenModalMedium] = useState<Medium>();

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
        <div className="memori-media-items--grid">
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
                  setOpenModalMedium(media.find(m => m.mediumID === mediumID));
                }}
                item={{
                  ...item,
                  title: item.title,
                  url: item.url,
                  content: item.content,
                }}
                customMediaRenderer={customMediaRenderer}
              />
            </Transition.Child>
          ))}
        </div>
      )}
      {codeSnippets.map(medium => (
        <Transition.Child
          as="div"
          className="memori-media-item--snippet"
          key={medium.mediumID}
          enter="ease-out duration-500"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-1 translate-y-0"
          leave="ease-in duration-300"
          leaveFrom="opacity-1"
          leaveTo="opacity-0"
        >
          <Snippet key={medium.mediumID} medium={medium} />
        </Transition.Child>
      ))}
      {cssExecutableCode.map(medium => (
        <style
          key={medium.mediumID}
          dangerouslySetInnerHTML={{ __html: medium.content || '' }}
        ></style>
      ))}

      {openModalMedium?.mediumID && (
        <Modal
          width="100%"
          widthMd="100%"
          className="memori-media-item--modal"
          open={!!openModalMedium}
          onClose={() => setOpenModalMedium(undefined)}
          footer={null}
        >
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
            }}
            customMediaRenderer={customMediaRenderer}
          />
        </Modal>
      )}
    </Transition>
  );
};

export default memo(MediaItemWidget);
