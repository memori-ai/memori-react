import React from 'react';
import { DialogState } from '@memori.ai/memori-api-client/dist/types';
import UploadMenu from '../UploadMenu/UploadMenu';
import SendOnEnterMenu from '../SendOnEnterMenu/SendOnEnterMenu';
import ChatTextArea from '../ChatTextArea/ChatTextArea';
import Button from '../ui/Button';
import { useTranslation } from 'react-i18next';
import Send from '../icons/Send';

import './ChatInputs.css';

export interface Props {
  dialogState?: DialogState;
  instruct?: boolean;
  sendOnEnter?: 'keypress' | 'click';
  setSendOnEnter: (sendOnEnter: 'keypress' | 'click') => void;
  attachmentsMenuOpen?: 'link' | 'media';
  setAttachmentsMenuOpen: (attachmentsMenuOpen: 'link' | 'media') => void;
  userMessage?: string;
  onChangeUserMessage: (userMessage: string) => void;
  sendMessage: (msg: string) => void;
  onTextareaFocus: () => void;
  onTextareaBlur: () => void;
  onTextareaPressEnter: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

const ChatInputs: React.FC<Props> = ({
  dialogState,
  instruct = false,
  sendOnEnter = 'click',
  setSendOnEnter,
  attachmentsMenuOpen,
  setAttachmentsMenuOpen,
  userMessage = '',
  onChangeUserMessage,
  sendMessage,
  onTextareaFocus,
  onTextareaBlur,
  onTextareaPressEnter,
}) => {
  const { t } = useTranslation();

  return (
    <fieldset
      id="chat-fieldset"
      className="memori-chat-inputs"
      disabled={dialogState?.state === 'X2a' || dialogState?.state === 'X3'}
    >
      {instruct && (
        <UploadMenu
          attachmentsMenuOpen={attachmentsMenuOpen}
          setAttachmentsMenuOpen={setAttachmentsMenuOpen}
          disabled={!dialogState?.acceptsMedia}
        />
      )}
      <SendOnEnterMenu
        sendOnEnter={sendOnEnter}
        setSendOnEnter={setSendOnEnter}
      />
      <ChatTextArea
        value={userMessage}
        onChange={onChangeUserMessage}
        onPressEnter={onTextareaPressEnter}
        onFocus={onTextareaFocus}
        onBlur={onTextareaBlur}
        disabled={['R2', 'R3', 'R4', 'G3', 'X3'].includes(
          dialogState?.state || ''
        )}
      />
      <Button
        shape="circle"
        primary={!!userMessage?.length}
        disabled={!userMessage || userMessage.length === 0}
        className="memori--conversation-button memori-chat-inputs--send"
        onClick={() => sendMessage(userMessage)}
        title={t('send') || 'Send'}
        icon={<Send />}
      />
    </fieldset>
  );
};

export default ChatInputs;
