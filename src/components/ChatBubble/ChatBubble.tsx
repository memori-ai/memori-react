import React, { useEffect, useLayoutEffect, useState } from 'react';
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
import Bug from '../icons/Bug';
import ChevronLeft from '../icons/ChevronLeft';
import ChevronRight from '../icons/ChevronRight';
import WhyThisAnswer from '../WhyThisAnswer/WhyThisAnswer';
import { stripHTML, stripOutputTags } from '../../helpers/utils';
import { renderMsg, truncateMessage } from '../../helpers/message';
import Expandable from '../ui/Expandable';
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

interface DebugLog {
  timestamp: string;
  level: string;
  message: string;
  // Add other log fields as needed
}

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
  showFunctionCache?: boolean;
}

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
  showFunctionCache = true,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const [showingWhyThisAnswer, setShowingWhyThisAnswer] = useState(false);
  const [openFunctionCache, setOpenFunctionCache] = useState(false);
  const [debugLogs, setDebugLogs] = useState<DebugLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [debugError, setDebugError] = useState<string | null>(null);
  const [activeDebugTab, setActiveDebugTab] = useState<'function' | 'logs'>('function');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Initialize MathJax on component mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.MathJax) {
      installMathJax();
    }
  }, []);

  const text = message.translatedText || message.text;
  const { text: renderedText } = renderMsg(
    text,
    useMathFormatting,
    t('reasoning') || 'Reasoning...'
  );
  const plainText = message.fromUser
    ? truncateMessage(text)
    : stripHTML(stripOutputTags(renderedText));

  // Format function cache content
  const functionCacheData = message.media?.find(
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
  }, [message.text, message.fromUser, renderedText]);

  const fetchDebugLogs = async (page = 1, size = pageSize) => {
    setIsLoadingLogs(true);
    setDebugError(null);
  
    console.log('Fetching debug logs via Next.js API:', {
      sessionID,
      page,
      size,
    });
  
    try {
      const response = await fetch(`http://localhost:3000/api/debug-logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionID: sessionID,
          page: page,
          size: size,
        }),
      });
  
      console.log('API response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error response:', errorData);
        throw new Error(errorData.error || `Request failed: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Debug logs data:', data);
      
      // Handle both possible response formats
      const logs = data.logs || data.documents || [];
      const total = data.total || logs.length;
      
      setDebugLogs(logs);
      setTotalLogs(total);
      setTotalPages(Math.ceil(total / size));
      setCurrentPage(page);
      
    } catch (error) {
      console.error('Debug logs fetch error:', error);
      setDebugError(
        error instanceof Error ? error.message : 'Failed to fetch debug logs'
      );
    } finally {
      setIsLoadingLogs(false);
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
          {message.fromUser ? (
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
          ) : (
            <div
              dir="auto"
              className="memori-chat--bubble-content"
              dangerouslySetInnerHTML={{ __html: renderedText }}
            />
          )}

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

              {!message.fromUser &&
                showFunctionCache &&
                // message.media?.some(
                //   m => m.properties?.functionCache === 'true'
                // ) && (
                (
                  <Tooltip
                    align="left"
                    content={
                        'Debug'
                    }
                    className="memori-chat--bubble-action-icon memori-chat--debug-button"
                  >
                    <Button
                      ghost
                      shape="circle"
                      title={'Debug'}
                      className="memori-chat--bubble-action-icon memori-chat--debug-button"
                      icon={<Bug aria-label="Debug" className="memori-chat--debug-icon" />}
                      onClick={() => {
                        setOpenFunctionCache(true);
                        setCurrentPage(1);
                        fetchDebugLogs(1, pageSize);
                      }}
                    />
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

      <Modal
        title="Debug Information"
        open={openFunctionCache}
        onClose={() => setOpenFunctionCache(false)}
        className="memori-chat--function-cache-modal"
      >
        <div className="memori-chat--debug-tabs">
          <button
            className={`memori-chat--debug-tab ${
              activeDebugTab === 'function' ? 'active' : ''
            }`}
            onClick={() => setActiveDebugTab('function')}
          >
            Function Cache
          </button>
          <button
            className={`memori-chat--debug-tab ${
              activeDebugTab === 'logs' ? 'active' : ''
            }`}
            onClick={() => {
              setActiveDebugTab('logs');
              setCurrentPage(1);
              fetchDebugLogs(1, pageSize);
            }}
          >
            Injest Logs
          </button>
        </div>

        <div className="memori-chat--debug-content">
          {activeDebugTab === 'function' && functionCacheData?.content && (
            <div className="memori-chat--function-cache">
              <h3 className="memori-chat--debug-subtitle">
                {functionCacheData.title || 'Function Cache'}
              </h3>
              <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                {functionCacheData.content}
              </pre>
            </div>
          )}

          {activeDebugTab === 'logs' && (
            <div className="memori-chat--debug-logs-container">
              {isLoadingLogs ? (
                <div className="memori-chat--debug-loading">Loading logs...</div>
              ) : debugError ? (
                <div className="memori-chat--debug-error">{debugError}</div>
              ) : debugLogs.length === 0 ? (
                <div className="memori-chat--debug-empty">No logs found</div>
              ) : (
                <>
                  <div className="memori-chat--debug-logs">
                    {debugLogs.map((log, index) => (
                      <div key={index} className="memori-chat--debug-log-entry">
                        <div className="memori-chat--debug-log-header">
                          <span className="memori-chat--debug-timestamp">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                          <span
                            className={`memori-chat--debug-level memori-chat--debug-level-${log.level.toLowerCase()}`}
                          >
                            {log.level}
                          </span>
                        </div>
                        <pre className="memori-chat--debug-message">{log.message}</pre>
                      </div>
                    ))}
                  </div>
                  
                  {totalPages > 1 && (
                    <div className="memori-chat--debug-pagination">
                      <div className="memori-chat--debug-pagination--info">
                        Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalLogs)} of {totalLogs} logs
                      </div>
                      <div className="memori-chat--debug-pagination--controls">
                        <button
                          className="memori-chat--debug-pagination--button"
                          onClick={() => fetchDebugLogs(currentPage - 1, pageSize)}
                          disabled={currentPage === 1}
                          title="Previous page"
                        >
                          <ChevronLeft />
                        </button>
                        <span className="memori-chat--debug-pagination--page-info">
                          {currentPage} / {totalPages}
                        </span>
                        <button
                          className="memori-chat--debug-pagination--button"
                          onClick={() => fetchDebugLogs(currentPage + 1, pageSize)}
                          disabled={currentPage === totalPages}
                          title="Next page"
                        >
                          <ChevronRight />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ChatBubble;
