import React from 'react';
import memoriApiClient from '@memori.ai/memori-api-client';
interface UploadImagesProps {
    authToken?: string;
    client?: ReturnType<typeof memoriApiClient>;
    sessionID?: string;
    isMediaAccepted?: boolean;
    setDocumentPreviewFiles: any;
    documentPreviewFiles: any;
    onLoadingChange?: (loading: boolean, fileCount?: number) => void;
    maxImages?: number;
    memoriID?: string;
    onImageError?: (error: {
        message: string;
        severity: 'error' | 'warning' | 'info';
    }) => void;
    onValidateImageFile?: (file: File) => boolean;
}
declare const UploadImages: React.FC<UploadImagesProps>;
export default UploadImages;
