import React from 'react';
import Spin from '../ui/Spin';
import { LayoutProps } from '../MemoriWidget/MemoriWidget';

const TotemLayout: React.FC<LayoutProps> = ({
  header,
  avatar,
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

    <Spin spinning={loading} className="memori-totem-layout">
      {poweredBy}
      {showInstruct && changeMode}

      <div className="memori-totem-layout--header">{header}</div>

      <div className="memori-totem-layout--avatar">{avatar}</div>

      <div className="memori-totem-layout--controls">
        {sessionId && hasUserActivatedSpeak ? chat : startPanel}
      </div>
    </Spin>
  </>
);

export default TotemLayout;
