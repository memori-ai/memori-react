import Drawer from '../ui/Drawer';
import { useTranslation } from 'react-i18next';
import { Props as WidgetProps } from '../MemoriWidget/MemoriWidget';
import memoriApiClient from '@memori.ai/memori-api-client';
import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  ChangeEvent,
} from 'react';
import {
  ChatLog,
  ChatLogLine,
  User,
  Memori,
  Medium,
  DialogState,
  EventLog,
  Message,
} from '@memori.ai/memori-api-client/dist/types';
import Card from '../ui/Card';
import ChatBubble from '../ChatBubble/ChatBubble';
import Button from '../ui/Button';
import ChatRound from '../icons/Chat';
import { escapeHTML, stripHTML, truncateMessage } from '../../helpers/utils';
import { Dialog, Transition } from '@headlessui/react';
import debounce from 'lodash/debounce';
import Chat from '../Chat/Chat';
import Spin from '../ui/Spin';
import Download from '../icons/Download';
import MessageIcon from '../icons/Message';

export interface Props {
  open: boolean;
  onClose: () => void;
  apiClient: ReturnType<typeof memoriApiClient>;
  sessionId: string;
  memori: Memori;
  resumeSession: (chatLog: ChatLog) => void;
  baseUrl: string;
  apiUrl: string;
  history: Message[];
}

const ITEMS_PER_PAGE = 8;
const DEBOUNCE_DELAY = 300;

