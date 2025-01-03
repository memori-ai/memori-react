import React, { useEffect } from 'react';
import Spin from '../ui/Spin';
import { LayoutProps } from '../MemoriWidget/MemoriWidget';

const ZoomedFullBodyLayout: React.FC<LayoutProps> = ({
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
}) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <>
      {integrationStyle}
      {integrationBackground}

      <Spin className="memori-spin--zoomed-full-body" spinning={loading}>
        {Header && headerProps && <Header {...headerProps} />}

        <div className="memori--grid">
          <div className="memori--grid-column memori--grid-column-left">
            {Avatar && avatarProps && (
              <Avatar chatProps={chatProps} isZoomed {...avatarProps} />
            )}

            <div id="extension" />
          </div>
          <div className="memori--grid-column memori--grid-column--zoomed-full-body memori--grid-column-right">
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

export default ZoomedFullBodyLayout;
