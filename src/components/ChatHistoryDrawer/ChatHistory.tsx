import Drawer from '../ui/Drawer';
import { useTranslation } from 'react-i18next';
import { Props as WidgetProps } from '../MemoriWidget/MemoriWidget';
import memoriApiClient from '@memori.ai/memori-api-client';
import { useEffect } from 'react';
import { User } from '@memori.ai/memori-api-client/dist/types';

export interface Props {
  open: boolean;
  layout?: WidgetProps['layout'];
  onClose: () => void;
  apiClient: ReturnType<typeof memoriApiClient>;
  sessionId: string;
}

const ChatHistoryDrawer = ({
  open,
  layout = 'DEFAULT',
  onClose,
  apiClient,
  sessionId,
}: Props) => {
  const { t } = useTranslation();

  const { getChatLogsByUser } = apiClient.chatLogs;

  useEffect(() => {
    console.log('sessionId', sessionId);
    getChatLogsByUser(sessionId).then((res) => {
      console.log(res);
    });
  }, []);

  return (
    <Drawer
      className="memori-chat-history-drawer"
      open={open}
      onClose={onClose}
      title={t('widget.chatHistory') || 'Chat History'}
      description={t('widget.chatHistoryDescription')}
    >
      <div className="memori-chat-history-drawer--content">

      </div>
    </Drawer>
  );
};

export default ChatHistoryDrawer;
