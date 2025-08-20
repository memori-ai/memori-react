import React, { useState, useEffect, useRef } from 'react';
import Spin from '../ui/Spin';
import { LayoutProps } from '../MemoriWidget/MemoriWidget';
import { useTranslation } from 'react-i18next';
import QuestionHelp from '../icons/QuestionHelp';
import Close from '../icons/Close';

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

  const { onClickStart, hasInitialSession } = startPanelProps || {};

  // Use refs to store original sidebar properties to restore them later
  const originalSidebarStyles = useRef({
    right: '',
    width: '',
    backgroundColor: '',
  });

  useEffect(() => {
    console.log('[HiddenChatLayout] Setting up fullscreen change listener');
    // Add fullscreen change event listener to handle ESC key
    const handleFullscreenChange = () => {
      console.log('[HiddenChatLayout] Fullscreen changed:', {
        fullscreenElement: !!document.fullscreenElement,
        fullScreen
      });
      if (!document.fullscreenElement && fullScreen) {
        restoreFromFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      console.log('[HiddenChatLayout] Cleaning up fullscreen change listener');
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [fullScreen]);

  useEffect(() => {
    console.log('[HiddenChatLayout] Updating body styles:', { isOpen, fullScreen });
    const mainDiv = document.body;
    if (isOpen) {
      if (!fullScreen) {
        mainDiv.style.width = 'calc(100% - 350px)';
        mainDiv.style.marginRight = '300px';
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
    }
  }, [isOpen, fullScreen]);

  const handleSidebarToggle = () => {
    console.log('[HiddenChatLayout] Sidebar toggle clicked:', {
      currentState: isOpen,
      autoStart,
      sessionId,
      hasInitialSession,
      hasTriggeredAutostart
    });

    // Only trigger autostart when opening the sidebar for the first time
    // and when we haven't already triggered it
    if (!isOpen && !hasTriggeredAutostart && (autoStart || autoStart === undefined) && (!sessionId || hasInitialSession)) {
      console.log('[HiddenChatLayout] Triggering autostart');
      setHasTriggeredAutostart(true);
      onClickStart?.();
    }
    
    // If we're in fullscreen mode and trying to close the sidebar
    if (fullScreen && isOpen) {
      console.log('[HiddenChatLayout] Exiting fullscreen before closing sidebar');
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
    
    console.log('[HiddenChatLayout] Setting isOpen to:', newState);
  };

  const restoreFromFullscreen = () => {
    console.log('[HiddenChatLayout] Restoring from fullscreen');
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
    console.log('[HiddenChatLayout] Fullscreen toggle clicked:', {
      currentFullscreen: !!document.fullscreenElement
    });
    
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

        console.log('[HiddenChatLayout] Stored original styles:', originalSidebarStyles.current);

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
        className="memori-sidebar-toggle"
        checked={isOpen}
        onChange={handleSidebarToggle}
      />
      <div className="memori-sidebar-container">
        <label
          htmlFor="memori-sidebar-toggle"
          className="memori-sidebar-toggle-label memori-open-label"
        >
          <QuestionHelp className="memori-icon" aria-label={t('expand')} />
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
              <Close className="memori-icon-close" aria-label={t('collapse')} />
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
                <Spin />
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
};

export default HiddenChatLayout;
