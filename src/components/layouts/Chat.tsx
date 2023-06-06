import React from 'react';
import Spin from '../ui/Spin';
import { LayoutProps } from '../MemoriWidget/MemoriWidget';

const ChatLayout: React.FC<LayoutProps> = ({
  header,
  chat,
  startPanel,
  integrationStyle,
  integrationBackground,
  changeMode,
  sessionId,
  hasUserActivatedSpeak,
  showInstruct = false,
  loading = false,
  poweredBy,
}) => (
  <>
    {integrationStyle}
    {integrationBackground}

    <Spin spinning={loading} className="memori-chat-layout">
      {poweredBy}
      {showInstruct && changeMode}

      <div className="memori-chat-layout--header">{header}</div>

      <div className="memori-chat-layout--controls">
        {sessionId && hasUserActivatedSpeak ? chat : startPanel}
      </div>
    </Spin>
  </>
);

export default ChatLayout;
