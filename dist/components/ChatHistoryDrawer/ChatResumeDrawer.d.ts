import { Message } from '@memori.ai/memori-api-client/dist/types';
export interface ResumeDrawerMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    status?: 'completed' | 'interrupted';
    media?: Message['media'];
    attachment?: {
        name: string;
        type: string;
        size: string;
        ext: string;
    };
}
export interface ChatResumeDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onBack?: () => void;
    onExportChat: () => void;
    embedded?: boolean;
    session: {
        title: string;
        subtitle: string;
        summary: string;
        messages: ResumeDrawerMessage[];
        quickActions: {
            label: string;
            prompt: string;
        }[];
    };
    onResume: (prompt?: string) => void;
    isLoading?: boolean;
}
declare const ChatResumeDrawer: ({ isOpen, onClose, onBack, embedded, session, onResume, isLoading, onExportChat, }: ChatResumeDrawerProps) => JSX.Element | null;
export default ChatResumeDrawer;
