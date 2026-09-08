import React from 'react';
import { ExpertReference, Memori, Message, Tenant, User } from '@memori.ai/memori-api-client/dist/types';
import { Props as MemoriProps } from '../MemoriWidget/MemoriWidget';
import memoriApiClient from '@memori.ai/memori-api-client';
declare global {
    interface Window {
        MathJax?: {
            typesetPromise?: (elements: string[]) => Promise<void>;
        };
    }
}
export interface Props {
    message: Message;
    memori: Memori;
    sessionID: string;
    tenant?: Tenant;
    baseUrl?: string;
    apiUrl?: string;
    client?: ReturnType<typeof memoriApiClient>;
    showFeedback?: boolean;
    showWhyThisAnswer?: boolean;
    showCopyButton?: boolean;
    showTranslationOriginal?: boolean;
    simulateUserPrompt?: (msg: string) => void;
    showAIicon?: boolean;
    useMathFormatting?: boolean;
    isFirst?: boolean;
    userAvatar?: MemoriProps['userAvatar'];
    user?: User;
    experts?: ExpertReference[];
    showFunctionCache?: boolean;
    showReasoning?: boolean;
    usageHtml?: string;
}
declare const ChatBubble: React.FC<Props>;
export default ChatBubble;
