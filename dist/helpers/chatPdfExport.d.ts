import { Message, Memori } from '@memori.ai/memori-api-client/dist/types';
export interface ChatPDFOptions {
    fontSize?: string;
    fontFamily?: string;
    lineHeight?: string;
    color?: string;
    backgroundColor?: string;
    primaryColorRgb?: string;
}
export interface ChatPDFExportParams {
    messages: Message[];
    memori: Memori;
    conversationStartedLabel: string;
    language?: string;
}
export declare const generateChatPDFCSS: (options?: ChatPDFOptions) => string;
export declare const formatChatHistoryForPDF: (params: ChatPDFExportParams) => string;
export declare const createChatPDFDocument: (htmlContent: string, title: string, options?: ChatPDFOptions) => string;
