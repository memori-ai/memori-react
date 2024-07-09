import React from 'react';
import { DialogState } from '@memori.ai/memori-api-client/dist/types';
// import SendOnEnterMenu from '../SendOnEnterMenu/SendOnEnterMenu';
import ChatTextArea from '../ChatTextArea/ChatTextArea';
import Button from '../ui/Button';
import { useTranslation } from 'react-i18next';
import Send from '../icons/Send';
import MicrophoneButton from '../MicrophoneButton/MicrophoneButton';
import cx from 'classnames';
import Microphone from '../icons/Microphone';

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
  microphoneMode?: 'CONTINUOUS' | 'HOLD_TO_TALK';
  authToken?: string;
}

const ChatInputs: React.FC<Props> = ({
  dialogState,
  userMessage = '',
  onChangeUserMessage,
  sendMessage,
  onTextareaFocus,
  onTextareaBlur,
  onTextareaPressEnter,
  showMicrophone = false,
  microphoneMode = 'HOLD_TO_TALK',
  listening = false,
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
      {/*(instruct || dialogState?.acceptsMedia) && (
        <UploadMenu
          attachmentsMenuOpen={attachmentsMenuOpen}
          setAttachmentsMenuOpen={setAttachmentsMenuOpen}
          authToken={authToken}
          disabled={!dialogState?.acceptsMedia}
        />
      )*/}
      {/*<SendOnEnterMenu
        sendOnEnter={sendOnEnter}
        setSendOnEnter={setSendOnEnter}
      />*/}
      <ChatTextArea
        value={userMessage}
        onChange={onChangeUserMessage}
        onPressEnter={onTextareaPressEnter}
        onFocus={onTextareaFocus}
        onBlur={onTextareaBlur}
        disabled={['R2', 'R3', 'R4', 'R5', 'G3', 'X3'].includes(
          dialogState?.state || ''
        )}
      />
      <Button
        shape="circle"
        primary={!!userMessage?.length}
        disabled={!userMessage || userMessage.length === 0}
        className="memori-chat-inputs--send"
        onClick={() => {
          sendMessage(userMessage);
          stopAudio();
          speechSynthesis.speak(new SpeechSynthesisUtterance(''));
        }}
        title={t('send') || 'Send'}
        icon={<Send />}
      />
      {showMicrophone && microphoneMode === 'HOLD_TO_TALK' && (
        <MicrophoneButton
          listening={listening}
          startListening={startListening}
          stopListening={() => {
            stopListening();

            if (!!userMessage?.length) {
              sendMessage(userMessage);
            }
          }}
          stopAudio={stopAudio}
        />
      )}
      {showMicrophone && microphoneMode === 'CONTINUOUS' && (
        <Button
          primary
          className={cx('memori-chat-inputs--mic', {
            'memori-chat-inputs--mic--listening': listening,
          })}
          title={
            listening
              ? t('write_and_speak.micButtonPopoverListening') || 'Listening'
              : t('write_and_speak.micButtonPopover') || 'Start listening'
          }
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
      )}
    </fieldset>
  );
};

export default ChatInputs;
