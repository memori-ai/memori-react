/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Spin } from '@memori.ai/ui';
import { LayoutProps } from '../MemoriWidget/MemoriWidget';
import { useTranslation } from 'react-i18next';
import { useArtifact } from '../MemoriArtifactSystem/context/ArtifactContext';
import { HelpCircle, X } from 'lucide-react';
import { getResourceUrl } from '../../helpers/media';
import ArtifactDrawer from '../MemoriArtifactSystem/components/ArtifactDrawer/ArtifactDrawer';
import ChatInputs from '../ChatInputs/ChatInputs';
import {
  maxDocumentsPerMessage,
  maxDocumentContentLength,
  pasteAsCardLineThreshold,
  pasteAsCardCharThreshold,
} from '../../helpers/constants';
import type { LayoutName } from '../../types/layout';

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
  poweredBy,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [hasTriggeredAutostart, setHasTriggeredAutostart] = useState(false);

  const { state, closeArtifact } = useArtifact();
  const useSideArtifactChrome =
    state.isDrawerOpen && !state.isChatLogPanelPresentation;

  const { onClickStart, hasInitialSession } = startPanelProps || {};
  const memori = headerProps?.memori;
  const tenant = headerProps?.tenant;
  const baseUrl = headerProps?.baseUrl;
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
      layout: 'HIDDEN_CHAT' as LayoutName,
      showChatHistory: false,
      enableAudio: true,
    };
  }, [headerProps]);

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

        // Store original styles before modifying
        originalSidebarStyles.current = {
          right: sidebar.style.right,
          width: sidebar.style.width,
          backgroundColor: sidebar.style.backgroundColor,
        };

        // Set styles for fullscreen — keep --memori-secondary-background via CSS, clear inline white
        sidebar.style.right = '0';
        sidebar.style.width = '100%';
        sidebar.style.backgroundColor = '';
        sidebar.classList.add('memori-sidebar-fullscreen');

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
          useSideArtifactChrome ? 'memori-sidebar-toggle-artifact' : ''
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
          <div className="memori-hidden-chat-layout--controls memori-chat-layout--controls">
            <div className="memori-chat-layout--header">
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
                      />
                    )}
                    <label
                      htmlFor="memori-sidebar-toggle"
                      className="memori-sidebar-toggle-label memori-close-label memori-hidden-chat-layout--header-close"
                      aria-label={t('collapse') || 'Close'}
                      title={t('collapse') || 'Close'}
                    >
                      <X className="memori-icon-close" aria-hidden />
                    </label>
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
                        showAiGeneratedNote={false}
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
            {poweredBy}
          </div>
        </aside>
      </div>

      {/* Artifact drawer — fixed overlay that pairs with the sidebar shift (right: 55%) */}
      {useSideArtifactChrome && <ArtifactDrawer />}
    </>
  );
};

export default HiddenChatLayout;
