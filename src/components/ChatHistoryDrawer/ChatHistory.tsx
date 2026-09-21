import {
  useAlertManager,
  createAlertOptions,
  Button,
  Input,
  SelectBox,
  Spin,
} from '@memori.ai/ui';
import { useTranslation } from 'react-i18next';
import memoriApiClient from '@memori.ai/memori-api-client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ChatLog,
  ChatLogLine,
  ChatMedium,
  Memori,
  Message,
} from '@memori.ai/memori-api-client/dist/types';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  MessageCircle,
  Search,
} from 'lucide-react';
import { stripHTML, useDebounce } from '../../helpers/utils';
import { stripAllInternalTags } from '../../helpers/message';
import {
  getDocumentBadgeLabel,
  getOriginalMimeType,
} from '../MediaWidget/MediaItemWidget.utils';
import { getTranslation } from '../../helpers/translations';
import { getConversationTitle } from '../../helpers/conversationTitle';
import {
  formatConversationListDate,
  getLastMessageDate,
  groupConversations,
} from '../../helpers/conversationHistory';
import SideDrawer, { SideDrawerEmpty } from '../SideDrawer/SideDrawer';
import IconButton from '../IconButton/IconButton';
import DrawerFooter from '../DrawerFooter/DrawerFooter';
import ChatResumeDrawer from './ChatResumeDrawer';
import cx from 'classnames';

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
  showFunctionCache?: boolean;
  showMessageConsumption?: boolean;
}

const PAGE_SIZE = 8;
const DEFAULT_MINIMUM_MESSAGES = 3;

type DateRange = 'today' | 'yesterday' | 'last_7_days' | 'last_30_days' | 'all';

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

const formatDateRangeForAPI = (dateRange: Exclude<DateRange, 'all'>) => {
  const now = new Date();
  if (dateRange === 'today') {
    const yesterday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 1
    );
    return {
      dateFrom: formatDateForAPI(yesterday),
      dateTo: formatDateForAPI(now),
    };
  }
  if (dateRange === 'yesterday') {
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
    return {
      dateFrom: formatDateForAPI(dayBeforeYesterday),
      dateTo: formatDateForAPI(yesterday),
    };
  }
  if (dateRange === 'last_7_days') {
    const sevenDaysAgo = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 7
    );
    return {
      dateFrom: formatDateForAPI(sevenDaysAgo),
      dateTo: formatDateForAPI(now),
    };
  }
  const thirtyDaysAgo = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 30
  );
  return {
    dateFrom: formatDateForAPI(thirtyDaysAgo),
    dateTo: formatDateForAPI(now),
  };
};

const isImageMimeType = (mimeType?: string) =>
  mimeType?.startsWith('image/') ?? false;

const isFunctionCallMedium = (medium: ChatMedium) =>
  Boolean(medium.properties?.functionSignature) ||
  Boolean(medium.properties?.functionCache);

const isFileMedium = (medium: ChatMedium) =>
  !isFunctionCallMedium(medium) && !isImageMimeType(medium.mimeType);

type ChatLogWithOptionalTitle = ChatLog & { title?: string | null };

const translateChatLogs = async (
  chatLogs: ChatLog[],
  fromLanguage: string,
  toLanguage: string,
  baseUrl: string
): Promise<ChatLog[]> => {
  try {
    return await Promise.all(
      chatLogs.map(async chatLog => ({
        ...chatLog,
        lines: await Promise.all(
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
              return line;
            }
          })
        ),
      }))
    );
  } catch (e) {
    console.error('Error translating chat logs:', e);
    return chatLogs;
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
  URL.revokeObjectURL(url);
};

const conversationTitleOf = (chatLog: ChatLogWithOptionalTitle): string =>
  getConversationTitle({ title: chatLog.title, lines: chatLog.lines });

