import React, { useState, useMemo } from 'react';
import Spin from '../ui/Spin';
import { LayoutProps } from '../MemoriWidget/MemoriWidget';
import Button from '../ui/Button';
import Blob from '../Blob/Blob';
import Close from '../icons/Close';
import { useTranslation } from 'react-i18next';

const WebsiteAssistantLayout: React.FC<LayoutProps> = ({
  Header,
  headerProps,
  Avatar,
  avatarProps,
  Chat,
  chatProps,
  StartPanel,
  startPanelProps,
  integrationStyle,
  ChangeMode,
  changeModeProps,
  sessionId,
  hasUserActivatedSpeak,
  showInstruct = false,
  loading = false,
  poweredBy,
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

  return (
    <div
      className={`memori-website_assistant--${
        collapsed ? 'collapsed' : 'expanded'
      }`}
    >
      {collapsed ? (
        <div className="memori-website_assistant--trigger">
          <Button
            className="memori-website_assistant--trigger-button"
            ghost
            shape="circle"
            onClick={() => setCollapsed(false)}
            title={t('expand') || 'Expand'}
          >
            <Blob avatar={avatarProps?.memori.avatarURL} />
          </Button>
        </div>
      ) : (
        <>
          {integrationStyle}

          <Spin spinning={loading} className="memori-website_assistant-layout">
            {poweredBy}

            <div className="memori-website_assistant--close-button-wrapper">
              <Button
                className="memori-website_assistant--close-button"
                primary
                shape="circle"
                onClick={() => setCollapsed(true)}
                icon={<Close />}
                title={t('close') || 'Close'}
              />
            </div>

            {showInstruct && ChangeMode && changeModeProps && (
              <ChangeMode {...changeModeProps} />
            )}

            <div className="memori-website_assistant-layout--header">
              {Header && headerProps && (
                <Header
                  {...headerProps}
                  showSettings={false}
                  showReload={false}
                />
              )}
            </div>

            <div className="memori-website_assistant-layout--avatar">
              {Avatar && avatarProps && (
                <Avatar
                  {...avatarProps}
                  integrationConfig={
                    avatarProps.integrationConfig
                      ? {
                          ...avatarProps.integrationConfig,
                          avatarURL: avatarProps.integrationConfig?.avatarURL
                            ? `${
                                avatarProps.integrationConfig?.avatarURL.split(
                                  '#'
                                )[0]
                              }#${expandedKey}`
                            : undefined,
                        }
                      : {}
                  }
                  key={expandedKey}
                />
              )}
            </div>

            <div id="extension" />

            <div className="memori-website_assistant-layout--controls">
              {sessionId && hasUserActivatedSpeak && Chat && chatProps ? (
                <Chat {...chatProps} />
              ) : startPanelProps ? (
                <StartPanel {...startPanelProps} />
              ) : null}
            </div>
          </Spin>
        </>
      )}
    </div>
  );
};

export default WebsiteAssistantLayout;
