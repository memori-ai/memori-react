import { UseCopyArtifactReturn } from '../types';
export declare const useCopyArtifact: (artifact: {
    content: string;
    mimeType: string;
    title?: string;
}, onCopy?: () => void, onDownload?: () => void, onPrint?: () => void) => UseCopyArtifactReturn;