// This function calculates the title of the chat log based on the most meaningful user message
const calculateTitle = (lines: ChatLogLine[]): string => {
  const userMessages = lines.filter(line => line.inbound);
  if (userMessages.length === 0) return '';

  // Common non-significant phrases that shouldn't be used as titles (English and Italian)
  const insignificantPhrases = [
    // English phrases
    'hello',
    'hi',
    'hey',
    'good morning',
    'good afternoon',
    'good evening',
    'thanks',
    'thank you',
    'thx',
    'tnx',
    'ty',
    'thanks!',
    'thank you!',
    'ok',
    'okay',
    'k',
    'yes',
    'no',
    'yep',
    'nope',
    'yeah',
    'nah',
    'good',
    'great',
    'nice',
    'cool',
    'awesome',
    'perfect',
    'excellent',
    'bye',
    'goodbye',
    'see you',
    'see ya',
    'later',
    'good night',
    'how are you',
    'how are you doing',
    "what's up",
    'sup',
    'please',
    'pls',
    'sorry',
    'excuse me',
    'pardon',
    'i see',
    'i understand',
    'got it',
    'gotcha',
    'understood',
    'continue',
    'go on',
    'tell me more',
    'more',
    'next',
    'start',
    'begin',
    "let's start",
    "let's begin",
    'help',
    'can you help',
    'i need help',
    'test',
    'testing',
    'test message',
    '?',
    '??',
    '???',
    '!',
    '!!',
    '!!!',
    '...',
    '..',
    '.',
    'a',
    'an',
    'the',
    'and',
    'or',
    'but',
    'in',
    'on',
    'at',
    'to',
    'for',
    'of',
    'with',
    'by',

    // Italian phrases
    'ciao',
    'salve',
    'buongiorno',
    'buonasera',
    'buonanotte',
    'grazie',
    'grazie mille',
    'grazie!',
    'grazie mille!',
    'thx',
    'tnx',
    'ok',
    'va bene',
    'va bene così',
    'perfetto',
    'ottimo',
    'bene',
    'sì',
    'si',
    'no',
    'certo',
    'certamente',
    'assolutamente',
    'arrivederci',
    'a presto',
    'a dopo',
    'ci vediamo',
    'addio',
    'come stai',
    'come va',
    'tutto bene',
    'che succede',
    'per favore',
    'per piacere',
    'scusa',
    'scusami',
    'mi dispiace',
    'capisco',
    'ho capito',
    'capito',
    'perfetto',
    'continua',
    'vai avanti',
    'dimmi di più',
    'altro',
    'altro ancora',
    'inizia',
    'iniziamo',
    'comincia',
    'cominciamo',
    'aiuto',
    'puoi aiutarmi',
    'ho bisogno di aiuto',
    'test',
    'prova',
    'messaggio di prova',
    '?',
    '??',
    '???',
    '!',
    '!!',
    '!!!',
    '...',
    '..',
    '.',
    'un',
    'una',
    'il',
    'la',
    'gli',
    'le',
    'e',
    'o',
    'ma',
    'in',
    'su',
    'a',
    'per',
    'di',
    'con',
    'da',
  ];

  // Function to calculate message significance score
  const calculateSignificanceScore = (message: string): number => {
    const cleanMessage = message.toLowerCase().trim();

    // Check if it's an insignificant phrase
    if (insignificantPhrases.includes(cleanMessage)) {
      return 0;
    }

    // Check if it's too short (less than 3 words)
    const wordCount = cleanMessage
      .split(/\s+/)
      .filter(word => word.length > 0).length;
    if (wordCount < 3) {
      return 0.1;
    }

    // Check if it's just punctuation or very short
    if (cleanMessage.length < 5) {
      return 0.1;
    }

    // Check if it's a question (questions are often more significant) - English and Italian
    const isQuestion =
      /\?$/.test(cleanMessage) ||
      // English question starters
      /^(what|how|why|when|where|who|which|can|could|would|will|do|does|did|is|are|was|were)/.test(
        cleanMessage
      ) ||
      // Italian question starters
      /^(cosa|come|perché|perche|quando|dove|chi|quale|quali|può|puo|potrebbe|vorrebbe|sarà|sara|fa|fai|fanno|è|e|sono|era|erano)/.test(
        cleanMessage
      );

    // Calculate base score
    let score = 0.5;

    // Boost score for questions
    if (isQuestion) score += 0.3;

    // Boost score for longer, more detailed messages
    if (wordCount > 5) score += 0.2;
    if (wordCount > 10) score += 0.2;

    // Reduce score for very long messages (might be too verbose for a title)
    if (wordCount > 20) score -= 0.1;

    // Boost score for messages with specific details (numbers, dates, names)
    if (/\d/.test(cleanMessage)) score += 0.1;
    if (
      /[A-ZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞŸ][a-zàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]+/.test(
        message
      )
    )
      score += 0.1; // Proper nouns (including accented characters)

    return Math.min(score, 1.0);
  };

  // Score all user messages
  const scoredMessages = userMessages.map((msg, index) => {
    const cleanText = stripHTML(msg.text || '');
    const score = calculateSignificanceScore(cleanText);
    return {
      text: cleanText,
      score,
      index,
      originalIndex: index,
    };
  });

  // Sort by score (highest first) and then by position (earlier messages preferred for same score)
  scoredMessages.sort((a, b) => {
    if (Math.abs(a.score - b.score) < 0.1) {
      // If scores are close, prefer earlier messages
      return a.index - b.index;
    }
    return b.score - a.score;
  });

  // Find the best message
  let bestMessage = scoredMessages[0];

  // If the best message has a very low score, try to find a better one
  if (bestMessage.score < 0.3) {
    // Look for the first message that's not completely insignificant
    const betterMessage = scoredMessages.find(msg => msg.score > 0.1);
    if (betterMessage) {
      bestMessage = betterMessage;
    }
  }

  // If we still don't have a good message, try to create a title from multiple messages
  if (bestMessage.score < 0.2) {
    // Try to combine first few meaningful messages
    const meaningfulMessages = scoredMessages
      .filter(msg => msg.score > 0.1)
      .slice(0, 3)
      .sort((a, b) => a.index - b.index);

    if (meaningfulMessages.length > 1) {
      const combinedText = meaningfulMessages
        .map(msg => msg.text)
        .join(' - ')
        .substring(0, 80);
      return combinedText.length > 80 ? `${combinedText}...` : combinedText;
    }
  }

  // Format the final title
  const title = bestMessage.text;
  const maxLength = 100;

  if (title.length > maxLength) {
    // Try to cut at a word boundary
    const truncated = title.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > maxLength * 0.7) {
      // If we can cut at a word boundary without losing too much
      return `${truncated.substring(0, lastSpace)}...`;
    }
    return `${truncated}...`;
  }

  return title;
};

