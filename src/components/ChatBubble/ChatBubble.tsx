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
  Check,
} from 'lucide-react';
import { Tooltip } from '@memori.ai/ui';
import FeedbackButtons from '../FeedbackButtons/FeedbackButtons';
import { useTranslation } from 'react-i18next';
import { Button } from '@memori.ai/ui';
import WhyThisAnswer from '../WhyThisAnswer/WhyThisAnswer';
import { stripHTML, stripOutputTags } from '../../helpers/utils';
import { renderMsg, sanitizeMsg, truncateMessage } from '../../helpers/message';
import { Expandable, Modal } from '@memori.ai/ui';
import memoriApiClient from '@memori.ai/memori-api-client';

/** Same reset window as ShareButton copy feedback */
const COPY_FEEDBACK_MS = 2500;

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
  usageHtml?: string;
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
  usageHtml = '',
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const [showingWhyThisAnswer, setShowingWhyThisAnswer] = useState(false);
  const [openFunctionCache, setOpenFunctionCache] = useState(false);
  const [copyStatus, setCopyStatus] = useState<{
    plain: 'idle' | 'success' | 'error';
    raw: 'idle' | 'success' | 'error';
  }>({ plain: 'idle', raw: 'idle' });
  const copyResetTimers = useRef<{
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
    ? sanitizeMsg(truncateMessage(cleanText))
    : stripHTML(stripOutputTags(renderedText));
  const copyText = message.fromUser ? cleanText : plainText;
  const shouldShowCopyButtons =
    showCopyButton && (!!plainText?.length || !!message.text?.length);
  const shouldShowCopyRawButton =
    shouldShowCopyButtons &&
    !!message.text?.length &&
    plainText !== message.text;
  const rawMessageText = sanitizeMsg(
    message.fromUser
      ? message.text || ''
      : (message.text || '').replaceAll(/<think.*?>(.*?)<\/think>/gs, '')
  );
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
        Object.keys(copyResetTimers.current) as Array<'plain' | 'raw'>
      ).forEach(key => {
        const timer = copyResetTimers.current[key];
        if (timer) {
          clearTimeout(timer);
          copyResetTimers.current[key] = null;
        }
      });
    };
  }, []);

  const clearCopyReset = (type: 'plain' | 'raw') => {
    if (copyResetTimers.current[type]) {
      clearTimeout(copyResetTimers.current[type]!);
      copyResetTimers.current[type] = null;
    }
  };

  const scheduleCopyReset = (type: 'plain' | 'raw') => {
    clearCopyReset(type);
    copyResetTimers.current[type] = setTimeout(() => {
      setCopyStatus(prev => ({ ...prev, [type]: 'idle' }));
      copyResetTimers.current[type] = null;
    }, COPY_FEEDBACK_MS);
  };

  const handleCopyClick = async (type: 'plain' | 'raw', text: string) => {
    if (!text?.length) return;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        throw new Error('Clipboard unavailable');
      }
      setCopyStatus(prev => ({ ...prev, [type]: 'success' }));
      scheduleCopyReset(type);
    } catch (err) {
      console.error('Copy failed', err);
      setCopyStatus(prev => ({ ...prev, [type]: 'error' }));
      scheduleCopyReset(type);
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
          <div className="memori-chat--bubble-message ">
            {sanitizeMsg(cleanText)}
          </div>
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
                dangerouslySetInnerHTML={{ __html: sanitizeMsg(cleanText) }}
              />
            </Expandable>
          ) : (
            <div
              dir="auto"
              className="memori-chat--bubble-content"
              dangerouslySetInnerHTML={{ __html: renderedText }}
            />
          )}

          {!!usageHtml && (
            <div
              className="memori-chat--usage-inside-bubble"
              dangerouslySetInnerHTML={{ __html: usageHtml }}
            />
          )}

          {(shouldShowCopyButtons ||
            (message.generatedByAI && showAIicon) ||
            (message.generatedByAI && showFunctionCache) ||
            (showFeedback && simulateUserPrompt)) && (
            <div className="memori-chat--bubble-addon">
              {shouldShowCopyButtons && (
                <Tooltip
                  placement="bottom"
                  content={
                    copyStatus.plain === 'success'
                      ? copiedLabel
                      : copyStatus.plain === 'error'
                        ? t('copyFailed')
                        : t('copy') || 'Copy'
                  }
                >
                  <span className="memori-chat--bubble-addon-tooltip-trigger">
                    <Button
                      variant="ghost"
                      shape="circle"
                      type="button"
                      aria-label={
                        copyStatus.plain === 'success'
                          ? String(copiedLabel)
                          : copyStatus.plain === 'error'
                            ? String(t('copyFailed'))
                            : String(t('copy') || 'Copy')
                      }
                      className={cx(
                        'memori-chat--bubble-action-button',
                        'memori-share-button--copy-item',
                        {
                          'memori-share-button--copy-item--success':
                            copyStatus.plain === 'success',
                          'memori-share-button--copy-item--error':
                            copyStatus.plain === 'error',
                        }
                      )}
                      icon={
                        copyStatus.plain === 'success' ? (
                          <Check
                            className="memori-share-button--copy-icon"
                            aria-hidden
                            strokeWidth={2.5}
                          />
                        ) : (
                          <Copy
                            className="memori-share-button--copy-icon"
                            aria-hidden
                            style={
                              copyStatus.plain === 'idle' && message.fromUser
                                ? { color: '#fff' }
                                : undefined
                            }
                          />
                        )
                      }
                      onClick={() => handleCopyClick('plain', copyText)}
                    />
                  </span>
                </Tooltip>
              )}

              {shouldShowCopyRawButton && (
                <Tooltip
                  placement="bottom"
                  content={
                    copyStatus.raw === 'success'
                      ? copiedLabel
                      : copyStatus.raw === 'error'
                        ? t('copyFailed')
                        : t('copyRawCode') || 'Copy raw code'
                  }
                >
                  <span className="memori-chat--bubble-addon-tooltip-trigger">
                    <Button
                      variant="ghost"
                      shape="circle"
                      type="button"
                      aria-label={
                        copyStatus.raw === 'success'
                          ? String(copiedLabel)
                          : copyStatus.raw === 'error'
                            ? String(t('copyFailed'))
                            : String(t('copyRawCode') || 'Copy raw code')
                      }
                      className={cx(
                        'memori-chat--bubble-action-button',
                        'memori-share-button--copy-item',
                        {
                          'memori-share-button--copy-item--success':
                            copyStatus.raw === 'success',
                          'memori-share-button--copy-item--error':
                            copyStatus.raw === 'error',
                        }
                      )}
                      icon={
                        copyStatus.raw === 'success' ? (
                          <Check
                            className="memori-share-button--copy-icon"
                            aria-hidden
                            strokeWidth={2.5}
                          />
                        ) : (
                          <Code
                            className="memori-share-button--copy-icon"
                            aria-hidden
                          />
                        )
                      }
                      onClick={() => handleCopyClick('raw', rawMessageText)}
                    />
                  </span>
                </Tooltip>
              )}

              {!message.fromUser &&
                showFunctionCache &&
                message.media?.some(
                  m =>
                    Boolean(m.properties?.functionCache) ||
                    m.properties?.functionCache === 'true'
                ) && (
                  <Tooltip
                    placement="bottom"
                    content={t('functionCache') || 'Function cache'}
                    className="memori-chat--bubble-action-icon memori-chat--bubble-action-icon--debug"
                  >
                    <span className="memori-chat--bubble-addon-tooltip-trigger">
                      <Button
                        variant="ghost"
                        shape="circle"
                        className="memori-chat--bubble-action-button"
                        icon={
                          <Bug
                            aria-label={
                              t('functionCache') || 'Function cache'
                            }
                          />
                        }
                        onClick={() => setOpenFunctionCache(true)}
                      />
                    </span>
                  </Tooltip>
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
                  placement="bottom"
                  content={
                    t('generatedByAI') ||
                    (lang === 'it'
                      ? 'Risposta generata da IA, può talvolta generare informazioni non corrette'
                      : 'Answer generated by AI, may occasionally generate incorrect informations')
                  }
                  className="memori-chat--bubble-action-icon memori-chat--bubble-action-icon--ai"
                >
                  <span className="memori-chat--bubble-addon-tooltip-trigger">
                    <Button
                      variant="ghost"
                      shape="circle"
                      type="button"
                      className="memori-chat--bubble-action-button"
                      icon={
                        <Bot
                          aria-label={
                            t('generatedByAI') ||
                            'Answer generated by AI, may occasionally generate incorrect informations'
                          }
                        />
                      }
                    />
                  </span>
                </Tooltip>
              )}

              {showTranslationOriginal &&
                message.translatedText &&
                message.translatedText !== message.text && (
                  <Tooltip
                    placement="bottom"
                    content={`${
                      lang === 'it' ? 'Testo originale' : 'Original text'
                    }: ${message.text}`}
                    className="memori-chat--bubble-action-icon memori-chat--bubble-action-icon--ai"
                  >
                    <span className="memori-chat--bubble-addon-tooltip-trigger">
                      <Button
                        variant="ghost"
                        shape="circle"
                        type="button"
                        className="memori-chat--bubble-action-button"
                        icon={
                          <Languages
                            aria-label={
                              lang === 'it'
                                ? 'Testo originale'
                                : 'Original text'
                            }
                          />
                        }
                      />
                    </span>
                  </Tooltip>
                )}

              {!message.fromUser &&
                message.questionAnswered &&
                apiUrl &&
                showWhyThisAnswer && (
                  <Tooltip
                    placement="bottom"
                    content={t('whyThisAnswer') || 'Why this answer?'}
                  >
                    <span className="memori-chat--bubble-addon-tooltip-trigger">
                      <Button
                        variant="ghost"
                        shape="circle"
                        className="memori-chat--bubble-action-button"
                        onClick={() => setShowingWhyThisAnswer(true)}
                        disabled={showingWhyThisAnswer}
                        icon={
                          <HelpCircle
                            aria-label={
                              t('whyThisAnswer') || 'Why this answer?'
                            }
                          />
                        }
                      />
                    </span>
                  </Tooltip>
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
              <div className="memori-chat--bubble-avatar">{userAvatar}</div>
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
