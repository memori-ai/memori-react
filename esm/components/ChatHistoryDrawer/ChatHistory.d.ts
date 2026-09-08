/// <reference types="react" />
import memoriApiClient from '@memori.ai/memori-api-client';
import { ChatLog, Memori, Message } from '@memori.ai/memori-api-client/dist/types';
export interface Props {
    open: boolean;
    onClose: () => void;
    apiClient: ReturnType<typeof memoriApiClient>;
    sessionId: string;
    memori: Memori;
    resumeSession: (chatLog: ChatLog) => void;
    baseUrl: string;
    apiUrl: string;
    history: Message[];
    loginToken?: string;
    language: string;
    userLang: string;
    isMultilanguageEnabled?: boolean;
}
declare const ChatHistoryDrawer: ({ open, onClose, apiClient, sessionId, memori, resumeSession, baseUrl, apiUrl, history, loginToken, language, userLang, isMultilanguageEnabled, }: Props) => JSX.Element;
export default ChatHistoryDrawer;
