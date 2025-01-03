import React from 'react';
import Spin from '../ui/Spin';
import { LayoutProps } from '../MemoriWidget/MemoriWidget';

const FullPageLayout: React.FC<LayoutProps> = ({
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

    <Spin spinning={loading}>
      {Header && headerProps && <Header {...headerProps} />}

      <div className="memori--grid">
        <div className="memori--grid-column memori--grid-column-left">
          {Avatar && avatarProps && <Avatar {...avatarProps} />}

          <div id="extension" />
        </div>
        <div className="memori--grid-column memori--grid-column-right">
          {sessionId && hasUserActivatedSpeak && Chat && chatProps ? (
            <Chat {...chatProps} />
          ) : startPanelProps ? (
            <StartPanel {...startPanelProps} />
          ) : null}
        </div>

        {poweredBy}
      </div>
    </Spin>
  </>
);

export default FullPageLayout;
