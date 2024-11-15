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
  ChangeMode,
  changeModeProps,
  sessionId,
  hasUserActivatedSpeak,
  showInstruct = false,
  loading = false,
  poweredBy,
}) => {
  const isChrome = navigator.userAgent.includes('Chrome');

  return (
    <>
    {integrationStyle}
    {integrationBackground}

    <Spin className={`memori-full-body--container  ${isChrome ? 'memori-full-body--container--chrome' : 'memori-full-body--container--safari'}`} spinning={loading}>
      {showInstruct && ChangeMode && changeModeProps && (
        <ChangeMode {...changeModeProps} />
      )}

      <div className="memori-full-body--header">
        {Header && headerProps && <Header {...headerProps} />}
      </div>

      <div className="memori--grid">
        <div className="memori-full-body-layout--avatar-mobile memori--grid-column memori--grid-column-left">
          {Avatar && avatarProps && <Avatar {...avatarProps} />}

          <div id="extension" />
        </div>
        <div className="memori--grid-column--zoomed-full-body memori-full-body-layout--controls memori--grid-column memori--grid-column-right">
          {sessionId && hasUserActivatedSpeak && Chat && chatProps ? (
            <Chat {...chatProps} />
          ) : startPanelProps ? (
            <StartPanel {...startPanelProps} />
          ) : null}
        </div>

        <div className="memori--powered-by-custom">{poweredBy}</div>
      </div>
    </Spin>
  </>
  );
};

export default FullPageLayout;
