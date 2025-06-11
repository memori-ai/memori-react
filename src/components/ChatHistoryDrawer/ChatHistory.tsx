import Drawer from '../ui/Drawer';
import { useTranslation } from 'react-i18next';
import { Props as WidgetProps } from '../MemoriWidget/MemoriWidget';
import memoriApiClient from '@memori.ai/memori-api-client';
import { useEffect, useMemo, useState, useCallback, ChangeEvent } from 'react';
import {
  ChatLog,
  ChatLogLine,
  User,
  Memori,
  Medium,
  DialogState,
} from '@memori.ai/memori-api-client/dist/types';
import Card from '../ui/Card';
import ChatBubble from '../ChatBubble/ChatBubble';
import Button from '../ui/Button';
import ChatRound from '../icons/Chat';
import { truncateMessage } from '../../helpers/utils';
import { Dialog, Transition } from '@headlessui/react';
import debounce from 'lodash/debounce';
import Chat from '../Chat/Chat';

export interface Props {
  open: boolean;
  layout?: WidgetProps['layout'];
  onClose: () => void;
  apiClient: ReturnType<typeof memoriApiClient>;
  sessionId: string;
  memori: Memori;
  resumeSession: (chatLog: ChatLog) => void;
  baseUrl: string;
  apiUrl: string;
}

const ITEMS_PER_PAGE = 8;
const DEBOUNCE_DELAY = 300;

const ChatHistoryDrawer = ({
  open,
  layout = 'DEFAULT',
  onClose,
  apiClient,
  sessionId,
  memori,
  resumeSession,
  baseUrl,
  apiUrl,
}: Props) => {
  const { t } = useTranslation();
  const { getChatLogsByUser } = apiClient.chatLogs;

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
      setChatLogs(res.chatLogs.sort((a, b) => {
        const dateA = Math.max(...a.lines.map(l => new Date(l.timestamp).getTime()));
        const dateB = Math.max(...b.lines.map(l => new Date(l.timestamp).getTime()));
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      }));
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
    return chatLogs.filter(c => 
      c.lines.some(l => l.text.toLowerCase().includes(searchText.toLowerCase())) && 
      c.lines.length > 1
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
          <div className="memori-chat-history-drawer--loading--spinner" />
          <p className="memori-chat-history-drawer--loading--text">{t('widget.loadingChatHistory') || 'Loading chat history...'}</p>
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
          <p className="memori-chat-history-drawer--empty--text">{t('widget.noChatHistoryAvailable') || 'No chat history available'}</p>
        </div>
      );
    }

    if (filteredChatLogs.length === 0) {
      return (
        <div className="memori-chat-history-drawer--no-results">
          <p>{t('widget.noResultsFound', { searchText }) || `No results found for "${searchText}"`}</p>
        </div>
      );
    }

    console.log('selectedChatLog', selectedChatLog);

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
                onClick={() => setSelectedChatLog(
                  selectedChatLog?.chatLogID === chatLog.chatLogID ? null : chatLog
                )}
                key={chatLog.chatLogID}
                className={`memori-chat-history-drawer--card ${
                  selectedChatLog?.chatLogID === chatLog.chatLogID ? 'memori-chat-history-drawer--card--selected' : ''
                }`}
              >
                <>
                  <div className="memori-chat-history-drawer--card--header">
                    <div className="memori-chat-history-drawer--card--header--content">
                      <div className="memori-chat-history-drawer--card--header--icon-wrapper">
                        <ChatRound className="memori-chat-history-drawer--card--header--icon" />
                      </div>
                      <div className="memori-chat-history-drawer--card--header--info">
                        <div className="memori-chat-history-drawer--card--header--title-wrapper">
                          <Dialog.Title as="h3" className="memori-chat-history-drawer--card--header--title">
                            {'Chat-' + chatLog.chatLogID.substring(0, 4)}
                          </Dialog.Title>
                          {chatLog.boardOfExperts && (
                            <div className="memori-chat-history-drawer--card--header--badge">
                              BOE
                            </div>
                          )}
                        </div>
                        <div className="memori-chat-history-drawer--card--header--meta">
                          {chatLog.lines.some(line => line.media && line.media.filter(m => m.mimeType !== 'text/html' && m.mimeType !== 'text/plain').length > 0) && (
                            <span className="memori-chat-history-drawer--card--header--meta--messages">
                              <svg className="memori-chat-history-drawer--card--header--meta--icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {chatLog.lines.reduce((acc, line) => acc + (line.media?.filter(m => m.mimeType !== 'text/html' && m.mimeType !== 'text/plain').length || 0), 0)}
                            </span>
                          )}
                          <span className="memori-chat-history-drawer--card--header--meta--messages">
                            <svg className="memori-chat-history-drawer--card--header--meta--icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            {chatLog.lines.length}
                          </span>
                          <time className="memori-chat-history-drawer--card--header--meta--time" dateTime={new Date(lastMessageDate).toISOString()}>
                            <svg className="memori-chat-history-drawer--card--header--meta--icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formatDate(new Date(lastMessageDate).toISOString())}
                          </time>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {selectedChatLog?.chatLogID === chatLog.chatLogID && (
                    <div className="memori-chat-history-drawer--card--content">
                      <div className="memori-chat-history-drawer--card--content--messages">
                          <Chat
                            key={`${chatLog.lines[0].text}-${chatLog.lines[0].timestamp}`}
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
                              text: truncateMessage(line.text),
                              contextVars: line.contextVars,
                              media: line.media as Medium[],
                              fromUser: line.inbound,
                              timestamp: line.timestamp,
                            }))}
                            memori={memori}
                            sessionID={sessionId}
                            setDialogState={() => {}}
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
                              {t('write_and_speak.resumeButton') || 'Resume chat'}
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
              {t('write_and_speak.page', { current: currentPage, total: totalPages })}
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
      title={t('widget.chatHistory') || 'Chat History'} 
      description={t('widget.chatHistoryDescription')}
    >
      <div className="memori-chat-history-drawer--content">
        <div className="memori-chat-history-drawer--toolbar">
          <div className="memori-chat-history-drawer--toolbar--search">
            <input
              type="search"
              className="memori-chat-history-drawer--toolbar--search--input"
              placeholder={t('search') || 'Search in chat history...'}
              onChange={(e: ChangeEvent<HTMLInputElement>) => debouncedSearch(e.target.value)}
            />
            <span className="memori-chat-history-drawer--toolbar--search--icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
          <Button
            onClick={() => {
              setSortOrder(order => order === 'asc' ? 'desc' : 'asc');
              setCurrentPage(1);
            }}
            className="memori-chat-history-drawer--toolbar--sort-button"
          >
            {sortOrder === 'desc' ? t('write_and_speak.latestFirst') : t('write_and_speak.oldestFirst')}
          </Button>
        </div>
        {renderContent()}
      </div>
    </Drawer>
  );
};

export default ChatHistoryDrawer;
