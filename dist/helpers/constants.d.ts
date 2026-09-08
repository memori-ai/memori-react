export declare const chatLanguages: {
    value: string;
    label: string;
}[];
export declare const popularLanguageCodes: string[];
export declare const getGroupedChatLanguages: () => {
    popular: {
        value: string;
        label: string;
    }[];
    all: {
        value: string;
        label: string;
    }[];
};
export declare const uiLanguages: string[];
export declare const officeNativeExtensions: readonly [".doc", ".docx", ".dotx", ".xltx", ".potx"];
export declare const documentConversionExtensions: readonly [".pdf", ".docm", ".xlsx", ".xlsm", ".xls", ".ods", ".pptx", ".pptm", ".html", ".htm", ".xhtml", ".csv", ".tsv", ".txt", ".md", ".markdown", ".json", ".xml", ".log", ".yml", ".yaml"];
export declare const allowedMediaTypes: string[];
export declare const officeMimeShortLabels: Record<string, string>;
export declare const officeExtensionShortLabels: Record<string, string>;
export declare const anonTag = "\uD83D\uDC64";
export declare const prismSyntaxLangs: ({
    name: string;
    lang: string;
    mimeType: string;
    monacoLang: string;
    executable: boolean;
} | {
    name: string;
    lang: string;
    mimeType: string;
    monacoLang: string;
    executable?: undefined;
})[];
export declare const boardOfExpertsLoadingSentences: {
    [lang: string]: {
        text: string;
        delayAfter: number;
    }[];
};
export declare const MAX_MSG_CHARS = 4000;
export declare const MAX_MSG_WORDS = 300;
export declare const maxDocumentsPerMessage = 10;
export declare const maxDocumentContentLength = 300000;
export declare const pasteAsCardLineThreshold = 100;
export declare const pasteAsCardCharThreshold = 4200;
