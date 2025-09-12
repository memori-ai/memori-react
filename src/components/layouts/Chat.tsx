import React, { useState, useEffect } from 'react';
import Spin from '../ui/Spin';
import { LayoutProps } from '../MemoriWidget/MemoriWidget';
import ArtifactDrawer from '../MemoriArtifactSystem/components/ArtifactDrawer/ArtifactDrawer';
import { useArtifact } from '../MemoriArtifactSystem/context/ArtifactContext';

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
  const { state } = useArtifact();


  return (
    <>
      {integrationStyle}
      {integrationBackground}

      <Spin spinning={loading} className="memori-chat-layout">
        {poweredBy}

        <div className={`memori-chat-layout--header ${
          state.isDrawerOpen ? 'memori-chat-layout--header-with-artifact' : ''
        }`}>
          {Header && headerProps && <Header {...headerProps} />}
        </div>

        <div id="extension" />

        <div
          className={`memori-chat-layout--main ${
            state.isDrawerOpen ? 'memori-chat-layout--main-with-artifact' : ''
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
        </div>

      </Spin>
    </>
  );
};

export default ChatLayout;
