import React, { useEffect, useMemo, useState } from 'react';
import { Button, Spin } from '@memori.ai/ui';
import { useTranslation } from 'react-i18next';
import { Expand, MapPin, Brain, Share2, EllipsisVertical } from 'lucide-react';
import { LayoutProps } from '../MemoriWidget/MemoriWidget';
import { useArtifact } from '../MemoriArtifactSystem/context/ArtifactContext';
import { getResourceUrl } from '../../helpers/media';
import ChatInputs from '../ChatInputs/ChatInputs';
import MobileSessionPanel from '../MobileSessionPanel/MobileSessionPanel';
import ShareButton from '../ShareButton/ShareButton';
import {
  maxDocumentsPerMessage,
  maxDocumentContentLength,
  pasteAsCardLineThreshold,
  pasteAsCardCharThreshold,
} from '../../helpers/constants';

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
  const { t } = useTranslation();
  const { state } = useArtifact();
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

  const handleMobileFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      return;
    }
    document.exitFullscreen().catch(() => {});
  };

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
    headerProps?.setVenue(undefined);
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
      showChatHistory: true,
      enableAudio: true,
    };
  }, [headerProps, isMobile]);

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

      <Spin spinning={loading} className="memori-chat-layout">
        {poweredBy}

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
            <div
              className={`memori-chat-layout--header ${
                state.isDrawerOpen
                  ? 'memori-chat-layout--header-with-artifact'
                  : ''
              }`}
            >
              {Header && headerProps && mobileHeaderProps && (
                <div className="memori-chat-layout--header-row">
                  {memori && brandAvatarSrc && (
                    <div className="memori-chat-layout--brand">
                      <img
                        className="memori-chat-layout--brand-avatar"
                        src={brandAvatarSrc}
                        alt=""
                        role="presentation"
                      />
                      <div className="memori-chat-layout--brand-text">
                        <span className="memori-chat-layout--brand-name">
                          {memori.name}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="memori-chat-layout--header-actions">
                    <Header
                      {...mobileHeaderProps}
                      buttonVariant="outline"
                      extraActions={
                        isMobile ? (
                          <Button
                            variant="outline"
                            className="memori-chat-layout--overflow-trigger"
                            aria-label={
                              t('widget.moreActions') || 'More actions'
                            }
                            icon={<EllipsisVertical />}
                            onClick={() => setMobileSheetOpen(true)}
                          />
                        ) : undefined
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="memori-chat-layout--body">
              {headerProps && (
                <MobileSessionPanel
                  open={mobileSheetOpen}
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
                  actions={[
                    {
                      key: 'fullscreen',
                      icon: <Expand size={18} />,
                      title: t('fullscreenEnter') || 'Full screen',
                      subtitle:
                        t('widget.expandToImmersive') ||
                        'Expand to immersive view',
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
                      view: 'share',
                    },
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
                      view: 'location',
                      trailing: (
                        <span className="memori-mobile-session-panel--chevron">
                          {'>'}
                        </span>
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
                        <span className="memori-mobile-session-panel--chevron">
                          {'>'}
                        </span>
                      ),
                      view: 'knownFacts',
                      disabled: !isSessionStarted,
                    },
                  ]}
                  knownFactsPageTitle={t('knownFacts.title') || 'Known facts'}
                  sharePageTitle={t('widget.share') || 'Share'}
                  locationPageTitle={
                    t('widget.mobileSession.locationTracking') ||
                    'Location tracking'
                  }
                  backLabel={t('back') || 'Back'}
                  locationStatusLabel={
                    t('widget.mobileSession.locationStatus') || 'Status'
                  }
                  locationPlace={headerProps.position?.placeName}
                  locationUnknownLabel={
                    t('write_and_speak.unknownPosition') || 'Unknown position'
                  }
                  locationEnableLabel={
                    t('widget.mobileSession.useCurrentPosition') ||
                    'Use current position'
                  }
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
              {sessionId && hasUserActivatedSpeak && Chat && chatProps ? (
                <Chat {...chatProps} />
              ) : startPanelProps ? (
                <div
                  className="memori-chat-layout--start-shell"
                  id="chat-wrapper"
                >
                  <div className="memori-chat-layout--start-panel-wrap">
                    <StartPanel {...startPanelProps} />
                  </div>
                  {Chat && chatProps && chatProps.showInputs !== false && (
                    <div className="memori-chat-layout--prechat-inputs">
                      <ChatInputs
                        userMessage={chatProps.userMessage}
                        onChangeUserMessage={chatProps.onChangeUserMessage}
                        dialogState={chatProps.dialogState}
                        instruct={chatProps.instruct}
                        authToken={chatProps.authToken}
                        sendMessage={chatProps.sendMessage}
                        isTyping={chatProps.memoriTyping}
                        microphoneMode={chatProps.microphoneMode}
                        sendOnEnter={chatProps.sendOnEnter}
                        setSendOnEnter={chatProps.setSendOnEnter}
                        client={chatProps.client}
                        sessionID={chatProps.sessionID}
                        showUpload={chatProps.showUpload}
                        attachmentsMenuOpen={chatProps.attachmentsMenuOpen}
                        setAttachmentsMenuOpen={
                          chatProps.setAttachmentsMenuOpen
                        }
                        onTextareaFocus={() => {
                          chatProps.stopListening?.();
                        }}
                        onTextareaBlur={() => {}}
                        onTextareaExpanded={() => {}}
                        startListening={chatProps.startListening}
                        stopListening={chatProps.stopListening}
                        stopAudio={chatProps.stopAudio}
                        listening={chatProps.listening}
                        isPlayingAudio={chatProps.isPlayingAudio}
                        showMicrophone={chatProps.showMicrophone}
                        memoriID={chatProps.memori?.memoriID}
                        maxTextareaCharacters={chatProps.maxTextareaCharacters}
                        maxDocumentsPerMessage={maxDocumentsPerMessage}
                        maxDocumentContentLength={maxDocumentContentLength}
                        pasteAsCardLineThreshold={pasteAsCardLineThreshold}
                        pasteAsCardCharThreshold={pasteAsCardCharThreshold}
                      />
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Spin>
    </>
  );
};

export default ChatLayout;