const ChatHistoryDrawer = ({
  open,
  onClose,
  apiClient,
  sessionId,
  memori,
  resumeSession,
  baseUrl,
  language,
  userLang,
  isMultilanguageEnabled = false,
  showFunctionCache = false,
  showMessageConsumption = false,
  loginToken,
}: Props) => {
  const { t, i18n } = useTranslation();
  const { add } = useAlertManager();
  const { getUserChatLogsByTokenPaged } = apiClient.chatLogs;

  const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);
  const [selectedChatLog, setSelectedChatLog] = useState<ChatLog | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const searchQuery = useDebounce(searchInput, 300);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [minimumMessagesPerChat, setMinimumMessagesPerChat] = useState(
    DEFAULT_MINIMUM_MESSAGES
  );
  const [customMinimumMessages, setCustomMinimumMessages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);

  const fetchChatLogs = useCallback(
    async ({
      from = 0,
      append = false,
    }: { from?: number; append?: boolean } = {}) => {
      if (!loginToken) {
        setError(
          t('errorFetchingSession') ||
            'Login token required to fetch chat history'
        );
        return;
      }

      if (append) setLoadingMore(true);
      else setIsLoading(true);
      setError(null);

      try {
        const range =
          dateRange === 'all' ? undefined : formatDateRangeForAPI(dateRange);
        const response = await getUserChatLogsByTokenPaged({
          loginToken,
          memoriID: memori.engineMemoriID,
          from,
          howMany: PAGE_SIZE,
          filter: searchQuery,
          dateFrom: range?.dateFrom,
          dateTo: range?.dateTo,
          minimumMessagesPerChat:
            minimumMessagesPerChat === 0
              ? customMinimumMessages
              : minimumMessagesPerChat,
        } as Parameters<typeof getUserChatLogsByTokenPaged>[0]);

        let nextLogs: ChatLog[] = response.chatLogs || [];
        if (
          language.toUpperCase() !== userLang.toUpperCase() &&
          isMultilanguageEnabled
        ) {
          nextLogs = await translateChatLogs(
            nextLogs,
            language,
            userLang,
            baseUrl
          );
        }

        const total =
          (response as { count?: number; totalItems?: number }).count ??
          (response as { totalItems?: number }).totalItems ??
          nextLogs.length;

        setTotalItems(total);
        setChatLogs(current => (append ? [...current, ...nextLogs] : nextLogs));
      } catch (err) {
        setError(t('errorFetchingSession') || 'Error loading chat history');
        console.error('Error fetching chat logs:', err);
      } finally {
        setIsLoading(false);
        setLoadingMore(false);
      }
    },
    [
      loginToken,
      memori.engineMemoriID,
      searchQuery,
      dateRange,
      minimumMessagesPerChat,
      customMinimumMessages,
      language,
      userLang,
      isMultilanguageEnabled,
      baseUrl,
      getUserChatLogsByTokenPaged,
    ]
  );

  useEffect(() => {
    if (open) return;
    setSelectedChatLog(null);
    setSearchInput('');
    setFiltersOpen(false);
    setDateRange('all');
    setMinimumMessagesPerChat(DEFAULT_MINIMUM_MESSAGES);
    setCustomMinimumMessages(1);
  }, [open]);

  useEffect(() => {
    if (open) {
      void fetchChatLogs({ from: 0 });
    }
  }, [open, fetchChatLogs]);

  const exportChatLog = (chatLog: ChatLog) => {
    const text = `${t(
      'write_and_speak.conversationStartedLabel'
    )} ${new Intl.DateTimeFormat(i18n.language, {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date())}\n\n`.concat(
      chatLog.lines
        .map(
          (line: ChatLogLine) =>
            `${line.inbound ? 'YOU' : memori.name}: ${stripAllInternalTags(
              stripHTML(line.text || '')
            )}`
        )
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

  const handleResumeChat = () => {
    if (!selectedChatLog) return;
    resumeSession(selectedChatLog);
    add(
      createAlertOptions({
        description:
          t('write_and_speak.chatResumed') || 'Conversation resumed.',
        severity: 'success',
      })
    );
    onClose();
  };

  const formatCountLabel = (count: number) =>
    `${count} ${
      count === 1
        ? t('write_and_speak.message') || 'message'
        : t('write_and_speak.messages') || 'messages'
    }`;

  const metaFor = (chatLog: ChatLog) => {
    const lastDate = getLastMessageDate(chatLog.lines);
    const dateLabel = lastDate
      ? formatConversationListDate(lastDate, i18n.language)
      : '';
    return [dateLabel, formatCountLabel(chatLog.lines.length)]
      .filter(Boolean)
      .join(' · ');
  };

  const selectedTitle = selectedChatLog
    ? conversationTitleOf(selectedChatLog) ||
      `Chat-${selectedChatLog.chatLogID.substring(0, 4)}`
    : '';

  const selectedChatSession = useMemo(() => {
    if (!selectedChatLog) return null;
    const hasInterruptedLine = selectedChatLog.lines.some(
      line => !line.inbound && !line.text?.trim()
    );

    return {
      title: selectedTitle,
      subtitle: metaFor(selectedChatLog),
      summary: '',
      messages: selectedChatLog.lines.map((line, index) => {
        const attachmentMedium = line.inbound
          ? (line.media || []).find(isFileMedium)
          : undefined;

        return {
          id: `${selectedChatLog.chatLogID}-${index}`,
          role: line.inbound ? ('user' as const) : ('assistant' as const),
          content: line.text || '',
          timestamp: line.timestamp,
          media: (line.media || []).map((medium, mediumIndex) => ({
            ...medium,
            mediumID:
              (medium as { mediumID?: string }).mediumID ||
              `${selectedChatLog.chatLogID}-${index}-${mediumIndex}`,
          })),
          status:
            !line.inbound && !line.text?.trim() && hasInterruptedLine
              ? ('interrupted' as const)
              : ('completed' as const),
          attachment: attachmentMedium
            ? (() => {
                const name =
                  attachmentMedium.title ||
                  attachmentMedium.url?.split('/').pop() ||
                  'Attachment file';
                const mimeType = getOriginalMimeType(
                  name,
                  attachmentMedium.mimeType
                );
                return {
                  name,
                  type: mimeType,
                  size: '2.4 KB',
                  ext: getDocumentBadgeLabel(
                    mimeType,
                    name,
                    attachmentMedium.url
                  ),
                };
              })()
            : undefined,
        };
      }),
      quickActions: [],
    };
  }, [selectedChatLog, selectedTitle, i18n.language, t]);

  const groupedLogs = useMemo(
    () =>
      groupConversations(chatLogs, chatLog =>
        getLastMessageDate(chatLog.lines)
      ),
    [chatLogs]
  );

  const formatGroupLabel = (
    key: ReturnType<typeof groupConversations<ChatLog>>[number]['key']
  ) => {
    if (key.type === 'thisWeek') {
      return t('write_and_speak.thisWeek') || 'This week';
    }
    const label = new Intl.DateTimeFormat(i18n.language, {
      month: 'long',
      ...(key.year === new Date().getFullYear() ? {} : { year: 'numeric' }),
    }).format(new Date(key.year, key.month, 1));
    return label.charAt(0).toUpperCase() + label.slice(1);
  };

  const isEmpty = !isLoading && !error && totalItems === 0 && !searchQuery;
  const noSearchResults =
    !isLoading && !error && !isEmpty && chatLogs.length === 0;
  const hasMore = chatLogs.length < totalItems;
  const isDetail = Boolean(selectedChatLog && selectedChatSession);

  const listFooter =
    !isDetail && !isEmpty && !isLoading ? (
      <DrawerFooter
        start={
          <span className="memori-chat-history-drawer--count">
            {t('write_and_speak.shownOfTotal', {
              shown: chatLogs.length,
              total: totalItems,
            })}
          </span>
        }
        end={
          hasMore ? (
            <Button
              variant="outline"
              loading={loadingMore}
              disabled={loadingMore}
              icon={<ChevronDown aria-hidden />}
              iconPosition="right"
              onClick={() =>
                void fetchChatLogs({ from: chatLogs.length, append: true })
              }
            >
              {t('write_and_speak.loadMore') || t('knownFacts.loadMore')}
            </Button>
          ) : undefined
        }
      />
    ) : undefined;

  const detailFooter = isDetail ? (
    <DrawerFooter>
      <Button
        className="memori-chat-history-drawer--resume-cta"
        variant="primary"
        onClick={handleResumeChat}
      >
        {t('chatResume.resume', { defaultValue: 'Resume conversation' })}
      </Button>
    </DrawerFooter>
  ) : undefined;

  const drawerTitle = isDetail ? (
    <span className="memori-chat-history-drawer--heading">
      <Button
        variant="ghost"
        shape="circle"
        size="sm"
        type="button"
        className="memori-chat-history-drawer--heading-button"
        aria-label={
          t('write_and_speak.backToConversationList') || 'Back to the list'
        }
        title={
          t('write_and_speak.backToConversationList') || 'Back to the list'
        }
        icon={<ChevronLeft aria-hidden />}
        onClick={() => setSelectedChatLog(null)}
      />
      <span className="memori-chat-history-drawer--heading-text">
        <span
          className="memori-chat-history-drawer--heading-title"
          title={selectedTitle}
        >
          {selectedTitle}
        </span>
        <span className="memori-chat-history-drawer--heading-meta">
          {selectedChatSession?.subtitle}
        </span>
      </span>
      <IconButton
        type="button"
        className="memori-chat-history-drawer--heading-button"
        aria-label={
          t('write_and_speak.downloadThisConversation') ||
          'Download this conversation'
        }
        title={
          t('write_and_speak.downloadThisConversation') ||
          'Download this conversation'
        }
        icon={<Download aria-hidden />}
        onClick={() => selectedChatLog && exportChatLog(selectedChatLog)}
      />
    </span>
  ) : (
    t('write_and_speak.chatHistory') || 'Chat history'
  );

  return (
    <SideDrawer
      open={open}
      size="md"
      className={cx('memori-chat-history-drawer', {
        'memori-chat-history-drawer--detail': isDetail,
      })}
      title={drawerTitle}
      closeLabel={t('close') || 'Close'}
      footer={isDetail ? detailFooter : listFooter}
      onClose={onClose}
    >
      {isDetail && selectedChatSession ? (
        <ChatResumeDrawer
          embedded
          isOpen
          session={selectedChatSession}
          memori={memori}
          onResume={handleResumeChat}
          onClose={() => setSelectedChatLog(null)}
          onExportChat={() => selectedChatLog && exportChatLog(selectedChatLog)}
          showFunctionCache={showFunctionCache}
          showMessageConsumption={showMessageConsumption}
        />
      ) : (
        <>
          <div className="memori-chat-history-drawer--toolbar">
            <div className="memori-chat-history-drawer--toolbar-row">
              <div className="memori-chat-history-drawer--search">
                <Search
                  aria-hidden
                  className="memori-chat-history-drawer--search-icon"
                />
                <label className="sr-only" htmlFor="memori-chat-history-search">
                  {t('write_and_speak.searchInChatHistory')}
                </label>
                <Input
                  id="memori-chat-history-search"
                  fullWidth
                  value={searchInput}
                  placeholder={t('write_and_speak.searchInChatHistory') || ''}
                  onValueChange={setSearchInput}
                />
              </div>
              {totalItems > 0 && (
                <span className="memori-chat-history-drawer--total">
                  {t('write_and_speak.conversationsCount', {
                    count: totalItems,
                  })}
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              type="button"
              className="memori-chat-history-drawer--filters-toggle"
              aria-expanded={filtersOpen}
              icon={
                <ChevronDown
                  aria-hidden
                  className={cx(
                    'memori-chat-history-drawer--filters-chevron',
                    filtersOpen &&
                      'memori-chat-history-drawer--filters-chevron--open'
                  )}
                />
              }
              iconPosition="right"
              onClick={() => setFiltersOpen(openFilters => !openFilters)}
            >
              {t('write_and_speak.filters')}
            </Button>
            {filtersOpen && (
              <div className="memori-chat-history-drawer--filters">
                <SelectBox
                  className="memori-chat-history-drawer--filters-select"
                  value={dateRange}
                  displayValue={
                    dateRange === 'all' ? t('all') || 'All' : t(dateRange)
                  }
                  onChange={value => {
                    if (!value) return;
                    setDateRange(value as DateRange);
                  }}
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
                />
                <div className="memori-chat-history-drawer--filters-messages">
                  <SelectBox
                    className="memori-chat-history-drawer--filters-select"
                    value={String(minimumMessagesPerChat)}
                    displayValue={
                      minimumMessagesPerChat === 0
                        ? t('chatLogs.customMinimumMessages') ||
                          'Customize the number of messages'
                        : t('chatLogs.atLeast' + minimumMessagesPerChat) ||
                          `At least ${minimumMessagesPerChat} messages`
                    }
                    onChange={value => {
                      setMinimumMessagesPerChat(value ? Number(value) : 0);
                    }}
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
                        label:
                          t('chatLogs.atLeast10') || 'At least 10 messages',
                      },
                      {
                        value: '15',
                        label:
                          t('chatLogs.atLeast15') || 'At least 15 messages',
                      },
                      {
                        value: '20',
                        label:
                          t('chatLogs.atLeast20') || 'At least 20 messages',
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
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        setCustomMinimumMessages(
                          parseInt(event.target.value, 10) || 1
                        );
                      }}
                      className="memori-chat-history-drawer--filters-custom"
                      aria-label={
                        t('chatLogs.customMinimumMessages') ||
                        'Customize the number of messages'
                      }
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {isLoading && (
            <div className="memori-chat-history-drawer--loading">
              <Spin spinning primary />
              <p>
                {t('write_and_speak.loadingChatHistory') ||
                  'Loading chat history...'}
              </p>
            </div>
          )}

          {error && (
            <div className="memori-chat-history-drawer--error" role="alert">
              <p>{error}</p>
            </div>
          )}

          {isEmpty && (
            <SideDrawerEmpty
              icon={<MessageCircle />}
              title={
                t('write_and_speak.noChatHistoryAvailable') ||
                'No chat history available'
              }
            />
          )}

          {noSearchResults && (
            <SideDrawerEmpty
              icon={<Search />}
              title={t('write_and_speak.noResultsFound', {
                searchText: searchQuery,
              })}
            />
          )}

          {!isLoading && !error && groupedLogs.length > 0 && (
            <div className="memori-chat-history-drawer--groups">
              {groupedLogs.map(group => (
                <section
                  key={
                    group.key.type === 'thisWeek'
                      ? 'thisWeek'
                      : `${group.key.year}-${group.key.month}`
                  }
                  className="memori-chat-history-drawer--group"
                >
                  <h3 className="memori-chat-history-drawer--group-label">
                    {formatGroupLabel(group.key)}
                  </h3>
                  <ul
                    className="memori-chat-history-drawer--list"
                    aria-label={
                      t('write_and_speak.chatHistory') || 'Chat history'
                    }
                  >
                    {group.items.map(chatLog => {
                      const title =
                        conversationTitleOf(chatLog) ||
                        `Chat-${chatLog.chatLogID.substring(0, 4)}`;
                      const isCurrentSession = chatLog.sessionID === sessionId;
                      const meta = metaFor(chatLog);
                      const lastDate = getLastMessageDate(chatLog.lines);

                      return (
                        <li key={chatLog.chatLogID}>
                          <div
                            className={cx(
                              'memori-chat-history-drawer--list-item',
                              {
                                'memori-chat-history-drawer--list-item--disabled':
                                  isCurrentSession,
                              }
                            )}
                          >
                            <button
                              type="button"
                              className="memori-chat-history-drawer--list-item-main"
                              aria-disabled={isCurrentSession || undefined}
                              aria-label={title}
                              disabled={isCurrentSession}
                              onClick={() => {
                                if (isCurrentSession) return;
                                setSelectedChatLog(chatLog);
                              }}
                            >
                              <span className="memori-chat-history-drawer--list-item--content">
                                <span
                                  className="memori-chat-history-drawer--list-item--title"
                                  title={title}
                                >
                                  {title}
                                </span>
                                <span className="memori-chat-history-drawer--list-item--meta">
                                  {lastDate && (
                                    <time dateTime={lastDate.toISOString()}>
                                      {meta}
                                    </time>
                                  )}
                                  {!lastDate && meta}
                                </span>
                              </span>
                            </button>
                            <ChevronRight
                              aria-hidden
                              className="memori-chat-history-drawer--list-item-chevron"
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </>
      )}
    </SideDrawer>
  );
};

export default ChatHistoryDrawer;
