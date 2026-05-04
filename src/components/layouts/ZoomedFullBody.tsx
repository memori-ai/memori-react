import React, { useEffect, useState } from 'react';
import { Spin } from '@memori.ai/ui';
import { LayoutProps } from '../MemoriWidget/MemoriWidget';
import ArtifactDrawer from '../MemoriArtifactSystem/components/ArtifactDrawer/ArtifactDrawer';
import { useArtifact } from '../MemoriArtifactSystem/context/ArtifactContext';

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
  const { state } = useArtifact();
  const hasArtifact = state.currentArtifact;
  const useSideArtifactChrome =
    state.isDrawerOpen && !state.isChatLogPanelPresentation;

  return (
    <>
      {integrationStyle}
      {integrationBackground}

      <Spin className="memori-spin--zoomed-full-body" spinning={loading}>
        <div className="memori--grid">
          {!useSideArtifactChrome && (
            <div className="memori--grid-column memori--grid-column-left">
              {Avatar && avatarProps && (
                <Avatar chatProps={chatProps} isZoomed {...avatarProps} />
              )}

              <div id="extension" />
            </div>
          )}
          <div
            className={`memori-chat-layout--main ${
              hasArtifact && !state.isChatLogPanelPresentation
                ? 'memori-chat-layout--main-with-artifact'
                : ''
            }`}
          >
            <div
              className={
                state.isFullscreen
                  ? `memori-chat-layout-controls-hide`
                  : `memori-chat-layout--controls ${
                      useSideArtifactChrome
                        ? 'memori-chat-layout--controls-with-artifact'
                        : ''
                    }`
              }
            >
              <div
                className={`memori-chat-layout--header ${
                  useSideArtifactChrome
                    ? 'memori-chat-layout--header-with-artifact'
                    : ''
                }`}
              >
                {Header && headerProps && <Header {...headerProps} />}
              </div>
              {sessionId && hasUserActivatedSpeak && Chat && chatProps ? (
                <Chat {...chatProps} />
              ) : startPanelProps ? (
                <StartPanel {...startPanelProps} />
              ) : null}
            </div>
          </div>

          {poweredBy}
        </div>
      </Spin>
    </>
  );
};

export default ZoomedFullBodyLayout;
