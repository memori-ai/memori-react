import React, { useState } from 'react';
import { DialogState, Medium } from '@memori.ai/memori-api-client/dist/types';
import ChatTextArea from '../ChatTextArea/ChatTextArea';
import Button from '../ui/Button';
import { useTranslation } from 'react-i18next';
import Send from '../icons/Send';
import MicrophoneButton from '../MicrophoneButton/MicrophoneButton';
import cx from 'classnames';
import Microphone from '../icons/Microphone';
import UploadButton from '../UploadButton/UploadButton';
import FilePreview from '../FilePreview/FilePreview';
import memoriApiClient from '@memori.ai/memori-api-client';
export interface Props {
  dialogState?: DialogState;
  instruct?: boolean;
  sendOnEnter?: 'keypress' | 'click';
  setSendOnEnter: (sendOnEnter: 'keypress' | 'click') => void;
  attachmentsMenuOpen?: 'link' | 'media';
  setAttachmentsMenuOpen: (attachmentsMenuOpen: 'link' | 'media') => void;
  userMessage?: string;
  onChangeUserMessage: (userMessage: string) => void;
  sendMessage: (
    msg: string,
    media?: (Medium & { type: string })[]
  ) => void;
  onTextareaFocus: () => void;
  onTextareaBlur: () => void;
  resetTranscript: () => void;
  listening?: boolean;
  isPlayingAudio?: boolean;
  stopAudio: () => void;
  startListening: () => void;
  stopListening: () => void;
  showMicrophone?: boolean;
  microphoneMode?: 'CONTINUOUS' | 'HOLD_TO_TALK';
  authToken?: string;
  showUpload?: boolean;
  sessionID?: string;
  apiURL?: string;
  memoriID?: string;
}

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
  sessionID,
  authToken,
  apiURL,
  memoriID,
}) => {
  const { t } = useTranslation();

  // State for document preview files
  const [documentPreviewFiles, setDocumentPreviewFiles] = useState<
    {
      name: string;
      id: string;
      content: string;
      mediumID: string | undefined;
      mimeType: string;
      url?: string;
      type: string;
    }[]
  >([]);

  // Client
  const client = apiURL ? memoriApiClient(apiURL) : null;
  const { dialog } = client || {
    dialog: { postMediumDeselectedEvent: null },
  };

  /**
   * Handles sending a message, including any attached files
   */
  const onSendMessage = (
    files: {
      name: string;
      id: string;
      content: string;
      mediumID: string | undefined;
      mimeType: string;
      type: string;
      url?: string;
    }[]
  ) => {
    sendMessage(
      userMessage,
      files.map(file => ({
        mediumID: file.mediumID || '',
        mimeType: file.mimeType,
        content: file.content,
        title: file.name,
        properties: { isAttachedFile: true },
        type: file.type,
        url: file.url,
      }))
    );

    // Reset states after sending
    setDocumentPreviewFiles([]);
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
        documentPreviewFiles.map(file => ({
          mediumID: file.mediumID || '',
          mimeType: file.mimeType,
          content: file.content,
          title: file.name,
          properties: { isAttachedFile: true },
          type: file.type,
          url: file.url,
        }))
      );

      setDocumentPreviewFiles([]);
      onChangeUserMessage('');
      resetTranscript();
    }
  };

  /**
   * Removes a file from the preview list
   */
  const removeFile = async (fileId: string, mediumID: string | undefined) => {
    console.log('removeFile', fileId);
    // Call the MediumDeselected event if dialog API is available
    if (dialog.postMediumDeselectedEvent && sessionID && mediumID) {
      await dialog.postMediumDeselectedEvent(sessionID, mediumID);
    }
    setDocumentPreviewFiles(
      (
        prev: {
          name: string;
          id: string;
          content: string;
          mediumID: string | undefined;
          mimeType: string;
          type: string;
          url?: string;
        }[]
      ) => prev.filter((file: { id: string }) => file.id !== fileId)
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
      {/* Preview for document files */}
      {showUpload && (
        <>
          <FilePreview
            previewFiles={documentPreviewFiles}
            removeFile={removeFile}
          />

          {/* Replace the individual buttons with our unified upload component */}
          <UploadButton
            authToken={authToken}
            apiUrl={apiURL}
            sessionID={sessionID}
            isMediaAccepted={dialogState?.acceptsMedia || false}
            setDocumentPreviewFiles={setDocumentPreviewFiles}
            documentPreviewFiles={documentPreviewFiles}
            memoriID={memoriID}
          />
        </>
      )}
      <Button
        shape="circle"
        primary={!!userMessage?.length}
        disabled={!userMessage || userMessage.length === 0}
        className="memori-chat-inputs--send"
        onClick={() => {
          onSendMessage(documentPreviewFiles);
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
