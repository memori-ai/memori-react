import {
  Drawer,
  useAlertManager,
  createAlertOptions,
  Card,
} from '@memori.ai/ui';
import { useTranslation } from 'react-i18next';
import memoriApiClient from '@memori.ai/memori-api-client';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  ChatLog,
  ChatLogLine,
  Memori,
  Message,
  ChatLogFilters,
} from '@memori.ai/memori-api-client/dist/types';
import { Button } from '@memori.ai/ui';
import { MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { stripHTML } from '../../helpers/utils';
import debounce from 'lodash/debounce';
import { Spin } from '@memori.ai/ui';
import { SelectBox } from '@memori.ai/ui';
// Helpers / Utils
import { getTranslation } from '../../helpers/translations';
import ChatResumeDrawer from './ChatResumeDrawer';

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
const ICON_BACKGROUND_COLORS = [
  'var(--chat-history-icon-purple, #EEEDFE)',
  'var(--chat-history-icon-teal, #E1F5EE)',
  'var(--chat-history-icon-amber, #FAEEDA)',
  'var(--chat-history-icon-coral, #FAECE7)',
] as const;

type ContentTypeFilter = 'all' | 'with_images' | 'with_files';

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
  const { add } = useAlertManager();
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
  const [contentTypeFilter, setContentTypeFilter] =
    useState<ContentTypeFilter>('all');

  const isSameDay = (dateA: Date, dateB: Date) =>
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate();

  const getChatLogStats = (chatLog: ChatLog) => {
    const imageCount = chatLog.lines.reduce((total, line) => {
      const imagesInLine =
        line.media?.filter(medium => medium.mimeType?.startsWith('image/'))
          .length || 0;
      return total + imagesInLine;
    }, 0);

    const hasFile = chatLog.lines.some(line =>
      (line.media || []).some(
        medium =>
          !medium.mimeType?.startsWith('image/') &&
          medium.mimeType !== 'text/html' &&
          medium.mimeType !== 'text/plain'
      )
    );

    const assistantReplies = chatLog.lines.filter(
      line => !line.inbound && line.text?.trim()
    );
    const previewSource = assistantReplies[1] || assistantReplies[0];
    const preview = stripHTML(previewSource?.text || '')
      .replace(/\s+/g, ' ')
      .trim();

    const allText = chatLog.lines
      .map(line => line.text || '')
      .join(' ')
      .toLowerCase();
    const isTestConversation =
      /\b(test|testing|experiment|esperimento|prova)\b/.test(allText);

    return {
      imageCount,
      hasFile,
      preview,
      isTestConversation,
      messageCount: chatLog.lines.length,
    };
  };

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
  }, [
    sortOrder,
    dateRange,
    minimumMessagesPerChat,
    customMinimumMessages,
    open,
  ]);

  // Fetch chat logs when current page, date range, or minimum messages filter changes
  useEffect(() => {
    if (open && currentPage > 0) {
      fetchChatLogs(dateRange);
    }
  }, [
    currentPage,
    dateRange,
    minimumMessagesPerChat,
    customMinimumMessages,
    fetchChatLogs,
    open,
  ]);

  const debouncedSearch = useMemo(
    () => debounce((value: string) => setSearchText(value), DEBOUNCE_DELAY),
    []
  );
  // Remove client-side pagination since we're now using server-side pagination
  const paginatedChatLogs = useMemo(() => {
    if (contentTypeFilter === 'all') {
      return chatLogs;
    }

    return chatLogs.filter(chatLog => {
      const stats = getChatLogStats(chatLog);
      if (contentTypeFilter === 'with_images') {
        return stats.imageCount > 0;
      }
      return stats.hasFile;
    });
  }, [chatLogs, contentTypeFilter]);

  const handleResumeChat = async (_prompt?: string) => {
    if (selectedChatLog) {
      resumeSession(selectedChatLog);
      add(
        createAlertOptions({
          description:
            t('write_and_speak.chatResumed') || 'Conversation resumed.',
          severity: 'success',
        })
      );
      onClose();
    }
  };

  const handleCloseResumeDrawer = () => {
    setIsViewingChatDetail(false);
    setSelectedChatLog(null);
  };

  const handleExportChat = (chatLog: ChatLog, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the list item from toggling
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

  const formatCountLabel = (count: number, singular: string, plural: string) =>
    `${count} ${count === 1 ? singular : plural}`;

  const selectedChatSession = useMemo(() => {
    if (!selectedChatLog) return null;

    const title =
      calculateTitle(selectedChatLog.lines) ||
      'Chat-' + selectedChatLog.chatLogID.substring(0, 4);

    const hasInterruptedLine = selectedChatLog.lines.some(
      line => !line.inbound && !line.text?.trim()
    );
    const lastMessageDate = Math.max(
      ...selectedChatLog.lines.map(line => new Date(line.timestamp).getTime())
    );

    return {
      title,
      subtitle: `${formatDate(new Date(lastMessageDate).toISOString())} · ${
        selectedChatLog.lines.length
      } ${t('write_and_speak.messages') || 'messages'}`,
      summary:
        t('write_and_speak.sessionSummaryDescription') ||
        'Hai caricato un file Markdown con la presentazione del gruppo. L’AI stava elaborando una risposta.',
      messages: selectedChatLog.lines.map((line, index) => ({
        id: `${selectedChatLog.chatLogID}-${index}`,
        role: line.inbound ? ('user' as const) : ('assistant' as const),
        content: line.text || '',
        timestamp: line.timestamp,
        status:
          !line.inbound && !line.text?.trim() && hasInterruptedLine
            ? ('interrupted' as const)
            : ('completed' as const),
        attachment:
          line.inbound && Array.isArray(line.media) && line.media.length > 0
            ? {
                name:
                  line.media[0].url?.split('/').pop() ||
                  line.media[0].url ||
                  'Attachment file',
                type: 'Markdown',
                size: '2.4 KB',
                ext: 'MD',
              }
            : undefined,
      })),
      quickActions: [
        {
          label: t('write_and_speak.summarizeSession') || 'Riassumi la sessione',
          prompt: 'Riassumi la sessione',
        },
        {
          label: t('write_and_speak.retryRequest') || 'Riprova la richiesta',
          prompt: 'Riprova la richiesta',
        },
      ],
    };
  }, [selectedChatLog, t]);

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

    if (paginatedChatLogs.length === 0) {
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
          {paginatedChatLogs.map((chatLog: ChatLog, index: number) => {
            const lastMessageDate = Math.max(
              ...chatLog.lines.map(line => new Date(line.timestamp).getTime())
            );
            const stats = getChatLogStats(chatLog);
            const iconSymbol = stats.hasFile
              ? '📄'
              : stats.isTestConversation
              ? '🧪'
              : '💬';
            const iconBackgroundColor =
              ICON_BACKGROUND_COLORS[index % ICON_BACKGROUND_COLORS.length];
            const isUpdatedToday = isSameDay(
              new Date(lastMessageDate),
              new Date()
            );
            const title =
              calculateTitle(chatLog.lines) ||
              'Chat-' + chatLog.chatLogID.substring(0, 4);

            return (
              <Card
                variant="outlined"
                key={chatLog.chatLogID}
                className={`memori-chat-history-drawer--list-item ${
                  selectedChatLog?.chatLogID === chatLog.chatLogID
                    ? 'memori-chat-history-drawer--list-item--selected'
                    : ''
                } ${
                  chatLog?.sessionID !== sessionId
                    ? 'memori-chat-history-drawer--list-item--hoverable'
                    : ''
                } ${
                  chatLog?.sessionID === sessionId
                    ? 'memori-chat-history-drawer--list-item--disabled'
                    : ''
                }`}
              >
                <button
                  type="button"
                  className="memori-chat-history-drawer--list-item--button"
                  disabled={chatLog?.sessionID === sessionId}
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
                >
                  {/* <div
                    className="memori-chat-history-drawer--list-item--icon"
                    style={{ backgroundColor: iconBackgroundColor }}
                    aria-hidden="true"
                  >
                    {iconSymbol}
                  </div> */}
                  <div className="memori-chat-history-drawer--list-item--content">
                    <div className="memori-chat-history-drawer--list-item--title-wrapper">
                      <h3 className="memori-chat-history-drawer--list-item--title">
                        {title}
                      </h3>
                      {isUpdatedToday && (
                        <span className="memori-chat-history-drawer--list-item--today-pill">
                          {t('today') || 'Today'}
                        </span>
                      )}
                    </div>
                    {/* {stats.preview && (
                      <p className="memori-chat-history-drawer--list-item--preview">
                        {stats.preview}
                      </p>
                    )} */}
                    <div className="memori-chat-history-drawer--list-item--meta">
                      <time
                        className="memori-chat-history-drawer--list-item--meta--time"
                        dateTime={new Date(lastMessageDate).toISOString()}
                      >
                        {formatDate(new Date(lastMessageDate).toISOString())}
                      </time>
                      {stats.imageCount > 0 && (
                        <span className="memori-chat-history-drawer--list-item--meta-badge memori-chat-history-drawer--list-item--meta-badge-images">
                          {formatCountLabel(
                            stats.imageCount,
                            t('write_and_speak.image') || 'image',
                            t('write_and_speak.images') || 'images'
                          )}
                        </span>
                      )}
                      <span className="memori-chat-history-drawer--list-item--meta-badge memori-chat-history-drawer--list-item--meta-badge-messages">
                        {formatCountLabel(
                          stats.messageCount,
                          t('write_and_speak.message') || 'message',
                          t('write_and_speak.messages') || 'messages'
                        )}
                      </span>
                      {stats.hasFile && (
                        <span className="memori-chat-history-drawer--list-item--meta-badge memori-chat-history-drawer--list-item--meta-badge-files">
                          {t('write_and_speak.file') || 'file'}
                        </span>
                      )}
                      {chatLog.boardOfExperts && (
                        <span className="memori-chat-history-drawer--list-item--meta-badge memori-chat-history-drawer--list-item--meta-badge-boe">
                          boe
                        </span>
                      )}
                    </div>
                  </div>
                </button>
                {/* {!isMobile && (
                  <div className="memori-chat-history-drawer--list-item--actions">
                    <Button
                      variant="ghost"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                        handleExportChat(chatLog, e)
                      }
                      disabled={chatLog?.sessionID === sessionId}
                      icon={<Download />}
                    />
                  </div>
                )} */}
              </Card>
            );
          })}
        </ul>
      </>
    );
  };

  const renderListPagination = () => {
    if (totalPages <= 1) return null;
    return (
      <nav
        className="memori-chat-history-drawer--pagination"
        aria-label={
          t('write_and_speak.chatHistory') || 'Chat history pagination'
        }
      >
        <Button
          variant="outline"
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="memori-chat-history-drawer--pagination--button memori-chat-history-drawer--pagination--prev"
          icon={<ChevronLeft />}
          title={t('previous') || 'Previous'}
        />
        <span className="memori-chat-history-drawer--pagination--info">
          {t('write_and_speak.page', {
            current: currentPage,
            total: totalPages,
          })}
        </span>
        <Button
          variant="outline"
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="memori-chat-history-drawer--pagination--button memori-chat-history-drawer--pagination--next"
          icon={<ChevronRight />}
          title={t('next') || 'Next'}
        />
      </nav>
    );
  };

  return (
    <Drawer
      className="memori-chat-history-drawer"
      open={open}
      onClose={onClose}
      title={t('write_and_speak.chatHistory') || 'Chat History'}
      closable={true}
      size="md"
      description={t('write_and_speak.chatHistoryDescription')}
    >
      {selectedChatSession && isViewingChatDetail ? (
        <div className="memori-chat-history-drawer--content memori-chat-history-drawer--content-with-footer">
          <ChatResumeDrawer
            embedded={true}
            isOpen={true}
            session={selectedChatSession}
            onResume={handleResumeChat}
            onBack={handleCloseResumeDrawer}
            onClose={handleCloseResumeDrawer}
          />
        </div>
      ) : (
        <div className="memori-chat-history-drawer--content memori-chat-history-drawer--content-with-footer">
          <div className="memori-chat-history-drawer--scrollable">
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
                  displayValue={
                    minimumMessagesPerChat === 0
                      ? t('chatLogs.customMinimumMessages') ||
                        'Customize the number of messages'
                      : t('chatLogs.atLeast' + minimumMessagesPerChat) ||
                        'At least ' + minimumMessagesPerChat + ' messages'
                  }
                  className="memori-chat-history-drawer--toolbar--min-messages-filter--select"
                  options={[
                    {
                      value: '1',
                      label: t('chatLogs.anyMessage') || 'Any message',
                    },
                    {
                      value: '2',
                      label: t('chatLogs.atLeast2') || 'At least 2 messages',
                    },
                    {
                      value: '3',
                      label: t('chatLogs.atLeast3') || 'At least 3 messages',
                    },
                    {
                      value: '5',
                      label: t('chatLogs.atLeast5') || 'At least 5 messages',
                    },
                    {
                      value: '10',
                      label: t('chatLogs.atLeast10') || 'At least 10 messages',
                    },
                    {
                      value: '15',
                      label: t('chatLogs.atLeast15') || 'At least 15 messages',
                    },
                    {
                      value: '20',
                      label: t('chatLogs.atLeast20') || 'At least 20 messages',
                    },
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
                    {
                      label: t('yesterday') || 'Yesterday',
                      value: 'yesterday',
                    },
                    {
                      label: t('last_7_days') || 'Last 7 days',
                      value: 'last_7_days',
                    },
                    {
                      label: t('last_30_days') || 'Last 30 days',
                      value: 'last_30_days',
                    },
                  ]}
                  value={dateRange}
                  displayValue={
                    dateRange === 'all'
                      ? t('all') || 'All'
                      : t(dateRange) || dateRange
                  }
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
          {totalPages > 1 && (
            <div className="memori-chat-history-drawer--pagination-footer">
              {renderListPagination()}
            </div>
          )}
        </div>
      )}
    </Drawer>
  );
};

export default ChatHistoryDrawer;
