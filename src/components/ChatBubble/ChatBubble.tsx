import React, { useEffect, useState, useRef, lazy, Suspense, useLayoutEffect } from 'react';
import cx from 'classnames';
import { Message, Memori, Tenant, User, ExpertReference } from '@memori.ai/memori-api-client/dist/types';
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
import Bug from '../icons/Bug'
import WhyThisAnswer from '../WhyThisAnswer/WhyThisAnswer';
import { stripHTML, stripOutputTags } from '../../helpers/utils';
import FilePreview from '../FilePreview/FilePreview';
import { renderMsg, truncateMessage } from '../../helpers/message';
import Spin from '../ui/Spin';
import Modal from '../ui/Modal';

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


// Custom Expandable component optimized for chat bubble content
const ChatBubbleExpandable = ({ 
  children, 
  className, 
  content,
  isLarge,
  onExpand,
  mode = 'chat'
}: { 
  children: React.ReactNode; 
  className?: string; 
  content: string;
  isLarge: boolean;
  onExpand: () => void;
  mode?: 'chat' | 'log';
}) => {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [expanded, setExpanded] = useState(false);
  const [needsExpanding, setNeedsExpanding] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && mode === 'log') {
      const textContent = ref.current.textContent || '';
      // Determine if content needs to be expandable
      if (textContent.length > 300 || isLarge) {
        setNeedsExpanding(true);
      }
    }
  }, [isLarge, mode]);

  // If mode is log, always render full content
  if (mode === 'chat') {
    return (
      <div className={cx('memori-expandable', className)}>
        <div ref={ref} className="memori-expandable--inner">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={cx('memori-expandable', className)}>
      <div
        ref={ref}
        className="memori-expandable--inner"
      >
        {expanded ? children : (
          <div className="truncated-content">
            {truncateMessage(typeof content === 'string' ? content : '')}
          </div>
        )}
      </div>
      {needsExpanding && !expanded && (
        <Button
          ghost
          padded={false}
          className="expand-button"
          onClick={() => {
            setExpanded(true);
            onExpand();
          }}
        >
          ...
        </Button>
      )}
      {needsExpanding && expanded && (
        <Button
          ghost
          padded={false}
          className="collapse-button"
          onClick={() => setExpanded(false)}
        >
          {lang === 'it' ? 'Mostra meno' : 'Show less'}
        </Button>
      )}
    </div>
  );
};

// Lazy load the virtualized content component
const VirtualizedContent = lazy(() => import('./VirtualizedContent/VirtualizedContent'));

export interface Props {
  message: Message | undefined;
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
  showFunctionCache?: boolean;
  onLoadingStateChange?: (isLoading: boolean) => void;
  mode?: 'chat' | 'log';
}

