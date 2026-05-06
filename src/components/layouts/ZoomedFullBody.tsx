import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Spin } from '@memori.ai/ui';
import { useTranslation } from 'react-i18next';
import {
  Expand,
  MapPin,
  Brain,
  Share2,
  EllipsisVertical,
  MessageCircle,
} from 'lucide-react';
import { LayoutProps } from '../MemoriWidget/MemoriWidget';
import { useArtifact } from '../MemoriArtifactSystem/context/ArtifactContext';
import { getResourceUrl } from '../../helpers/media';
import MobileSessionPanel from '../MobileSessionPanel/MobileSessionPanel';
import ShareButton from '../ShareButton/ShareButton';

function isFullscreenAllowedOnDevice(): boolean {
  if (typeof document === 'undefined') return false;
  if (document.fullscreenEnabled === true) return true;
  const fullscreenMeta = document.querySelector(
    'meta[name="memori-fullscreen-enabled"], meta[name="fullscreen-enabled"]'
  );
  return fullscreenMeta?.getAttribute('content') === 'true';
}

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
  const { t } = useTranslation();
  const { state } = useArtifact();
  const hasArtifact = state.currentArtifact;
  const useSideArtifactChrome =
    state.isDrawerOpen && !state.isChatLogPanelPresentation;
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mediaQuery.matches);
    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);
  const memori = headerProps?.memori;
  const tenant = headerProps?.tenant;
  const baseUrl = headerProps?.baseUrl;
  const loggedUser =
    headerProps?.loginToken && headerProps?.user ? headerProps.user : undefined;
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
      {
        key: 'fullscreen',
        icon: <Expand size={18} />,
        title: t('fullscreenEnter') || 'Full screen',
        subtitle: t('widget.expandToImmersive') || 'Expand to immersive view',
        onClick: () => {
          handleMobileFullscreen();
          setMobileSheetOpen(false);
        },
      },
      {
        key: 'share',
        icon: <Share2 size={18} />,
        title: t('widget.share') || 'Share chat',
        subtitle:
          t('widget.mobileSession.copyLinkOrDownload') ||
          'Copy link or download',
        view: 'share' as const,
      },
      {
        key: 'location',
        icon: <MapPin size={18} />,
        title:
          t('widget.mobileSession.locationTracking') || 'Location tracking',
        subtitle:
          headerProps.position?.placeName ||
          t('widget.mobileSession.currentlyOff') ||
          'Currently off',
        view: 'location' as const,
        trailing: (
          <span className="memori-mobile-session-panel--chevron">{'>'}</span>
        ),
      },
      {
        key: 'knownFacts',
        icon: <Brain size={18} />,
        title: t('knownFacts.title') || 'Known facts',
        subtitle:
          t('widget.mobileSession.whatIKnowAboutYou') ||
          'What I know about you',
        trailing: (
          <span className="memori-mobile-session-panel--chevron">{'>'}</span>
        ),
        view: 'knownFacts' as const,
        disabled: !isSessionStarted,
      },
    ];
  }, [headerProps, isMobile, isSessionStarted, t, handleMobileFullscreen]);
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

  return (
    <>
      {integrationStyle}
      {integrationBackground}

      <Spin className="memori-spin--zoomed-full-body" spinning={loading}>
        {Header && headerProps && mobileHeaderProps && (
          <div className="memori-fullpage-top-header">
            <div className="memori-chat-layout--header">
              <div className="memori-fullpage-header-row">
                {memori && (
                  <div className="memori-fullpage-header-brand">
                    {brandAvatarSrc ? (
                      <img
                        className="memori-fullpage-header-brand-icon memori-fullpage-header-brand-icon--avatar"
                        src={brandAvatarSrc}
                        alt=""
                        role="presentation"
                      />
                    ) : (
                      <span
                        className="memori-fullpage-header-brand-icon"
                        aria-hidden
                      />
                    )}
                    <span className="memori-fullpage-header-brand-name">
                      {memori.name}
                    </span>
                  </div>
                )}
                <div className="memori-fullpage-header-actions">
                  <Header
                    {...mobileHeaderProps}
                    layout="FULLPAGE"
                    buttonVariant="outline"
                    extraActions={
                      isMobile ? (
                        <Button
                          variant="outline"
                          className="memori-chat-layout--overflow-trigger"
                          aria-label={t('widget.moreActions') || 'More actions'}
                          icon={<EllipsisVertical />}
                          onClick={() => setMobileSheetOpen(true)}
                        />
                      ) : undefined
                    }
                  />
                </div>
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
            isLoggedIn={!!loggedUser}
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
            logoutLabel={t('login.logout') || 'Log out'}
            onLogout={() => {
              handleMobileLogout();
              setMobileSheetOpen(false);
            }}
          />
        )}
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
