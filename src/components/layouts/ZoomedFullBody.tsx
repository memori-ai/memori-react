import React, { useEffect } from 'react';
import Spin from '../ui/Spin';
import { LayoutProps } from '../MemoriWidget/MemoriWidget';

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
  ChangeMode,
  changeModeProps,
  sessionId,
  hasUserActivatedSpeak,
  showInstruct = false,
  loading = false,
  poweredBy,
}) => {
  useEffect(() => {
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';

    // Touch focus handler for chat bubbles
    const handleBubbleTouch = (e: any) => {
        const bubble = e.target.closest('.memori-chat--bubble');
        if (bubble) {
            // Remove focus from other bubbles
            document.querySelectorAll('.memori-chat--bubble.focused').forEach(other => {
                if (other !== bubble) {
                    other.classList.remove('focused');
                }
            });
            bubble.classList.add('focused');
            // Prevent any default touch behaviors
            e.stopPropagation();
        }
    };

    // Handle clicking outside to remove focus
    const handleOutsideTouch = (e: any) => {
        const chatContainer = e.target.closest('.memori-full-body-layout--controls');
        const bubble = e.target.closest('.memori-chat--bubble');
        
        if (chatContainer && !bubble) {
            document.querySelectorAll('.memori-chat--bubble.focused').forEach(bubble => {
                bubble.classList.remove('focused');
            });
        }
    };

    // Add event listeners
    const chatContainer = document.querySelector('.memori-full-body-layout--controls');
    if (chatContainer) {
        chatContainer.addEventListener('touchstart', handleBubbleTouch, { passive: true });
        document.addEventListener('touchstart', handleOutsideTouch, { passive: true });
    }

    // Cleanup function
    return () => {
        document.body.style.overflow = '';
        if (chatContainer) {
            chatContainer.removeEventListener('touchstart', handleBubbleTouch);
            document.removeEventListener('touchstart', handleOutsideTouch);
        }
    };
  }, []); // Empty dependency array since we only want this to run once on mount

  return (
    <>
      {integrationStyle}
      {integrationBackground}

      <Spin className="memori-full-body--container" spinning={loading}>
        {showInstruct && ChangeMode && changeModeProps && (
          <ChangeMode {...changeModeProps} />
        )}

        <div className="memori-full-body--header">
          {Header && headerProps && <Header {...headerProps} />}
        </div>

        <div className="memori--grid">
          <div className="memori-full-body-layout--avatar-mobile memori--grid-column memori--grid-column-left ">
            {Avatar && avatarProps && (
              <Avatar chatProps={chatProps} isZoomed {...avatarProps} />
            )}

            <div id="extension" />
          </div>
          <div className="memori--grid-column--zoomed-full-body memori-full-body-layout--controls memori--grid-column memori--grid-column-right ">
            {sessionId && hasUserActivatedSpeak && Chat && chatProps ? (
              <Chat {...chatProps} />
            ) : startPanelProps ? (
              <StartPanel {...startPanelProps} />
            ) : null}
          </div>

          <div className="memori--powered-by-custom">{poweredBy}</div>
        </div>
      </Spin>
    </>
  );
};

export default ZoomedFullBodyLayout;
