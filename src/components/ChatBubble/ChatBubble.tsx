import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import cx from 'classnames';
import {
  ExpertReference,
  Memori,
  Message,
  Tenant,
  User,
} from '@memori.ai/memori-api-client/dist/types';
import { Props as MemoriProps } from '../MemoriWidget/MemoriWidget';
import { getResourceUrl } from '../../helpers/media';
import {
  User as UserIcon,
  Bot,
  Languages,
  HelpCircle,
  Copy,
  Code,
  Bug,
} from 'lucide-react';
import { Tooltip } from '@memori.ai/ui';
import FeedbackButtons from '../FeedbackButtons/FeedbackButtons';
import { useTranslation } from 'react-i18next';
import { Button } from '@memori.ai/ui';
import WhyThisAnswer from '../WhyThisAnswer/WhyThisAnswer';
import { stripHTML, stripOutputTags } from '../../helpers/utils';
import { renderMsg, truncateMessage } from '../../helpers/message';
import { Expandable, Modal } from '@memori.ai/ui';
import memoriApiClient from '@memori.ai/memori-api-client';

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

export interface Props {
  message: Message;
  memori: Memori;
  sessionID: string;
  tenant?: Tenant;
  baseUrl?: string;
  apiUrl?: string;
  client?: ReturnType<typeof memoriApiClient>;
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
  showReasoning?: boolean;
}

