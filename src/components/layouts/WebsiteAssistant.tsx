import React, { useState, useMemo } from 'react';
import { Spin } from '@memori.ai/ui';
import { LayoutProps } from '../MemoriWidget/MemoriWidget';
import { Button } from '@memori.ai/ui';
import Blob from '../Blob/Blob';
import { X } from 'lucide-react';
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
  sessionId,
  hasUserActivatedSpeak,
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
    <>
      {collapsed && (
        <div className="memori-website_assistant--trigger">
          <Button
            className="memori-website_assistant--trigger-button"
            variant="ghost"
            shape="circle"
            onClick={() => setCollapsed(false)}
            title={t('expand') || 'Expand'}
          >
            <Blob avatar={avatarProps?.memori.avatarURL} />
          </Button>
        </div>
      )}
      <div
        className={`memori-website_assistant--${
          collapsed ? 'collapsed' : 'expanded'
        }`}
      >
        {!collapsed && (
          <>
            {integrationStyle}

            <Spin
              spinning={loading}
              className="memori-website_assistant-layout"
            >
              {poweredBy}

              <div className="memori-website_assistant--close-button-wrapper">
                <Button
                  className="memori-website_assistant--close-button"
                  variant="primary"
                  onClick={() => setCollapsed(true)}
                  icon={<X />}
                  title={t('close') || 'Close'}
                />
              </div>

              {Header && headerProps && (
                              <Header
                    {...headerProps}
                    showSettings={false}
                    showReload={false}
                  />
              )}

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
    </>
  );
};

export default WebsiteAssistantLayout;
