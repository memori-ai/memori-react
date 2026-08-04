import React, { useState, useMemo } from 'react';
import { Spin, Button } from '@memori.ai/ui';
import { LayoutProps } from '../../MemoriWidget/MemoriWidget';
import Blob from '../../Blob/Blob';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useArtifact } from '../../MemoriArtifactSystem/context/ArtifactContext';
import ArtifactDrawer from '../../MemoriArtifactSystem/components/ArtifactDrawer/ArtifactDrawer';
import { getResourceUrl } from '../../../helpers/media';

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
  avatar3dHidden,
}) => {
  const { t } = useTranslation();
  const { state: artifactState } = useArtifact();
  const useSideArtifactChrome =
    artifactState.isDrawerOpen && !artifactState.isChatLogPanelPresentation;
  const [collapsed, _setCollapsed] = useState(true);
  const [expandedKey, setExpandedKey] = useState<string>();

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
        }`}
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
                  />
                ) : null}
              </div>
              {poweredBy}
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
