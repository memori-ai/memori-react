import { Drawer } from '@memori.ai/ui';
import { useTranslation } from 'react-i18next';
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
  Memori,
  Medium,
  Message,
  ChatLogFilters,
} from '@memori.ai/memori-api-client/dist/types';
import { Card, Button } from '@memori.ai/ui';
import {
  MessageCircle,
  Download,
  ArrowUp,
  ChevronLeft,
  X,
} from 'lucide-react';
import { stripHTML } from '../../helpers/utils';
import debounce from 'lodash/debounce';
import { Spin } from '@memori.ai/ui';
import Chat from '../Chat/Chat';
import { SelectBox } from '@memori.ai/ui';
// Helpers / Utils
import { getTranslation } from '../../helpers/translations';

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
  loginToken?: string;
  language: string;
  userLang: string;
  isMultilanguageEnabled?: boolean;
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

// Function to translate all chat logs lines
const translateChatLogs = async (
  chatLogs: ChatLog[],
  fromLanguage: string,
  toLanguage: string,
  baseUrl: string
): Promise<ChatLog[]> => {
  try {
    const translatedChatLogs = await Promise.all(
      chatLogs.map(async chatLog => {
        const translatedLines = await Promise.all(
          chatLog.lines.map(async line => {
            if (!line.text) return line;

            try {
              const translation = await getTranslation(
                line.text,
                toLanguage,
                fromLanguage,
                baseUrl
              );

              return {
                ...line,
                originalText: line.text,
                text: translation.text,
              };
            } catch (e) {
              console.error('Error translating line:', e);
              return line; // Return original line if translation fails
            }
          })
        );

        return {
          ...chatLog,
          lines: translatedLines,
        };
      })
    );

    return translatedChatLogs;
  } catch (e) {
    console.error('Error translating chat logs:', e);
    return chatLogs; // Return original chat logs if translation fails
  }
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
  loginToken,
  language,
  userLang,
  isMultilanguageEnabled = false,
}: Props) => {
  const { t } = useTranslation();
  const { getUserChatLogsByTokenPaged } = apiClient.chatLogs;

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
  const [indexPage, setIndexPage] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [dateRange, setDateRange] = useState<
    'today' | 'yesterday' | 'last_7_days' | 'last_30_days' | 'all'
  >('all');
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isViewingChatDetail, setIsViewingChatDetail] = useState(false);

  // New filter for minimum messages per chat
  const [minimumMessagesPerChat, setMinimumMessagesPerChat] =
    useState<number>(3);

  const [customMinimumMessages, setCustomMinimumMessages] = useState<number>(1);

  const formatDateForAPI = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
  };

  const formatDateRangeForAPI = (
    dateRange: 'today' | 'yesterday' | 'last_7_days' | 'last_30_days'
  ) => {
    if (dateRange === 'today') {
      const now = new Date();
      const yesterday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 1
      );
      const dateFrom = formatDateForAPI(yesterday);
      const dateTo = formatDateForAPI(now);
      return { dateFrom, dateTo };
    }
    if (dateRange === 'yesterday') {
      const now = new Date();
      const yesterday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 1
      );
      const dayBeforeYesterday = new Date(
        yesterday.getFullYear(),
        yesterday.getMonth(),
        yesterday.getDate() - 2
      );
      const dateFrom = formatDateForAPI(dayBeforeYesterday);
      const dateTo = formatDateForAPI(yesterday);
      return { dateFrom, dateTo };
    }
    if (dateRange === 'last_7_days') {
      const now = new Date();
      const sevenDaysAgo = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 7
      );
      const dateFrom = formatDateForAPI(sevenDaysAgo);
      const dateTo = formatDateForAPI(now);
      return { dateFrom, dateTo };
    }
    if (dateRange === 'last_30_days') {
      const now = new Date();
      const thirtyDaysAgo = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 30
      );
      const dateFrom = formatDateForAPI(thirtyDaysAgo);
      const dateTo = formatDateForAPI(now);
      return { dateFrom, dateTo };
    }
  };

  const fetchChatLogs = useCallback(
    async (
      dateRangeValue:
        | 'today'
        | 'yesterday'
        | 'last_7_days'
        | 'last_30_days'
        | 'all' = 'all'
    ) => {
      if (!loginToken) {
        setError(
          t('errorFetchingSession') ||
            'Login token required to fetch chat history'
        );
        return;
      }

      // Calculate the index based on current page
      const calculatedIndex = ITEMS_PER_PAGE * (currentPage - 1);
      setIndexPage(calculatedIndex);

      setIsLoading(true);
      setError(null);
      let response;
      let filters: any = {
        loginToken: loginToken,
        memoriID: memori.engineMemoriID,
        dateFrom: undefined,
        dateTo: undefined,
        from: calculatedIndex,
        howMany: ITEMS_PER_PAGE,
        minimumMessagesPerChat:
          minimumMessagesPerChat === 0
            ? customMinimumMessages
            : minimumMessagesPerChat,
      };
      try {
        if (dateRangeValue === 'all') {
          response = await getUserChatLogsByTokenPaged(filters);
        } else {
          const { dateFrom, dateTo } =
            formatDateRangeForAPI(dateRangeValue) ?? {};
          response = await getUserChatLogsByTokenPaged({
            ...filters,
            dateFrom: dateFrom ?? undefined,
            dateTo: dateTo ?? undefined,
          });
        }

        const res = response;

        // Sort the chat logs by date
        let sortedChatLogs = res.chatLogs.sort((a: ChatLog, b: ChatLog) => {
          const dateA = Math.max(
            ...a.lines.map((l: any) => new Date(l.timestamp).getTime())
          );
          const dateB = Math.max(
            ...b.lines.map((l: any) => new Date(l.timestamp).getTime())
          );
          return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });

        // Translate chat logs if needed
        if (
          language.toUpperCase() !== userLang.toUpperCase() &&
          isMultilanguageEnabled
        ) {
          sortedChatLogs = await translateChatLogs(
            sortedChatLogs,
            language,
            userLang,
            baseUrl
          );
        }

        setChatLogs(sortedChatLogs);
        setTotalItems(res.count || sortedChatLogs.length);
        setTotalPages(
          Math.ceil((res.count || sortedChatLogs.length) / ITEMS_PER_PAGE)
        );
      } catch (err) {
        setError(t('errorFetchingSession') || 'Error loading chat history');
        console.error('Error fetching chat logs:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [
      loginToken,
      memori.engineMemoriID,
      currentPage,
      sortOrder,
      apiUrl,
      minimumMessagesPerChat,
      customMinimumMessages,
    ]
  );

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (open) {
      setCurrentPage(1); // Reset to first page when opening
      setIndexPage(0); // Reset index to 0
      setIsViewingChatDetail(false); // Reset detail view when opening
      setSelectedChatLog(null); // Reset selected chat when opening
    }
  }, [open]);

  // Reset to first page when changing sort order, date range, or minimum messages filter
  useEffect(() => {
    if (open) {
      setCurrentPage(1);
      setIndexPage(0);
    }
  }, [sortOrder, dateRange, minimumMessagesPerChat, customMinimumMessages, open]);

  // Fetch chat logs when current page, date range, or minimum messages filter changes
  useEffect(() => {
    if (open && currentPage > 0) {
      fetchChatLogs(dateRange);
    }
  }, [currentPage, dateRange, minimumMessagesPerChat, customMinimumMessages, fetchChatLogs, open]);

  const debouncedSearch = useMemo(
    () => debounce((value: string) => setSearchText(value), DEBOUNCE_DELAY),
    []
  );
  // Remove client-side pagination since we're now using server-side pagination
  const paginatedChatLogs = chatLogs;

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

  const escapeUnderScore = (value: string) => {
    return value.replace(/_/g, ' ');
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
          <MessageCircle className="memori-chat-history-drawer--empty--icon" />
          <p className="memori-chat-history-drawer--empty--text">
            {t('write_and_speak.noChatHistoryAvailable') ||
              'No chat history available'}
          </p>
        </div>
      );
    }

    if (chatLogs.length === 0) {
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
                hoverable={chatLog?.sessionID !== sessionId}
                onClick={async () => {
                  // the active chat
                  if (chatLog?.sessionID === sessionId) {
                    return;
                  }
                  if (selectedChatLog?.chatLogID === chatLog.chatLogID) {
                    setSelectedChatLog(null);
                    if (isMobile) {
                      setIsViewingChatDetail(false);
                    }
                    return;
                  }
                  setSelectedChatLog(chatLog);
                  // if (isMobile) {
                  setIsViewingChatDetail(true);
                  // }
                }}
                key={chatLog.chatLogID}
                className={`memori-chat-history-drawer--card ${
                  selectedChatLog?.chatLogID === chatLog.chatLogID
                    ? 'memori-chat-history-drawer--card--selected'
                    : ''
                } ${
                  chatLog?.sessionID === sessionId
                    ? 'memori-chat-history-drawer--card--disabled'
                    : 'memori-chat-history-drawer--card--hoverable'
                }`}
              >
                <>
                  <div className="memori-chat-history-drawer--card--header">
                    <div className="memori-chat-history-drawer--card--header--content">
                      <div className="memori-chat-history-drawer--card--header--info">
                        <div className="memori-chat-history-drawer--card--header--title-wrapper">
                          <h3
                            className="memori-chat-history-drawer--card--header--title"
                          >
                            {calculateTitle(chatLog.lines) ||
                              'Chat-' + chatLog.chatLogID.substring(0, 4)}
                          </h3>
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
                      {/* <svg
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
                      </svg> */}
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
                    {!isMobile && (
                      <div className="memori-chat-history-drawer--card--content--header">
                        <Button
                          className="memori-chat-history-drawer--card--content--export-button"
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleExportChat(chatLog, e)}
                          disabled={chatLog?.sessionID === sessionId}
                        >
                          <div className="memori-chat-history-drawer--card--content--export-button--content">
                            <Download className="memori-chat-history-drawer--card--content--export-button--icon" />
                            {/* <span className="memori-chat-history-drawer--card--content--export-button--text">
                            {t('write_and_speak.exportChat') || 'Export Chat'}
                          </span> */}
                          </div>
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* {selectedChatLog?.chatLogID === chatLog.chatLogID &&
                    !isMobile && (
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
                            isChatlogPanel={true}
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
                              <MessageCircle className="memori-chat-history-drawer--card--content--resume-button--icon" />
                              <span className="memori-chat-history-drawer--card--content--resume-button--text">
                                {t('write_and_speak.resumeButton') ||
                                  'Resume chat'}
                              </span>
                            </div>
                          </Button>
                        </div>
                      </div>
                    )} */}
                </>
              </Card>
            );
          })}
        </ul>

        {totalPages > 1 && (
          <div className="memori-chat-history-drawer--pagination">
            <Button
              variant="primary"
              onClick={() => {
                setCurrentPage(p => Math.max(1, p - 1));
                // fetchChatLogs will be triggered by the useEffect that depends on currentPage
              }}
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
              variant="primary"
              onClick={() => {
                setCurrentPage(p => Math.min(totalPages, p + 1));
                // fetchChatLogs will be triggered by the useEffect that depends on currentPage
              }}
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

  const renderChatDetailView = () => {
    if (!selectedChatLog) return null;

    // Calculate the date of the chat (using the last message timestamp)
    const lastMessageDate = Math.max(
      ...selectedChatLog.lines.map(line => new Date(line.timestamp).getTime())
    );
    const chatDate = formatDate(new Date(lastMessageDate).toISOString());

    return (
      <div className="memori-chat-history-drawer--detail-view">
        <div className="memori-chat-history-drawer--detail-view--header">
          <Button
            className="memori-chat-history-drawer--detail-view--back-button"
            onClick={() => {
              setIsViewingChatDetail(false);
              setSelectedChatLog(null);
            }}
            icon={<ChevronLeft />}
          />
          <div className="memori-chat-history-drawer--detail-view--header--title-wrapper">
            <div className="memori-chat-history-drawer--detail-view--header--title">
              {calculateTitle(selectedChatLog.lines) ||
                'Chat-' + selectedChatLog.chatLogID.substring(0, 4)}
            </div>
            <div className="memori-chat-history-drawer--detail-view--header--date">
              {chatDate}
            </div>
          </div>
        </div>
        <div className="memori-chat-history-drawer--detail-view--content">
          <div className="memori-chat-history-drawer--detail-view--messages">
            <Chat
              key={`${selectedChatLog.chatLogID}-${selectedChatLog.lines.length}`}
              baseUrl={baseUrl}
              apiUrl={apiUrl}
              memoriTyping={false}
              showTypingText={false}
              showAIicon={true}
              showTranslationOriginal={false}
              showWhyThisAnswer={false}
              showCopyButton={false}
              isChatlogPanel={true}
              showInputs={false}
              history={selectedChatLog.lines.map(line => ({
                text: line.text,
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
              listening={false}
              setEnableFocusChatInput={() => {}}
              stopAudio={() => {}}
              isHistoryView={true}
            />
          </div>
          <div className="memori-chat-history-drawer--detail-view--actions">
            <Button
              className="memori-chat-history-drawer--detail-view--resume-button"
              variant="primary"
              onClick={handleResumeChat}
            >
              <div className="memori-chat-history-drawer--detail-view--resume-button--content">
                {/* <ChatRound className="memori-chat-history-drawer--detail-view--resume-button--icon" /> */}
                <span className="memori-chat-history-drawer--detail-view--resume-button--text">
                  {t('write_and_speak.resumeButton') || 'Resume chat'}
                </span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Drawer
      className="memori-chat-history-drawer"
      open={open}
      onClose={onClose}
      title={t('write_and_speak.chatHistory') || 'Chat History'}
      closable={true}
      description={
        !isViewingChatDetail
          ? t('write_and_speak.chatHistoryDescription')
          : undefined
      }
    >
      {isViewingChatDetail ? (
        renderChatDetailView()
      ) : (
        <div className="memori-chat-history-drawer--content">
          <div className="memori-chat-history-drawer--toolbar">
            {/* New minimum messages filter */}
            <div className="memori-chat-history-drawer--toolbar--min-messages-filter">
              {/* <label className={styles.filterLabel}>
                {t('chatLogs.minimumMessages', { ns: 'admin' })}
              </label> */}
              <SelectBox
                placeholder={
                  (t('chatLogs.customMinimumMessages') ||
                    'Customize the number of messages') ??
                  'Customize the number of messages'
                }
                value={String(minimumMessagesPerChat)}
                onChange={value => {
                  setMinimumMessagesPerChat(value ? Number(value) : 0);
                }}
                className="memori-chat-history-drawer--toolbar--min-messages-filter--select"
                options={[
                  { value: '1', label: t('chatLogs.anyMessage') || 'Any message' },
                  { value: '2', label: t('chatLogs.atLeast2') || 'At least 2 messages' },
                  { value: '3', label: t('chatLogs.atLeast3') || 'At least 3 messages' },
                  { value: '5', label: t('chatLogs.atLeast5') || 'At least 5 messages' },
                  { value: '10', label: t('chatLogs.atLeast10') || 'At least 10 messages' },
                  { value: '15', label: t('chatLogs.atLeast15') || 'At least 15 messages' },
                  { value: '20', label: t('chatLogs.atLeast20') || 'At least 20 messages' },
                  {
                    value: '0',
                    label:
                      t('chatLogs.customMinimumMessages') ||
                      'Customize the number of messages',
                  },
                ]}
              />
              {minimumMessagesPerChat === 0 && (
                <input
                  type="number"
                  min={1}
                  value={customMinimumMessages}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = parseInt(e.target.value, 10);
                    setCustomMinimumMessages(value);
                  }}
                  style={{ minWidth: 50 }}
                  className="memori-chat-history-drawer--toolbar--min-messages-filter--input-number"
                />
              )}
            </div>
            <div className="memori-chat-history-drawer--toolbar--actions">
              <SelectBox
                options={[
                  { label: t('all') || 'All', value: 'all' },
                  { label: t('today') || 'Today', value: 'today' },
                  { label: t('yesterday') || 'Yesterday', value: 'yesterday' },
                  { label: t('last_7_days') || 'Last 7 days', value: 'last_7_days' },
                  { label: t('last_30_days') || 'Last 30 days', value: 'last_30_days' },
                ]}
                value={dateRange}
                className="memori-chat-history-drawer--toolbar--actions--select"
                onChange={value => {
                  if (value) {
                    setDateRange(
                      value as
                        | 'today'
                        | 'yesterday'
                        | 'last_7_days'
                        | 'last_30_days'
                        | 'all'
                    );
                    setCurrentPage(1);
                  }
                }}
              />
            </div>
          </div>
          {renderContent()}
        </div>
      )}
    </Drawer>
  );
};

export default ChatHistoryDrawer;
