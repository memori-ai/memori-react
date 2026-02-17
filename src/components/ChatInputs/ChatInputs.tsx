import React, { useCallback, useState } from 'react';
import { DialogState, Medium } from '@memori.ai/memori-api-client/dist/types';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import ChatTextArea from '../ChatTextArea/ChatTextArea';
import Button from '../ui/Button';
import Send from '../icons/Send';
import MicrophoneButton from '../MicrophoneButton/MicrophoneButton';
import cx from 'classnames';
import Microphone from '../icons/Microphone';
import UploadButton from '../UploadButton/UploadButton';
import FilePreview from '../FilePreview/FilePreview';
import memoriApiClient from '@memori.ai/memori-api-client';
import Plus from '../icons/Plus';
import {
  PASTE_AS_CARD_LINE_THRESHOLD,
  PASTE_AS_CARD_CHAR_THRESHOLD,
  MAX_DOCUMENTS_PER_MESSAGE,
  MAX_DOCUMENT_CONTENT_LENGTH,
} from '../../helpers/constants';
export interface Props {
  dialogState?: DialogState;
  instruct?: boolean;
  sendOnEnter?: 'keypress' | 'click';
  setSendOnEnter: (sendOnEnter: 'keypress' | 'click') => void;
  attachmentsMenuOpen?: 'link' | 'media';
  setAttachmentsMenuOpen: (attachmentsMenuOpen: 'link' | 'media') => void;
  userMessage?: string;
  onChangeUserMessage: (userMessage: string) => void;
  sendMessage: (msg: string, media?: (Medium & { type: string })[]) => void;
  onTextareaFocus: () => void;
  onTextareaBlur: () => void;
  listening?: boolean;
  isPlayingAudio?: boolean;
  stopAudio: () => void;
  startListening: () => void;
  stopListening: () => void;
  showMicrophone?: boolean;
  microphoneMode?: 'CONTINUOUS' | 'HOLD_TO_TALK';
  authToken?: string;
  showUpload?: boolean;
  isTyping?: boolean;
  sessionID?: string;
  memoriID?: string;
  client?: ReturnType<typeof memoriApiClient>;
  onTextareaExpanded?: (expanded: boolean) => void;
}

