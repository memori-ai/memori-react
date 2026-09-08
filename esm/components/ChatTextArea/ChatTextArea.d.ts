import React from 'react';
export interface Props {
    disabled?: boolean;
    value: string;
    onChange: (value: string) => void;
    onPressEnter?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    onPaste?: (e: React.ClipboardEvent<HTMLTextAreaElement>) => void;
    onFocus?: (e: React.FocusEvent) => void;
    onBlur?: (e: React.FocusEvent) => void;
    onExpandedChange?: (expanded: boolean) => void;
    maxTextareaCharacters?: number;
}
declare const ChatTextArea: React.FC<Props>;
export default ChatTextArea;
