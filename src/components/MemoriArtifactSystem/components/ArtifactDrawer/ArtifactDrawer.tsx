/**
 * ArtifactDrawer Component
 * Displays artifacts as a drawer on mobile and as a split panel on web
 * Following the project's design system and responsive patterns
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, Transition } from '@headlessui/react';
import Button from '../../../ui/Button';
import Close from '../../../icons/Close';
import ArtifactActions from '../ArtifactActions/ArtifactActions';
import { useArtifact } from '../../context/ArtifactContext';
import ArtifactPreview from '../ArtifactPreview/ArtifactPreview';
import { ArtifactTab } from '../../types/artifact.types';
import cx from 'classnames';

const ArtifactDrawer: React.FC<{ isChatLogPanel?: boolean }> = ({
  isChatLogPanel = false,
}) => {
  const { state, openArtifact, closeArtifact, toggleFullscreen } =
    useArtifact();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<ArtifactTab>('preview');
  const [showHistory, setShowHistory] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  /**
   * Handle window resize to detect mobile/desktop changes
   */
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 769;
      if (newIsMobile !== isMobile) {
        setIsAnimating(true);
        setTimeout(() => {
          setIsMobile(newIsMobile);
          setIsAnimating(false);
        }, 150);
      } else {
        setIsMobile(newIsMobile);
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  /**
   * Handle tab change
   */
  const handleTabChange = useCallback((tab: ArtifactTab) => {
    setActiveTab(tab);
  }, []);

  /**
   * Handle copy action
   */
  const handleCopy = useCallback(async () => {
    if (!state.currentArtifact) return;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(state.currentArtifact.content);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = state.currentArtifact.content;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    } catch (error) {
      console.error('Copy failed:', error);
      throw error;
    }
  }, [state.currentArtifact]);

  /**
   * Handle download action
   */
  const handleDownload = useCallback(() => {
    // This will be handled by the ArtifactActions component
    console.log('Download triggered');
  }, []);

  /**
   * Handle print action
   */
  const handlePrint = useCallback(() => {
    // This will be handled by the ArtifactActions component
    console.log('Print triggered');
  }, []);

  /**
   * Handle external open action
   */
  const handleOpenExternal = useCallback(() => {
    // This will be handled by the ArtifactActions component
    console.log('External open triggered');
  }, []);

  /**
   * Handle fullscreen toggle
   */
  const handleToggleFullscreen = useCallback(() => {
    if (toggleFullscreen) {
      toggleFullscreen();
    }
  }, [toggleFullscreen]);

  /**
   * Handle close with escape key
   */
  const handleClose = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      closeArtifact();
      setIsAnimating(false);
    }, 200);
  }, [closeArtifact]);

  /**
   * Toggle history panel
   */
  const toggleHistory = useCallback(() => {
    setShowHistory(prev => !prev);
  }, []);

  if (!state.currentArtifact) {
    return null;
  }

  // Render mobile drawer
  if (isMobile) {
    return (
      <Transition show={state.isDrawerOpen}>
        {state.isDrawerOpen && (
          <Dialog
            open={state.isDrawerOpen}
            onClose={handleClose}
            className="memori-artifact-drawer memori-artifact-drawer--mobile"
            as="div"
          >
            <div
              className="memori-artifact-drawer--backdrop"
              onClick={handleClose}
            />
            <div className="memori-artifact-drawer--panel memori-artifact-drawer--panel-mobile">
              {/* Header */}
              <div className="memori-artifact-drawer--header">
                <div className="memori-artifact-drawer--header-content">
                  <h2 className="memori-artifact-drawer--title">
                    {state.currentArtifact.title}
                  </h2>
                  <div className="memori-artifact-drawer--meta">
                    <span className="memori-artifact-drawer--meta-item">
                      {t('artifact.type') || 'Type'}:{' '}
                      {state.currentArtifact.mimeType}
                    </span>
                    <span className="memori-artifact-drawer--meta-item">
                      {t('artifact.size') || 'Size'}:{' '}
                      {formatBytes(state.currentArtifact.size)}
                    </span>
                    <span className="memori-artifact-drawer--meta-item">
                      {t('artifact.generated') || 'Generated'}:{' '}
                      {formatTimestamp(state.currentArtifact.timestamp)}
                    </span>
                  </div>
                </div>

                <div className="memori-artifact-drawer--header-actions">
                  <ArtifactActions
                    artifact={state.currentArtifact}
                    onCopy={handleCopy}
                    onDownload={handleDownload}
                    onPrint={handlePrint}
                    loading={false}
                    onOpenExternal={handleOpenExternal}
                    onToggleFullscreen={handleToggleFullscreen}
                    isFullscreen={state.isFullscreen}
                    isChatLogPanel={isChatLogPanel}
                  />
                </div>

                <Button
                  onClick={handleClose}
                  className={cx(
                    'memori-artifact-drawer--close',
                    'memori-button--circle',
                    'memori-button--icon-only'
                  )}
                  ghost
                  title={t('artifact.close') || 'Close'}
                >
                  <Close className="memori-artifact-drawer--close-icon" />
                </Button>
              </div>

              {/* Content */}
              <div className="memori-artifact-drawer--content">
                <div className="memori-artifact-drawer--main">
                  <ArtifactPreview
                    artifact={state.currentArtifact}
                    activeTab={activeTab as ArtifactTab}
                    onTabChange={handleTabChange as (tab: ArtifactTab) => void}
                  />
                </div>
              </div>
            </div>
          </Dialog>
        )}
      </Transition>
    );
  }

  // Render web split panel
  return (
    <div
      style={isChatLogPanel ? { minHeight: '75vh', maxHeight: '75vh' } : {}}
      className="memori-artifact-panel"
    >
      {/* Header */}
      <div className="memori-artifact-panel--header">
        <div className="memori-artifact-panel--header-content">
          <h2 className="memori-artifact-panel--title">
            {state.currentArtifact.title}
          </h2>
          <div className="memori-artifact-panel--meta">
            <span className="memori-artifact-panel--meta-item">
              {t('artifact.type') || 'Type'}: {state.currentArtifact.mimeType}
            </span>
            <span className="memori-artifact-panel--meta-item">
              {t('artifact.size') || 'Size'}:{' '}
              {formatBytes(state.currentArtifact.size)}
            </span>
            <span className="memori-artifact-panel--meta-item">
              {t('artifact.generated') || 'Generated'}:{' '}
              {formatTimestamp(state.currentArtifact.timestamp)}
            </span>
          </div>
        </div>

        <div className="memori-artifact-panel--header-actions">
          <ArtifactActions
            artifact={state.currentArtifact}
            onCopy={handleCopy}
            onDownload={handleDownload}
            loading={false}
            onPrint={handlePrint}
            onOpenExternal={handleOpenExternal}
            onToggleFullscreen={handleToggleFullscreen}
            isFullscreen={state.isFullscreen}
            isChatLogPanel={isChatLogPanel}
          />
        </div>

        <Button
          onClick={closeArtifact}
          className={cx(
            'memori-artifact-drawer--close',
            'memori-button--circle',
            'memori-button--icon-only'
          )}
          ghost
          title={t('artifact.close') || 'Close'}
        >
          <Close className="memori-artifact-panel--close-icon" />
        </Button>
      </div>

      {/* Content */}
      <div className="memori-artifact-panel--content">
        <div className="memori-artifact-panel--main">
          <ArtifactPreview
            artifact={state.currentArtifact}
            activeTab={activeTab as ArtifactTab}
            onTabChange={handleTabChange as (tab: ArtifactTab) => void}
          />
        </div>
      </div>
    </div>
  );
};

/**
 * Format file size in human readable format
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Format timestamp for display
 */
function formatTimestamp(timestamp: Date): string {
  return timestamp.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default ArtifactDrawer;
