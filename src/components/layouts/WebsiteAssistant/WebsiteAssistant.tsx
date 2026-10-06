import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Spin,
  Button,
  useAlertManager,
  createAlertOptions,
} from '@memori.ai/ui';
import { LayoutProps } from '../../MemoriWidget/MemoriWidget';
import Blob from '../../Blob/Blob';
import {
  X,
  EllipsisVertical,
  MapPin,
  Share2,
  Trash2,
  Users,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useArtifact } from '../../MemoriArtifactSystem/context/ArtifactContext';
import ArtifactDrawer from '../../MemoriArtifactSystem/components/ArtifactDrawer/ArtifactDrawer';
import { getResourceUrl } from '../../../helpers/media';
import IconButton from '../../IconButton/IconButton';
import MobileSessionPanel from '../../MobileSessionPanel/MobileSessionPanel';
import ShareButton from '../../ShareButton/ShareButton';
import {
  clearWidgetFullscreen,
  requestWidgetFullscreen,
} from '../../../helpers/fullscreen';

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
  show3dAvatar = false,
  sideDrawerOpen = false,
  onSidebarToggle,
}) => {
  const { t } = useTranslation();
  const { state: artifactState } = useArtifact();
  const useSideArtifactChrome =
    artifactState.isDrawerOpen && !artifactState.isChatLogPanelPresentation;
  const useSideDrawerChrome = useSideArtifactChrome || sideDrawerOpen;
  const [collapsed, _setCollapsed] = useState(true);
  const [expandedKey, setExpandedKey] = useState<string>();
  const [fullScreen, setFullScreen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

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

  const { add } = useAlertManager();
  const [sessionPanelOpen, setSessionPanelOpen] = useState(false);

  const loggedUser =
    headerProps?.loginToken && headerProps?.user?.userID
      ? headerProps.user
      : undefined;
  const loggedUserDisplayName =
    loggedUser?.userName || loggedUser?.eMail || memori?.name || 'User';
  const showKnownFacts =
    !!memori?.enableDeepThought &&
    !!headerProps?.loginToken &&
    !!headerProps?.user?.pAndCUAccepted;
  const positionRequested =
    !!memori?.needsPosition && !!headerProps?.positionPopoverOpen;

  const closeSessionPanel = () => {
    setSessionPanelOpen(false);
    if (headerProps?.positionPopoverOpen) {
      headerProps.setPositionPopoverOpen(false);
    }
  };

  // The header no longer mounts PositionPopover, so StartPanel position
  // requests are served by the session panel's location view.
  useEffect(() => {
    if (positionRequested) setSessionPanelOpen(true);
  }, [positionRequested]);

  const sessionActions = useMemo(() => {
    if (!headerProps) return [];
    return [
      ...(headerProps.showShare
        ? [
            {
              key: 'share',
              icon: <Share2 size={18} />,
              title: t('widget.share') || 'Share chat',
              subtitle:
                t('widget.mobileSession.copyLinkOrDownload') ||
                'Copy link or download',
              view: 'share' as const,
            },
          ]
        : []),
      ...(headerProps.memori?.needsPosition
        ? [
            {
              key: 'location',
              icon: <MapPin size={18} />,
              title:
                t('widget.mobileSession.locationTracking') ||
                'Location tracking',
              subtitle:
                headerProps.position?.placeName ||
                t('widget.mobileSession.currentlyOff') ||
                'Currently off',
              view: 'location' as const,
            },
          ]
        : []),
      ...(headerProps.memori?.enableBoardOfExperts
        ? [
            {
              key: 'experts',
              icon: <Users size={18} />,
              title:
                t('widget.showExpertsInTheBoard') || 'Experts in this board',
              disabled: !isSessionStarted,
              onClick: () => {
                headerProps.setShowExpertsDrawer(true);
                setSessionPanelOpen(false);
              },
            },
          ]
        : []),
      ...(headerProps.showClear
        ? [
            {
              key: 'clear',
              icon: <Trash2 size={18} />,
              title: t('clearHistory') || 'Clear chat',
              onClick: () => {
                headerProps.clearHistory();
                add(
                  createAlertOptions({
                    description: t('clearHistoryDone'),
                    severity: 'success',
                  })
                );
                setSessionPanelOpen(false);
              },
            },
          ]
        : []),
    ];
  }, [headerProps, isSessionStarted, t, add]);

  const showChatHistoryAction =
    !!headerProps?.showChatHistory && !!headerProps?.loginToken;

  const hasSessionPanelContent =
    sessionActions.length > 0 ||
    showChatHistoryAction ||
    !!headerProps?.showLogin ||
    (isSessionStarted &&
      (showKnownFacts || !!headerProps?.showMessageConsumption));

  const restoreFromFullscreen = () => {
    const panel = panelRef.current;
    if (panel) {
      panel.style.left = originalPanelStyles.current.left;
      panel.style.right = originalPanelStyles.current.right;
      panel.style.width = originalPanelStyles.current.width;
      panel.style.maxWidth = originalPanelStyles.current.maxWidth;
      panel.style.height = originalPanelStyles.current.height;
      panel.style.backgroundColor = originalPanelStyles.current.backgroundColor;
      panel.classList.remove(FULLSCREEN_CLASS);
      clearWidgetFullscreen(panel);
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
      const panel = panelRef.current;
      if (panel) {
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

        // Request fullscreen on the widget root, not on the panel: drawers
        // and modals portal into the root and would otherwise be hidden.
        requestWidgetFullscreen(panel, err => {
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
    if (nextCollapsed) closeSessionPanel();
    _setCollapsed(nextCollapsed);
    onSidebarToggle?.(!nextCollapsed);
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
        ref={panelRef}
        className={`memori-website_assistant--${
          collapsed ? 'collapsed' : 'expanded'
        }${
          useSideDrawerChrome
            ? ' memori-website_assistant--drawer-open memori-website_assistant--artifact-open'
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
                      {...headerProps}
                      buttonVariant="outline"
                      memori={{
                        ...headerProps.memori,
                        needsPosition: false,
                        enableDeepThought: false,
                        enableBoardOfExperts: false,
                      }}
                      showSettings={false}
                      showReload={false}
                      showChatHistory={false}
                      showShare={false}
                      showClear={false}
                      showLogin={false}
                      showMessageConsumption={false}
                      fullScreenHandler={handleFullscreenToggle}
                      extraActions={
                        hasSessionPanelContent ? (
                          <IconButton
                            className="memori-chat-layout--overflow-trigger"
                            active={sessionPanelOpen}
                            aria-label={
                              t('widget.moreActions') || 'More actions'
                            }
                            icon={<EllipsisVertical />}
                            onClick={() =>
                              sessionPanelOpen
                                ? closeSessionPanel()
                                : setSessionPanelOpen(true)
                            }
                          />
                        ) : undefined
                      }
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

              {show3dAvatar && (
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

            {headerProps && hasSessionPanelContent && (
              <MobileSessionPanel
                open={sessionPanelOpen}
                presentation="popover"
                onClose={closeSessionPanel}
                initialView={positionRequested ? 'location' : 'session'}
                autoStartGeolocation={
                  positionRequested && !!headerProps.autoStartPositionGeolocation
                }
                title={t('widget.mobileSession.session') || 'Session'}
                loginToken={headerProps.loginToken}
                user={headerProps.user}
                apiClient={headerProps.apiClient}
                userName={loggedUserDisplayName}
                userEmail={loggedUser?.eMail}
                userInitial={loggedUserDisplayName.charAt(0).toUpperCase()}
                avatarURL={loggedUser?.avatarURL}
                birthDate={loggedUser?.birthDate}
                actions={sessionActions}
                showChatHistory={showChatHistoryAction}
                onChatHistoryOpen={() => {
                  headerProps.setShowChatHistoryDrawer(true);
                  closeSessionPanel();
                }}
                knownFactsPageTitle={t('knownFacts.title') || 'Known facts'}
                sharePageTitle={t('widget.share') || 'Share'}
                locationPageTitle={
                  t('widget.mobileSession.locationTracking') ||
                  'Location tracking'
                }
                backLabel={t('back') || 'Back'}
                shareContent={
                  <ShareButton
                    tenant={headerProps.tenant}
                    memori={headerProps.memori}
                    sessionID={headerProps.sessionID}
                    title={headerProps.memori?.name}
                    baseUrl={headerProps.baseUrl}
                    align="left"
                    history={headerProps.history}
                    renderMode="inline"
                  />
                }
                knownFactsDisabled={!isSessionStarted}
                showSessionInfo={isSessionStarted}
                showKnownFacts={showKnownFacts}
                showMessageConsumption={!!headerProps.showMessageConsumption}
                history={headerProps.history ?? []}
                isLoggedIn={!!loggedUser}
                showLogin={!!headerProps.showLogin}
                loginLabel={t('login.login') || 'Log in'}
                onLogin={() => {
                  headerProps.setShowLoginDrawer(true);
                  closeSessionPanel();
                }}
                onKnownFactsOpen={() => {
                  if (!isSessionStarted) return;
                  headerProps.setShowKnownFactsDrawer(true);
                  closeSessionPanel();
                }}
                venue={headerProps.position}
                setVenue={headerProps.setVenue}
                logoutLabel={t('login.logout') || 'Log out'}
                onLogout={() => {
                  headerProps.onLogout?.();
                  closeSessionPanel();
                }}
              />
            )}
          </>
        )}
      </div>

      {/* Artifact drawer — fixed overlay beside the website assistant panel */}
      {useSideArtifactChrome && <ArtifactDrawer />}
    </>
  );
};

export default WebsiteAssistantLayout;
