import React, { useEffect, useCallback } from 'react';
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
  ChangeMode,
  changeModeProps,
  sessionId,
  hasUserActivatedSpeak,
  showInstruct = false,
  loading = false,
  poweredBy,
}) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const adjustChatInputs = useCallback(() => {
    const memoriChatInputs = document.getElementById('chat-fieldset');
    if (memoriChatInputs) {
      memoriChatInputs.style.bottom = '35px';
    }
  }, []);

  useEffect(() => {
    adjustChatInputs();
  }, [sessionId, adjustChatInputs]);

  return (
    <>
      {integrationStyle}
      {integrationBackground}

      <Spin className="memori-spin--zoomed-full-body" spinning={loading}>
        {showInstruct && ChangeMode && changeModeProps && <ChangeMode {...changeModeProps} />}

        {Header && headerProps && <Header {...headerProps} />}

        <div className="memori--grid">
          <div className="memori--grid-column memori--grid-column-left">
            {Avatar && avatarProps && (
              <Avatar chatProps={chatProps} isZoomed {...avatarProps} />
            )}

            <div id="extension" />
          </div>
          <div className="memori--grid-column memori--grid-column-right">
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
