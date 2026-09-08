export declare const stripAttachmentTags: (value: string) => string;
export declare const stripAllInternalTags: (value: string) => string;
export declare const needsTruncation: (message: string) => boolean;
export declare const truncateMessage: (message: string) => string;
export declare const sanitizeMsg: (msg: string) => string;
export declare const renderMsg: (text: string, useMathFormatting: boolean | undefined, reasoningText: string | undefined, showReasoning: boolean) => {
    text: string;
};
