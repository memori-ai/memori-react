import React from 'react';
import { Message } from '@memori.ai/memori-api-client/dist/types';
export interface ChatConsumptionDropdownProps {
    history: Message[];
    hasSpacedButtons?: boolean;
    trigger?: React.ReactNode;
}
declare const ChatConsumptionDropdown: React.FC<ChatConsumptionDropdownProps>;
export default ChatConsumptionDropdown;
