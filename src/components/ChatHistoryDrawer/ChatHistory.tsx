import Drawer from '../ui/Drawer';
import { useTranslation } from 'react-i18next';
import { Props as WidgetProps } from '../MemoriWidget/MemoriWidget';
import memoriApiClient from '@memori.ai/memori-api-client';
import { useEffect, useMemo, useState } from 'react';
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
import './ChatHistory.css';

export interface Props {
  open: boolean;
  layout?: WidgetProps['layout'];
  onClose: () => void;
  apiClient: ReturnType<typeof memoriApiClient>;
  sessionId: string;
  memori: Memori;
  resumeSession: (
    sessionId: string,
    chatLogs: ChatLogLine[]
  ) => void;
}

const ITEMS_PER_PAGE = 10;

const ChatHistoryDrawer = ({
  open,
  layout = 'DEFAULT',
  onClose,
  apiClient,
  sessionId,
  memori,
  resumeSession,
}: Props) => {
  const { t } = useTranslation();

  const { getChatLogsByUser } = apiClient.chatLogs;
  const { postTextEnteredEventExtended } = apiClient;

  const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);
  const [selectedChatLog, setSelectedChatLog] = useState<ChatLog | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    console.log('Fetching chat logs for session:', sessionId);
    getChatLogsByUser(sessionId)
      .then(res => {
        console.log('Received chat logs:', res.chatLogs);
        setChatLogs(res.chatLogs.reverse());
      })
      .catch(err => {
        console.error('Error fetching chat logs:', err);
      });
  }, []);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const filteredChatLogs = useMemo(() => {
    return chatLogs
      .filter(
        c => c.lines.some(l => l.text.toLowerCase().includes(searchText.toLowerCase())) && c.lines.length > 1
      )
      .slice(startIndex, endIndex);
  }, [chatLogs, searchText, startIndex, endIndex]);
  const totalPages =
    filteredChatLogs && filteredChatLogs.length > 0
      ? Math.ceil(filteredChatLogs.length / ITEMS_PER_PAGE)
      : 1;

  const handleResumeChat = async () => {
    console.log('Resuming chat from:', selectedChatLog?.lines);
    // create a new array of objects with question and answer
    let questionsAndAnswers: { question: string; answer: string }[] = [];
    selectedChatLog?.lines.forEach(line => {
      if (line.inbound) {
        // This is an answer from the Memori
        if (questionsAndAnswers.length > 0) {
          questionsAndAnswers[questionsAndAnswers.length - 1].answer =
            line.text;
        }
      } else {
        // This is a question from the user
        questionsAndAnswers.push({
          question: line.text,
          answer: '',
        });
      }
    });
    const response = await postTextEnteredEventExtended({
      sessionId,
      text: `Riprendiamo la conversazione con ${
        selectedChatLog?.chatLogID
      } del ${new Intl.DateTimeFormat('it', {
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(new Date(selectedChatLog?.lines[0].timestamp || 0))}`,
      questionsAndAnswersHistory: questionsAndAnswers,
    });
    if (response.resultCode === 0) {
      console.log('Resuming chat from:', response);
      resumeSession(
        sessionId,
        selectedChatLog?.lines || []
      );
    }
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
        <div className="memori-chat-history-drawer--search">
          <input
            type="text"
            placeholder={t('search') || 'Search in chat history...'}
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '16px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
        </div>
        <ul>
          {filteredChatLogs.map((chatLog: ChatLog) => (
            <Card
              hoverable
              onClick={() => {
                console.log('Selected chat log:', chatLog);
                setSelectedChatLog(chatLog);
              }}
              key={chatLog.chatLogID}
            >
              <>
                <div className="memori-chat-history-drawer--content--card">
                  <ChatRound className="memori-chat-history-drawer--content--card--icon" />
                  <h3 style={{ fontSize: '1rem', margin: 0 }}>
                    {'Chat-' + chatLog.chatLogID.substring(0, 4)}
                  </h3>
                  <h4 style={{ fontSize: '0.8rem', margin: 0 }}>
                    {chatLog.lines.length === 1
                      ? '1 message'
                      : `${chatLog.lines.length} messages`}
                  </h4>
                  {chatLog.boardOfExperts && (
                    <div className="memori-chat-history-drawer--content--card--board-of-experts">
                      Board of Experts
                    </div>
                  )}
                  <span style={{ marginLeft: 'auto' }}>
                    {new Intl.DateTimeFormat('it', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    }).format(new Date(
                      Math.max(
                        ...chatLog.lines.map(line =>
                          new Date(line.timestamp).getTime()
                        )
                      )
                    ))}
                  </span>
                </div>
                {selectedChatLog?.chatLogID === chatLog.chatLogID && (
                  <div className="memori-chat-history-drawer--content--card--content">
                    {chatLog.lines.map((line: ChatLogLine) => (
                      <ChatBubble
                        key={line.text}
                        message={{
                          text: line.text,
                          contextVars: line.contextVars,
                          media: line.media as Medium[],
                          fromUser: line.inbound,
                          timestamp: line.timestamp,
                        }}
                        memori={memori}
                        sessionID={sessionId}
                      />
                    ))}

                    <Button primary onClick={handleResumeChat}>
                      {t('write_and_speak.resumeButton') || 'Resume chat'}
                    </Button>
                  </div>
                )}
              </>
            </Card>
          ))}
        </ul>
        {totalPages > 1 && (
          <div className="memori-chat-history-drawer--pagination">
            <Button
              primary
              onClick={() => {
                console.log('Moving to previous page');
                setCurrentPage(p => Math.max(1, p - 1));
              }}
              disabled={currentPage === 1}
            >
              {t('previous') || 'Previous'}
            </Button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <Button
              primary
              onClick={() => {
                console.log('Moving to next page');
                setCurrentPage(p => Math.min(totalPages, p + 1));
              }}
              disabled={currentPage === totalPages}
            >
              {t('next') || 'Next'}
            </Button>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default ChatHistoryDrawer;
