import React, { useEffect, memo } from 'react';
import cx from 'classnames';
import {
  DialogState,
  Memori,
  Message,
  Tenant,
} from '@memori.ai/memori-api-client/dist/types';
import { hasTouchscreen } from '../../helpers/utils';
import { getResourceUrl } from '../../helpers/media';
import ChatBubble from '../ChatBubble/ChatBubble';
import MediaWidget, {
  Props as MediaWidgetProps,
} from '../MediaWidget/MediaWidget';
import Button from '../ui/Button';
import { Props as MemoriProps } from '../MemoriWidget/MemoriWidget';
import memoriApiClient from '@memori.ai/memori-api-client';
import ChatInputs from '../ChatInputs/ChatInputs';
import Typing from '../Typing/Typing';

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
  showContextPerLine?: boolean;
  showAIicon?: boolean;
  client: ReturnType<typeof memoriApiClient>;
  selectReceiverTag: (tag: string) => Promise<void>;
  preview?: boolean;
  microphoneMode?: 'CONTINUOUS' | 'HOLD_TO_TALK';
  sendOnEnter?: 'keypress' | 'click';
  setSendOnEnter: (sendOnEnter: 'keypress' | 'click') => void;
  attachmentsMenuOpen?: 'link' | 'media';
  setAttachmentsMenuOpen: (attachmentsMenuOpen: 'link' | 'media') => void;
  instruct?: boolean;
  showInputs?: boolean;
  showMicrophone?: boolean;
  userMessage?: string;
  onChangeUserMessage: (userMessage: string) => void;
  sendMessage: (msg: string) => void;
  listening?: boolean;
  isPlayingAudio?: boolean;
  stopAudio: () => void;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  customMediaRenderer?: MediaWidgetProps['customMediaRenderer'];
  layout: MemoriProps['layout'];
}

const Chat: React.FC<Props> = ({
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
  selectReceiverTag,
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
  isPlayingAudio,
  stopAudio,
  startListening,
  stopListening,
  resetTranscript,
  customMediaRenderer,
  layout,
}) => {
  const scrollToBottom = () => {
    setTimeout(() => {
      if (
        document.body.classList.contains('chat-focused') ||
        layout === 'WEBSITE_ASSISTANT'
      ) {
        document
          .querySelector('.memori-chat--content')
          ?.scrollTo(
            0,
            document.querySelector('.memori-chat--content')?.scrollHeight ?? 0
          );
      } else {
        document.querySelector('#end-messages-ref')?.scrollIntoView({
          behavior: 'smooth',
        });
      }
    }, 200);
  };
  useEffect(() => {
    !preview && scrollToBottom();
  }, [history, preview]);

  const onTextareaFocus = () => {
    stopListening();
    if (hasTouchscreen() && window.innerWidth <= 768) {
      document.getElementById('chat-wrapper')?.classList?.add('chat-focused');
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
      scrollToBottom();
    }
  };
  const onTextareaPressEnter = () => {
    if (sendOnEnter === 'keypress' && userMessage?.length > 0) {
      stopListening();
      sendMessage(userMessage);
      onChangeUserMessage('');
      resetTranscript();
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
                tenantID: tenant?.id,
                resourceURI: memori.coverURL,
                baseURL: baseUrl,
                apiURL: apiUrl,
              })}"), url("${getResourceUrl({
                type: 'cover',
                tenantID: tenant?.id,
                baseURL: baseUrl || 'https://app.twincreator.com',
                apiURL: apiUrl,
              })}")`,
            }}
          />

          {history.map((message, index) => (
            <React.Fragment key={index}>
              <ChatBubble
                isFirst={index === 0}
                message={message}
                memori={memori}
                tenant={tenant}
                baseUrl={baseUrl}
                apiUrl={apiUrl}
                simulateUserPrompt={simulateUserPrompt}
                showAIicon={showAIicon}
                showFeedback={
                  index === history.length - 1 &&
                  !message.fromUser &&
                  dialogState?.acceptsFeedback
                }
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

          {dialogState?.hints && dialogState.hints.length > 0 && (
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
                  : 'en'
              }
              sentence={typingText}
              key={typingText}
            />
          )}
          <div id="end-messages-ref" />
        </div>
      </div>

      {/*
       * TODO: X2a emoji picker
       */}

      {dialogState?.state === 'X3' && sessionID && (
        <div className="memori-chat--known-tags">
          {Object.keys(dialogState.knownTags ?? {})
            .filter(t => t !== memori.giverTag)
            .map(tag => (
              <Button
                key={tag}
                icon={
                  <span className="memori-chat--known-tag-icon">{tag}</span>
                }
                className="memori-chat--known-tag"
                onClick={() => selectReceiverTag(tag)}
              >
                {dialogState.knownTags?.[tag]}
              </Button>
            ))}
        </div>
      )}

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
          attachmentsMenuOpen={attachmentsMenuOpen}
          setAttachmentsMenuOpen={setAttachmentsMenuOpen}
          onTextareaPressEnter={onTextareaPressEnter}
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

export default memo(Chat);
