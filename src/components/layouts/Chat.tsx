import React, { useEffect, useMemo, useState } from 'react';
import { Spin } from '@memori.ai/ui';
import IconButton from '../IconButton/IconButton';
import ArtifactDrawer from '../MemoriArtifactSystem/components/ArtifactDrawer/ArtifactDrawer';
import { useTranslation } from 'react-i18next';
import {
  MapPin,
  Share2,
  EllipsisVertical,
  MessageCircle,
} from 'lucide-react';
import { LayoutProps } from '../MemoriWidget/MemoriWidget';
import { useArtifact } from '../MemoriArtifactSystem/context/ArtifactContext';
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

  const globalBackground = chatProps?.globalBackground;

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
  }, [headerProps, isMobile, t]);

  return (
    <>
      {integrationStyle}
      {integrationBackground}

      <Spin spinning={loading} className="memori-chat-layout">
        <div id="extension" />

        {/* Header stays full-width above the content split — same pattern as FULLPAGE */}
        <div className="memori-chat-layout--header">
          {Header && headerProps && mobileHeaderProps && (
            <div className="memori-fullpage-header-row">
              <Header
                {...mobileHeaderProps}
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
          )}
        </div>

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

        {/* Content row: chat + artifact as full-height siblings (FULLPAGE pattern) */}
        <div
          className={`memori-chat-layout--main${
            globalBackground ? ' memori-chat-layout--main--has-background' : ''
          }`}
          style={
            globalBackground
              ? ({
                  ['--memori-chat-global-background' as string]: `url(${globalBackground})`,
                } as React.CSSProperties)
              : undefined
          }
        >
          <div
            className={
              state.isFullscreen
                ? `memori-chat-layout-controls-hide`
                : `memori-chat-layout--controls`
            }
          >
            <div className="memori-conversation-column">
              <div className="memori-chat-layout--body">
                {sessionId && hasUserActivatedSpeak && Chat && chatProps ? (
                  <Chat {...chatProps} showInputs={false} />
                ) : startPanelProps ? (
                  <div
                    className="memori-chat-layout--start-shell"
                    id="chat-wrapper"
                  >
                    <div className="memori-chat-layout--start-panel-wrap">
                      <StartPanel {...startPanelProps} />
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Input bar sits outside body so it spans the shared column below the scroll area */}
              {Chat && chatProps && chatProps.showInputs !== false && (
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
                  setAttachmentsMenuOpen={chatProps.setAttachmentsMenuOpen}
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
                  maxTotalMessagePayload={chatProps.maxTotalMessagePayload}
                  maxDocumentsPerMessage={maxDocumentsPerMessage}
                  maxDocumentContentLength={maxDocumentContentLength}
                  pasteAsCardLineThreshold={pasteAsCardLineThreshold}
                  pasteAsCardCharThreshold={pasteAsCardCharThreshold}
                  showAiGeneratedNote={isSessionStarted}
                  footerBrand={poweredBy}
                />
              )}
            </div>
          </div>

          {/* Artifact column — shrinks chat column only; outer layout stays put */}
          <div
            className={`memori--grid-column-artifact${
              useSideArtifactChrome ? ' memori--grid-column-artifact--open' : ''
            }`}
          >
            {useSideArtifactChrome && <ArtifactDrawer isLayoutColumn />}
          </div>
        </div>
      </Spin>
    </>
  );
};

export default ChatLayout;
