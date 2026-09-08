import React from 'react';
import memoriApiClient from '@memori.ai/memori-api-client';
interface UploadDocumentsProps {
    setDocumentPreviewFiles: (files: {
        name: string;
        id: string;
        content: string;
        mimeType: string;
        textAssetUrl?: string;
    }[]) => void;
    authToken?: string;
    client?: ReturnType<typeof memoriApiClient>;
    sessionID?: string;
    baseUrl?: string;
    memoriID?: string;
    maxDocuments?: number;
    documentPreviewFiles: any;
    onLoadingChange?: (loading: boolean, fileCount?: number) => void;
    onDocumentError?: (error: {
        message: string;
        severity: 'error' | 'warning' | 'info';
    }) => void;
    onValidateFile?: (file: File) => boolean;
    onValidatePayloadSize?: (newDocuments: {
        name: string;
        id: string;
        content: string;
        mimeType: string;
    }[]) => boolean | {
        valid: boolean;
        message?: string;
    };
}
declare const UploadDocuments: React.FC<UploadDocumentsProps>;
export default UploadDocuments;
