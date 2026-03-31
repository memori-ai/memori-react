import React from 'react';
import { Spin } from '@memori.ai/ui';
import { LayoutProps } from '../MemoriWidget/MemoriWidget';

const TotemLayout: React.FC<LayoutProps> = ({
  Header,
  headerProps,
  Avatar,
  avatarProps,
  Chat,
  chatProps,
  StartPanel,
  startPanelProps,
  integrationStyle,
  integrationBackground,
  sessionId,
  hasUserActivatedSpeak,
  loading = false,
  poweredBy,
}) => (
  <>
    {integrationStyle}
    {integrationBackground}

    <Spin spinning={loading} className="memori-totem-layout">
      {poweredBy}

      <div className="memori-totem-layout--header">
        {Header && headerProps && <Header {...headerProps} />}
      </div>

      <div className="memori-totem-layout--avatar">
        {Avatar && avatarProps && <Avatar chatProps={chatProps} {...avatarProps} isTotem />}
      </div>

      <div id="extension" />

      <div className="memori-totem-layout--controls">
        {sessionId && hasUserActivatedSpeak && Chat && chatProps ? (
          <Chat {...chatProps} />
        ) : startPanelProps ? (
          <StartPanel {...startPanelProps} />
        ) : null}
      </div>
    </Spin>
  </>
);

export default TotemLayout;