const ChatInputs: React.FC<Props> = ({
  dialogState,
  userMessage = '',
  sendOnEnter,
  onChangeUserMessage,
  sendMessage,
  onTextareaFocus,
  onTextareaBlur,
  showMicrophone = false,
  microphoneMode = 'HOLD_TO_TALK',
  listening = false,
  stopAudio,
  startListening,
  stopListening,
  showUpload = false,
  isTyping = false,
  sessionID,
  authToken,
  memoriID,
  client,
  onTextareaExpanded,
}) => {
  const { t } = useTranslation();

  // State for textarea expansion
  const [isExpanded, setIsExpanded] = useState(false);

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
    if (isTyping) return;

    const mediaWithIds = files.map((file, index) => {
      const generatedMediumID =
        file.mediumID ||
        `file_${Date.now()}_${index}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;
      return {
        mediumID: generatedMediumID,
        mimeType: file.mimeType,
        content: file.content,
        title: file.name,
        properties: { isAttachedFile: true },
        type: file.type,
        url: file.url,
      };
    });

    sendMessage(userMessage, mediaWithIds);

    // Reset states after sending
    setDocumentPreviewFiles([]);
    stopAudio();
    speechSynthesis.speak(new SpeechSynthesisUtterance(''));
  };

  /**
   * Handles enter key press in textarea
   */
  const onTextareaPressEnter = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    // Alt/Option+Enter should create a newline (do not send)
    if (e.altKey) return;

    // Prevent default newline on Enter to keep behavior consistent
    e.preventDefault();

    // While the agent is typing, ignore Enter (no send, no newline)
    if (isTyping) return;

    if (sendOnEnter === 'keypress' && userMessage?.length > 0) {
      stopListening();
      const mediaWithIds = documentPreviewFiles.map((file, index) => {
        const generatedMediumID =
          file.mediumID ||
          `file_${Date.now()}_${index}_${Math.random()
            .toString(36)
            .substr(2, 9)}`;
        return {
          mediumID: generatedMediumID,
          mimeType: file.mimeType,
          content: file.content,
          title: file.name,
          properties: { isAttachedFile: true },
          type: file.type,
          url: file.url,
        };
      });

      sendMessage(userMessage, mediaWithIds);

      setDocumentPreviewFiles([]);
      onChangeUserMessage('');
    }
  };

  /**
   * Removes a file from the preview list
   */
  const removeFile = async (fileId: string, mediumID: string | undefined) => {
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

  /**
   * Handles textarea expansion change
   */
  const handleTextareaExpanded = (expanded: boolean) => {
    setIsExpanded(expanded);
    if (onTextareaExpanded) {
      onTextareaExpanded(expanded);
    }
  };

  /**
   * When pasted text is long (many lines or many characters, e.g. CSV/table on one line),
   * add it as a document card instead of inserting into the textarea (same UX as other media).
   */
  const handleTextareaPaste = useCallback(
    (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      if (e.clipboardData.files?.length) return;
      // Use 'text/plain' only so rich/HTML pastes don't get treated as many lines
      const text = e.clipboardData.getData('text/plain');
      if (!text?.trim()) return;
      const lineCount = text.split(/\r\n|\r|\n/).length;
      const isLongByLines = lineCount > PASTE_AS_CARD_LINE_THRESHOLD;
      const isLongByChars = text.length > PASTE_AS_CARD_CHAR_THRESHOLD;
      // Create a card when pasted content has many lines OR is one/few very long lines (e.g. CSV/table)
      if (!isLongByLines && !isLongByChars) return;

      // Critical: max attachments reached – prevent dumping long text into textarea, show feedback
      if (documentPreviewFiles.length >= MAX_DOCUMENTS_PER_MESSAGE) {
        e.preventDefault();
        toast.error(
          t('upload.pasteMaxAttachmentsReached', {
            max: MAX_DOCUMENTS_PER_MESSAGE,
            defaultValue: `Maximum ${MAX_DOCUMENTS_PER_MESSAGE} attachments. Remove one to add this as a file.`,
          })
        );
        return;
      }

      // Critical: pasted content exceeds single-document size limit – reject and inform
      if (text.length > MAX_DOCUMENT_CONTENT_LENGTH) {
        e.preventDefault();
        toast.error(
          t('upload.contextSizeExceedsLimit', {
            defaultValue:
              'Context size exceeds the limit. Try reducing the number of files or content in the conversation.',
          })
        );
        return;
      }

      e.preventDefault();
      const newFile = {
        name: t('upload.pastedText') || 'pasted-text',  
        id: `paste_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        content: text,
        mediumID: undefined as string | undefined,
        mimeType: 'text/plain',
        type: 'document',
      };
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
        ) => [...prev, newFile]
      );
    },
    [documentPreviewFiles, setDocumentPreviewFiles, t]
  );

  const isDisabled =
    dialogState?.state === 'X2a' || dialogState?.state === 'X3';
  const textareaDisabled = ['R2', 'R3', 'R4', 'R5', 'G3', 'X3'].includes(
    dialogState?.state || ''
  );

  return (
    <div className="memori-chat-inputs-wrapper">
      <fieldset
        id="chat-fieldset"
        className={cx('memori-chat-inputs', {
          'memori-chat-inputs--expanded': isExpanded,
        })}
        disabled={isDisabled}
      >
        {/* Preview for document files (show when upload enabled or when paste added cards) */}
        {(showUpload || documentPreviewFiles.length > 0) && (
          <FilePreview
            previewFiles={documentPreviewFiles}
            removeFile={removeFile}
          />
        )}
        <div className="memori-chat-inputs--container">
          {/* Leading area - Plus button */}
          <div className="memori-chat-inputs--leading">
            {showUpload && (
              <div className="memori-chat-inputs--upload-wrapper">
                <UploadButton
                  authToken={authToken}
                  client={client}
                  sessionID={sessionID}
                  isMediaAccepted={dialogState?.acceptsMedia || false}
                  setDocumentPreviewFiles={setDocumentPreviewFiles}
                  documentPreviewFiles={documentPreviewFiles}
                  memoriID={memoriID}
                />
              </div>
            )}
          </div>

          {/* Primary area - Textarea */}
          <div className="memori-chat-inputs--primary">
            <ChatTextArea
              value={userMessage}
              onChange={onChangeUserMessage}
              onPressEnter={onTextareaPressEnter}
              onPaste={handleTextareaPaste}
              onFocus={onTextareaFocus}
              onBlur={onTextareaBlur}
              onExpandedChange={handleTextareaExpanded}
              disabled={textareaDisabled}
            />
          </div>

          {/* Trailing area - Microphone and Send button */}
          <div className="memori-chat-inputs--trailing">
            <div className="memori-chat-inputs--trailing-inner">
              {showMicrophone && microphoneMode === 'CONTINUOUS' && (
                <button
                  type="button"
                  className={cx('memori-chat-inputs--mic-btn', {
                    'memori-chat-inputs--mic-btn--listening': listening,
                  })}
                  title={
                    listening
                      ? t('write_and_speak.micButtonPopoverListening') ||
                        'Listening'
                      : t('write_and_speak.micButtonPopover') ||
                        'Start listening'
                  }
                  onClick={() => {
                    if (listening) {
                      stopListening();
                    } else {
                      stopAudio();
                      startListening();
                    }
                  }}
                  disabled={isDisabled}
                  aria-label={
                    listening
                      ? t('write_and_speak.micButtonPopoverListening') ||
                        'Listening'
                      : t('write_and_speak.micButtonPopover') ||
                        'Start listening'
                  }
                >
                  <Microphone className="icon" />
                </button>
              )}
              {showMicrophone && microphoneMode === 'HOLD_TO_TALK' && (
                <MicrophoneButton
                  listening={listening}
                  startListening={startListening}
                  stopListening={() => {
                    stopListening();
                    if (listening && !!userMessage?.length) {
                      sendMessage(userMessage);
                    }
                  }}
                  stopAudio={stopAudio}
                />
              )}
              <button
                type="button"
                className={cx('memori-chat-inputs--send-btn', {
                  'memori-chat-inputs--send-btn--active': !!userMessage?.length,
                  'memori-chat-inputs--send-btn--disabled':
                    !userMessage || userMessage.length === 0,
                })}
                onClick={() => {
                  onSendMessage(documentPreviewFiles);
                }}
                disabled={!userMessage || userMessage.length === 0 || isTyping}
                title={t('send') || 'Send'}
                aria-label={t('send') || 'Send'}
              >
                {isTyping ? (
                  <div className="memori-chat-inputs--send-btn--loading" />
                ) : (
                  <Send className="icon" />
                )}
              </button>
            </div>
          </div>
        </div>
      </fieldset>
      {/* Disclaimer */}
      {/* <div className="memori-chat-inputs--disclaimer">
        <div>
          {t(
            'chat.disclaimer',
            'AIsuru può commettere errori. Assicurati di verificare le informazioni importanti.'
          )}
        </div>
      </div> */}
    </div>
  );
};

export default ChatInputs;
