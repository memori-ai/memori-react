import React, { useEffect, useState } from 'react';
import Spin from '../ui/Spin';
import { LayoutProps } from '../MemoriWidget/MemoriWidget';
import { useArtifact } from '../MemoriArtifactSystem/context/ArtifactContext';
import ArtifactDrawer from '../MemoriArtifactSystem/components/ArtifactDrawer/ArtifactDrawer';

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
}) => {
  const { state } = useArtifact();
  const hasArtifact = state.currentArtifact;
  return (
    <>
      {integrationStyle}
      {integrationBackground}

      <Spin spinning={loading}>
        {Header && headerProps && <Header {...headerProps} />}

        <div className="memori--grid">
          {!state.isDrawerOpen && (
            <div className="memori--grid-column memori--grid-column-left">
              {Avatar && avatarProps && (
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
                      state.isDrawerOpen
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

            {state.isDrawerOpen && (
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

          {poweredBy}
        </div>
      </Spin>
    </>
  );
};

export default FullPageLayout;
