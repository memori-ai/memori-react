import React, { useEffect, memo, useState } from 'react';
import cx from 'classnames';
import {
  DialogState,
  ExpertReference,
  Medium,
  Memori,
  Message,
  Tenant,
  User,
} from '@memori.ai/memori-api-client/dist/types';
import { hasTouchscreen } from '../../helpers/utils';
import { getResourceUrl } from '../../helpers/media';
import ChatBubble from '../ChatBubble/ChatBubble';
import MediaWidget, {
  Props as MediaWidgetProps,
} from '../MediaWidget/MediaWidget';
import { Props as MemoriProps } from '../MemoriWidget/MemoriWidget';
import memoriApiClient from '@memori.ai/memori-api-client';
import ChatInputs from '../ChatInputs/ChatInputs';
import Typing from '../Typing/Typing';
import { boardOfExpertsLoadingSentences } from '../../helpers/constants';

import { useArtifact } from '../MemoriArtifactSystem/context/ArtifactContext';
import ArtifactHandler from '../MemoriArtifactSystem/components/ArtifactHandler/ArtifactHandler';
import { ArtifactData } from '../MemoriArtifactSystem/types/artifact.types';
export interface Props {
  memori: Memori;
  tenant?: Tenant;
  sessionID: string;
  translateTo?: string;
  baseUrl?: string;
  apiUrl?: string;
  memoriTyping?: boolean;
  typingText?: string;
  showTypingText?: boolean;
  history: Message[];
  authToken?: string;
  dialogState?: DialogState;
  pushMessage: (message: Message) => void;
  simulateUserPrompt: (text: string, translatedText?: string) => void;
  showDates?: boolean;
  showUpload?: boolean;
  showContextPerLine?: boolean;
  showAIicon?: boolean;
  showTranslationOriginal?: boolean;
  showWhyThisAnswer?: boolean;
  showReasoning?: boolean;
  client?: ReturnType<typeof memoriApiClient>;
  preview?: boolean;
  microphoneMode?: 'CONTINUOUS' | 'HOLD_TO_TALK';
  sendOnEnter?: 'keypress' | 'click';
  setSendOnEnter: (sendOnEnter: 'keypress' | 'click') => void;
  attachmentsMenuOpen?: 'link' | 'media';
  setAttachmentsMenuOpen: (attachmentsMenuOpen: 'link' | 'media') => void;
  instruct?: boolean;
  showCopyButton?: boolean;
  showInputs?: boolean;
  showMicrophone?: boolean;
  userMessage?: string;
  onChangeUserMessage: (userMessage: string) => void;
  sendMessage: (msg: string, media?: (Medium & { type: string })[]) => void;
  listening?: boolean;
  setEnableFocusChatInput: (enableFocusChatInput: boolean) => void;
  isPlayingAudio?: boolean;
  stopAudio: () => void;
  startListening: () => void;
  stopListening: () => void;
  customMediaRenderer?: MediaWidgetProps['customMediaRenderer'];
  layout?: MemoriProps['layout'];
  userAvatar?: MemoriProps['userAvatar'];
  user?: User;
  experts?: ExpertReference[];
  useMathFormatting?: boolean;
  isHistoryView?: boolean;
  isChatlogPanel?: boolean;
  showFunctionCache?: boolean;
}

