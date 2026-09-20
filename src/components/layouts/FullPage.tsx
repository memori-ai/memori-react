import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Spin } from '@memori.ai/ui';
import IconButton from '../IconButton/IconButton';
import { useTranslation } from 'react-i18next';
import {
  Expand,
  MapPin,
  Share2,
  EllipsisVertical,
  MessageCircle,
} from 'lucide-react';
import { LayoutProps } from '../MemoriWidget/MemoriWidget';
import { useArtifact } from '../MemoriArtifactSystem/context/ArtifactContext';
import ArtifactDrawer from '../MemoriArtifactSystem/components/ArtifactDrawer/ArtifactDrawer';
import MobileSessionPanel from '../MobileSessionPanel/MobileSessionPanel';
import ShareButton from '../ShareButton/ShareButton';
import {
  ARTIFACT_COLUMN_DEFAULT_WIDTH,
  ARTIFACT_OVERLAY_BREAKPOINT,
  clampArtifactColumnWidth,
} from '../../helpers/artifactPanel';

function isFullscreenAllowedOnDevice(): boolean {
  if (typeof document === 'undefined') return false;
  if (document.fullscreenEnabled === true) return true;
  const fullscreenMeta = document.querySelector(
    'meta[name="memori-fullscreen-enabled"], meta[name="fullscreen-enabled"]'
  );
  return fullscreenMeta?.getAttribute('content') === 'true';
}

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
  const { t } = useTranslation();
  const { state } = useArtifact();
  const hasArtifact = state.currentArtifact;
  const useSideArtifactChrome =
    state.isDrawerOpen && !state.isChatLogPanelPresentation;
  const [isMobile, setIsMobile] = useState(false);
  const [isArtifactOverlay, setIsArtifactOverlay] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [artifactColumnWidth, setArtifactColumnWidth] = useState(
    ARTIFACT_COLUMN_DEFAULT_WIDTH
  );
  const [isResizingArtifact, setIsResizingArtifact] = useState(false);
  const contentRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const overlayQuery = window.matchMedia(
      `(max-width: ${ARTIFACT_OVERLAY_BREAKPOINT - 1}px)`
    );
    const update = () => {
      setIsMobile(mediaQuery.matches);
      setIsArtifactOverlay(overlayQuery.matches);
    };
    update();
    mediaQuery.addEventListener('change', update);
    overlayQuery.addEventListener('change', update);
    return () => {
      mediaQuery.removeEventListener('change', update);
      overlayQuery.removeEventListener('change', update);
    };
  }, []);
  const memori = headerProps?.memori;
  const tenant = headerProps?.tenant;
  const baseUrl = headerProps?.baseUrl;
  const loggedUser =
    headerProps?.loginToken && headerProps?.user?.userID
      ? headerProps.user
      : undefined;
  const enrichedUser = loggedUser as
    | (typeof loggedUser & {
        name?: string;
        surname?: string;
      })
    | undefined;
  const loggedUserDisplayName =
    [enrichedUser?.name, enrichedUser?.surname]
      .filter(Boolean)
      .join(' ')
      .trim() ||
    loggedUser?.userName ||
    loggedUser?.eMail ||
    memori?.name ||
    'User';
  const loggedUserInitial = loggedUserDisplayName.charAt(0).toUpperCase();
  const isSessionStarted = Boolean(sessionId && hasUserActivatedSpeak);

  // Agent status indicator above the avatar, bound to the real conversation state.
  const agentStatus = useMemo(() => {
    if (chatProps?.isPlayingAudio) {
      return {
        key: 'speaking' as const,
        label: t('widget.agentStatusSpeaking', {
          defaultValue: 'sta parlando',
        }),
      };
    }
    if (chatProps?.memoriTyping) {
      return {
        key: 'processing' as const,
        label: t('widget.agentStatusProcessing', {
          defaultValue: 'in elaborazione',
        }),
      };
    }
    if (chatProps?.listening) {
      return {
        key: 'listening' as const,
        label: t('widget.agentStatusListening', {
          defaultValue: 'in ascolto',
        }),
      };
    }
    return null;
  }, [
    chatProps?.isPlayingAudio,
    chatProps?.memoriTyping,
    chatProps?.listening,
    t,
  ]);

  const handleMobileFullscreen = useCallback(() => {
    if (!isFullscreenAllowedOnDevice()) return;

    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      return;
    }
    document.exitFullscreen().catch(() => {});
  }, []);

  const handleMobileLogout = () => {
    if (!headerProps) return;
    if (loggedUser && headerProps.onLogout) {
      headerProps.onLogout();
      return;
    }
    headerProps.setShowLoginDrawer(true);
  };

  const handleEnableLocation = () => {
    if (!headerProps) return;
    if (!navigator.geolocation) {
      headerProps.setPositionPopoverOpen(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        headerProps.setVenue({
          latitude,
          longitude,
          placeName: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
          uncertainty: position.coords.accuracy / 1000,
        });
      },
      () => {
        headerProps.setPositionPopoverOpen(true);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const handleDisableLocation = () => {
    headerProps?.setVenue({
      latitude: 0,
      longitude: 0,
      placeName: '',
      uncertainty: 0,
    });
  };

  const clampToContentRow = useCallback(
    (requestedWidth: number) => {
      const containerWidth =
        contentRowRef.current?.getBoundingClientRect().width ||
        window.innerWidth;
      return clampArtifactColumnWidth(
        requestedWidth,
        containerWidth,
        isArtifactOverlay
      );
    },
    [isArtifactOverlay]
  );

  useEffect(() => {
    if (!useSideArtifactChrome) return;
    setArtifactColumnWidth(current => clampToContentRow(current));
  }, [useSideArtifactChrome, isArtifactOverlay, clampToContentRow]);

  const handleArtifactResizeStart = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      const handle = event.currentTarget;
      handle.setPointerCapture(event.pointerId);
      setIsResizingArtifact(true);
    },
    []
  );

  const handleArtifactResizeMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isResizingArtifact) return;
      const row = contentRowRef.current;
      if (!row) return;
      const nextWidth = row.getBoundingClientRect().right - event.clientX;
      setArtifactColumnWidth(clampToContentRow(nextWidth));
    },
    [clampToContentRow, isResizingArtifact]
  );

  const handleArtifactResizeEnd = useCallback(() => {
    setIsResizingArtifact(false);
  }, []);

  const handleArtifactResizeKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const step = event.shiftKey ? 40 : 16;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setArtifactColumnWidth(current => clampToContentRow(current + step));
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        setArtifactColumnWidth(current => clampToContentRow(current - step));
      } else if (event.key === 'Home') {
        event.preventDefault();
        setArtifactColumnWidth(current => clampToContentRow(current + 200));
      } else if (event.key === 'End') {
        event.preventDefault();
        setArtifactColumnWidth(current => clampToContentRow(current - 200));
      }
    },
    [clampToContentRow]
  );

  const mobileHeaderProps = useMemo(() => {
    if (!headerProps) return undefined;
    if (!isMobile) return headerProps;
    return {
      ...headerProps,
      showReload: false,
      showClear: false,
      showSettings: false,
      showShare: false,
      showLogin: false,
      showMessageConsumption: false,
      showFullscreen: false,
      memori: {
        ...headerProps.memori,
        needsPosition: false,
        enableDeepThought: false,
      },
      showChatHistory: false,
      enableAudio: true,
    };
  }, [headerProps, isMobile]);

  const mobileSessionActions = useMemo(() => {
    if (!headerProps) return [];
    const showChatHistoryInPanel =
      isMobile &&
      !!headerProps.loginToken &&
      headerProps.showChatHistory !== false;
    const showFullscreenInPanel =
      !isMobile && headerProps.showFullscreen !== false;
    const showShareInPanel = headerProps.showShare !== false;
    const showLocationInPanel = !!headerProps.memori?.needsPosition;
    const historyBlock = showChatHistoryInPanel
      ? [
          {
            key: 'chatHistory',
            icon: <MessageCircle size={18} />,
            title:
              t('widget.headerHistory') ||
              t('write_and_speak.chatHistory') ||
              'Chat history',
            onClick: () => {
              headerProps.setShowChatHistoryDrawer(true);
              setMobileSheetOpen(false);
            },
          },
        ]
      : [];
    return [
      ...historyBlock,
      ...(showFullscreenInPanel
        ? [
            {
              key: 'fullscreen',
              icon: <Expand size={18} />,
              title: t('fullscreenEnter') || 'Full screen',
              subtitle:
                t('widget.expandToImmersive') || 'Expand to immersive view',
              onClick: () => {
                handleMobileFullscreen();
                setMobileSheetOpen(false);
              },
            },
          ]
        : []),
      ...(showShareInPanel
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
      ...(showLocationInPanel
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
              trailing: (
                <span className="memori-mobile-session-panel--chevron">
                  {'>'}
                </span>
              ),
            },
          ]
        : []),
    ];
  }, [headerProps, isMobile, isSessionStarted, t, handleMobileFullscreen]);
  return (
    <>
      {integrationStyle}
      {integrationBackground}

      <Spin spinning={loading}>
        {Header && headerProps && mobileHeaderProps && (
          <div className="memori-fullpage-top-header">
            <div className="memori-chat-layout--header">
              <div className="memori-fullpage-header-row">
                <Header
                  {...mobileHeaderProps}
                  layout="FULLPAGE"
                  buttonVariant="outline"
                  extraActions={
                    isMobile ? (
                      <IconButton
                        className="memori-chat-layout--overflow-trigger"
                        active={mobileSheetOpen}
                        aria-label={t('widget.moreActions') || 'More actions'}
                        icon={<EllipsisVertical />}
                        onClick={() =>
                          setMobileSheetOpen(currentOpen => !currentOpen)
                        }
                      />
                    ) : undefined
                  }
                />
              </div>
            </div>
          </div>
        )}
        {headerProps && (
          <MobileSessionPanel
            open={mobileSheetOpen}
            presentation="popover"
            onClose={() => setMobileSheetOpen(false)}
            title={t('widget.mobileSession.session') || 'Session'}
            loginToken={headerProps.loginToken}
            user={headerProps.user}
            apiClient={headerProps.apiClient}
            userName={loggedUserDisplayName}
            userEmail={loggedUser?.eMail}
            userInitial={loggedUserInitial}
            avatarURL={loggedUser?.avatarURL}
            birthDate={loggedUser?.birthDate}
            actions={mobileSessionActions}
            knownFactsPageTitle={t('knownFacts.title') || 'Known facts'}
            sharePageTitle={t('widget.share') || 'Share'}
            locationPageTitle={
              t('widget.mobileSession.locationTracking') || 'Location tracking'
            }
            backLabel={t('back') || 'Back'}
            locationStatusLabel={
              t('widget.mobileSession.locationStatus') || 'Status'
            }
            locationPlace={headerProps.position?.placeName}
            locationUnknownLabel={
              t('write_and_speak.unknownPosition') || 'Unknown position'
            }
            locationEnableLabel={t('widget.shareLocation') || 'Share location'}
            locationDisableLabel={
              t('widget.mobileSession.disableLocationSharing') ||
              'Disable location sharing'
            }
            knownFactsDescription={
              t('knownFacts.description', {
                memoriName: memori?.name || '',
              }) || ''
            }
            knownFactsCtaLabel={
              t('widget.mobileSession.openKnownFacts') ||
              'Open full known facts'
            }
            knownFactsCountLabel={
              (t('widget.mobileSession.knownFactsMessages', {
                count: headerProps.history?.length || 0,
              }) as string) || ''
            }
            shareContent={
              <ShareButton
                tenant={headerProps?.tenant}
                memori={headerProps?.memori}
                sessionID={headerProps?.sessionID}
                title={headerProps?.memori?.name}
                baseUrl={headerProps?.baseUrl}
                align="left"
                history={headerProps?.history}
                renderMode="inline"
              />
            }
            knownFactsDisabled={!isSessionStarted}
            showSessionInfo={isSessionStarted}
            showKnownFacts={
              !!headerProps.memori?.enableDeepThought &&
              !!headerProps.loginToken &&
              !!headerProps.user?.pAndCUAccepted
            }
            showMessageConsumption={!!headerProps.showMessageConsumption}
            history={headerProps.history ?? []}
            isLoggedIn={!!loggedUser}
            showLogin={!!headerProps.showLogin}
            loginLabel={t('login.login') || 'Log in'}
            onLogin={() => {
              headerProps.setShowLoginDrawer(true);
              setMobileSheetOpen(false);
            }}
            onKnownFactsOpen={() => {
              if (!isSessionStarted) return;
              headerProps.setShowKnownFactsDrawer(true);
              setMobileSheetOpen(false);
            }}
            onLocationEnable={handleEnableLocation}
            onLocationDisable={handleDisableLocation}
            venue={headerProps.position}
            setVenue={headerProps.setVenue}
            logoutLabel={t('login.logout') || 'Log out'}
            onLogout={() => {
              handleMobileLogout();
              setMobileSheetOpen(false);
            }}
          />
        )}

        {/* Content row: grid (avatar+chat) + artifact column as full-height siblings */}
        <div
          ref={contentRowRef}
          className={`memori-fullpage-content-row${
            useSideArtifactChrome && isArtifactOverlay
              ? ' memori-fullpage-content-row--artifact-overlay'
              : ''
          }${
            isResizingArtifact ? ' memori-fullpage-content-row--resizing' : ''
          }`}
          style={
            useSideArtifactChrome
              ? ({
                  ['--memori-artifact-column-width' as string]: `${artifactColumnWidth}px`,
                } as React.CSSProperties)
              : undefined
          }
        >
          <div className="memori--grid">
            {/* Avatar column — hidden when artifact is open so chat stays on the left */}
            <div
              className="memori--grid-column memori--grid-column-left"
              hidden={useSideArtifactChrome}
            >
              {isSessionStarted && agentStatus && (
                <div
                  className="memori-fullpage-agent-status"
                  role="status"
                  aria-live="polite"
                >
                  <span
                    className={`memori-fullpage-agent-status--dot memori-fullpage-agent-status--dot-${agentStatus.key}`}
                    aria-hidden="true"
                  />
                  <span className="memori-fullpage-agent-status--label">
                    {agentStatus.label}
                  </span>
                </div>
              )}

              {Avatar && avatarProps && (
                <Avatar chatProps={chatProps} {...avatarProps} />
              )}

              <div id="extension" />
            </div>

            {/* Chat column — flex:1, shrinks naturally when artifact column grows */}
            <div className="memori-chat-layout--main">
              <div
                className={
                  state.isFullscreen
                    ? `memori-chat-layout-controls-hide`
                    : `memori-chat-layout--controls`
                }
              >
                {sessionId && hasUserActivatedSpeak && Chat && chatProps ? (
                  <Chat
                    {...chatProps}
                    footerBrand={poweredBy}
                    showAiGeneratedNote
                  />
                ) : startPanelProps ? (
                  <div className="memori-conversation-column">
                    <StartPanel
                      {...startPanelProps}
                      footerBrand={poweredBy}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Artifact column — outside the padded grid, spans full content height */}
          <div
            className={`memori--grid-column-artifact${
              useSideArtifactChrome ? ' memori--grid-column-artifact--open' : ''
            }`}
          >
            {useSideArtifactChrome && (
              <>
                {!isMobile && (
                  <div
                    className="memori-artifact-resize-handle"
                    role="separator"
                    aria-orientation="vertical"
                    aria-label={
                      t('artifact.resizeHandle') || 'Resize artifact panel'
                    }
                    aria-valuemin={360}
                    aria-valuemax={
                      Math.round(
                        contentRowRef.current?.getBoundingClientRect().width ||
                          0
                      ) || undefined
                    }
                    aria-valuenow={Math.round(artifactColumnWidth)}
                    tabIndex={0}
                    onPointerDown={handleArtifactResizeStart}
                    onPointerMove={handleArtifactResizeMove}
                    onPointerUp={handleArtifactResizeEnd}
                    onPointerCancel={handleArtifactResizeEnd}
                    onKeyDown={handleArtifactResizeKeyDown}
                  />
                )}
                <ArtifactDrawer isLayoutColumn />
              </>
            )}
          </div>
        </div>
      </Spin>
    </>
  );
};

export default FullPageLayout;
