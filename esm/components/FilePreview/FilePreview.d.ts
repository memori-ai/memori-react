/// <reference types="react" />
type FilePreviewProps = {
    previewFiles: any;
    removeFile: (id: string, mediumID: string | undefined) => void;
    allowRemove?: boolean;
    showAnonymousRetentionNotice?: boolean;
    uploadingCount?: number;
};
declare const FilePreview: ({ previewFiles, removeFile, allowRemove, showAnonymousRetentionNotice, uploadingCount, }: FilePreviewProps) => JSX.Element;
export default FilePreview;
