import React from 'react';
import Spin from '../ui/Spin';
import { LayoutProps } from '../MemoriWidget/MemoriWidget';

const ChatLayout: React.FC<LayoutProps> = ({
  Header,
  headerProps,
  Chat,
  chatProps,
  StartPanel,
  startPanelProps,
  integrationStyle,
  integrationBackground,
  ChangeMode,
  changeModeProps,
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
      {showInstruct && ChangeMode && changeModeProps && (
        <ChangeMode {...changeModeProps} />
      )}

      <div className="memori-chat-layout--header">
        {Header && headerProps && <Header {...headerProps} />}
      </div>

      <div id="extension" />

      <div className="memori-chat-layout--controls">
        {sessionId && hasUserActivatedSpeak && Chat && chatProps ? (
          <Chat {...chatProps} />
        ) : startPanelProps ? (
          <StartPanel {...startPanelProps} />
        ) : null}
      </div>
    </Spin>
  </>
);

export default ChatLayout;