// Size thresholds for different rendering strategies
const LARGE_MESSAGE_THRESHOLD = 5000; // characters
const VERY_LARGE_MESSAGE_THRESHOLD = 15000; // characters for virtualized rendering

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
  showFunctionCache = false,
  onLoadingStateChange,
  mode = 'chat',
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const [showingWhyThisAnswer, setShowingWhyThisAnswer] = useState(false);
  const [openFunctionCache, setOpenFunctionCache] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [contentExpanded, setContentExpanded] = useState(false);
  const [formattedContent, setFormattedContent] = useState<string>('');
  const contentRef = useRef<HTMLDivElement>(null);

  // Determine message size categories
  const messageLength = message?.text?.length || 0;
  const isLargeMessage = messageLength > LARGE_MESSAGE_THRESHOLD;
  const isVeryLargeMessage = messageLength > VERY_LARGE_MESSAGE_THRESHOLD;
  
  // Get original and plaintext content
  const originalText = message?.translatedText || message?.text || '';
  const plainText = message?.fromUser 
    ? (mode === 'chat' ? truncateMessage(originalText) : originalText)
    : stripHTML(stripOutputTags(formattedContent || originalText));

  // Handle loading state changes
  useEffect(() => {
    if (onLoadingStateChange) {
      onLoadingStateChange(isLoading);
    }
  }, [isLoading, onLoadingStateChange]);

  // Initialize MathJax on component mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.MathJax) {
      installMathJax();
    }
  }, []);

  // Format function cache content
  const functionCacheData = message?.media?.find(
    m => m.properties?.functionCache === "true"
  );

  // Initial formatting - format full content if mode is chat
  useEffect(() => {
    if (mode === 'chat') {
      // Always format full content when in chat mode
      const { text } = renderMsg(originalText, useMathFormatting);
      setFormattedContent(text);
    } else {
      // Log mode behavior
      if (!isLargeMessage) {
        const { text } = renderMsg(originalText, useMathFormatting);
        setFormattedContent(text);
      } else {
        // For large messages, only format what's visible initially (truncated content)
        const truncated = truncateMessage(originalText);
        const { text } = renderMsg(truncated, useMathFormatting);
        setFormattedContent(text);
      }
    }
  }, [originalText, useMathFormatting, isLargeMessage, mode]);

  // Handle expansion - format full content when expanding
  const handleExpand = () => {
    if (isLargeMessage && mode === 'log') {
      setIsLoading(true);
      setContentExpanded(true);
      
      // Use timeout to avoid blocking the UI
      setTimeout(() => {
        try {
          const { text } = renderMsg(originalText, useMathFormatting);
          setFormattedContent(text);
        } catch (error) {
          console.error('Error formatting message:', error);
          // Fallback to plain unformatted text in case of error
          setFormattedContent(`<p>${originalText}</p>`);
        } finally {
          setIsLoading(false);
        }
      }, 50);
    }
  };

  // Render MathJax whenever the formatted content changes
  useLayoutEffect(() => {
    if (!message?.fromUser && formattedContent && contentRef.current && useMathFormatting) {
      // Allow a short delay for the DOM to update
      const timer = setTimeout(() => {
        if (window.MathJax && window.MathJax.typesetPromise) {
          try {
            window.MathJax.typesetPromise([contentRef.current?.innerHTML ?? ''])
              .catch(err => console.error('MathJax typesetting failed:', err));
          } catch (error) {
            console.error('Error during MathJax typesetting:', error);
          }
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [formattedContent, message?.fromUser, useMathFormatting]);

  // Render the appropriate content based on size and expanded state
  const renderMessageContent = () => {
    if (isLoading) {
      return (
        <div className="memori-chat--bubble-content memori-chat--bubble-loading">
          <Spin />
        </div>
      );
    }
    
    // If mode is chat, render content directly without expandable wrapper
    if (mode === 'chat') {
      if (isVeryLargeMessage) {
        // For very large content without expand functionality, use virtualization
        return (
          <Suspense fallback={<Spin />}>
            <VirtualizedContent
              content={formattedContent}
              className="memori-chat--bubble-content memori-chat--virtualized-content"
            />
          </Suspense>
        );
      }
      
      // Default rendering for normal-sized messages without expand functionality
      return (
        <div
          dir="auto"
          ref={contentRef}
          className="memori-chat--bubble-content"
          dangerouslySetInnerHTML={{ __html: formattedContent }}
        />
      );
    }
    
    // Log mode expandable behavior
    if (contentExpanded && isVeryLargeMessage) {
      // For very large expanded content, use virtualization
      return (
        <Suspense fallback={<Spin />}>
          <VirtualizedContent
            content={formattedContent}
            className="memori-chat--bubble-content memori-chat--virtualized-content"
          />
        </Suspense>
      );
    }
    
    if (message?.fromUser) {
      // User messages use Expandable with simple truncation
      return (
        <ChatBubbleExpandable 
          className="memori-chat--bubble-content" 
          content={formattedContent}
          isLarge={isLargeMessage}
          onExpand={handleExpand}
          mode={mode}
        >
          <div
            dir="auto"
            className="memori-chat--bubble-content"
            dangerouslySetInnerHTML={{ __html: formattedContent }}
          />
        </ChatBubbleExpandable>
      );
    } 
    
    // AI/system messages - use expandable for large content
    if (isLargeMessage) {
      return (
        <ChatBubbleExpandable 
          className="memori-chat--bubble-content" 
          content={formattedContent}
          isLarge={isLargeMessage}
          onExpand={handleExpand}
          mode={mode}
        >
          <div
            dir="auto"
            ref={contentRef}
            className="memori-chat--bubble-content"
            dangerouslySetInnerHTML={{ __html: formattedContent }}
          />
        </ChatBubbleExpandable>
      );
    }
    
    // Default rendering for normal-sized messages
    return (
      <div
        dir="auto"
        ref={contentRef}
        className="memori-chat--bubble-content"
        dangerouslySetInnerHTML={{ __html: formattedContent }}
      />
    );
  };

  // Full component render
  return (
    <>
      {(message?.initial || isFirst) && (
        <div className="memori-chat--bubble-initial" />
      )}
      <Transition
        show
        appear
        as="div"
        className={cx('memori-chat--bubble-container', {
          'memori-chat--bubble-from-user': !!message?.fromUser,
          'memori-chat--with-addon':
            (message?.generatedByAI && showAIicon) ||
            (showFeedback && simulateUserPrompt),
          'memori-chat--large-content': isLargeMessage && mode === 'log',
        })}
      >
        {!message?.fromUser && (
          <Transition.Child
            as="picture"
            className="memori-chat--bubble-avatar"
            enter="transition ease-in-out duration-300"
            enterFrom={`opacity-0 scale-075 ${
              message?.fromUser ? 'translate-x-15' : 'translate-x--15'
            }`}
            enterTo="opacity-1 scale-1 translate-x-0"
            leave="transition ease-in-out duration-300"
            leaveFrom="opacity-1 scale-1 translate-x-0"
            leaveTo={`opacity-0 scale-075 ${
              message?.fromUser ? 'translate-x-15' : 'translate-x--15'
            }`}
            title={
              !!message?.emitter?.length && !!memori.enableBoardOfExperts
                ? message?.emitter
                : memori.name
            }
          >
            <img
              className="memori-chat--bubble-avatar-img"
              alt={
                !!message?.emitter?.length && !!memori.enableBoardOfExperts
                  ? message?.emitter
                  : memori.name
              }
              src={
                !!message?.emitter?.length &&
                !!memori.enableBoardOfExperts &&
                experts?.find((e) => e.name === message?.emitter)
                  ? `${
                      new URL(apiUrl ?? '/').origin
                    }/api/v1/memoriai/memori/avatar/${
                      experts?.find((e) => e.name === message?.emitter)
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
              onError={(e) => {
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
            'memori-chat--user-bubble': !!message?.fromUser,
            'memori-chat--with-addon':
              (!message?.fromUser && showCopyButton) ||
              (message?.generatedByAI && showAIicon) ||
              (showFeedback && simulateUserPrompt),
            'memori-chat--ai-generated': message?.generatedByAI && showAIicon,
            'memori-chat--with-feedback': showFeedback,
            'memori-chat--large-message': isLargeMessage && mode === 'log',
          })}
          enter="transition ease-in-out duration-300"
          enterFrom={`opacity-0 scale-09 translate-x-${
            message?.fromUser ? '30' : '-30'
          }`}
          enterTo="opacity-1 scale-1 translate-x-0"
          leave="transition ease-in-out duration-300"
          leaveFrom="opacity-1 scale-1 translate-x-0"
          leaveTo={`opacity-0 scale-09  translate-x-${
            message?.fromUser ? '30' : '-30'
          }`}
        >
          {renderMessageContent()}

          {((!message?.fromUser && showCopyButton) ||
            (message?.generatedByAI && showAIicon) ||
            (showFeedback && simulateUserPrompt)) && (
            <div className="memori-chat--bubble-addon">
              {!message?.fromUser && showCopyButton && (
                <Button
                  ghost
                  shape="circle"
                  title={t('copy') || 'Copy'}
                  className="memori-chat--bubble-action-icon"
                  icon={<Copy aria-label={t('copy') || 'Copy'} />}
                  onClick={() => navigator.clipboard.writeText(plainText)}
                />
              )}

              {!message?.fromUser &&
                showCopyButton &&
                plainText !== message?.text && (
                  <Button
                    ghost
                    shape="circle"
                    title={t('copyRawCode') || 'Copy raw code'}
                    className="memori-chat--bubble-action-icon"
                    icon={
                      <Code aria-label={t('copyRawCode') || 'Copy raw code'} />
                    }
                    onClick={() => navigator.clipboard.writeText(message?.text || '')}
                  />
                )}

              {!message?.fromUser &&
                showFunctionCache &&
                message?.media?.some(m => m.properties?.functionCache === "true") && (
                  <Button
                    ghost
                    shape="circle"
                    title="Debug"
                    className="memori-chat--bubble-action-icon"
                    icon={<Bug aria-label="Debug" />}
                    onClick={() => setOpenFunctionCache(true)}
                  />
                )}

              {showFeedback && !!simulateUserPrompt && (
                <FeedbackButtons
                  memori={memori}
                  className="memori-chat--bubble-feedback"
                  dropdown
                  onNegativeClick={(msg) => {
                    if (msg) simulateUserPrompt(msg);
                  }}
                />
              )}

              {message?.generatedByAI && showAIicon && (
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
                message?.translatedText &&
                message?.translatedText !== message?.text && (
                  <Tooltip
                    align="left"
                    content={`${
                      lang === 'it' ? 'Testo originale' : 'Original text'
                    }: ${message?.text}`}
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

              {!message?.fromUser &&
                message?.questionAnswered &&
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

          {message?.fromUser &&
            message?.media &&
            message?.media?.length > 0 &&
            message?.media[0]?.properties?.isAttachedFile && (
              <FilePreview
                previewFiles={message?.media?.map((m) => ({
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

        {message?.fromUser && (
          <>
            {(!!userAvatar && typeof userAvatar === 'string') ||
            (!userAvatar && !!user?.avatarURL?.length) ? (
              <Transition.Child
                as="picture"
                className="memori-chat--bubble-avatar"
                enter="transition ease-in-out duration-300"
                enterFrom={`opacity-0 scale-075 ${
                  message?.fromUser ? 'translate-x-15' : 'translate-x--15'
                }`}
                enterTo="opacity-1 scale-1 translate-x-0"
                leave="transition ease-in-out duration-300"
                leaveFrom="opacity-1 scale-1 translate-x-0"
                leaveTo={`opacity-0 scale-075 ${
                  message?.fromUser ? 'translate-x-15' : 'translate-x--15'
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
                  message?.fromUser ? 'translate-x-15' : 'translate-x--15'
                }`}
                enterTo="opacity-1 scale-1 translate-x-0"
                leave="transition ease-in-out duration-300"
                leaveFrom="opacity-1 scale-1 translate-x-0"
                leaveTo={`opacity-0 scale-075 ${
                  message?.fromUser ? 'translate-x-15' : 'translate-x--15'
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
                  message?.fromUser ? 'translate-x-15' : 'translate-x--15'
                }`}
                enterTo="opacity-1 scale-1 translate-x-0"
                leave="transition ease-in-out duration-300"
                leaveFrom="opacity-1 scale-1 translate-x-0"
                leaveTo={`opacity-0 scale-075 ${
                  message?.fromUser ? 'translate-x-15' : 'translate-x--15'
                }`}
              >
                <UserIcon />
              </Transition.Child>
            )}
          </>
        )}
      </Transition>

      {showingWhyThisAnswer && apiUrl && message && (
        <WhyThisAnswer
          visible={showingWhyThisAnswer}
          message={message}
          closeDrawer={() => setShowingWhyThisAnswer(false)}
          apiURL={apiUrl}
          sessionID={sessionID}
        />
      )}

      {/* Function cache modal */}
      <Modal
        title={functionCacheData?.title}
        open={openFunctionCache}
        onClose={() => setOpenFunctionCache(false)}
        className="memori-chat--function-cache-modal"
      >
        <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
          {functionCacheData?.content}
        </pre>
      </Modal>
    </>
  );
};

export default ChatBubble;