import React, { useState, useEffect, useRef } from 'react';
import { Spin } from '@memori.ai/ui';
import { LayoutProps } from '../MemoriWidget/MemoriWidget';
import { useTranslation } from 'react-i18next';
import { useArtifact } from '../MemoriArtifactSystem/context/ArtifactContext';
import { HelpCircle, X } from 'lucide-react';

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

  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [hasTriggeredAutostart, setHasTriggeredAutostart] = useState(false);

  const { state, closeArtifact } = useArtifact();
  const { onClickStart, hasInitialSession } = startPanelProps || {};

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
      (widgetEl && getComputedStyle(widgetEl).getPropertyValue('--memori-modal-size-sm')?.trim()) || '350px';
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
    if (!isOpen && !hasTriggeredAutostart && (autoStart || autoStart === undefined) && (!sessionId || hasInitialSession)) {
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
        className={`memori-sidebar-toggle ${state.isDrawerOpen ? 'memori-sidebar-toggle-artifact' : ''}`}
        checked={isOpen}
        onChange={handleSidebarToggle}
      />
      <div className="memori-sidebar-container">
        <label
          htmlFor="memori-sidebar-toggle"
          className="memori-sidebar-toggle-label memori-open-label"
        >
          <HelpCircle className="memori-icon" aria-label={t('expand') ?? undefined} />
        </label>
        
        <aside
          className={`memori-sidebar ${
            fullScreen ? 'memori-sidebar-fullscreen' : ''
          }`}
        >
          <label
            htmlFor="memori-sidebar-toggle"
            className="memori-sidebar-toggle-label memori-close-label"
          >
            <span>
              <X className="memori-icon-close" aria-label={t('collapse') ?? undefined} />
            </span>
          </label>
          <div className="memori-sidebar-content">
            <div className="memori-hidden-chat-layout--header">
              {Header && headerProps && (
                <Header
                  position={{
                    latitude: 0,
                    longitude: 0,
                    placeName: '',
                  }}
                  {...headerProps}
                  className="memori-hidden-chat-layout-header--layout"
                  fullScreenHandler={handleFullscreenToggle}
                />
              )}
            </div>
          </div>
          <div id="extension" />
          <div className="memori-hidden-chat-layout--controls">
            {sessionId && hasUserActivatedSpeak && Chat && chatProps ? (
              <Chat {...chatProps} />
            ) : !autoStart && startPanelProps ? (
              <div className="memori-loading">
                <StartPanel {...startPanelProps} />
              </div>
            ) : (
              <div className="memori-loading">
                <Spin spinning />
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
};

export default HiddenChatLayout;
