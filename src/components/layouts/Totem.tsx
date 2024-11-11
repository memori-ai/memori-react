import React from 'react';
import Spin from '../ui/Spin';
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

    <Spin spinning={loading} className="memori-totem-layout">
      {poweredBy}
      {showInstruct && ChangeMode && changeModeProps && (
        <ChangeMode {...changeModeProps} />
      )}

      <div className="memori-totem-layout--header">
        {Header && headerProps && <Header {...headerProps} />}
      </div>

      <div className="memori-totem-layout--avatar">
        {Avatar && avatarProps && <Avatar {...avatarProps} isTotem />}
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
