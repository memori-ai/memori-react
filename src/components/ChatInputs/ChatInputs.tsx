import React from 'react';
import { DialogState } from '@memori.ai/memori-api-client/dist/types';
import UploadMenu from '../UploadMenu/UploadMenu';
import SendOnEnterMenu from '../SendOnEnterMenu/SendOnEnterMenu';
import ChatTextArea from '../ChatTextArea/ChatTextArea';
import Button from '../ui/Button';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import Send from '../icons/Send';
import Microphone from '../icons/Microphone';

import './ChatInputs.css';
import Tooltip from '../ui/Tooltip';

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
  listening?: boolean;
  isPlayingAudio?: boolean;
  stopAudio: () => void;
  startListening: () => void;
  stopListening: () => void;
  showMicrophone?: boolean;
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
  showMicrophone = false,
  listening = false,
  isPlayingAudio = false,
  stopAudio,
  startListening,
  stopListening,
}) => {
  const { t } = useTranslation();

  return (
    <fieldset
      id="chat-fieldset"
      className="memori-chat-inputs"
      disabled={dialogState?.state === 'X2a' || dialogState?.state === 'X3'}
    >
      {(instruct || dialogState?.acceptsMedia) && (
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
        className="memori-chat-inputs--send"
        onClick={() => sendMessage(userMessage)}
        title={t('send') || 'Send'}
        icon={<Send />}
      />
      {showMicrophone && (
        <Tooltip
          alignLeft
          content={
            listening
              ? t('write_and_speak.micButtonPopoverListening')
              : t('write_and_speak.micButtonPopover')
          }
        >
          <Button
            className={cx('memori-chat-inputs--mic', {
              'memori-chat-inputs--mic--listening': listening,
            })}
            disabled={isPlayingAudio}
            onClick={() => {
              if (listening) {
                stopListening();
              } else {
                stopAudio();
                startListening();
              }
            }}
            shape="circle"
            icon={<Microphone />}
          />
        </Tooltip>
      )}
    </fieldset>
  );
};

export default ChatInputs;