const ChatBubble: React.FC<Props> = ({
  message,
  memori,
  tenant,
  baseUrl,
  apiUrl,
  client,
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
  showReasoning = false,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const [showingWhyThisAnswer, setShowingWhyThisAnswer] = useState(false);
  const [openFunctionCache, setOpenFunctionCache] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState({
    plain: false,
    raw: false,
  });
  const copyFeedbackTimers = useRef<{
    plain: ReturnType<typeof setTimeout> | null;
    raw: ReturnType<typeof setTimeout> | null;
  }>({
    plain: null,
    raw: null,
  });
  // Initialize MathJax on component mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.MathJax) {
      installMathJax();
    }
  }, []);

  // Clean text by removing document_attachment tags before rendering
  const cleanText = (message.translatedText || message.text).replace(
    /<document_attachment filename="([^"]+)" type="([^"]+)">([\s\S]*?)<\/document_attachment>/g,
    ''
  );
  const { text: renderedText } = renderMsg(
    message.fromUser ? truncateMessage(cleanText) : cleanText,
    useMathFormatting,
    t('reasoning') || 'Reasoning...',
    showReasoning
  );
  const plainText = message.fromUser
    ? truncateMessage(cleanText)
    : stripHTML(stripOutputTags(renderedText));
  const copyText = message.fromUser ? cleanText : plainText;
  const shouldShowCopyButtons =
    showCopyButton && (!!plainText?.length || !!message.text?.length);
  const shouldShowCopyRawButton =
    shouldShowCopyButtons &&
    !!message.text?.length &&
    plainText !== message.text;
  const rawMessageText = message.fromUser
    ? message.text || ''
    : (message.text || '').replaceAll(/<think.*?>(.*?)<\/think>/gs, '');
  const copiedLabel = t('copied') || 'Copied';

  // Format function cache content
  const functionCacheData = message.media?.filter(
    m => m.properties?.functionCache === 'true'
  );

  useLayoutEffect(() => {
    if (typeof window !== 'undefined' && !message.fromUser) {
      const timer = setTimeout(() => {
        if (window.MathJax && window.MathJax.typesetPromise) {
          try {
            const elements = document.querySelectorAll(
              '.memori-chat--bubble-content'
            );
            if (elements.length > 0) {
              // Salva la posizione di scroll corrente
              const scrollContainer = document.querySelector(
                '.memori-chat--history'
              );
              const currentScrollTop = scrollContainer?.scrollTop || 0;
              const currentScrollHeight = scrollContainer?.scrollHeight || 0;

              window.MathJax.typesetPromise(['.memori-chat--bubble-content'])
                .then(() => {
                  // Ripristina la posizione di scroll dopo il rendering MathJax
                  if (scrollContainer) {
                    const newScrollHeight = scrollContainer.scrollHeight;
                    const heightDifference =
                      newScrollHeight - currentScrollHeight;
                    scrollContainer.scrollTop =
                      currentScrollTop + heightDifference;
                  }
                })
                .catch(err =>
                  console.error('MathJax typesetting failed:', err)
                );
            }
          } catch (error) {
            console.error('Error during MathJax typesetting:', error);
          }
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [cleanText, message.fromUser, renderedText]);

  useEffect(() => {
    return () => {
      (
        Object.keys(copyFeedbackTimers.current) as Array<'plain' | 'raw'>
      ).forEach(key => {
        const timer = copyFeedbackTimers.current[key];
        if (timer) {
          clearTimeout(timer);
          copyFeedbackTimers.current[key] = null;
        }
      });
    };
  }, []);

  const triggerCopyFeedback = (type: 'plain' | 'raw') => {
    setCopyFeedback(prev => ({ ...prev, [type]: true }));
    if (copyFeedbackTimers.current[type]) {
      clearTimeout(copyFeedbackTimers.current[type]!);
    }
    copyFeedbackTimers.current[type] = setTimeout(() => {
      setCopyFeedback(prev => ({ ...prev, [type]: false }));
      copyFeedbackTimers.current[type] = null;
    }, 1500);
  };

  const handleCopyClick = (type: 'plain' | 'raw', text: string) => {
    if (!text?.length) return;
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => triggerCopyFeedback(type))
        .catch(err => {
          console.error('Copy failed', err);
        });
    } else {
      triggerCopyFeedback(type);
    }
  };

  // Check if initial is a string (status message) or boolean (legacy)
  const initialStatus =
    typeof message.initial === 'string' ? message.initial : null;
  const showInitialDivider =
    (message.initial === true || isFirst) && !initialStatus;

  // Check if this is a system error message
  const isSystemError = message.emitter === 'system';

  if (initialStatus) {
    return (
      <div className="memori-chat--bubble-status-message">
        <div className="memori-chat--bubble-status-message-content">
          {initialStatus}
        </div>
      </div>
    );
  }

  // Render system error messages as red warning messages
  if (isSystemError) {
    return (
      <div
        className={cx('memori-chat--bubble-container memori-chat-scroll-item', {
          'memori-chat--bubble-from-user': false,
        })}
      >
        <picture
          className="memori-chat--bubble-avatar"
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
        </picture>
        <div className="memori-chat--bubble memori-chat--bubble-status-message-error">
          <div className="memori-chat--bubble-message ">{cleanText}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {showInitialDivider && <div className="memori-chat--bubble-initial" />}
      <div
        className={cx('memori-chat--bubble-container memori-chat-scroll-item', {
          'memori-chat--bubble-from-user': !!message.fromUser,
          'memori-chat--with-addon':
            (message.generatedByAI && showAIicon) ||
            (showFeedback && simulateUserPrompt),
        })}
      >
        {!message.fromUser && (
          <picture
            className="memori-chat--bubble-avatar"
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
          </picture>
        )}

        <div
          className={cx('memori-chat--bubble', {
            'memori-chat--user-bubble': !!message.fromUser,
            'memori-chat--with-addon':
              shouldShowCopyButtons ||
              (message.generatedByAI && showAIicon) ||
              (showFeedback && simulateUserPrompt),
            'memori-chat--ai-generated': message.generatedByAI && showAIicon,
            'memori-chat--with-feedback': showFeedback,
          })}
        >
          {message.fromUser ? (
            <Expandable
              className="memori-chat--bubble-content"
              mode="characters"
            >
              <div
                dir="auto"
                className="memori-chat--bubble-content"
                dangerouslySetInnerHTML={{ __html: cleanText }}
              />
            </Expandable>
          ) : (
            <div
              dir="auto"
              className="memori-chat--bubble-content"
              dangerouslySetInnerHTML={{ __html: renderedText }}
            />
          )}

          {(shouldShowCopyButtons ||
            (message.generatedByAI && showAIicon) ||
            (message.generatedByAI && showFunctionCache) ||
            (showFeedback && simulateUserPrompt)) && (
            <div className="memori-chat--bubble-addon">
              {shouldShowCopyButtons && (
                <Button
                  variant="ghost"
                  shape="circle"
                  title={copyFeedback.plain ? copiedLabel : t('copy') || 'Copy'}
                  icon={
                    <Copy
                      aria-label={
                        copyFeedback.plain ? copiedLabel : t('copy') || 'Copy'
                      }
                    />
                  }
                  onClick={() => handleCopyClick('plain', copyText)}
                />
              )}
              {copyFeedback.plain && (
                <span
                  role="status"
                  aria-live="polite"
                  className={cx('memori-chat--bubble-action-feedback', {
                    'memori-chat--bubble-action-feedback--from-user':
                      message.fromUser,
                  })}
                >
                  {copiedLabel}
                </span>
              )}

              {shouldShowCopyRawButton && (
                <Button
                  variant="ghost"
                  shape="circle"
                  title={
                    copyFeedback.raw
                      ? copiedLabel
                      : t('copyRawCode') || 'Copy raw code'
                  }
                  icon={
                    <Code
                      aria-label={
                        copyFeedback.raw
                          ? copiedLabel
                          : t('copyRawCode') || 'Copy raw code'
                      }
                    />
                  }
                  onClick={() => handleCopyClick('raw', rawMessageText)}
                />
              )}
              {copyFeedback.raw && (
                <span
                  role="status"
                  aria-live="polite"
                  className={cx('memori-chat--bubble-action-feedback', {
                    'memori-chat--bubble-action-feedback--from-user':
                      message.fromUser,
                  })}
                >
                  {copiedLabel}
                </span>
              )}

              {!message.fromUser &&
                showFunctionCache &&
                message.media?.some(
                  m =>
                    Boolean(m.properties?.functionCache) ||
                    m.properties?.functionCache === 'true'
                ) && (
                  <Button
                    variant="ghost"
                    shape="circle"
                    title="Debug"
                    icon={<Bug aria-label="Debug" />}
                    onClick={() => setOpenFunctionCache(true)}
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
                  align="right"
                  content={
                    t('generatedByAI') ||
                    (lang === 'it'
                      ? 'Risposta generata da IA, può talvolta generare informazioni non corrette'
                      : 'Answer generated by AI, may occasionally generate incorrect informations')
                  }
                  className="memori-chat--bubble-action-icon memori-chat--bubble-action-icon--ai"
                >
                  <span>
                    <Bot
                      aria-label={t('generatedByAI') || 'Answer generated by AI, may occasionally generate incorrect informations'}
                    />
                  </span>
                </Tooltip>
              )}

              {showTranslationOriginal &&
                message.translatedText &&
                message.translatedText !== message.text && (
                  <Tooltip
                    align="right"
                    content={`${
                      lang === 'it' ? 'Testo originale' : 'Original text'
                    }: ${message.text}`}
                    className="memori-chat--bubble-action-icon memori-chat--bubble-action-icon--ai"
                  >
                    <span>
                      <Languages
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
                    variant="ghost"
                    shape="circle"
                    title={t('whyThisAnswer') || undefined}
                    onClick={() => setShowingWhyThisAnswer(true)}
                    disabled={showingWhyThisAnswer}
                    icon={
                      <HelpCircle aria-label={t('whyThisAnswer') || undefined} />
                    }
                  />
                )}
            </div>
          )}
        </div>

        {message.fromUser && (
          <>
            {(!!userAvatar && typeof userAvatar === 'string') ||
            (!userAvatar && !!user?.avatarURL?.length) ? (
              <picture className="memori-chat--bubble-avatar">
                <img
                  className="memori-chat--bubble-avatar-img"
                  alt={user?.userName ?? 'User'}
                  src={userAvatar ?? user?.avatarURL}
                />
              </picture>
            ) : !!userAvatar ? (
              <div className="memori-chat--bubble-avatar">
                {userAvatar}
              </div>
            ) : (
              <div className="memori-chat--bubble-avatar">
                <UserIcon />
              </div>
            )}
          </>
        )}
      </div>

      {/* Document attachments are extracted and passed to Chat.tsx for rendering */}

      {showingWhyThisAnswer && client && (
        <WhyThisAnswer
          client={client}
          visible={showingWhyThisAnswer}
          message={message}
          closeDrawer={() => setShowingWhyThisAnswer(false)}
          sessionID={sessionID}
        />
      )}

      <Modal
        open={openFunctionCache}
        className="memori-chat--function-cache-modal"
        title={t('functionCache') || 'Function Cache'}
        closable={true}
      >
        {functionCacheData?.map((f, i) => (
          <div
            key={f.mediumID}
            style={
              i > 0
                ? {
                    marginTop: '1.5rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid #e0e0e0',
                  }
                : {
                    paddingTop: '1.5rem',
                  }
            }
          >
            <h3 style={{ marginTop: 0 }}>{f.title}</h3>
            <pre
              key={f.mediumID}
              style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
            >
              {f.content}
            </pre>
          </div>
        ))}
      </Modal>
    </>
  );
};

export default ChatBubble;
