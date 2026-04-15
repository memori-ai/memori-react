/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button, Dropdown, Spin } from '@memori.ai/ui';
import { LayoutProps } from '../MemoriWidget/MemoriWidget';
import { useTranslation } from 'react-i18next';
import { useArtifact } from '../MemoriArtifactSystem/context/ArtifactContext';
import {
  Brain,
  Camera,
  EllipsisVertical,
  HelpCircle,
  LogIn,
  LogOut,
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
import type { Props as HeaderComponentProps } from '../Header/Header';
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
  type HeaderActionKey =
    | 'position'
    | 'reload'
    | 'clear'
    | 'chatHistory'
    | 'consumption'
    | 'fullscreen'
    | 'deepThought'
    | 'experts'
    | 'audio'
    | 'settings'
    | 'share'
    | 'login';

  const { primaryHeaderProps, overflowActionKeys, hasOverflowActions } =
    useMemo<{
      primaryHeaderProps?: HeaderComponentProps;
      overflowActionKeys: HeaderActionKey[];
      hasOverflowActions: boolean;
    }>(() => {
      if (!headerProps) {
        return {
          primaryHeaderProps: undefined,
          overflowActionKeys: [],
          hasOverflowActions: false,
        };
      }

    const actionVisibility: Array<{ key: HeaderActionKey; visible: boolean }> = [
      { key: 'position', visible: !!headerProps.memori?.needsPosition },
      { key: 'reload', visible: !!headerProps.showReload },
      { key: 'clear', visible: !!headerProps.showClear },
      {
        key: 'chatHistory',
        visible: (headerProps.showChatHistory ?? true) && !!headerProps.loginToken,
      },
      {
        key: 'consumption',
        visible: !!headerProps.showMessageConsumption && hasSustainabilityData,
      },
      { key: 'fullscreen', visible: true },
      {
        key: 'deepThought',
        visible:
          !!headerProps.memori?.enableDeepThought &&
          !!headerProps.loginToken &&
          !!headerProps.user?.pAndCUAccepted,
      },
      {
        key: 'experts',
        visible: !!headerProps.memori?.enableBoardOfExperts,
      },
      { key: 'audio', visible: headerProps.enableAudio ?? true },
      // HiddenChat-specific requirement: never show Settings in header actions.
      { key: 'settings', visible: false },
      { key: 'share', visible: headerProps.showShare ?? true },
      { key: 'login', visible: headerProps.showLogin ?? true },
    ];

    const visibleActions = actionVisibility.filter(action => action.visible);
    const visibleActionKeys = visibleActions.map(action => action.key);
    const knownFactsVisible = visibleActionKeys.includes('deepThought');
    const loginVisible = visibleActionKeys.includes('login');
    const shareEnabled = headerProps.showShare ?? true;
    const totalActionCount = visibleActionKeys.length;
    const hasOverflow = totalActionCount > 5;
    const maxVisibleButtons = hasOverflow ? 4 : 5;
    const primaryActionKeys: HeaderActionKey[] = hasOverflow
      ? visibleActionKeys.slice(0, maxVisibleButtons)
      : visibleActionKeys;
    let normalizedPrimaryActionKeys: HeaderActionKey[] =
      hasOverflow &&
      visibleActionKeys.includes('audio') &&
      !primaryActionKeys.includes('audio')
        ? [...primaryActionKeys.slice(0, maxVisibleButtons - 1), 'audio' as HeaderActionKey]
        : primaryActionKeys;
    if (hasOverflow && normalizedPrimaryActionKeys.includes('share')) {
      const replacementAction = visibleActionKeys.find(
        action =>
          action !== 'share' && !normalizedPrimaryActionKeys.includes(action)
      );
      normalizedPrimaryActionKeys = replacementAction
        ? normalizedPrimaryActionKeys.map(action =>
            action === 'share' ? replacementAction : action
          )
        : normalizedPrimaryActionKeys.filter(action => action !== 'share');
    }
    if (hasOverflow && normalizedPrimaryActionKeys.includes('deepThought')) {
      const replacementAction = visibleActionKeys.find(
        action =>
          action !== 'deepThought' && !normalizedPrimaryActionKeys.includes(action)
      );
      normalizedPrimaryActionKeys = replacementAction
        ? normalizedPrimaryActionKeys.map(action =>
            action === 'deepThought' ? replacementAction : action
          )
        : normalizedPrimaryActionKeys.filter(action => action !== 'deepThought');
    }
    if (hasOverflow && normalizedPrimaryActionKeys.includes('login')) {
      const replacementAction = visibleActionKeys.find(
        action =>
          action !== 'login' && !normalizedPrimaryActionKeys.includes(action)
      );
      normalizedPrimaryActionKeys = replacementAction
        ? normalizedPrimaryActionKeys.map(action =>
            action === 'login' ? replacementAction : action
          )
        : normalizedPrimaryActionKeys.filter(action => action !== 'login');
    }
    const overflowActionKeys: HeaderActionKey[] = (hasOverflow
      ? [
          ...visibleActionKeys.slice(5),
          ...(shareEnabled ? (['share'] as HeaderActionKey[]) : []),
          ...(knownFactsVisible ? (['deepThought'] as HeaderActionKey[]) : []),
          ...(loginVisible ? (['login'] as HeaderActionKey[]) : []),
        ]
      : []
    ).filter(
      action =>
        action === 'share' ||
        action === 'deepThought' ||
        action === 'login' ||
        !normalizedPrimaryActionKeys.includes(action)
    );
    const dedupedOverflowActionKeys = Array.from(
      new Set(overflowActionKeys)
    ) as HeaderActionKey[];
    const orderedOverflowActionKeys: HeaderActionKey[] = [
      ...dedupedOverflowActionKeys.filter(action => action !== 'login'),
      ...dedupedOverflowActionKeys.filter(action => action === 'login'),
    ];

    const mapHeaderPropsFromActions = (
      actions: HeaderActionKey[]
    ): HeaderComponentProps => {
      const actionSet = new Set(actions);
      return {
        ...headerProps,
        memori: {
          ...headerProps.memori,
          needsPosition: actionSet.has('position') && !!headerProps.memori?.needsPosition,
          enableDeepThought:
            actionSet.has('deepThought') && !!headerProps.memori?.enableDeepThought,
          enableBoardOfExperts:
            actionSet.has('experts') && !!headerProps.memori?.enableBoardOfExperts,
        },
        showReload: actionSet.has('reload') && !!headerProps.showReload,
        showClear: actionSet.has('clear') && !!headerProps.showClear,
        showChatHistory:
          actionSet.has('chatHistory') && (headerProps.showChatHistory ?? true),
        showMessageConsumption:
          actionSet.has('consumption') && !!headerProps.showMessageConsumption,
        showFullscreen: actionSet.has('fullscreen'),
        enableAudio: actionSet.has('audio') && (headerProps.enableAudio ?? true),
        showSettings: actionSet.has('settings') && (headerProps.showSettings ?? true),
        showShare: actionSet.has('share') && (headerProps.showShare ?? true),
        showLogin: actionSet.has('login') && (headerProps.showLogin ?? true),
      };
    };

      return {
        primaryHeaderProps: mapHeaderPropsFromActions(normalizedPrimaryActionKeys),
        overflowActionKeys: orderedOverflowActionKeys,
        hasOverflowActions: orderedOverflowActionKeys.length > 0,
      };
    }, [headerProps, hasSustainabilityData]);

  const loggedUser = headerProps?.loginToken && headerProps?.user ? headerProps.user : undefined;
  const sharedUrl = useMemo(() => {
    if (!headerProps?.memori || !headerProps?.sessionID) return undefined;
    const currentLanguage = i18n.language === 'it' ? 'it' : 'en';
    if (headerProps.memori.ownerUserID) {
      return `${headerProps.baseUrl ?? 'https://www.aisuru.com'}/${currentLanguage}/shared/${
        headerProps.memori.ownerUserID
      }/${headerProps.memori.memoriID}/${headerProps.sessionID}`;
    }
    if (headerProps.memori.exposed) {
      return `${headerProps.baseUrl ?? 'https://www.aisuru.com'}/${currentLanguage}/shared/${
        headerProps.memori.ownerUserName
      }/${headerProps.memori.name}/${headerProps.sessionID}`;
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

  const handleOverflowActionClick = (action: HeaderActionKey) => {
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
          navigator.clipboard
            .writeText(targetUrl)
            .catch(() => {
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

  const overflowItems: Array<{
    key: HeaderActionKey;
    label: string;
    icon: React.ReactNode;
    disabled?: boolean;
  }> = useMemo(
    () =>
      overflowActionKeys.map(action => {
        if (action === 'reload')
          return {
            key: action,
            label: t('reload') || 'Reload',
            icon: <RefreshCw />,
          };
        if (action === 'clear')
          return {
            key: action,
            label: t('clearHistory') || 'Clear chat',
            icon: <Trash2 />,
          };
        if (action === 'chatHistory')
          return {
            key: action,
            label: t('write_and_speak.chatHistory') || 'Chat history',
            icon: <MessageCircle />,
          };
        if (action === 'fullscreen')
          return {
            key: action,
            label: t('fullscreenEnter') || 'Fullscreen',
            icon: <Maximize />,
          };
        if (action === 'deepThought')
          return {
            key: action,
            label: t('knownFacts.title') || 'Known facts',
            icon: <Brain />,
            disabled: !headerProps?.hasUserActivatedSpeak || !headerProps?.sessionID,
          };
        if (action === 'experts')
          return {
            key: action,
            label: t('widget.showExpertsInTheBoard') || 'Experts in this board',
            icon: <Users />,
            disabled: !headerProps?.hasUserActivatedSpeak || !headerProps?.sessionID,
          };
        if (action === 'audio')
          return {
            key: action,
            label: t('widget.sound') || 'Sound',
            icon: headerProps?.speakerMuted ? <VolumeX /> : <Volume2 />,
          };
        if (action === 'settings')
          return {
            key: action,
            label: t('widget.settings') || 'Settings',
            icon: <Settings />,
          };
        if (action === 'share')
          return {
            key: action,
            label: t('widget.share') || 'Share',
            icon: <Share2 />,
          };
        if (action === 'login')
          return {
            key: action,
            label: loggedUser
              ? t('login.logout') || 'Logout'
              : t('login.login') || 'Login',
            icon: loggedUser ? <LogOut /> : <LogIn />,
          };
        return {
          key: action,
          label: t('widget.moreActions') || 'Action',
          icon: <User />,
        };
      }),
    [
      overflowActionKeys,
      t,
      headerProps?.hasUserActivatedSpeak,
      headerProps?.sessionID,
      headerProps?.speakerMuted,
      loggedUser,
    ]
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
                    {primaryHeaderProps && (
                      <Header
                        position={{
                          latitude: 0,
                          longitude: 0,
                          placeName: '',
                        }}
                        {...primaryHeaderProps}
                        buttonVariant="outline"
                        fullScreenHandler={handleFullscreenToggle}
                      />
                    )}
                    {hasOverflowActions && (
                      <Dropdown>
                        <Dropdown.Trigger
                          showChevron={false}
                          render={(
                            props: React.ButtonHTMLAttributes<HTMLButtonElement>
                          ) => (
                            <Button
                              {...props}
                              variant="outline"
                              aria-label={t('widget.moreActions') || 'More actions'}
                              icon={<EllipsisVertical />}
                            />
                          )}
                        />
                        <Dropdown.Menu className="memori-hidden-chat-layout--overflow-menu">
                          {loggedUser && (
                            <>
                              <Dropdown.Item className="memori-dropdown--user-item">
                                <div className="memori-dropdown--user-info">
                                  <div className="memori-dropdown--avatar-wrap">
                                    {loggedUser.avatarURL ? (
                                      <>
                                        <img
                                          src={loggedUser.avatarURL}
                                          alt={loggedUser.userName || loggedUser.eMail}
                                          className="memori-dropdown--avatar"
                                        />
                                        <span className="memori-dropdown--avatar-overlay">
                                          <Camera size={20} strokeWidth={2} />
                                        </span>
                                      </>
                                    ) : (
                                      <div className="memori-dropdown--avatar-placeholder">
                                        <span className="memori-dropdown--avatar-initial">
                                          {loggedUserInitial}
                                        </span>
                                        <span className="memori-dropdown--avatar-overlay">
                                          <Camera size={20} strokeWidth={2} />
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="memori-dropdown--user-details">
                                    <h3 className="memori-dropdown--user-name">
                                      {loggedUserDisplayName || t('login.welcomeUser')}
                                    </h3>
                                    <p className="memori-dropdown--user-email">
                                      {loggedUser.eMail}
                                    </p>
                                    <div className="memori-dropdown--user-badge">
                                      {loggedUser.birthDate
                                        ? new Date(
                                            loggedUser.birthDate
                                          ).toLocaleDateString()
                                        : t('login.notSet')}
                                    </div>
                                  </div>
                                </div>
                              </Dropdown.Item>
                              <Dropdown.Separator className="memori-dropdown--separator" />
                            </>
                          )}
                          {overflowItems.map(item => (
                            <Dropdown.Item
                              key={item.key}
                              icon={item.icon}
                              disabled={item.disabled}
                              onClick={() => handleOverflowActionClick(item.key)}
                            >
                              {item.label}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="memori-chat-layout--body">
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
