/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button, Spin } from '@memori.ai/ui';
import { LayoutProps } from '../MemoriWidget/MemoriWidget';
import { useTranslation } from 'react-i18next';
import { useArtifact } from '../MemoriArtifactSystem/context/ArtifactContext';
import {
  Brain,
  EllipsisVertical,
  HelpCircle,
  LogIn,
  LogOut,
  MapPin,
  MessageCircle,
  RefreshCw,
  Settings,
  Share2,
  Trash2,
  User,
  Users,
  Volume2,
  VolumeX,
  Maximize,
  X,
} from 'lucide-react';
import { getResourceUrl } from '../../helpers/media';
import ChatInputs from '../ChatInputs/ChatInputs';
import ShareButton from '../ShareButton/ShareButton';
import MobileSessionPanel from '../MobileSessionPanel/MobileSessionPanel';
import {
  maxDocumentsPerMessage,
  maxDocumentContentLength,
  pasteAsCardLineThreshold,
  pasteAsCardCharThreshold,
} from '../../helpers/constants';

const HiddenChatLayout: React.FC<LayoutProps> = ({
  Header,
  headerProps,
  Chat,
  chatProps,
  startPanelProps,
  sessionId,
  hasUserActivatedSpeak,
  autoStart,
  StartPanel,
  onSidebarToggle,
}) => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [hasTriggeredAutostart, setHasTriggeredAutostart] = useState(false);
  const [sessionPanelOpen, setSessionPanelOpen] = useState(false);

  const { state, closeArtifact } = useArtifact();

  const { onClickStart, hasInitialSession } = startPanelProps || {};
  const memori = headerProps?.memori;
  const tenant = headerProps?.tenant;
  const baseUrl = headerProps?.baseUrl;
  const hasSustainabilityData = useMemo(
    () =>
      !!headerProps?.history?.some(
        line =>
          !!(
            line as {
              llmUsage?: { energyImpact?: unknown };
            }
          ).llmUsage?.energyImpact
      ),
    [headerProps?.history]
  );
  const hiddenChatHeaderProps = useMemo(() => {
    if (!headerProps) return undefined;
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
  }, [headerProps]);

  const loggedUser =
    headerProps?.loginToken && headerProps?.user ? headerProps.user : undefined;
  const sharedUrl = useMemo(() => {
    if (!headerProps?.memori || !headerProps?.sessionID) return undefined;
    const currentLanguage = i18n.language === 'it' ? 'it' : 'en';
    if (headerProps.memori.ownerUserID) {
      return `${
        headerProps.baseUrl ?? 'https://www.aisuru.com'
      }/${currentLanguage}/shared/${headerProps.memori.ownerUserID}/${
        headerProps.memori.memoriID
      }/${headerProps.sessionID}`;
    }
    if (headerProps.memori.exposed) {
      return `${
        headerProps.baseUrl ?? 'https://www.aisuru.com'
      }/${currentLanguage}/shared/${headerProps.memori.ownerUserName}/${
        headerProps.memori.name
      }/${headerProps.sessionID}`;
    }
    return window.location.href;
  }, [headerProps, i18n.language]);
  const loggedUserDisplayName = useMemo(() => {
    if (!loggedUser) return '';
    const enrichedUser = loggedUser as typeof loggedUser & {
      name?: string;
      surname?: string;
      firstName?: string;
      lastName?: string;
    };
    const fullName =
      [enrichedUser.name, enrichedUser.surname]
        .filter(Boolean)
        .join(' ')
        .trim() ||
      [enrichedUser.firstName, enrichedUser.lastName]
        .filter(Boolean)
        .join(' ')
        .trim();
    return fullName || loggedUser.userName || loggedUser.eMail || '';
  }, [loggedUser]);
  const loggedUserInitial = useMemo(
    () => (loggedUserDisplayName || 'U').charAt(0).toUpperCase(),
    [loggedUserDisplayName]
  );
  const isSessionStarted = Boolean(sessionId && hasUserActivatedSpeak);

  const handleOverflowActionClick = (
    action:
      | 'reload'
      | 'clear'
      | 'chatHistory'
      | 'fullscreen'
      | 'deepThought'
      | 'experts'
      | 'audio'
      | 'settings'
      | 'share'
      | 'login'
  ) => {
    if (!headerProps) return;
    switch (action) {
      case 'reload':
        window.location.reload();
        break;
      case 'clear':
        headerProps.clearHistory();
        break;
      case 'chatHistory':
        headerProps.setShowChatHistoryDrawer(true);
        break;
      case 'fullscreen':
        handleFullscreenToggle();
        break;
      case 'deepThought':
        headerProps.setShowKnownFactsDrawer(true);
        break;
      case 'experts':
        headerProps.setShowExpertsDrawer(true);
        break;
      case 'audio':
        headerProps.setSpeakerMuted(!headerProps.speakerMuted);
        break;
      case 'settings':
        headerProps.setShowSettingsDrawer(true);
        break;
      case 'share': {
        const targetUrl = sharedUrl || window.location.href;
        if (navigator.share) {
          navigator
            .share({
              title: headerProps.memori?.name,
              url: targetUrl,
            })
            .catch(() => {
              // User dismissed share sheet or browser blocked it.
            });
          break;
        }
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(targetUrl).catch(() => {
            const opened = window.open(targetUrl, '_blank');
            if (!opened) window.location.assign(targetUrl);
          });
          break;
        }
        {
          const opened = window.open(targetUrl, '_blank');
          if (!opened) window.location.assign(targetUrl);
        }
        break;
      }
      case 'login':
        if (loggedUser && headerProps.onLogout) {
          headerProps.onLogout();
        } else {
          headerProps.setShowLoginDrawer(true);
        }
        break;
      default:
        break;
    }
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

  const sessionPanelActions = useMemo(
    () => [
      {
        key: 'fullscreen',
        icon: <Maximize size={18} />,
        title: t('fullscreenEnter') || 'Full screen',
        subtitle: t('widget.expandToImmersive') || 'Expand to immersive view',
        onClick: () => {
          handleFullscreenToggle();
          setSessionPanelOpen(false);
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
          headerProps?.position?.placeName ||
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
      ...(headerProps?.showReload
        ? [
            {
              key: 'reload',
              icon: <RefreshCw size={18} />,
              title: t('reload') || 'Reload',
              onClick: () => handleOverflowActionClick('reload'),
            },
          ]
        : []),
      ...(headerProps?.showClear
        ? [
            {
              key: 'clear',
              icon: <Trash2 size={18} />,
              title: t('clearHistory') || 'Clear chat',
              onClick: () => handleOverflowActionClick('clear'),
            },
          ]
        : []),
      // ...(headerProps?.showChatHistory
      //   ? [
      //       {
      //         key: 'chatHistory',
      //         icon: <MessageCircle size={18} />,
      //         title: t('write_and_speak.chatHistory') || 'Chat history',
      //         onClick: () => handleOverflowActionClick('chatHistory'),
      //       },
      //     ]
      //   : []),
      // ...(headerProps?.memori?.enableBoardOfExperts
      //   ? [
      //       {
      //         key: 'experts',
      //         icon: <Users size={18} />,
      //         title:
      //           t('widget.showExpertsInTheBoard') || 'Experts in this board',
      //         disabled: !isSessionStarted,
      //         onClick: () => handleOverflowActionClick('experts'),
      //       },
      //     ]
      //   : []),
      // ...(headerProps?.enableAudio
      //   ? [
      //       {
      //         key: 'audio',
      //         icon: headerProps?.speakerMuted ? (
      //           <VolumeX size={18} />
      //         ) : (
      //           <Volume2 size={18} />
      //         ),
      //         title: t('widget.sound') || 'Sound',
      //         onClick: () => handleOverflowActionClick('audio'),
      //       },
      //     ]
      //   : []),
    ],
    [t, headerProps, isSessionStarted]
  );

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

  // Use refs to store original sidebar properties to restore them later
  const originalSidebarStyles = useRef({
    right: '',
    width: '',
    backgroundColor: '',
  });

  useEffect(() => {
    // Add fullscreen change event listener to handle ESC key
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

  useEffect(() => {
    const mainDiv = document.body;
    const widgetEl = document.querySelector('.memori-widget');
    const sidebarWidth =
      (widgetEl &&
        getComputedStyle(widgetEl)
          .getPropertyValue('--memori-hidden-chat-width')
          ?.trim()) ||
      'min(450px, 100vw)';
    if (isOpen) {
      if (!fullScreen) {
        mainDiv.style.width = `calc(100% - ${sidebarWidth})`;
        mainDiv.style.marginRight = sidebarWidth;
        mainDiv.style.transition = 'all 0.5s';
      } else {
        mainDiv.style.width = '100%';
        mainDiv.style.marginLeft = '0';
      }
    } else {
      // Reset the body styles when sidebar is closed
      mainDiv.style.width = '100%';
      mainDiv.style.marginRight = '0';
      mainDiv.style.marginLeft = '0';
      closeArtifact();
    }
  }, [isOpen, fullScreen]);

  const handleSidebarToggle = () => {
    // Only trigger autostart when opening the sidebar for the first time
    // and when we haven't already triggered it
    if (
      !isOpen &&
      !hasTriggeredAutostart &&
      (autoStart || autoStart === undefined) &&
      (!sessionId || hasInitialSession)
    ) {
      setHasTriggeredAutostart(true);
      onClickStart?.();
    }

    // If we're in fullscreen mode and trying to close the sidebar
    if (fullScreen && isOpen) {
      // Exit fullscreen first
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => {
          console.warn('[HiddenChatLayout] Error exiting fullscreen:', err);
        });
      }
      // Restore sidebar styles
      restoreFromFullscreen();
    }

    const newState = !isOpen;
    setIsOpen(newState);

    // Notify parent component about sidebar state change
    if (onSidebarToggle) {
      onSidebarToggle(newState);
    }
  };

  const restoreFromFullscreen = () => {
    const sidebarElement = document.querySelector('.memori-sidebar');
    if (sidebarElement) {
      //restore closing button
      const closeButton = document.querySelector('.memori-close-label');
      if (closeButton) {
        (closeButton as HTMLElement).style.display = 'flex';
      }
      // Restore original styles
      const sidebar = sidebarElement as HTMLElement;
      sidebar.style.right = originalSidebarStyles.current.right;
      sidebar.style.width = originalSidebarStyles.current.width;
      sidebar.style.backgroundColor =
        originalSidebarStyles.current.backgroundColor;

      // Remove the fullscreen class
      sidebar.classList.remove('memori-sidebar-fullscreen');
    }
    setFullScreen(false);
  };

  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      // Enter fullscreen
      const sidebarElement = document.querySelector('.memori-sidebar');
      if (sidebarElement) {
        const sidebar = sidebarElement as HTMLElement;

        //hide closing button
        const closeButton = document.querySelector('.memori-close-label');
        if (closeButton) {
          (closeButton as HTMLElement).style.display = 'none';
        }

        // Store original styles before modifying
        originalSidebarStyles.current = {
          right: sidebar.style.right,
          width: sidebar.style.width,
          backgroundColor: sidebar.style.backgroundColor,
        };

        // Set styles for fullscreen
        sidebar.style.right = '0';
        sidebar.style.width = '100%';
        sidebar.style.backgroundColor = '#FFFFFF';

        // Request fullscreen
        sidebar.requestFullscreen().catch(err => {
          console.warn('[HiddenChatLayout] Error enabling fullscreen:', err);
        });
      }
      setFullScreen(true);
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => {
          console.warn('[HiddenChatLayout] Error exiting fullscreen:', err);
        });
      }
      restoreFromFullscreen();
    }
  };

  return (
    <>
      <input
        type="checkbox"
        id="memori-sidebar-toggle"
        className={`memori-sidebar-toggle ${
          state.isDrawerOpen ? 'memori-sidebar-toggle-artifact' : ''
        }`}
        checked={isOpen}
        onChange={handleSidebarToggle}
      />
      <div className="memori-sidebar-container">
        <label
          htmlFor="memori-sidebar-toggle"
          className="memori-sidebar-toggle-label memori-open-label"
        >
          <HelpCircle
            className="memori-icon"
            aria-label={t('expand') ?? undefined}
          />
        </label>

        <aside
          className={`memori-sidebar memori-chat-layout ${
            fullScreen ? 'memori-sidebar-fullscreen' : ''
          }`}
        >
          <label
            htmlFor="memori-sidebar-toggle"
            className="memori-sidebar-toggle-label memori-close-label"
          >
            <span>
              <X
                className="memori-icon-close"
                aria-label={t('collapse') ?? undefined}
              />
            </span>
          </label>
          <div className="memori-hidden-chat-layout--controls memori-chat-layout--controls">
            <div
              className={`memori-chat-layout--header ${
                state.isDrawerOpen
                  ? 'memori-chat-layout--header-with-artifact'
                  : ''
              }`}
            >
              {Header && headerProps && (
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
                  <div className="memori-hidden-chat-layout--header-actions">
                    {hiddenChatHeaderProps && (
                      <Header
                        position={{
                          latitude: 0,
                          longitude: 0,
                          placeName: '',
                        }}
                        {...hiddenChatHeaderProps}
                        buttonVariant="outline"
                        fullScreenHandler={handleFullscreenToggle}
                        extraActions={
                          <Button
                            variant="outline"
                            className="memori-hidden-chat-layout--overflow-trigger"
                            aria-label={
                              t('widget.moreActions') || 'More actions'
                            }
                            icon={<EllipsisVertical />}
                            onClick={() =>
                              setSessionPanelOpen(currentOpen => !currentOpen)
                            }
                          />
                        }
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="memori-chat-layout--body">
              {headerProps && (
                <MobileSessionPanel
                  open={sessionPanelOpen}
                  onClose={() => setSessionPanelOpen(false)}
                  presentation="popover"
                  title={t('widget.mobileSession.session') || 'Session'}
                  loginToken={headerProps.loginToken}
                  user={headerProps.user}
                  apiClient={headerProps.apiClient}
                  userName={loggedUserDisplayName || memori?.name || 'User'}
                  userEmail={loggedUser?.eMail}
                  userInitial={loggedUserInitial}
                  avatarURL={loggedUser?.avatarURL}
                  birthDate={loggedUser?.birthDate}
                  actions={sessionPanelActions}
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
                    t('widget.shareLocation') || 'Share location'
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
                    setSessionPanelOpen(false);
                  }}
                  onKnownFactsOpen={() => {
                    if (!isSessionStarted) return;
                    headerProps.setShowKnownFactsDrawer(true);
                    setSessionPanelOpen(false);
                  }}
                  onLocationEnable={handleEnableLocation}
                  onLocationDisable={handleDisableLocation}
                  logoutLabel={t('login.logout') || 'Log out'}
                  onLogout={() => {
                    handleOverflowActionClick('login');
                    setSessionPanelOpen(false);
                  }}
                />
              )}
              {sessionId && hasUserActivatedSpeak && Chat && chatProps ? (
                <Chat {...chatProps} />
              ) : !autoStart && startPanelProps ? (
                <div className="memori-chat-layout--start-shell">
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
              ) : (
                <div className="memori-loading">
                  <Spin spinning />
                </div>
              )}
              <div id="extension" />
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default HiddenChatLayout;
