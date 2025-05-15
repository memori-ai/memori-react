import React, { useEffect, useLayoutEffect, useState, useRef, lazy, Suspense } from 'react';
import cx from 'classnames';
import {
  ExpertReference,
  Memori,
  Message,
  Tenant,
  User,
} from '@memori.ai/memori-api-client/dist/types';
import { Props as MemoriProps } from '../MemoriWidget/MemoriWidget';
import { Transition } from '@headlessui/react';
import { getResourceUrl } from '../../helpers/media';
import UserIcon from '../icons/User';
import AI from '../icons/AI';
import Translation from '../icons/Translation';
import Tooltip from '../ui/Tooltip';
import FeedbackButtons from '../FeedbackButtons/FeedbackButtons';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import QuestionHelp from '../icons/QuestionHelp';
import Copy from '../icons/Copy';
import Code from '../icons/Code';
import WhyThisAnswer from '../WhyThisAnswer/WhyThisAnswer';
import { stripHTML, stripOutputTags } from '../../helpers/utils';
import FilePreview from '../FilePreview/FilePreview';
import { renderMsg, truncateMessage } from '../../helpers/message';
import Expandable from '../ui/Expandable';
import Spin from '../ui/Spin';

// Always import and load MathJax
import { installMathJax } from '../../helpers/utils';

// Import MathJax types
declare global {
  interface Window {
    MathJax?: {
      typesetPromise?: (elements: string[]) => Promise<void>;
    };
  }
}

// Import virtualized list component - using dynamic import for better performance
const VirtualizedContent = lazy(() => import('./VirtualizedContent/VirtualizedContent'));

export interface Props {
  message: Message;
  memori: Memori;
  sessionID: string;
  tenant?: Tenant;
  baseUrl?: string;
  apiUrl?: string;
  showFeedback?: boolean;
  showWhyThisAnswer?: boolean;
  showCopyButton?: boolean;
  showTranslationOriginal?: boolean;
  simulateUserPrompt?: (msg: string) => void;
  showAIicon?: boolean;
  useMathFormatting?: boolean;
  isFirst?: boolean;
  userAvatar?: MemoriProps['userAvatar'];
  user?: User;
  experts?: ExpertReference[];
}

// The size threshold for when to use virtualized rendering
const LARGE_MESSAGE_THRESHOLD = 5000; // characters


// Helper function to check if a message is large and needs special handling
const isLargeMessage = (message: Message): boolean => {
  return message.text.length > LARGE_MESSAGE_THRESHOLD;
};

// Function to create a web worker for processing large text
const createTextProcessingWorker = (text: string, callback: (processedText: string) => void) => {
  const workerCode = `
    self.onmessage = function(e) {
      const text = e.data;
      
      // Process the text in chunks to avoid blocking
      const result = processText(text);
      
      self.postMessage(result);
      self.close();
    };

    function processText(text) {
      // Simple processing for now - in a real implementation, 
      // this would do more complex operations like parsing, 
      // formatting, etc.
      return text;
    }
  `;

  const blob = new Blob([workerCode], { type: 'application/javascript' });
  const url = URL.createObjectURL(blob);
  const worker = new Worker(url);

  worker.onmessage = (e) => {
    callback(e.data);
    URL.revokeObjectURL(url);
  };

  worker.postMessage(text);
  return worker;
};