const downloadFile = (text: string, filename: string) => {
  const data = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(data);
  const element = document.createElement('a');
  element.setAttribute('href', url);
  element.setAttribute('download', filename);
  element.style.display = 'none';

  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

const ChatHistoryDrawer = ({
  open,
  onClose,
  apiClient,
  sessionId,
  memori,
  resumeSession,
  baseUrl,
  apiUrl,
  history,
}: Props) => {
  const { t } = useTranslation();
  const { getChatLogsByUser, getSessionChatLogs } = apiClient.chatLogs;

  const textCurrentChat = `${t(
    'write_and_speak.conversationStartedLabel'
  )} ${new Intl.DateTimeFormat('it', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date())}\n\n`.concat(
    history
      .map(m => `${m.fromUser ? 'YOU' : memori.name}: ${m.text}`)
      .join('\n')
  );
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);
  const [selectedChatLog, setSelectedChatLog] = useState<ChatLog | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchChatLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getChatLogsByUser(sessionId);
      setChatLogs(
        res.chatLogs.sort((a, b) => {
          const dateA = Math.max(
            ...a.lines.map(l => new Date(l.timestamp).getTime())
          );
          const dateB = Math.max(
            ...b.lines.map(l => new Date(l.timestamp).getTime())
          );
          return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        })
      );
    } catch (err) {
      setError(t('errorFetchingSession') || 'Error loading chat history');
      console.error('Error fetching chat logs:', err);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, sortOrder]);

  useEffect(() => {
    if (open) fetchChatLogs();
  }, [open, fetchChatLogs]);

  const debouncedSearch = useMemo(
    () => debounce((value: string) => setSearchText(value), DEBOUNCE_DELAY),
    []
  );

  const filteredChatLogs = useMemo(() => {
    return chatLogs.filter(
      c =>
        c.lines.some(l =>
          l.text.toLowerCase().includes(searchText.toLowerCase())
        ) && c.lines.length > 1
    );
  }, [chatLogs, searchText]);

  const totalPages = Math.ceil(filteredChatLogs.length / ITEMS_PER_PAGE);

  const paginatedChatLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredChatLogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredChatLogs, currentPage]);

  const handleResumeChat = async () => {
    if (selectedChatLog) {
      resumeSession(selectedChatLog);
      onClose();
    }
  };

  const handleExportChat = (chatLog: ChatLog, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card from toggling
    const text = `${t(
      'write_and_speak.conversationStartedLabel'
    )} ${new Intl.DateTimeFormat(navigator.language, {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date())}\n\n`.concat(
      chatLog.lines
        .map(line => `${line.inbound ? 'YOU' : memori.name}: ${line.text}`)
        .join('\n')
    );

    downloadFile(
      text,
      `${memori.name.replace(/\W+/g, '-')}-chat-${chatLog.chatLogID.substring(
        0,
        4
      )}.txt`
    );
  };

  const formatDate = (timestamp: string) => {
    return new Intl.DateTimeFormat(navigator.language, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(timestamp));
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="memori-chat-history-drawer--loading">
          <Spin
            spinning={true}
            primary={true}
            className="memori-chat-history-drawer--loading--spinner"
          />
          <p className="memori-chat-history-drawer--loading--text">
            {t('write_and_speak.loadingChatHistory') ||
              'Loading chat history...'}
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="memori-chat-history-drawer--error">
          <p>{error}</p>
        </div>
      );
    }

    if (!chatLogs.length) {
      return (
        <div className="memori-chat-history-drawer--empty">
          <ChatRound className="memori-chat-history-drawer--empty--icon" />
          <p className="memori-chat-history-drawer--empty--text">
            {t('write_and_speak.noChatHistoryAvailable') ||
              'No chat history available'}
          </p>
        </div>
      );
    }

    if (filteredChatLogs.length === 0) {
      return (
        <div className="memori-chat-history-drawer--no-results">
          <p>
            {t('write_and_speak.noResultsFound', {
              searchText: searchText || '',
            }) || 'No results found'}
          </p>
        </div>
      );
    }

    return (
      <>
        <ul className="memori-chat-history-drawer--list">
          {paginatedChatLogs.map((chatLog: ChatLog) => {
            const lastMessageDate = Math.max(
              ...chatLog.lines.map(line => new Date(line.timestamp).getTime())
            );

            return (
              <Card
                hoverable
                onClick={async () => {
                  if (selectedChatLog?.chatLogID === chatLog.chatLogID) {
                    setSelectedChatLog(null);
                    return;
                  }
                  // Check for chat-reference tag in the first line
                  // const firstMessage = chatLog.lines[1]?.text;
                  // const chatReferenceMatch = firstMessage?.match(/<chat-reference session-id="([^"]+)" event-log-id="([^"]+)"><\/chat-reference>/);
                  // if (chatReferenceMatch) {
                  //   const [_, refSessionId, refChatLogId] = chatReferenceMatch;
                  //   try {
                  //     const res = await getSessionChatLogs(refSessionId, refSessionId);
                  //     const prevChatLog = res.chatLogs.find((c: ChatLog) => c.chatLogID === refChatLogId);
                  //     if (prevChatLog) {
                  //       setSelectedChatLog({
                  //         ...chatLog,
                  //         lines: [
                  //           ...prevChatLog.lines,
                  //           ...chatLog.lines
                  //         ]
                  //       });
                  //       return;
                  //     }
                  //   } catch (e) {
                  //     console.error('Error fetching referenced chat log:', e);
                  //   }
                  // }
                  setSelectedChatLog(chatLog);
                }}
                key={chatLog.chatLogID}
                className={`memori-chat-history-drawer--card ${
                  selectedChatLog?.chatLogID === chatLog.chatLogID
                    ? 'memori-chat-history-drawer--card--selected'
                    : ''
                }`}
              >
                <>
                  <div className="memori-chat-history-drawer--card--header">
                    <div className="memori-chat-history-drawer--card--header--content">
                      <div className="memori-chat-history-drawer--card--header--icon-wrapper">
                        <MessageIcon className="memori-chat-history-drawer--card--header--icon" />
                      </div>
                      <div className="memori-chat-history-drawer--card--header--info">
                        <div className="memori-chat-history-drawer--card--header--title-wrapper">
                          <Dialog.Title
                            as="h3"
                            className="memori-chat-history-drawer--card--header--title"
                          >
                            {calculateTitle(chatLog.lines) ||
                              'Chat-' + chatLog.chatLogID.substring(0, 4)}
                          </Dialog.Title>
                          {chatLog.boardOfExperts && (
                            <div className="memori-chat-history-drawer--card--header--badge">
                              BOE
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="memori-chat-history-drawer--card--header--meta">
                    <time
                      className="memori-chat-history-drawer--card--header--meta--time"
                      dateTime={new Date(lastMessageDate).toISOString()}
                    >
                      <svg
                        className="memori-chat-history-drawer--card--header--meta--icon"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {formatDate(new Date(lastMessageDate).toISOString())}
                    </time>
                    {chatLog.lines.some(
                      line =>
                        line.media &&
                        line.media.filter(
                          m =>
                            m.mimeType !== 'text/html' &&
                            m.mimeType !== 'text/plain'
                        ).length > 0
                    ) && (
                      <span className="memori-chat-history-drawer--card--header--meta--messages">
                        <svg
                          className="memori-chat-history-drawer--card--header--meta--icon"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {chatLog.lines.reduce(
                          (acc, line) =>
                            acc +
                            (line.media?.filter(
                              m =>
                                m.mimeType !== 'text/html' &&
                                m.mimeType !== 'text/plain'
                            ).length || 0),
                          0
                        )}
                      </span>
                    )}
                    <span className="memori-chat-history-drawer--card--header--meta--messages">
                      <svg
                        className="memori-chat-history-drawer--card--header--meta--icon"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                      {chatLog.lines.length}
                    </span>
                    <div className="memori-chat-history-drawer--card--content--header">
                      <Button
                        className="memori-chat-history-drawer--card--content--export-button"
                        onClick={e => handleExportChat(chatLog, e)}
                      >
                        <div className="memori-chat-history-drawer--card--content--export-button--content">
                          <Download className="memori-chat-history-drawer--card--content--export-button--icon" />
                          {/* <span className="memori-chat-history-drawer--card--content--export-button--text">
                            {t('write_and_speak.exportChat') || 'Export Chat'}
                          </span> */}
                        </div>
                      </Button>
                    </div>
                  </div>

                  {selectedChatLog?.chatLogID === chatLog.chatLogID && (
                    <div className="memori-chat-history-drawer--card--content">
                      <div className="memori-chat-history-drawer--card--content--messages">
                        <Chat
                          key={`${chatLog.chatLogID}-${chatLog.lines.length}`}
                          baseUrl={baseUrl}
                          apiUrl={apiUrl}
                          memoriTyping={false}
                          showTypingText={false}
                          showAIicon={true}
                          showTranslationOriginal={false}
                          showWhyThisAnswer={false}
                          showCopyButton={false}
                          showInputs={false}
                          history={chatLog.lines.map(line => ({
                            text: line.text, // Don't truncate to preserve document_attachment tags
                            contextVars: line.contextVars,
                            media: line.media as Medium[],
                            fromUser: line.inbound,
                            timestamp: line.timestamp,
                          }))}
                          memori={memori}
                          sessionID={sessionId}
                          pushMessage={() => {}}
                          simulateUserPrompt={() => {}}
                          setSendOnEnter={() => {}}
                          attachmentsMenuOpen={undefined}
                          setAttachmentsMenuOpen={() => {}}
                          userMessage={''}
                          onChangeUserMessage={() => {}}
                          sendMessage={() => {}}
                          startListening={() => {}}
                          stopListening={() => {}}
                          resetTranscript={() => {}}
                          listening={false}
                          setEnableFocusChatInput={() => {}}
                          stopAudio={() => {}}
                          isHistoryView={true}
                        />
                      </div>
                      <div className="memori-chat-history-drawer--card--content--actions">
                        <Button
                          className="memori-chat-history-drawer--card--content--resume-button"
                          primary
                          onClick={handleResumeChat}
                        >
                          <div className="memori-chat-history-drawer--card--content--resume-button--content">
                            <ChatRound className="memori-chat-history-drawer--card--content--resume-button--icon" />
                            <span className="memori-chat-history-drawer--card--content--resume-button--text">
                              {t('write_and_speak.resumeButton') ||
                                'Resume chat'}
                            </span>
                          </div>
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              </Card>
            );
          })}
        </ul>

        {totalPages > 1 && (
          <div className="memori-chat-history-drawer--pagination">
            <Button
              primary
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="memori-chat-history-drawer--pagination--button"
            >
              {t('previous') || 'Previous'}
            </Button>
            <span className="memori-chat-history-drawer--pagination--info">
              {t('write_and_speak.page', {
                current: currentPage,
                total: totalPages,
              })}
            </span>
            <Button
              primary
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="memori-chat-history-drawer--pagination--button"
            >
              {t('next') || 'Next'}
            </Button>
          </div>
        )}
      </>
    );
  };

  return (
    <Drawer
      className="memori-chat-history-drawer"
      open={open}
      onClose={onClose}
      title={
        <div
          className="memori-chat-history-drawer--title-wrapper"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <span>{t('write_and_speak.chatHistory') || 'Chat History'}</span>

          <div className="memori-chat-history-drawer--download-button-wrapper">
            <span className="memori-chat-history-drawer--download-button-wrapper--text">
              {t('write_and_speak.downloadChat') || 'Download chat'}
            </span>
            <Button
              primary
              shape="circle"
              className="memori-chat-history-drawer--download-button"
              title={t('download') || 'Download chat'}
              icon={<Download />}
              // disabled={!selectedChatLog}
              onClick={() => {
                //download the chat already opened
                const fileName = `${memori.name.replace(/\W+/g, '-')}-chat-${
                  new Date().toISOString().split('T')[0]
                }.txt`;
                downloadFile(textCurrentChat, fileName);
              }}
            />
          </div>
        </div>
      }
      description={t('write_and_speak.chatHistoryDescription')}
    >
      <div className="memori-chat-history-drawer--content">
        <div className="memori-chat-history-drawer--toolbar">
          <div className="memori-chat-history-drawer--toolbar--search">
            <input
              type="search"
              className="memori-chat-history-drawer--toolbar--search--input"
              placeholder={
                t('write_and_speak.searchInChatHistory') ||
                'Search in chat history...'
              }
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                debouncedSearch(e.target.value)
              }
            />
            <span className="memori-chat-history-drawer--toolbar--search--icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
          </div>
          <div className="memori-chat-history-drawer--toolbar--actions">
            <Button
              onClick={() => {
                setSortOrder(order => (order === 'asc' ? 'desc' : 'asc'));
                setCurrentPage(1);
              }}
              className="memori-chat-history-drawer--toolbar--sort-button"
            >
              {sortOrder === 'desc'
                ? t('write_and_speak.latestFirst')
                : t('write_and_speak.oldestFirst')}
            </Button>
            {/* <Button
              onClick={() => {
                if (selectedChatLog) {
                  const chatText = selectedChatLog.lines
                    .map(line => `${line.inbound ? 'User' : 'AI'}: ${line.text}`)
                    .join('\n\n');
                  const blob = new Blob([chatText], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `chat-${selectedChatLog.chatLogID.substring(0, 4)}.txt`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }
              }}
              disabled={!selectedChatLog}
              className="memori-chat-history-drawer--toolbar--export-button"
            >
              {t('write_and_speak.exportChat') || 'Export Chat'}
            </Button> */}
          </div>
        </div>
        {renderContent()}
      </div>
    </Drawer>
  );
};

export default ChatHistoryDrawer;
