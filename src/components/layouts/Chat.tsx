import React, { useState, useEffect } from 'react';
import Spin from '../ui/Spin';
import { LayoutProps } from '../MemoriWidget/MemoriWidget';
import { ArtifactDrawer } from '../MemoriArtifactSystem';
import { useArtifactSystemContext } from '../MemoriArtifactSystem/context/ArtifactSystemContext';

const ChatLayout: React.FC<LayoutProps> = ({
  Header,
  headerProps,
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
  const { actions, state } = useArtifactSystemContext();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 769;
      if (newIsMobile !== isMobile) {
        setTimeout(() => {
          setIsMobile(newIsMobile);
        }, 300);
      } else {
        setIsMobile(newIsMobile);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  const hasArtifact = state.currentArtifact && !isMobile;

  return (
    <>
      {integrationStyle}
      {integrationBackground}

      <Spin spinning={loading} className="memori-chat-layout">
        {poweredBy}

        <div className="memori-chat-layout--header">
          {Header && headerProps && <Header {...headerProps} />}
        </div>

        <div id="extension" />

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
            <div className={state.isFullscreen ? `memori-chat-layout-artifact-panel-full-screen` : `memori-chat-layout--artifact-panel memori-chat-layout--artifact-panel-enter`}>
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
      </Spin>
    </>
  );
};

export default ChatLayout;
