import React from 'react';
import memoriApiClient from '@memori.ai/memori-api-client';
interface UploadManagerProps {
    authToken?: string;
    client?: ReturnType<typeof memoriApiClient>;
    sessionID?: string;
    baseUrl?: string;
    isMediaAccepted?: boolean;
    setDocumentPreviewFiles: any;
    documentPreviewFiles: {
        name: string;
        id: string;
        content: string;
        mediumID?: string;
        type?: string;
    }[];
    memoriID?: string;
    maxTotalMessagePayload?: number;
    maxDocumentsPerMessage?: number;
    maxDocumentContentLength?: number;
    onUploadLoadingChange?: (loading: boolean, fileCount?: number) => void;
}
declare const UploadButton: React.FC<UploadManagerProps>;
export default UploadButton;
