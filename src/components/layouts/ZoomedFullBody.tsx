import React, { useEffect, useState } from 'react';
import Spin from '../ui/Spin';
import { LayoutProps } from '../MemoriWidget/MemoriWidget';
import {
  ArtifactDrawer,
  useArtifactSystemContext,
} from '../MemoriArtifactSystem';

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
  const { state } = useArtifactSystemContext();
  const [isMobile, setIsMobile] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 769;
      if (newIsMobile !== isMobile) {
        setIsAnimating(true);
        setTimeout(() => {
          setIsMobile(newIsMobile);
          setIsAnimating(false);
        }, 300);
      } else {
        setIsMobile(newIsMobile);
      }
    };

    document.body.style.overflow = 'hidden';

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  const hasArtifact = state.currentArtifact && !isMobile;

  return (
    <>
      {integrationStyle}
      {integrationBackground}

      <Spin className="memori-spin--zoomed-full-body" spinning={loading}>
        {Header && headerProps && <Header {...headerProps} />}

        <div className="memori--grid">
          {!hasArtifact && (
            <div className="memori--grid-column memori--grid-column-left">
              {Avatar && avatarProps && !hasArtifact && (
                <Avatar chatProps={chatProps} {...avatarProps} />
              )}

              <div id="extension" />
            </div>
          )}
          <div
            className={`memori-chat-layout--main ${
              hasArtifact ? 'memori-chat-layout--main-with-artifact' : ''
            }`}
          >
            <div
              className={
                state.isFullscreen
                  ? `memori-chat-layout-controls-hide`
                  : `memori-chat-layout--controls ${
                      hasArtifact
                        ? 'memori-chat-layout--controls-with-artifact'
                        : ''
                    }`
              }
            >
              {sessionId && hasUserActivatedSpeak && Chat && chatProps ? (
                <Chat {...chatProps} />
              ) : startPanelProps ? (
                <StartPanel {...startPanelProps} />
              ) : null}
            </div>

            {hasArtifact && (
              <div
                className={
                  state.isFullscreen
                    ? `memori-chat-layout-artifact-panel-full-screen`
                    : `memori-chat-layout--artifact-panel memori-chat-layout--artifact-panel-enter`
                }
              >
                <ArtifactDrawer />
              </div>
            )}
          </div>

          {/* Mobile drawer - always rendered but only shown on mobile */}
          {state.currentArtifact && isMobile && (
            <div className="memori-chat-layout--artifact-drawer">
              <ArtifactDrawer />
            </div>
          )}

          <div className="memori--powered-by-custom">{poweredBy}</div>
        </div>
      </Spin>
    </>
  );
};

export default ZoomedFullBodyLayout;
