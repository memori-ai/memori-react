import type { Medium } from '@memori.ai/memori-api-client/dist/types';
import React from 'react';
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
export declare function MediaPreviewModal({ medium, onClose, sessionID, tenantID, baseURL, apiURL, customMediaRenderer, descriptionOneLine, onLinkPreviewInfo, onMediumClick, }: MediaPreviewModalProps): React.ReactElement;
