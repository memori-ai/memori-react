import { Medium } from '@memori.ai/memori-api-client/dist/types';
import React, { useState, useEffect } from 'react';
import Link from '../icons/Link';
import cx from 'classnames';
import { ellipsis } from 'ellipsed';
import Card from '../ui/Card';
import { Transition } from '@headlessui/react';

import './LinkItemWidget.css';

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
  items: Medium[];
  baseUrl?: string;
  descriptionOneLine?: boolean;
  onLinkPreviewInfo?: (linkPreviewInfo: ILinkPreviewInfo) => void;
}

const getSiteInfo = async (url: string, baseUrl?: string) => {
  try {
    const data = await fetch(
      `${baseUrl ||
        'https://app.twincreator.com'}/api/linkpreview/${encodeURIComponent(
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
  }, [item?.url, link, baseUrl, onLinkPreviewInfo]);

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
  }, [link?.description, item.mediumID]);

  return (
    <a
      href={normURL}
      target="_blank"
      rel="noopener noreferrer"
      className="memori-link-item--link"
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
              src={image}
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
