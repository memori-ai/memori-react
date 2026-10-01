import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DialogState, Medium } from '@memori.ai/memori-api-client/dist/types';
import { useTranslation } from 'react-i18next';
import ChatTextArea from '../ChatTextArea/ChatTextArea';
import { Button, Tooltip } from '@memori.ai/ui';
import { useAlertManager } from '@memori.ai/ui';
import { Send } from 'lucide-react';
import MicrophoneButton from '../MicrophoneButton/MicrophoneButton';
import AudioWave from '../AudioWave/AudioWave';
import cx from 'classnames';
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
  sendMessage: (msg: string, media?: (Medium & { type: string })[]) => void;
  /** Sync engine dialog state after MediumSelected (keeps catch-up fingerprints accurate). */
  onMediumSelectedState?: (state: DialogState) => void;
  onTextareaFocus: () => void;
  onTextareaBlur: () => void;
  listening?: boolean;
  isPlayingAudio?: boolean;
  stopAudio: () => void;
  /** May resolve to false when recording could not start (e.g. permission denied). */
  startListening: () => void | Promise<boolean>;
  /**
   * Ends the recording. With `onTranscript`, the transcription is handed back
   * instead of being sent directly.
   */
  stopListening: (onTranscript?: (text: string) => void) => void;
  /** Live microphone stream, drives the recording wave. */
  audioStream?: MediaStream | null;
  /** True while the last recording is being transcribed. */
  transcribing?: boolean;
  showMicrophone?: boolean;
  microphoneMode?: 'CONTINUOUS' | 'HOLD_TO_TALK';
  authToken?: string;
  showUpload?: boolean;
  isTyping?: boolean;
  sessionID?: string;
  memoriID?: string;
  baseUrl?: string;
  client?: ReturnType<typeof memoriApiClient>;
  onTextareaExpanded?: (expanded: boolean) => void;
  /** Override total document payload limit (character count). */
  maxTotalMessagePayload?: number;
  /** Max characters in textarea; shows counter and enforces pasted content + existing text does not exceed this limit. */
  maxTextareaCharacters?: number;
  /** Max attachments (docs + images) per message. */
  maxDocumentsPerMessage?: number;
  /** Per-document content character limit. */
  maxDocumentContentLength?: number;
  /** When pasted text has more than this many lines, it is added as a document card. */
  pasteAsCardLineThreshold?: number;
  /** When pasted text exceeds this length, it is added as a document card. */
  pasteAsCardCharThreshold?: number;
  /** When false, hides the AI disclaimer below the input (e.g. pre-start / start panel). */
  showAiGeneratedNote?: boolean;
  /** Optional branding node rendered in the footer row next to the disclaimer. */
  footerBrand?: React.ReactNode;
}

