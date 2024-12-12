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
  return (
    <>
    {integrationStyle}
    {integrationBackground}

    <Spin className="memori-full-body--container" spinning={loading}>
      {showInstruct && ChangeMode && changeModeProps && (
        <ChangeMode {...changeModeProps} />
      )}

      <div className="memori-full-body--header">
        {Header && headerProps && <Header {...headerProps} />}
      </div>

      <div className="memori--grid">
        <div className="memori-full-body-layout--avatar-column memori--grid-column memori--grid-column-left">
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

        <div className="memori--powered-by-container">{poweredBy}</div>
      </div>
    </Spin>
  </>
  );
};

export default FullPageLayout;