const Chat: React.FC<Props> = ({
  memori,
  tenant,
  sessionID,
  baseUrl,
  apiUrl,
  client,
  translateTo,
  memoriTyping,
  typingText,
  showTypingText = false,
  history = [],
  authToken,
  dialogState,
  simulateUserPrompt,
  showDates = false,
  showContextPerLine = false,
  showAIicon = true,
  showWhyThisAnswer = true,
  showCopyButton = true,
  showTranslationOriginal = false,
  showReasoning = false,
  preview = false,
  instruct = false,
  showInputs = true,
  showMicrophone = false,
  microphoneMode = 'HOLD_TO_TALK',
  sendOnEnter,
  setSendOnEnter,
  attachmentsMenuOpen,
  setAttachmentsMenuOpen,
  userMessage = '',
  onChangeUserMessage,
  sendMessage,
  listening,
  setEnableFocusChatInput,
  isPlayingAudio,
  stopAudio,
  startListening,
  stopListening,
  customMediaRenderer,
  user,
  userAvatar,
  showUpload = false,
  experts,
  useMathFormatting = false,
  isHistoryView = false,
  isChatlogPanel = false,
  showFunctionCache = false,
}) => {

  const { state, openArtifact, closeArtifact, toggleFullscreen } = useArtifact();

  // Auto-open artifacts when detected in new messages
  useEffect(() => {
    if (!state.isDrawerOpen && history.length > 0) {
      const lastMessage = history[history.length - 1];
      if (!lastMessage.fromUser) {
        const artifacts = detectArtifacts(
          lastMessage.translatedText || lastMessage.text || '',
          lastMessage.fromUser || false
        );
        
        if (artifacts.length > 0) {
          setTimeout(() => {
            openArtifact(artifacts[0]);
          }, 100);
        }
      }
    }
  }, [history]);

  // Artifact detection utility function
  const detectArtifacts = (text: string, fromUser: boolean): ArtifactData[] => {
    if (!text || fromUser) return [];

    const artifactRegex =
      /<output\s+class="memori-artifact"[^>]*data-mimetype="([^"]+)"[^>]*>([\s\S]*?)<\/output>/gi;
    const artifacts: ArtifactData[] = [];
    let match;

    while ((match = artifactRegex.exec(text)) !== null) {
      const mimeType = match[1];
      const content = match[2].trim();

      if (content.length > 50) {
        // Basic validation
        artifacts.push({
          id: `artifact-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          content,
          mimeType,
          title: `${mimeType.toUpperCase()} Artifact`,
          timestamp: new Date(),
          size: content.length,
        });
      }
    }

    return artifacts;
  };
  const scrollToBottom = () => {
    if (isHistoryView) return;
    setTimeout(() => {
      let userMsgs = document.querySelectorAll(
        '.memori-chat--bubble-container.memori-chat--bubble-from-user'
      );
      userMsgs[userMsgs.length - 1]?.scrollIntoView?.();
    }, 200);
  };
  useEffect(() => {
    !preview && !isHistoryView && scrollToBottom();
  }, [history, preview, isHistoryView]);

  const onTextareaFocus = () => {
    stopListening();
    const hasTouch = hasTouchscreen();

    if (hasTouch) setEnableFocusChatInput(true);
    // if the user is on mobile and had not recorded audio, add the chat-focused class to the chat wrapper
    if (hasTouch && window.innerWidth <= 768) {
      document.getElementById('chat-wrapper')?.classList?.add('chat-focused');
      // add the chat-focused class to the memori widget
      document
        .querySelector('.memori.memori-widget')
        ?.classList?.add('chat-focused');
      setTimeout(() => {
        scrollToBottom();
      }, 300);
    }
  };
  const onTextareaBlur = () => {
    if (
      document
        .getElementById('chat-wrapper')
        ?.classList?.contains('chat-focused')
    ) {
      document.getElementById('chat-wrapper')?.classList.remove('chat-focused');
      document
        .querySelector('.memori.memori-widget')
        ?.classList?.remove('chat-focused');
      scrollToBottom();
    }
  };

  return (
    <div
      className={cx('memori-chat--wrapper', {
        'memori-chat-wrapper--translate': translateTo,
      })}
      id="chat-wrapper"
      lang={translateTo?.toUpperCase()}
      data-memori-lang={memori.culture?.split('-')?.[0]?.toUpperCase() ?? 'EN'}
    >
      <div
        className={cx('memori-chat--history', {
          'memori-chat--history-touch': hasTouchscreen(),
        })}
      >
        <div
          className={cx('memori-chat--content', {
            'memori-chat--content-touch': hasTouchscreen(),
          })}
        >
          <div
            className={cx('memori-chat--cover')}
            style={{
              backgroundImage: `url("${getResourceUrl({
                type: 'cover',
                tenantID: tenant?.name,
                resourceURI: memori.coverURL,
                baseURL: baseUrl,
                apiURL: apiUrl,
              })}"), url("${getResourceUrl({
                type: 'cover',
                tenantID: tenant?.name,
                baseURL: baseUrl || 'https://www.aisuru.com',
                apiURL: apiUrl,
              })}")`,
            }}
          />

          {history.map((message, index) => (
            <React.Fragment
              key={`${index}-${
                message.text?.includes('<document_attachment')
                  ? 'has-attachments'
                  : 'no-attachments'
              }-${message.timestamp}`}
            >
              <ChatBubble
                key={`chatbubble-${index}-${
                  message.text?.includes('<document_attachment')
                    ? 'has-attachments'
                    : 'no-attachments'
                }-${message.timestamp}`}
                isFirst={index === 0}
                message={message}
                memori={memori}
                tenant={tenant}
                client={client}
                baseUrl={baseUrl}
                apiUrl={apiUrl}
                sessionID={sessionID}
                simulateUserPrompt={simulateUserPrompt}
                showAIicon={showAIicon}
                showWhyThisAnswer={showWhyThisAnswer}
                showTranslationOriginal={showTranslationOriginal}
                showFeedback={
                  index === history.length - 1 &&
                  !message.fromUser &&
                  dialogState?.acceptsFeedback
                }
                user={user}
                userAvatar={userAvatar}
                experts={experts}
                showCopyButton={showCopyButton}
                useMathFormatting={useMathFormatting}
                showFunctionCache={showFunctionCache}
                showReasoning={showReasoning}
              />

              {showDates && !!message.timestamp && (
                <small
                  className={`memori-chat--timestamp ${
                    message.fromUser ? 'text-right' : 'text-left'
                  }`}
                >
                  {new Intl.DateTimeFormat('it', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  }).format(
                    new Date(
                      message.timestamp.endsWith('Z')
                        ? message.timestamp
                        : `${message.timestamp}Z`
                    )
                  )}
                </small>
              )}

              {showContextPerLine &&
                !!Object.keys(message.contextVars ?? {}).length && (
                  <div className="memori-chat--context-vars">
                    {Object.keys(message.contextVars ?? {}).map(key =>
                      message.contextVars?.[key] === '-' ? (
                        <div
                          className={`memori-chat--context-tag memori-chat--context-tag-canceled`}
                          key={key}
                        >
                          <span className="memori-chat--context-tag-text">
                            {key}
                          </span>
                        </div>
                      ) : message.contextVars?.[key] === '✔️' ? (
                        <div className="memori-chat--context-tag" key={key}>
                          <span className="memori-chat--context-tag-text">
                            {key}
                          </span>
                        </div>
                      ) : (
                        <div className="memori-chat--context-tag" key={key}>
                          <span className="memori-chat--context-tag-text">
                            {key}: {message.contextVars?.[key]}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}

              <MediaWidget
                simulateUserPrompt={simulateUserPrompt}
                media={[
                  // Filter out HTML and plain text media items from the message
                  ...(message?.media?.filter(
                    m =>
                      m.mimeType !== 'text/html' && m.mimeType !== 'text/plain'
                  ) || []),

                  // Extract document attachments that are embedded in the message text
                  ...(() => {
                    // Get the translated or original message text
                    const text = message.translatedText || message.text;

                    // Regex to match document attachments in format:
                    // <document_attachment filename="name.ext" type="mime/type">content</document_attachment>
                    const documentAttachmentRegex =
                      /<document_attachment filename="([^"]+)" type="([^"]+)">([\s\S]*?)<\/document_attachment>/g;

                    const attachments: (Medium & { type?: string })[] = [];
                    let match;

                    // Find all document attachments in the text
                    while (
                      (match = documentAttachmentRegex.exec(text)) !== null
                    ) {
                      const [, filename, type, content] = match;

                      // Create a Medium object for each attachment with:
                      // - Unique ID using timestamp and random string
                      // - Empty URL since content is embedded
                      // - Original mime type and filename
                      // - Trimmed content from the attachment
                      // - Properties to mark it as a document attachment
                      attachments.push({
                        mediumID: `doc_${Date.now()}_${Math.random()
                          .toString(36)
                          .substr(2, 9)}`,
                        url: '',
                        mimeType: type,
                        title: filename,
                        content: content.trim(),
                        properties: { isDocumentAttachment: true },
                        type: 'document',
                      });
                    }

                    return attachments;
                  })(),
                ]}
                links={message?.media?.filter(m => m.mimeType === 'text/html')}
                sessionID={sessionID}
                baseUrl={baseUrl}
                apiUrl={apiUrl}
                translateTo={translateTo}
                customMediaRenderer={customMediaRenderer}
                fromUser={message.fromUser}
              />

                <ArtifactHandler
                  artifacts={detectArtifacts(
                    message.translatedText || message.text || '',
                    message.fromUser || false
                  )}
                  isChatlogPanel={isChatlogPanel}
                />
            </React.Fragment>
          ))}

          {dialogState?.hints &&
            dialogState.hints.length > 0 &&
            !memoriTyping && (
              <MediaWidget
                simulateUserPrompt={simulateUserPrompt}
                hints={
                  dialogState.translatedHints
                    ? dialogState.translatedHints
                    : dialogState.hints.map(h => ({
                        text: h,
                        originalText: h,
                      }))
                }
              />
            )}

          {!!memoriTyping && (
            <Typing
              useDefaultSentences={showTypingText}
              lang={
                translateTo
                  ? translateTo.toLowerCase() === 'it'
                    ? 'it'
                    : 'en'
                  : memori.culture?.split('-')?.[0]?.toLowerCase() === 'it'
                  ? 'it'
                  : 'en'
              }
              sentence={typingText}
              sentences={
                memori.enableBoardOfExperts
                  ? boardOfExpertsLoadingSentences
                  : undefined
              }
              key={typingText}
            />
          )}
          <div id="end-messages-ref" />
        </div>
      </div>

      {showInputs && (
        <ChatInputs
          userMessage={userMessage}
          onChangeUserMessage={onChangeUserMessage}
          dialogState={dialogState}
          instruct={instruct}
          authToken={authToken}
          sendMessage={sendMessage}
          microphoneMode={microphoneMode}
          sendOnEnter={sendOnEnter}
          setSendOnEnter={setSendOnEnter}
          client={client}
          sessionID={sessionID}
          showUpload={showUpload}
          attachmentsMenuOpen={attachmentsMenuOpen}
          setAttachmentsMenuOpen={setAttachmentsMenuOpen}
          onTextareaFocus={onTextareaFocus}
          onTextareaBlur={onTextareaBlur}
          startListening={startListening}
          stopListening={stopListening}
          stopAudio={stopAudio}
          listening={listening}
          isPlayingAudio={isPlayingAudio}
          showMicrophone={showMicrophone}
          memoriID={memori?.memoriID}
        />
      )}
    </div>
  );
};

export default memo(Chat);
