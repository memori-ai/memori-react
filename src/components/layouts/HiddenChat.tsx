import React, { useState, useMemo } from 'react';
import Spin from '../ui/Spin';
import { LayoutProps } from '../MemoriWidget/MemoriWidget';
import Button from '../ui/Button';
import Blob from '../Blob/Blob';
import Close from '../icons/Close';
import { useTranslation } from 'react-i18next';
import './hidden-chat.css';

const HiddenChatLayout: React.FC<LayoutProps> = ({
  Header,
  headerProps,
  Chat,
  chatProps,
  startPanelProps,
  sessionId,
  hasUserActivatedSpeak,
}) => {
  const { t } = useTranslation();
  const [collapsed, _setCollapsed] = useState(true);
  const [expandedKey, setExpandedKey] = useState<string>();

  const stopAudio = useMemo(() => chatProps?.stopAudio, [chatProps?.stopAudio]);

  const setCollapsed = (collapsed: boolean) => {
    _setCollapsed(collapsed);
    setExpandedKey(collapsed ? undefined : new Date().toISOString());
    try {
      stopAudio?.();
    } catch (e) {
      console.log(e);
    }
  };

  const initChat = () => {
    try {
      window.speechSynthesis.speak(
        new SpeechSynthesisUtterance('') // This is needed to enable the speech synthesis on iOS
      );
    } catch (e) {
      console.error(e);
    }

    if (startPanelProps && startPanelProps?.initializeTTS)
      startPanelProps?.initializeTTS();
    if (startPanelProps && startPanelProps?.onClickStart)
      startPanelProps?.onClickStart();
  };

  return (
    <>
      <input type="checkbox" id="sidebar-toggle" className="sidebar-toggle" />
      <div className="sidebar-container">
        <label
          htmlFor="sidebar-toggle"
          className="sidebar-toggle-label open-label"
          onClick={() => initChat()}
        >
          <span>HELP</span>
        </label>
        <aside className="sidebar">
          <label
            htmlFor="sidebar-toggle"
            className="sidebar-toggle-label close-label"
          >
            <span>CLOSE</span>
          </label>
          <div className="sidebar-content">
            <div className="memori-totem-layout--header">
              {Header && headerProps && (
                <Header
                  position={{
                    latitude: 0,
                    longitude: 0,
                    placeName: '',
                  }}
                  {...headerProps}
                  className="memori-totem-layout-header--layout"
                />
              )}
            </div>
          </div>

          <div id="extension" />

          <div className="memori-totem-layout--controls">
            {sessionId && hasUserActivatedSpeak && Chat && chatProps ? (
              <Chat {...chatProps} />
            ) : (
              <div className="loading">
                <Spin />
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
};

export default HiddenChatLayout;
