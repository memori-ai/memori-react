import { Material, SkinnedMesh } from 'three';
export declare const hasTouchscreen: () => boolean;
export declare const isMobileOrTablet: () => boolean;
export declare const isiOS: () => boolean;
export declare const isAndroid: () => boolean;
export declare const isSafari: () => boolean;
export declare const isSafariIOS: () => boolean;
export declare const pwdRegEx: RegExp;
export declare const mailRegEx: RegExp;
export declare const usernameRegEx: RegExp;
export declare const validURLRegEx: RegExp;
export declare const isValidUrl: (url: string) => boolean;
export declare function useDebounce<T>(value: T, delay: number): T;
export declare function useDebounceFn<T extends (...args: any) => any>(fn: T, delay: number): T;
export declare const stripDuplicates: (text: string) => string;
export declare const stripEmojis: (text: string) => string;
export declare const stripMarkdown: (text: string) => string;
export declare const OFFICE_NATIVE_EXTENSIONS: readonly [".doc", ".docx", ".dotx", ".xltx", ".potx"];
export declare const isOfficeNativeFilename: (filename: string) => boolean;
export type ParsedDocumentAttachment = {
    filename: string;
    type: string;
    content: string;
    url: string;
};
export declare const parseDocumentAttachmentsFromMessage: (text: string) => ParsedDocumentAttachment[];
export declare const extractAttachmentLinks: (content: string) => string[];
export declare const extractAttachmentLink: (content: string) => string | null;
export declare const stripDocumentAttachmentTags: (text: string) => string;
export declare const getDocumentAttachmentAssetUrl: (attachment: {
    content?: string | null;
    url?: string | null;
}) => string;
export declare const isAssetOnlyDocumentAttachment: (attachment: {
    title?: string;
    name?: string;
    content?: string | null;
    url?: string | null;
}) => boolean;
export declare const stripOutputTags: (text: string) => string;
export declare const stripReasoningTags: (text: string) => string;
export declare const stripHTML: (text: string) => string;
export declare const withLinksOpenInNewTab: (html: string) => string;
export declare const escapeHTML: (text: string) => string;
export declare const getFieldFromCustomData: (fieldName: string, data: string | undefined) => any;
export declare const truncateMessage: (message: string) => string;
export declare const stripObjNulls: (obj: {
    [key: string]: any;
}) => {
    [x: string]: any;
};
export declare const difference: (origObj: {
    [key: string]: any;
}, newObj: {
    [key: string]: any;
}) => {
    [key: string]: any;
};
export declare function cleanUrl(href: string): string | null;
export declare const mathJaxConfig: {
    startup: {
        elements: string[];
    };
    options: {
        processHtmlClass: string;
    };
    tex: {
        inlineMath: string[][];
        displayMath: string[][];
        processEscapes: boolean;
    };
    asciimath: {
        fixphi: boolean;
        displaystyle: boolean;
        decimalsign: string;
    };
    skipStartupTypeset: boolean;
    chtml: {
        displayAlign: string;
    };
    svg: {
        fontCache: string;
    };
};
export declare const installMathJaxScript: () => void;
export declare const installMathJax: () => void;
export declare function correctMaterials(materials: {
    [key: string]: Material;
}): void;
export declare function isSkinnedMesh(object: any): object is SkinnedMesh;
export declare function disposeObject(object: any): void;
export declare const safeParseJSON: (jsonString: string, fallbackString?: boolean) => any;
