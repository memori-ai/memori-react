import React, { useEffect, memo, useState } from 'react';
import cx from 'classnames';
import {
  DialogState,
  ExpertReference,
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
  setDialogState: (dialogState: DialogState) => void;
  pushMessage: (message: Message) => void;
  simulateUserPrompt: (text: string, translatedText?: string) => void;
  showDates?: boolean;
  showUpload?: boolean;
  showContextPerLine?: boolean;
  showAIicon?: boolean;
  showTranslationOriginal?: boolean;
  showWhyThisAnswer?: boolean;
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
  listening?: boolean;
  setEnableFocusChatInput: (enableFocusChatInput: boolean) => void;
  isPlayingAudio?: boolean;
  stopAudio: () => void;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  customMediaRenderer?: MediaWidgetProps['customMediaRenderer'];
  layout?: MemoriProps['layout'];
  userAvatar?: MemoriProps['userAvatar'];
  user?: User;
  experts?: ExpertReference[];
  useMathFormatting?: boolean;
  showFunctionCache?: boolean;
  mode?: 'chat' | 'log';
}

const OptimizedChat: React.FC<Props> = ({
  memori,
  tenant,
  sessionID,
  baseUrl,
  apiUrl,
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
  resetTranscript,
  customMediaRenderer,
  user,
  userAvatar,
  showUpload = false,
  experts,
  showFunctionCache = false,
  useMathFormatting = false,
  mode = 'chat',
}) => {
  // Determine if the chat has a lot of messages (for optimization)
  const hasLargeHistory = history.length > 50;
  
  // Track if we're currently in a loading state (for large messages)
  const [isLoadingMessage, setIsLoadingMessage] = useState(false);
  
  // Scroll to the bottom of the chat
  const scrollToBottom = () => {
    // Only attempt to scroll if we're not in a loading state
    if (!isLoadingMessage) {
      setTimeout(() => {
        let userMsgs = document.querySelectorAll(
          '.memori-chat--bubble-container.memori-chat--bubble-from-user'
        );
        userMsgs[userMsgs.length - 1]?.scrollIntoView?.();
      }, 200);
    }
  };
  
  useEffect(() => {
    !preview && scrollToBottom();
  }, [history, preview, isLoadingMessage]);
  
  // Text input focus/blur handlers
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

  // Callback when a message starts/finishes formatting
  const handleMessageLoadingState = (isLoading: boolean) => {
    setIsLoadingMessage(isLoading);
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
          {/* Cover image */}
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

          {/* Message history */}
          {history.map((message, index) => (
            <React.Fragment key={index}>
              {/* Use optimized chat bubble */}
              <ChatBubble
                isFirst={index === 0}
                message={message}
                memori={memori}
                tenant={tenant}
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
                mode={mode}
              />

              {/* Timestamps */}
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

              {/* Context variables */}
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

              {/* Media attachments */}
              <MediaWidget
                simulateUserPrompt={simulateUserPrompt}
                media={message?.media?.filter(
                  m => m.mimeType !== 'text/html' && m.mimeType !== 'text/plain'
                )}
                links={message?.media?.filter(m => m.mimeType === 'text/html')}
                sessionID={sessionID}
                baseUrl={baseUrl}
                apiUrl={apiUrl}
                translateTo={translateTo}
                customMediaRenderer={customMediaRenderer}
              />
            </React.Fragment>
          ))}

          {/* Hints display */}
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

          {/* Typing indicator */}
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
          
          {/* Reference element for scrolling */}
          <div id="end-messages-ref" />
        </div>
      </div>

      {/* Chat input area */}
      {showInputs && (
        <ChatInputs
          resetTranscript={resetTranscript}
          userMessage={userMessage}
          onChangeUserMessage={onChangeUserMessage}
          dialogState={dialogState}
          instruct={instruct}
          authToken={authToken}
          sendMessage={sendMessage}
          microphoneMode={microphoneMode}
          sendOnEnter={sendOnEnter}
          setSendOnEnter={setSendOnEnter}
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
        />
      )}
    </div>
  );
};

export default memo(OptimizedChat);