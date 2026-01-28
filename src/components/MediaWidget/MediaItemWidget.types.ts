import type { Medium } from '@memori.ai/memori-api-client/dist/types';

export type LinkPreviewInfo = {
  title?: string;
  siteName?: string;
  description?: string;
  mediaType?: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  favicon?: string;
  images?: string[];
  video?: string;
  videos?: string[];
};

/** @deprecated Use LinkPreviewInfo */
export type ILinkPreviewInfo = LinkPreviewInfo;

export type MediaItem = Medium & { type?: string };

export interface MediaItemWidgetProps {
  items: MediaItem[];
  sessionID?: string;
  tenantID?: string;
  translateTo?: string;
  baseURL?: string;
  apiURL?: string;
  customMediaRenderer?: (mimeType: string) => JSX.Element | null;
  fromUser?: boolean;
  descriptionOneLine?: boolean;
  onLinkPreviewInfo?: (linkPreviewInfo: LinkPreviewInfo) => void;
}

export interface RenderMediaItemProps {
  isChild?: boolean;
  item: MediaItem;
  sessionID?: string;
  tenantID?: string;
  preview?: boolean;
  baseURL?: string;
  apiURL?: string;
  onClick?: (mediumID: string) => void;
  customMediaRenderer?: (mimeType: string) => JSX.Element | null;
  descriptionOneLine?: boolean;
  onLinkPreviewInfo?: (linkPreviewInfo: LinkPreviewInfo) => void;
}

export interface RenderSnippetItemProps {
  item: Medium & { type: string };
  sessionID?: string;
  tenantID?: string;
  baseURL?: string;
  apiURL?: string;
  onClick?: (mediumID: string) => void;
}

export interface DocumentCardProps {
  title: string;
  badge: string;
  meta?: string | null;
  icon: JSX.Element;
}