const ChatBubble: React.FC<Props> = ({
  message,
  memori,
  tenant,
  baseUrl,
  apiUrl,
  sessionID,
  showFeedback,
  showWhyThisAnswer = true,
  showCopyButton = true,
  showTranslationOriginal = false,
  simulateUserPrompt,
  showAIicon = true,
  isFirst = false,
  useMathFormatting = false,
  user,
  userAvatar,
  experts,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const [showingWhyThisAnswer, setShowingWhyThisAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [processedText, setProcessedText] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);
  
  // For very large messages, initiate processing in web worker
  useEffect(() => {
    if (isLargeMessage(message) && !processedText) {
      // Use a web worker for processing to avoid blocking the main thread
      const worker = createTextProcessingWorker(message.text, (result) => {
        setProcessedText(result);
        setIsLoading(false);
      });
      
      return () => {
        // Cleanup worker if component unmounts during processing
        worker.terminate();
      };
    }
  }, [message.text, processedText]);

  // Initialize MathJax on component mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.MathJax) {
      installMathJax();
    }
  }, []);

  const text = message.translatedText || message.text;
  const { text: renderedText } = renderMsg(text, useMathFormatting);
  const plainText = message.fromUser
    ? truncateMessage(text)
    : stripHTML(stripOutputTags(renderedText));

  // Determine if we should use virtualized rendering
  const useVirtualizedRendering = isLargeMessage(message);

  // Render the message content based on size and formatting needs
  const renderMessageContent = () => {
    if (isLoading) {
      // Show loading spinner for any content that's processing
      return (
        <div className="memori-chat--bubble-content memori-chat--bubble-loading">
          <Spin />
        </div>
      );
    } else if (useVirtualizedRendering) {
      // For large messages, use virtualized rendering immediately
      return (
        <Suspense fallback={<Spin />}>
          <VirtualizedContent 
            content={renderedText} 
            className="memori-chat--bubble-content memori-chat--virtualized-content"
          />
        </Suspense>
      );
    } else if (message.fromUser) {
      // For regular user messages that don't need formatting, keep the expandable
      return (
        <Expandable
          className="memori-chat--bubble-content"
          mode="characters"
        >
          <div
            dir="auto"
            className="memori-chat--bubble-content"
            dangerouslySetInnerHTML={{ __html: renderedText }}
          />
        </Expandable>
      );
    } else {
      // For all other messages, render directly
      return (
        <div
          dir="auto"
          ref={contentRef}
          className="memori-chat--bubble-content"
          dangerouslySetInnerHTML={{ __html: renderedText }}
        />
      );
    }
  };

  return (
    <>
      {(message.initial || isFirst) && (
        <div className="memori-chat--bubble-initial" />
      )}
      <Transition
        show
        appear
        as="div"
        className={cx('memori-chat--bubble-container', {
          'memori-chat--bubble-from-user': !!message.fromUser,
          'memori-chat--with-addon':
            (message.generatedByAI && showAIicon) ||
            (showFeedback && simulateUserPrompt),
          'memori-chat--large-content': useVirtualizedRendering,
        })}
      >
        {!message.fromUser && (
          <Transition.Child
            as="picture"
            className="memori-chat--bubble-avatar"
            enter="transition ease-in-out duration-300"
            enterFrom={`opacity-0 scale-075 ${
              message.fromUser ? 'translate-x-15' : 'translate-x--15'
            }`}
            enterTo="opacity-1 scale-1 translate-x-0"
            leave="transition ease-in-out duration-300"
            leaveFrom="opacity-1 scale-1 translate-x-0"
            leaveTo={`opacity-0 scale-075 ${
              message.fromUser ? 'translate-x-15' : 'translate-x--15'
            }`}
            title={
              !!message.emitter?.length && !!memori.enableBoardOfExperts
                ? message.emitter
                : memori.name
            }
          >
            <img
              className="memori-chat--bubble-avatar-img"
              alt={
                !!message.emitter?.length && !!memori.enableBoardOfExperts
                  ? message.emitter
                  : memori.name
              }
              src={
                !!message.emitter?.length &&
                !!memori.enableBoardOfExperts &&
                experts?.find(e => e.name === message.emitter)
                  ? `${
                      new URL(apiUrl ?? '/').origin
                    }/api/v1/memoriai/memori/avatar/${
                      experts.find(e => e.name === message.emitter)
                        ?.expertMemoriID
                    }`
                  : memori.avatarURL && memori.avatarURL.length > 0
                  ? getResourceUrl({
                      type: 'avatar',
                      tenantID: tenant?.name,
                      resourceURI: memori.avatarURL,
                      baseURL: baseUrl,
                      apiURL: apiUrl,
                    })
                  : getResourceUrl({
                      tenantID: tenant?.name,
                      type: 'avatar',
                      baseURL: baseUrl || 'https://www.aisuru.com',
                      apiURL: apiUrl,
                    })
              }
              onError={e => {
                // Fallback image handling if primary source fails
                e.currentTarget.src =
                  memori.avatarURL && memori.avatarURL.length > 0
                    ? getResourceUrl({
                        type: 'avatar',
                        tenantID: tenant?.name,
                        resourceURI: memori.avatarURL,
                        baseURL: baseUrl,
                      })
                    : getResourceUrl({
                        tenantID: tenant?.name,
                        type: 'avatar',
                        baseURL: baseUrl,
                      });

                e.currentTarget.onerror = null;
              }}
            />
          </Transition.Child>
        )}

        <Transition.Child
          as="div"
          className={cx('memori-chat--bubble', {
            'memori-chat--user-bubble': !!message.fromUser,
            'memori-chat--with-addon':
              (!message.fromUser && showCopyButton) ||
              (message.generatedByAI && showAIicon) ||
              (showFeedback && simulateUserPrompt),
            'memori-chat--ai-generated': message.generatedByAI && showAIicon,
            'memori-chat--with-feedback': showFeedback,
            'memori-chat--large-message': useVirtualizedRendering,
          })}
          enter="transition ease-in-out duration-300"
          enterFrom={`opacity-0 scale-09 translate-x-${
            message.fromUser ? '30' : '-30'
          }`}
          enterTo="opacity-1 scale-1 translate-x-0"
          leave="transition ease-in-out duration-300"
          leaveFrom="opacity-1 scale-1 translate-x-0"
          leaveTo={`opacity-0 scale-09  translate-x-${
            message.fromUser ? '30' : '-30'
          }`}
        >
          {renderMessageContent()}

          {((!message.fromUser && showCopyButton) ||
            (message.generatedByAI && showAIicon) ||
            (showFeedback && simulateUserPrompt)) && (
            <div className="memori-chat--bubble-addon">
              {!message.fromUser && showCopyButton && (
                <Button
                  ghost
                  shape="circle"
                  title={t('copy') || 'Copy'}
                  className="memori-chat--bubble-action-icon"
                  icon={<Copy aria-label={t('copy') || 'Copy'} />}
                  onClick={() => navigator.clipboard.writeText(plainText)}
                />
              )}

              {!message.fromUser &&
                showCopyButton &&
                plainText !== message.text && (
                  <Button
                    ghost
                    shape="circle"
                    title={t('copyRawCode') || 'Copy raw code'}
                    className="memori-chat--bubble-action-icon"
                    icon={
                      <Code aria-label={t('copyRawCode') || 'Copy raw code'} />
                    }
                    onClick={() => navigator.clipboard.writeText(message.text)}
                  />
                )}

              {showFeedback && !!simulateUserPrompt && (
                <FeedbackButtons
                  memori={memori}
                  className="memori-chat--bubble-feedback"
                  dropdown
                  onNegativeClick={msg => {
                    if (msg) simulateUserPrompt(msg);
                  }}
                />
              )}

              {message.generatedByAI && showAIicon && (
                <Tooltip
                  align="left"
                  content={
                    t('generatedByAI') ||
                    (lang === 'it'
                      ? 'Risposta generata da IA, può talvolta generare informazioni non corrette'
                      : 'Answer generated by AI, may occasionally generate incorrect informations')
                  }
                  className="memori-chat--bubble-action-icon memori-chat--bubble-action-icon--ai"
                >
                  <span>
                    <AI
                      title={
                        t('generatedByAI') ||
                        (lang === 'it'
                          ? 'Risposta generata da IA, può talvolta generare informazioni non corrette'
                          : 'Answer generated by AI, may occasionally generate incorrect informations')
                      }
                    />
                  </span>
                </Tooltip>
              )}

              {showTranslationOriginal &&
                message.translatedText &&
                message.translatedText !== message.text && (
                  <Tooltip
                    align="left"
                    content={`${
                      lang === 'it' ? 'Testo originale' : 'Original text'
                    }: ${message.text}`}
                    className="memori-chat--bubble-action-icon memori-chat--bubble-action-icon--ai"
                  >
                    <span>
                      <Translation
                        aria-label={
                          lang === 'it' ? 'Testo originale' : 'Original text'
                        }
                      />
                    </span>
                  </Tooltip>
                )}

              {!message.fromUser &&
                message.questionAnswered &&
                apiUrl &&
                showWhyThisAnswer && (
                  <Button
                    ghost
                    shape="circle"
                    title={t('whyThisAnswer') || undefined}
                    className="memori-chat--bubble-action-icon"
                    onClick={() => setShowingWhyThisAnswer(true)}
                    disabled={showingWhyThisAnswer}
                    icon={
                      <QuestionHelp title={t('whyThisAnswer') || undefined} />
                    }
                  />
                )}
            </div>
          )}

          {message.fromUser &&
            message.media &&
            message.media?.length > 0 &&
            message.media[0].properties?.isAttachedFile && (
              <FilePreview
                previewFiles={message.media.map(m => ({
                  name: m.title ?? '',
                  id: m.mediumID,
                  content: m.content ?? '',
                }))}
                removeFile={() => {}}
                allowRemove={false}
                isMessagePreview={true}
              />
            )}
        </Transition.Child>

        {message.fromUser && (
          <>
            {(!!userAvatar && typeof userAvatar === 'string') ||
            (!userAvatar && !!user?.avatarURL?.length) ? (
              <Transition.Child
                as="picture"
                className="memori-chat--bubble-avatar"
                enter="transition ease-in-out duration-300"
                enterFrom={`opacity-0 scale-075 ${
                  message.fromUser ? 'translate-x-15' : 'translate-x--15'
                }`}
                enterTo="opacity-1 scale-1 translate-x-0"
                leave="transition ease-in-out duration-300"
                leaveFrom="opacity-1 scale-1 translate-x-0"
                leaveTo={`opacity-0 scale-075 ${
                  message.fromUser ? 'translate-x-15' : 'translate-x--15'
                }`}
              >
                <img
                  className="memori-chat--bubble-avatar-img"
                  alt={user?.userName ?? 'User'}
                  src={userAvatar ?? user?.avatarURL}
                />
              </Transition.Child>
            ) : !!userAvatar ? (
              <Transition.Child
                as="div"
                className="memori-chat--bubble-avatar"
                enter="transition ease-in-out duration-300"
                enterFrom={`opacity-0 scale-075 ${
                  message.fromUser ? 'translate-x-15' : 'translate-x--15'
                }`}
                enterTo="opacity-1 scale-1 translate-x-0"
                leave="transition ease-in-out duration-300"
                leaveFrom="opacity-1 scale-1 translate-x-0"
                leaveTo={`opacity-0 scale-075 ${
                  message.fromUser ? 'translate-x-15' : 'translate-x--15'
                }`}
              >
                {userAvatar}
              </Transition.Child>
            ) : (
              <Transition.Child
                as="div"
                className="memori-chat--bubble-avatar"
                enter="transition ease-in-out duration-300"
                enterFrom={`opacity-0 scale-075 ${
                  message.fromUser ? 'translate-x-15' : 'translate-x--15'
                }`}
                enterTo="opacity-1 scale-1 translate-x-0"
                leave="transition ease-in-out duration-300"
                leaveFrom="opacity-1 scale-1 translate-x-0"
                leaveTo={`opacity-0 scale-075 ${
                  message.fromUser ? 'translate-x-15' : 'translate-x--15'
                }`}
              >
                <UserIcon />
              </Transition.Child>
            )}
          </>
        )}
      </Transition>

      {showingWhyThisAnswer && apiUrl && (
        <WhyThisAnswer
          visible={showingWhyThisAnswer}
          message={message}
          closeDrawer={() => setShowingWhyThisAnswer(false)}
          apiURL={apiUrl}
          sessionID={sessionID}
        />
      )}
    </>
  );
};

export default ChatBubble;