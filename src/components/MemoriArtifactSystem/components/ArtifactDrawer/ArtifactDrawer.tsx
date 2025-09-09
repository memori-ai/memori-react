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
import Drawer from '../../../ui/Drawer';

const ArtifactDrawer: React.FC<{ isChatLogPanel?: boolean }> = ({
  isChatLogPanel = false,
}) => {
  const { state, openArtifact, closeArtifact, toggleFullscreen } =
    useArtifact();
  const { t } = useTranslation();
  const [showHistory, setShowHistory] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

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


  const ContentContainer = ({ children }: { children: React.ReactNode }) => {
    if(isChatLogPanel){
      return <div
        style={isChatLogPanel ? { minHeight: '75vh', maxHeight: '75vh' } : {}}
        className="memori-artifact-panel"
      >
        {children}
      </div>
    } else {
      return <Drawer
        open={state.isDrawerOpen}
        onClose={handleClose}
        placement="right"
        width="50%"
        className={state.isFullscreen ? 'memori-artifact-panel-drawer-fullscreen' : 'memori-artifact-panel-drawer'}
        widthMd="100%"
        widthLg="50%"
        closable={false}
        animated={true}
        showBackdrop={false}
        confirmDialogTitle={t('artifact.confirmDialogTitle') || 'Are you sure you want to close this artifact?'}
        confirmDialogMessage={t('artifact.confirmDialogMessage') || 'This action cannot be undone.'}
        // className="memori-artifact-panel"
      >
        {children}
      </Drawer>
    }
  }


  // Render web split panel
  return (
    <ContentContainer> 
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
          />
        </div>
      </div>
    </ContentContainer>
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
