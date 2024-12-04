import React, { useState } from 'react';
import { DialogState } from '@memori.ai/memori-api-client/dist/types';
import ChatTextArea from '../ChatTextArea/ChatTextArea';
import Button from '../ui/Button';
import { useTranslation } from 'react-i18next';
import Send from '../icons/Send';
import MicrophoneButton from '../MicrophoneButton/MicrophoneButton';
import cx from 'classnames';
import Microphone from '../icons/Microphone';
import UploadButton from '../UploadButton/UploadButton';
import FilePreview from '../FilePreview/FilePreview';

// API keys for file conversion service
const CONVERTAPI_SECRETKEY = process.env.CONVERTAPI_SECRETKEY || '';

export interface Props {
  /** Current dialog state */
  dialogState?: DialogState;
  /** Whether to show instruction mode */
  instruct?: boolean;
  /** When to send message - on enter key or click */
  sendOnEnter?: 'keypress' | 'click';
  /** Callback to update send on enter setting */
  setSendOnEnter: (sendOnEnter: 'keypress' | 'click') => void;
  /** Current attachments menu state */
  attachmentsMenuOpen?: 'link' | 'media';
  /** Callback to update attachments menu state */
  setAttachmentsMenuOpen: (attachmentsMenuOpen: 'link' | 'media') => void;
  /** Current user message text */
  userMessage?: string;
  /** Callback when user message changes */
  onChangeUserMessage: (userMessage: string) => void;
  /** Callback to send a message */
  sendMessage: (
    msg: string,
    media?: {
      mediumID: string;
      mimeType: string;
      content: string;
      title?: string;
      properties?: { [key: string]: any };
    }
  ) => void;
  /** Callback when textarea is focused */
  onTextareaFocus: () => void;
  /** Callback when textarea loses focus */
  onTextareaBlur: () => void;
  /** Callback to reset speech transcript */
  resetTranscript: () => void;
  /** Whether microphone is currently listening */
  listening?: boolean;
  /** Whether audio is currently playing */
  isPlayingAudio?: boolean;
  /** Callback to stop audio playback */
  stopAudio: () => void;
  /** Callback to start microphone listening */
  startListening: () => void;
  /** Callback to stop microphone listening */
  stopListening: () => void;
  /** Whether to show microphone button */
  showMicrophone?: boolean;
  /** Microphone input mode */
  microphoneMode?: 'CONTINUOUS' | 'HOLD_TO_TALK';
  /** Auth token for API requests */
  authToken?: string;
  /** Whether to show file upload button */
  showUpload?: boolean;
}

/**
 * Chat inputs component
 * Handles the chat input area, including:
 * - Text input for typing messages
 * - Send button
 * - File upload/attachment
 * - Voice input via microphone
 */
const ChatInputs: React.FC<Props> = ({
  dialogState,
  userMessage = '',
  sendOnEnter,
  onChangeUserMessage,
  sendMessage,
  onTextareaFocus,
  onTextareaBlur,
  resetTranscript,
  showMicrophone = false,
  microphoneMode = 'HOLD_TO_TALK',
  listening = false,
  stopAudio,
  startListening,
  stopListening,
  showUpload = false,
}) => {
  const { t } = useTranslation();


  // State for file preview list
  const [previewFiles, setPreviewFiles] = useState<
    { name: string; id: string; content: string }[]
  >([]);

  /**
   * Handles sending a message, including any attached files
   */
  const onSendMessage = () => {
    sendMessage(
      userMessage,
      previewFiles[0]
        ? {
            mediumID: '',
            mimeType: 'text/plain',
            content: previewFiles[0].content,
            title: previewFiles[0].name,
            properties: {
              isAttachedFile: true,
            },
          }
        : undefined
    );

    // Reset states after sending
    setPreviewFiles([]);
    stopAudio();
    speechSynthesis.speak(new SpeechSynthesisUtterance(''));
  };

  /**
   * Handles enter key press in textarea
   */
  const onTextareaPressEnter = () => {
    if (sendOnEnter === 'keypress' && userMessage?.length > 0) {
      stopListening();
      sendMessage(
        userMessage,
        previewFiles[0]
          ? {
              mediumID: '',
              mimeType: 'text/plain',
              content: previewFiles[0].content,
              title: previewFiles[0].name,
              properties: {
                isAttachedFile: true,
              },
            }
          : undefined
      );

      setPreviewFiles([]);
      onChangeUserMessage('');
      resetTranscript();
    }
  };

  /**
   * Removes a file from the preview list
   */
  const removeFile = (fileId: string) => {
    setPreviewFiles((prev: { name: string; id: string; content: string }[]) =>
      prev.filter((file: { id: string }) => file.id !== fileId)
    );
  };

  return (
    <fieldset
      id="chat-fieldset"
      className="memori-chat-inputs"
      disabled={dialogState?.state === 'X2a' || dialogState?.state === 'X3'}
    >
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
      {showUpload && (
        <>
          <FilePreview
            previewFiles={previewFiles}
            removeFile={removeFile}
          />
          <UploadButton
            setPreviewFiles={setPreviewFiles}
            convertapiToken={CONVERTAPI_SECRETKEY}
          />
        </>
      )}
      <Button
        shape="circle"
        primary={!!userMessage?.length}
        disabled={!userMessage || userMessage.length === 0}
        className="memori-chat-inputs--send"
        onClick={onSendMessage}
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
