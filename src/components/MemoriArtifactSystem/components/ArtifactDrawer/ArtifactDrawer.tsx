/**
 * ArtifactDrawer Component
 * Main drawer component for displaying artifacts with full functionality
 * Following the project's drawer patterns and design system
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, Transition } from '@headlessui/react';
import cx from 'classnames';
import Button from '../../../ui/Button';
import Close from '../../../icons/Close';
import ArtifactActions from '../ArtifactActions/ArtifactActions';
import ArtifactPreview from '../ArtifactPreview/ArtifactPreview';
import ArtifactHistory from '../ArtifactHistory/ArtifactHistory';
import { ArtifactDrawerProps, ArtifactTab } from '../../types/artifact.types';

const ArtifactDrawer: React.FC<ArtifactDrawerProps> = ({
  open,
  onClose,
  artifact,
  onToggleFullscreen,
  isFullscreen = false,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<ArtifactTab>('preview');
  const [showHistory, setShowHistory] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  /**
   * Handle window resize to detect mobile/desktop changes
   */
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 769);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    if (!artifact) return;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(artifact.content);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = artifact.content;
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
  }, [artifact]);

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
    if (onToggleFullscreen) {
      onToggleFullscreen();
    }
  }, [onToggleFullscreen]);

  /**
   * Handle close with escape key
   */
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  /**
   * Toggle history panel
   */
  const toggleHistory = useCallback(() => {
    setShowHistory(prev => !prev);
  }, []);

  /**
   * Get drawer width based on fullscreen state and screen size
   */
  const drawerWidth = useMemo(() => {
    if (isFullscreen) return '100%';
    if (isMobile) return '100%';
    return showHistory ? '70%' : '60%';
  }, [isFullscreen, showHistory, isMobile]);

  /**
   * Get drawer placement based on history visibility and screen size
   */
  const drawerPlacement = useMemo(() => {
    // On mobile, always use right placement for consistency
    if (isMobile) return 'right';
    return showHistory ? 'left' : 'right';
  }, [showHistory, isMobile]);

  if (!artifact) {
    return null;
  }

  return (
    <Transition appear show={open} as={React.Fragment}>
      <Dialog
        open={open}
        onClose={handleClose}
        className={cx('memori-artifact-drawer', {
          'memori-artifact-drawer--fullscreen': isFullscreen,
          'memori-artifact-drawer--mobile': isMobile,
        })}
      >
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="memori-artifact-drawer--backdrop" />
        </Transition.Child>

        <div className="memori-artifact-drawer--container">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom={
              drawerPlacement === 'right'
                ? 'translate-x-full'
                : '-translate-x-full'
            }
            enterTo="translate-x-0"
            leave="ease-in duration-200"
            leaveFrom="translate-x-0"
            leaveTo={
              drawerPlacement === 'right'
                ? 'translate-x-full'
                : '-translate-x-full'
            }
          >
            <div
              className={cx('memori-artifact-drawer--panel', {
                'memori-artifact-drawer--panel-left':
                  drawerPlacement === 'left',
                'memori-artifact-drawer--panel-fullscreen': isFullscreen,
              })}
              style={{ width: drawerWidth }}
            >
              {/* Header */}
              <div className="memori-artifact-drawer--header">
                <div className="memori-artifact-drawer--header-content">
                  <h2 className="memori-artifact-drawer--title">
                    {artifact.title}
                  </h2>
                  <p className="memori-artifact-drawer--subtitle">
                    {artifact.customTitle ||
                      `${artifact.typeInfo.name} Content`}
                  </p>
                  <div className="memori-artifact-drawer--meta">
                    <span className="memori-artifact-drawer--meta-item">
                      {t('artifact.type', 'Type')}: {artifact.typeInfo.name}
                    </span>
                    <span className="memori-artifact-drawer--meta-item">
                      {t('artifact.size', 'Size')}: {formatBytes(artifact.size)}
                    </span>
                    <span className="memori-artifact-drawer--meta-item">
                      {t('artifact.generated', 'Generated')}:{' '}
                      {formatTimestamp(artifact.timestamp)}
                    </span>
                  </div>
                </div>

                <div className="memori-artifact-drawer--header-actions">
                  {/* <Button
                    onClick={toggleHistory}
                    className="memori-artifact-drawer--history-toggle"
                    ghost
                    title={
                      showHistory
                        ? t('artifact.hideHistory', 'Hide history') ||
                          'Hide history'
                        : t('artifact.showHistory', 'Show history') ||
                          'Show history'
                    }
                  >
                    <HistoryIcon className="memori-artifact-drawer--history-toggle-icon" />
                  </Button> */}

                  <ArtifactActions
                    artifact={artifact}
                    onCopy={handleCopy}
                    onDownload={handleDownload}
                    onPrint={handlePrint}
                    onOpenExternal={handleOpenExternal}
                    onToggleFullscreen={handleToggleFullscreen}
                    isFullscreen={isFullscreen}
                  />
                </div>

                <Button
                  onClick={handleClose}
                  className="memori-artifact-drawer--close"
                  ghost
                  title={t('artifact.close', 'Close') || 'Close'}
                >
                  <Close className="memori-artifact-drawer--close-icon" />
                </Button>
              </div>

              {/* Content */}
              <div className="memori-artifact-drawer--content">
                <div className="memori-artifact-drawer--main">
                  <ArtifactPreview
                    artifact={artifact}
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                  />
                </div>

                {/* History Sidebar */}
                {/* {showHistory && (
                  <div className="memori-artifact-drawer--sidebar">
                    <ArtifactHistory
                      history={history}
                      onSelectArtifact={onSelectArtifact}
                      maxItems={20}
                    />
                  </div>
                )} */}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
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
