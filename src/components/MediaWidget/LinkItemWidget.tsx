import { Medium } from '@memori.ai/memori-api-client/dist/types';
import React, { useState, useEffect } from 'react';
import Link from '../icons/Link';
import cx from 'classnames';
import { ellipsis } from 'ellipsed';
import Card from '../ui/Card';
import { Transition } from '@headlessui/react';

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

export interface Props {
  isChild?: boolean;
  items: Medium[];
  baseUrl?: string;
  descriptionOneLine?: boolean;
  onLinkPreviewInfo?: (linkPreviewInfo: ILinkPreviewInfo) => void;
}

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

export const RenderLinkItem = ({
  isChild = false,
  item,
  baseUrl,
  onLinkPreviewInfo,
  descriptionOneLine = false,
}: Omit<Props, 'items'> & {
  item: Medium;
}) => {
  const [link, setLink] = useState<
    (ILinkPreviewInfo & { urlKey: string }) | null
  >(null);
  const normURL =
    item.url?.startsWith('http') || !item.url || item.url?.length === 0
      ? item.url
      : `https://${item.url}`;

  useEffect(() => {
    let normURL =
      item.url?.startsWith('http') || !item.url || item.url?.length === 0
        ? item.url
        : `https://${item.url}`;
    if (normURL && normURL !== link?.urlKey) {
      getSiteInfo(normURL, baseUrl).then(siteInfo => {
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
  }, [item?.url, baseUrl, onLinkPreviewInfo]);

  const title = item.title && item.title.length > 0 ? item.title : link?.title;
  const description = link?.description;
  const video = link?.video;
  const image = link?.image ?? link?.images?.[0];

  useEffect(() => {
    setTimeout(() => {
      ellipsis('.memori-link-item--card .memori-card--description', 3, {
        responsive: true,
      });
    }, 300);
  }, [description, item.mediumID]);

  return (
    <a
      href={normURL}
      target="_blank"
      rel="noopener noreferrer"
      className={cx('memori-link-item--link', {
        'memori-link-item--link--child': isChild,
      })}
      onClick={e => {
        if (!isChild) {
          e.preventDefault();
          e.stopPropagation();
          window.open(
            normURL,
            '_blank',
            `toolbar=yes,top=${window.innerHeight * 0.1},left=${
              window.innerWidth * 0.1
            },width=${window.innerWidth * 0.8},height=${
              window.innerHeight * 0.8
            }`
          );
        }
      }}
    >
      <Card
        hoverable
        className={cx('memori-link-item--card', {
          'memori-link-item--card-description-oneline': descriptionOneLine,
          'memori-link-item--card-has-image': image,
          'memori-link-item--card-has-video': video,
        })}
        cover={
          video ? (
            <iframe
              width="100%"
              height="100%"
              src={video}
              title="Video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : image ? (
            <img
              className="memori-link-item--card-cover-img"
              src="data:image/png;base64,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"
              srcSet={
                image.includes('data:image')
                  ? undefined
                  : image.startsWith('https')
                  ? image
                  : `https://${image.replace('http://', '')}`
              }
              alt={item.title}
            />
          ) : (
            <div className="memori-link-item--card-cover-icon">
              <Link className="memori-link-item--icon" />
            </div>
          )
        }
        title={title}
        description={description}
      />
    </a>
  );
};

const LinkItemWidget: React.FC<Props> = ({
  items,
  baseUrl,
  descriptionOneLine = false,
  onLinkPreviewInfo,
}: Props) => {
  return (
    <Transition appear show as="div" className="memori-link-items">
      <div className="memori-link-items--grid">
        {items.map((item, index) => (
          <Transition.Child
            as="div"
            className="memori-link-item"
            key={item.mediumID}
            enter={`ease-out duration-500 delay-${index * 100}`}
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-1 scale-100"
            leave="ease-in duration-300"
            leaveFrom="opacity-1 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <RenderLinkItem
              item={item}
              baseUrl={baseUrl}
              descriptionOneLine={descriptionOneLine}
              onLinkPreviewInfo={onLinkPreviewInfo}
            />
          </Transition.Child>
        ))}
      </div>
    </Transition>
  );
};

export default LinkItemWidget;
