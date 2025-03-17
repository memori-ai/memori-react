import Drawer from '../ui/Drawer';
import { useTranslation } from 'react-i18next';
import { Props as WidgetProps } from '../MemoriWidget/MemoriWidget';
import memoriApiClient from '@memori.ai/memori-api-client';
import { useEffect, useState } from 'react';
import {
  ChatLog,
  ChatLogLine,
  User,
  Memori,
  Medium,
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
}

const ITEMS_PER_PAGE = 10;

const ChatHistoryDrawer = ({
  open,
  layout = 'DEFAULT',
  onClose,
  apiClient,
  sessionId,
  memori,
}: Props) => {
  const { t } = useTranslation();

  const { getChatLogsByUser } = apiClient.chatLogs;

  const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);
  const [selectedChatLog, setSelectedChatLog] = useState<ChatLog | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    console.log('Fetching chat logs for session:', sessionId);
    getChatLogsByUser(sessionId)
      .then(res => {
        console.log('Received chat logs:', res.chatLogs);
        setChatLogs(res.chatLogs);
      })
      .catch(err => {
        console.error('Error fetching chat logs:', err);
      });
  }, []);

  const totalPages =
    chatLogs && chatLogs.length > 0
      ? Math.ceil(chatLogs.length / ITEMS_PER_PAGE)
      : 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentChatLogs =
    chatLogs && chatLogs.length > 0 ? chatLogs.slice(startIndex, endIndex) : [];

  return (
    <Drawer
      className="memori-chat-history-drawer"
      open={open}
      onClose={onClose}
      title={t('widget.chatHistory') || 'Chat History'}
      description={t('widget.chatHistoryDescription')}
    >
      <div className="memori-chat-history-drawer--content">
        <ul>
          {currentChatLogs.map((chatLog: ChatLog) => (
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
                  <h3 style={{ fontSize: '1rem', margin: 0 }}>{'Chat-' + chatLog.chatLogID.substring(0, 4)}</h3>
                  {chatLog.boardOfExperts && <div className="memori-chat-history-drawer--content--card--board-of-experts">Board of Experts</div>}
                  <span style={{ marginLeft: 'auto' }}>
                    {new Date(Math.max(...chatLog.lines.map(line => new Date(line.timestamp).getTime()))).toLocaleDateString()}
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
