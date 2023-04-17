import React from 'react';
import Spin from '../ui/Spin';

export interface Props {
  header?: JSX.Element | null;
  avatar: JSX.Element;
  chat?: JSX.Element | null;
  startPanel: JSX.Element;
  integrationStyle?: JSX.Element | null;
  integrationBackground?: JSX.Element | null;
  changeMode?: JSX.Element | null;
  poweredBy?: JSX.Element | null;
  sessionId?: string;
  hasUserActivatedSpeak?: boolean;
  showInstruct?: boolean;
  loading?: boolean;
}

const TotemLayout: React.FC<Props> = ({
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
