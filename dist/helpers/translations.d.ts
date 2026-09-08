export type DeeplTranslation = {
    detected_source_language: string;
    text: string;
};
export declare const dialogKeywords: string[];
export declare const getTranslation: (text: string, to: string, from?: string, _baseUrl?: string) => Promise<DeeplTranslation>;
