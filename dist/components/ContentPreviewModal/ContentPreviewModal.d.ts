import React, { FC } from 'react';
export interface ContentPreviewModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    isImage?: boolean;
    imageSrc?: string;
    imageAlt?: string;
    children?: React.ReactNode;
    className?: string;
}
declare const ContentPreviewModal: FC<ContentPreviewModalProps>;
export default ContentPreviewModal;
