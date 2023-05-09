import React from 'react';
import Spin from '../ui/Spin';
import { LayoutProps } from '../MemoriWidget/MemoriWidget';

const FullPageLayout: React.FC<LayoutProps> = ({
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
