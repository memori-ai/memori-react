import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Spin, Button } from '@memori.ai/ui';
import { LayoutProps } from '../../MemoriWidget/MemoriWidget';
import Blob from '../../Blob/Blob';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useArtifact } from '../../MemoriArtifactSystem/context/ArtifactContext';
import ArtifactDrawer from '../../MemoriArtifactSystem/components/ArtifactDrawer/ArtifactDrawer';
import { getResourceUrl } from '../../../helpers/media';

const PANEL_SELECTOR = '.memori-website_assistant--expanded';
const FULLSCREEN_CLASS = 'memori-website_assistant--fullscreen';

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
  avatar3dHidden = true,
}) => {
  const { t } = useTranslation();
  const { state: artifactState } = useArtifact();
  const useSideArtifactChrome =
    artifactState.isDrawerOpen && !artifactState.isChatLogPanelPresentation;
  const [collapsed, _setCollapsed] = useState(true);
  const [expandedKey, setExpandedKey] = useState<string>();
  const [fullScreen, setFullScreen] = useState(false);

  const originalPanelStyles = useRef({
    left: '',
    right: '',
    width: '',
    maxWidth: '',
    height: '',
    backgroundColor: '',
  });

  const stopAudio = useMemo(() => chatProps?.stopAudio, [chatProps?.stopAudio]);

  const memori = headerProps?.memori;
  const tenant = headerProps?.tenant;
  const baseUrl = headerProps?.baseUrl;
  const isSessionStarted = Boolean(sessionId && hasUserActivatedSpeak);

  const brandAvatarSrc = memori
    ? memori.avatarURL && memori.avatarURL.length > 0
      ? getResourceUrl({
          type: 'avatar',
          tenantID: tenant?.name,
          resourceURI: memori.avatarURL,
          baseURL: baseUrl,
          apiURL: '',
        })
      : getResourceUrl({
          type: 'avatar',
          tenantID: tenant?.name,
          baseURL: baseUrl,
          apiURL: '',
        })
    : undefined;

  const restoreFromFullscreen = () => {
    const panelElement = document.querySelector(PANEL_SELECTOR);
    if (panelElement) {
      const panel = panelElement as HTMLElement;
      panel.style.left = originalPanelStyles.current.left;
      panel.style.right = originalPanelStyles.current.right;
      panel.style.width = originalPanelStyles.current.width;
      panel.style.maxWidth = originalPanelStyles.current.maxWidth;
      panel.style.height = originalPanelStyles.current.height;
      panel.style.backgroundColor = originalPanelStyles.current.backgroundColor;
      panel.classList.remove(FULLSCREEN_CLASS);
    }
    setFullScreen(false);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && fullScreen) {
        restoreFromFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [fullScreen]);

  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      const panelElement = document.querySelector(PANEL_SELECTOR);
      if (panelElement) {
        const panel = panelElement as HTMLElement;

        originalPanelStyles.current = {
          left: panel.style.left,
          right: panel.style.right,
          width: panel.style.width,
          maxWidth: panel.style.maxWidth,
          height: panel.style.height,
          backgroundColor: panel.style.backgroundColor,
        };

        panel.style.left = '0';
        panel.style.right = '0';
        panel.style.width = '100%';
        panel.style.maxWidth = 'none';
        panel.style.height = '100%';
        panel.style.backgroundColor = '';
        panel.classList.add(FULLSCREEN_CLASS);

        panel.requestFullscreen().catch(err => {
          console.warn(
            '[WebsiteAssistantLayout] Error enabling fullscreen:',
            err
          );
        });
      }
      setFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => {
          console.warn(
            '[WebsiteAssistantLayout] Error exiting fullscreen:',
            err
          );
        });
      }
      restoreFromFullscreen();
    }
  };

  const setCollapsed = (nextCollapsed: boolean) => {
    if (nextCollapsed && fullScreen) {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => {
          console.warn(
            '[WebsiteAssistantLayout] Error exiting fullscreen:',
            err
          );
        });
      }
      restoreFromFullscreen();
    }
    _setCollapsed(nextCollapsed);
    setExpandedKey(nextCollapsed ? undefined : new Date().toISOString());
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
            aria-label={t('expand') || 'Expand'}
            aria-expanded={false}
            title={t('expand') || 'Expand'}
          >
            <Blob avatar={avatarProps?.memori.avatarURL} />
          </Button>
        </div>
      )}
      <div
        className={`memori-website_assistant--${
          collapsed ? 'collapsed' : 'expanded'
        }${
          useSideArtifactChrome
            ? ' memori-website_assistant--artifact-open'
            : ''
        }${fullScreen ? ` ${FULLSCREEN_CLASS}` : ''}`}
      >
        {!collapsed && (
          <>
            {integrationStyle}

            <Spin
              spinning={loading}
              className="memori-website_assistant-layout"
            >
              <div className="memori-website_assistant-layout--header-row">
                {memori && brandAvatarSrc && (
                  <div className="memori-chat-layout--brand">
                    <img
                      className="memori-chat-layout--brand-avatar"
                      src={brandAvatarSrc}
                      alt=""
                      role="presentation"
                    />
                    <div className="memori-chat-layout--brand-text">
                      {isSessionStarted && (
                        <span
                          className="memori-chat-layout--brand-name"
                          title={memori.name}
                        >
                          {memori.name}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                <div className="memori-website_assistant-layout--header-actions">
                  {Header && headerProps && (
                    <Header
                      buttonVariant="outline"
                      {...headerProps}
                      showSettings={false}
                      showReload={false}
                      showChatHistory={false}
                      fullScreenHandler={handleFullscreenToggle}
                    />
                  )}
                  <button
                    type="button"
                    className="memori-website_assistant--close-button"
                    onClick={() => setCollapsed(true)}
                    aria-label={t('collapse') || 'Close'}
                    title={t('collapse') || 'Close'}
                  >
                    <X className="memori-icon-close" aria-hidden />
                  </button>
                </div>
              </div>

              {!(avatar3dHidden === true || avatar3dHidden === 'true') && (
                <div className="memori-website_assistant-layout--avatar">
                  {Avatar && avatarProps && (
                    <Avatar
                      {...avatarProps}
                      integrationConfig={
                        avatarProps.integrationConfig
                          ? {
                              ...avatarProps.integrationConfig,
                              avatarURL: avatarProps.integrationConfig
                                ?.avatarURL
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
              )}

              <div id="extension" />

              <div className="memori-website_assistant-layout--controls">
                {sessionId && hasUserActivatedSpeak && Chat && chatProps ? (
                  <Chat {...chatProps} />
                ) : startPanelProps ? (
                  <StartPanel
                    {...startPanelProps}
                    showFullDescriptionOnMobile={true}
                    showChatHistory={false}
                  />
                ) : null}
              </div>
            </Spin>
          </>
        )}
      </div>

      {/* Artifact drawer — fixed overlay beside the website assistant panel */}
      {useSideArtifactChrome && <ArtifactDrawer />}
    </>
  );
};

export default WebsiteAssistantLayout;