const ChatInputs: React.FC<Props> = ({
  dialogState,
  userMessage = '',
  sendOnEnter,
  onChangeUserMessage,
  sendMessage,
  onMediumSelectedState,
  onTextareaFocus,
  onTextareaBlur,
  showMicrophone = false,
  listening = false,
  stopAudio,
  startListening,
  stopListening,
  audioStream,
  transcribing = false,
  showUpload = false,
  isTyping = false,
  sessionID,
  authToken,
  memoriID,
  baseUrl,
  client,
  onTextareaExpanded,
  maxTotalMessagePayload,
  maxTextareaCharacters,
  maxDocumentsPerMessage,
  maxDocumentContentLength,
  pasteAsCardLineThreshold,
  pasteAsCardCharThreshold,
  showAiGeneratedNote = true,
  footerBrand,
}) => {
  const { t } = useTranslation();
  const alertManager = useAlertManager();
  // State for textarea expansion
  const [isExpanded, setIsExpanded] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);
  const handleUploadLoadingChange = useCallback(
    (loading: boolean, fileCount?: number) => {
      setUploadingCount(loading ? fileCount ?? 1 : 0);
    },
    []
  );

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
    }[],
    message: string = userMessage
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

    sendMessage(message, mediaWithIds);

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

    // While the agent is typing or speech is transcribing, ignore Enter (no send, no newline)
    if (isTyping || transcribing) return;

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
   * Pasted text is added as a document attachment only when it exceeds the char or line threshold.
   * Otherwise the default paste (inline into textarea) is allowed.
   * When maxTextareaCharacters is set, pasted content + existing text must not exceed it.
   */
  const handleTextareaPaste = useCallback(
    (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      if (e.clipboardData.files?.length) return;
      const text = e.clipboardData.getData('text/plain');
      if (!text?.trim()) return;

      const target = e.target as HTMLTextAreaElement;
      const selectionLength = target.selectionEnd - target.selectionStart;
      const lengthAfterPaste =
        userMessage.length - selectionLength + text.length;

      if (
        maxTextareaCharacters != null &&
        lengthAfterPaste > maxTextareaCharacters
      ) {
        e.preventDefault();
        alertManager.add({
          id: `paste-content-exceeds-limit-${Date.now()}`,
          title: t('upload.pasteContentExceedsLimit', {
            defaultValue:
              'Pasted content exceeds the size limit. Try shortening the text or splitting it into smaller parts.',
          }),
          data: { severity: 'error', closable: true },
        });
        return;
      }

      const lineCount = text.split(/\r?\n/).length;
      const charThreshold = pasteAsCardCharThreshold ?? 4200;
      const lineThreshold = pasteAsCardLineThreshold ?? 100;
      const exceedsCharThreshold = text.length > charThreshold;
      const exceedsLineThreshold = lineCount > lineThreshold;
      if (!exceedsCharThreshold && !exceedsLineThreshold) {
        return; // allow default paste (inline)
      }

      // Critical: max attachments reached – prevent dumping long text into textarea, show feedback
      const maxDocs = maxDocumentsPerMessage ?? 10;
      if (documentPreviewFiles.length >= maxDocs) {
        e.preventDefault();
        alertManager.add({
          id: `paste-max-attachments-reached-${Date.now()}`,
          title: t('upload.pasteMaxAttachmentsReached', {
            max: maxDocs,
            defaultValue: `Maximum ${maxDocs} attachments. Remove one to add this as a file.`,
          }),
          data: { severity: 'error', closable: true },
        });
        return;
      }

      // Only enforce a per-document limit. `maxTotalMessagePayload` is kept for backward compatibility
      // and now acts as the per-document content length override.
      const perDocumentLimit =
        maxTotalMessagePayload ?? maxDocumentContentLength ?? 300000;

      if (text.length > perDocumentLimit) {
        e.preventDefault();
        alertManager.add({
          id: `paste-content-exceeds-per-document-limit-${Date.now()}`,
          title: t('upload.pasteContentExceedsLimit', {
            defaultValue:
              'Pasted content exceeds the size limit. Try shortening the text or splitting it into smaller parts.',
          }),
          data: { severity: 'error', closable: true },
        });
        return;
      }

      e.preventDefault();
      const displayName = t('upload.pastedText') || 'pasted-text';
      const wrappedContent = `<document_attachment filename="pasted-text.txt" type="text/plain">

${text}

</document_attachment>`;
      const newFile = {
        name: displayName,
        id: `paste_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        content: wrappedContent,
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
    [
      documentPreviewFiles,
      maxTextareaCharacters,
      maxTotalMessagePayload,
      userMessage.length,
      t,
    ]
  );

  const isDisabled =
    dialogState?.state === 'X2a' || dialogState?.state === 'X3';
  const hasActiveSession = Boolean(sessionID?.trim());
  const hasChatStarted = Boolean(dialogState);
  const textareaDisabled =
    !hasActiveSession ||
    ['R2', 'R3', 'R4', 'R5', 'G3', 'X3'].includes(dialogState?.state || '');
  const microphoneDisabled =
    isDisabled ||
    textareaDisabled ||
    !hasActiveSession ||
    !hasChatStarted ||
    isTyping ||
    transcribing;
  const [micActive, setMicActive] = useState(!!listening);
  const wasListeningRef = useRef(false);
  const pendingTranscriptRef = useRef<((text: string) => void) | null>(null);
  const userMessageRef = useRef(userMessage);
  userMessageRef.current = userMessage;
  const previewFilesRef = useRef(documentPreviewFiles);
  previewFilesRef.current = documentPreviewFiles;
  const listeningRef = useRef(listening);
  listeningRef.current = listening;
  const stopListeningRef = useRef(stopListening);
  stopListeningRef.current = stopListening;

  useEffect(() => {
    return () => {
      if (listeningRef.current) stopListeningRef.current();
    };
  }, []);

  useEffect(() => {
    if (listening) {
      if (pendingTranscriptRef.current) {
        stopListening(pendingTranscriptRef.current);
        return;
      }
      wasListeningRef.current = true;
      setMicActive(true);
      return;
    }

    pendingTranscriptRef.current = null;
    if (wasListeningRef.current) {
      wasListeningRef.current = false;
      setMicActive(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening]);

  useEffect(() => {
    if (microphoneDisabled && !listening) setMicActive(false);
  }, [microphoneDisabled, listening]);

  const startRecording = () => {
    if (microphoneDisabled) return;
    pendingTranscriptRef.current = null;
    setMicActive(true);
    stopAudio();
    Promise.resolve(startListening()).then(started => {
      if (started === false) setMicActive(false);
    });
  };

  const endRecording = (send: boolean) => {
    const onTranscript = (text: string) => {
      const message = [userMessageRef.current.trim(), text]
        .filter(Boolean)
        .join(' ');
      if (send) onSendMessage(previewFilesRef.current, message);
      else onChangeUserMessage(message);
    };
    pendingTranscriptRef.current = onTranscript;
    wasListeningRef.current = false;
    setMicActive(false);
    stopListening(onTranscript);
  };

  const canSend = micActive || userMessage.length > 0;
  const sendLabel = micActive
    ? t('write_and_speak.sendRecording') || 'Send voice message'
    : t('send') || 'Send';

  useEffect(() => {
    if (isTyping && listening) {
      stopListening();
    }
  }, [isTyping, listening, stopListening]);

  return (
    <div className="memori-chat-inputs-wrapper">
      <fieldset
        id="chat-fieldset"
        className={cx('memori-chat-inputs', {
          'memori-chat-inputs--expanded': isExpanded,
        })}
        disabled={isDisabled}
      >
        {/* Preview for document files (only when files or uploads are present) */}
        {(documentPreviewFiles.length > 0 || uploadingCount > 0) && (
          <div className="memori-chat-inputs--preview-wrapper">
            <FilePreview
              previewFiles={documentPreviewFiles}
              removeFile={removeFile}
              showAnonymousRetentionNotice={!authToken}
              uploadingCount={uploadingCount}
              maxDocumentsPerMessage={maxDocumentsPerMessage}
            />
          </div>
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
                  baseUrl={baseUrl}
                  isMediaAccepted={dialogState?.acceptsMedia || false}
                  setDocumentPreviewFiles={setDocumentPreviewFiles}
                  documentPreviewFiles={documentPreviewFiles}
                  memoriID={memoriID}
                  maxTotalMessagePayload={maxTotalMessagePayload}
                  maxDocumentsPerMessage={maxDocumentsPerMessage}
                  maxDocumentContentLength={maxDocumentContentLength}
                  onUploadLoadingChange={handleUploadLoadingChange}
                  disabled={textareaDisabled || isDisabled}
                  onMediumSelectedState={onMediumSelectedState}
                />
              </div>
            )}
          </div>

          {/* Primary area - Textarea, or live wave while recording */}
          <div className="memori-chat-inputs--primary">
            {micActive ? (
              <AudioWave
                stream={audioStream}
                label={
                  t('write_and_speak.recordingInProgress') ||
                  'Recording in progress'
                }
              />
            ) : (
              <ChatTextArea
                value={userMessage}
                onChange={onChangeUserMessage}
                onPressEnter={onTextareaPressEnter}
                onPaste={handleTextareaPaste}
                onFocus={onTextareaFocus}
                onBlur={onTextareaBlur}
                onExpandedChange={handleTextareaExpanded}
                disabled={textareaDisabled}
                maxTextareaCharacters={maxTextareaCharacters}
              />
            )}
          </div>

          {/* Trailing area - Microphone and Send button */}
          <div className="memori-chat-inputs--trailing">
            <div className="memori-chat-inputs--trailing-inner">
              {showMicrophone && (
                <MicrophoneButton
                  listening={micActive}
                  startListening={startRecording}
                  stopListening={() => endRecording(false)}
                  stopAudio={stopAudio}
                  disabled={microphoneDisabled && !micActive}
                />
              )}
              <Tooltip
                placement="top"
                className="memori-chat-inputs--send-btn-tooltip"
                slotProps={{
                  positioner: {
                    className:
                      'memori-chat-inputs--send-btn-tooltip-positioner',
                  },
                }}
                title={sendLabel}
              >
                <Button
                  variant="primary"
                  className={cx('memori-chat-inputs--send-btn', {
                    'memori-chat-inputs--send-btn--active': canSend,
                    'memori-chat-inputs--send-btn--disabled': !canSend,
                  })}
                  onClick={() => {
                    if (micActive) {
                      endRecording(true);
                      return;
                    }
                    onSendMessage(documentPreviewFiles);
                  }}
                  disabled={
                    !canSend || isTyping || transcribing || uploadingCount > 0
                  }
                  title={sendLabel}
                  size="sm"
                  aria-label={sendLabel}
                  aria-busy={transcribing || undefined}
                >
                  {isTyping || transcribing ? (
                    <div className="memori-chat-inputs--send-btn--loading" />
                  ) : (
                    <Send className="icon" />
                  )}
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>
      </fieldset>
      {(showAiGeneratedNote || footerBrand) && (
        <div className="memori-conversation-footer">
          {showAiGeneratedNote ? (
            <p className="memori-chat-inputs--ai-note">
              {t('aiGeneratedNote', { defaultValue: 'Generato da AI' })}
            </p>
          ) : (
            <span className="memori-chat-inputs--ai-note" aria-hidden />
          )}
          {footerBrand}
        </div>
      )}
    </div>
  );
};

export default ChatInputs;
