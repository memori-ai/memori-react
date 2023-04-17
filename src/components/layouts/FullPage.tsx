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

const FullPageLayout: React.FC<Props> = ({
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

    <Spin spinning={loading}>
      {showInstruct && changeMode}

      {header}

      <div className="memori--grid">
        <div className="memori--grid-column memori--grid-column-left">
          {avatar}
        </div>
        <div className="memori--grid-column memori--grid-column-right">
          {sessionId && hasUserActivatedSpeak ? chat : startPanel}
        </div>

        {poweredBy}
      </div>
    </Spin>
  </>
);

export default FullPageLayout;
