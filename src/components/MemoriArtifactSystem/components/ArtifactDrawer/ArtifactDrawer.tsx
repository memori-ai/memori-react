/**
 * ArtifactDrawer Component
 * Displays artifacts as a drawer on mobile and as a split panel on web
 * Following the project's design system and responsive patterns
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, Transition, Menu } from '@headlessui/react';
import Button from '../../../ui/Button';
import Close from '../../../icons/Close';
import ArtifactActions from '../ArtifactActions/ArtifactActions';
import { useArtifact } from '../../context/ArtifactContext';
import ArtifactPreview from '../ArtifactPreview/ArtifactPreview';
import { ArtifactData, ArtifactTab } from '../../types/artifact.types';
import cx from 'classnames';
import Drawer from '../../../ui/Drawer';
import Fullscreen from '../../../icons/Fullscreen';
import FullscreenExit from '../../../icons/FullscreenExit';
import MenuVertical from '../../../icons/MenuVertical';
import Download from '../../../icons/Download';
import Link from '../../../icons/Link';
import PrintIcon from '../../../icons/Print';
import { useCopyArtifact } from '../ArtifactActions/hooks/useCopyArtifact';
import TabSwitch from './components/TabSwitch';

const ArtifactDrawer: React.FC<{ isChatLogPanel?: boolean }> = ({
  isChatLogPanel = false,
}) => {
  const { state, closeArtifact, toggleFullscreen } =
    useArtifact();
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);

  const [activeTab, setActiveTab] = useState<ArtifactTab>('preview');

  /**
   * Handle tab switching
   */
  const handleTabChange = useCallback(
    (tab: ArtifactTab) => {
      setActiveTab(tab);
    },
    [activeTab]
  );

  // Use copy artifact hook for dynamic actions
  const {
    copyState,
    formats,
    handleCopy: handleCopyFormat,
    handleCopyClick,
  } = useCopyArtifact(
    state.currentArtifact || { content: '', mimeType: 'text/plain' },
    () => console.log('Copy completed'),
    () => console.log('Download completed'),
    () => console.log('Print completed')
  );

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
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
    closeArtifact();
  }, [closeArtifact]);

  if (!state.currentArtifact) {
    return null;
  }

  const hasPreview =
    state.currentArtifact.mimeType === 'html' ||
    state.currentArtifact.mimeType === 'markdown';

  const ContentContainer = useCallback(
    ({ children }: { children: React.ReactNode }) => {
      if (isChatLogPanel) {
        return (
          <div
            style={{ minHeight: '75vh', maxHeight: '75vh' }}
            className="memori-artifact-panel"
          >
            {children}
          </div>
        );
      } else {
        return (
          <Drawer
            open={state.isDrawerOpen}
            onClose={handleClose}
            placement="right"
            width="50%"
            className={
              state.isFullscreen
                ? 'memori-artifact-panel-drawer-fullscreen'
                : 'memori-artifact-panel-drawer'
            }
            widthMd="100%"
            widthLg="50%"
            closable={false}
            animated={true}
            enterDuration={isMobile ? 'duration-500' : 'duration-300'}
            leaveDuration={isMobile ? 'duration-400' : 'duration-200'}
            showBackdrop={false}
            preventBackdropClose={true}
            confirmDialogTitle={
              t('artifact.confirmDialogTitle') ||
              'Are you sure you want to close this artifact?'
            }
            confirmDialogMessage={
              t('artifact.confirmDialogMessage') ||
              'This action cannot be undone.'
            }
          // className="memori-artifact-panel"
          >
            {children}
          </Drawer>
        );
      }
    },
    [isChatLogPanel, handleClose, state.isDrawerOpen, state.isFullscreen, isMobile]
  );

  /**
 * Get MIME type string for downloads
 */
  const getMimeTypeString = useCallback((mimeType: string): string => {
    const mimeTypes: Record<string, string> = {
      html: 'text/html',
      json: 'application/json',
      markdown: 'text/markdown',
      css: 'text/css',
      javascript: 'text/javascript',
      typescript: 'text/typescript',
      svg: 'image/svg+xml',
      xml: 'text/xml',
      text: 'text/plain',
      python: 'text/x-python',
      java: 'text/x-java',
      cpp: 'text/x-c++',
      csharp: 'text/x-csharp',
      php: 'text/x-php',
      ruby: 'text/x-ruby',
      go: 'text/x-go',
      rust: 'text/x-rust',
      yaml: 'text/yaml',
      sql: 'text/x-sql',
    };
    return mimeTypes[mimeType] || 'text/plain';
  }, []);

  /**
   * Handle external open action
   */
  const handleOpenExternal = useCallback((artifact: ArtifactData) => {
    try {
      const mimeType = getMimeTypeString(artifact.mimeType);
      const blob = new Blob([artifact.content], { type: mimeType });
      const url = URL.createObjectURL(blob);

      const externalWindow = window.open(url, '_blank');
      if (!externalWindow) {
        alert(
          'Popup blocked! Please enable popups to open the artifact in a new window.'
        );
        return;
      }

      // Cleanup URL after a delay
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 60000);

    } catch (error) {
      console.error('External open failed:', error);
    }
  }, []);

  // Render web split panel
  return (
    <ContentContainer>
      {/* Header */}
      <div
        className={cx('memori-artifact-drawer-container-actions', {
          'memori-artifact-drawer-container-actions--no-preview': !hasPreview,
          'memori-artifact-drawer-container-actions--chatlog': isChatLogPanel,
        })}
      >
        {/* Desktop Actions */}
        {!isMobile && (
          <>
            {/* Modern Tab Switch */}
            {hasPreview && (
              <TabSwitch
                activeTab={activeTab}
                onTabChange={handleTabChange}
                hasPreview={hasPreview}
              />
            )}
            <ArtifactActions
              artifact={state.currentArtifact}
              onCopy={handleCopy}
              loading={false}
              isMobile={isMobile}
            />
            <Button
              onClick={closeArtifact}
              className={cx(
                'memori-artifact-drawer--close',
                'memori-button--icon-only',
                {
                  'memori-artifact-drawer--close-desktop': !hasPreview,
                }
              )}
              ghost
              title={t('artifact.close') || 'Close'}
            >
              <Close className="memori-artifact-panel--close-icon" />
            </Button>
          </>
        )}
      </div>

      {/* Top Right Header Section */}
      <div
        className={cx('memori-artifact-drawer-top-right', {
          'memori-artifact-drawer-top-right--no-preview': !hasPreview,
          'memori-artifact-drawer-top-right--chatlog': isChatLogPanel,
        })}
      >
        {/* Mobile Dropdown Menu */}
        {isMobile && (
          <>
            {hasPreview && (
              <TabSwitch
                activeTab={activeTab}
                onTabChange={handleTabChange}
                hasPreview={hasPreview}
              />
            )}
            <Menu as="div" className="memori-mobile-actions-menu">
              <Menu.Button as="div" className="memori-mobile-actions-trigger">
                <Button
                  className={cx(
                    'memori-button',
                    'memori-button--more-options',
                    'memori-button--icon-only'
                  )}
                  ghost
                  title={t('artifact.actions') || 'Actions'}
                >
                  <MenuVertical className="memori-artifact-action-icon" />
                </Button>
              </Menu.Button>

              <Transition
                as={React.Fragment}
                enter="memori-mobile-dropdown-enter"
                enterFrom="memori-mobile-dropdown-enter-from"
                enterTo="memori-mobile-dropdown-enter-to"
                leave="memori-mobile-dropdown-leave"
                leaveFrom="memori-mobile-dropdown-leave-from"
                leaveTo="memori-mobile-dropdown-leave-to"
              >
                <Menu.Items className="memori-mobile-dropdown">
                  <div className="memori-mobile-dropdown-list">
                    <Button
                      onClick={handleCopy}
                      disabled={false}
                      className="memori-artifact-action-btn"
                      ghost
                      title={t('artifact.copy') || 'Copy'}
                    >
                      <span className="memori-artifact-action-text">
                        {t('artifact.copy') || 'Copy'}
                      </span>
                    </Button>

                    {formats.map(format => {
                      // Get appropriate icon based on action type
                      const getIcon = () => {
                        switch (format.action) {
                          case 'copy':
                            return (
                              <Link className="memori-artifact-action-icon" />
                            );
                          case 'download':
                            return (
                              <Download className="memori-artifact-action-icon" />
                            );
                          case 'print':
                          case 'pdf':
                            return (
                              <PrintIcon className="memori-artifact-action-icon" />
                            );
                          default:
                            return (
                              <Link className="memori-artifact-action-icon" />
                            );
                        }
                      };

                      return (
                        <Button
                          key={format.id}
                          onClick={() => handleCopyFormat(format)}
                          disabled={
                            copyState.loading &&
                            copyState.activeFormat === format.id
                          }
                          className="memori-artifact-action-btn"
                          ghost
                          icon={getIcon()}
                          title={format.label}
                        >
                          <span className="memori-artifact-action-text">
                            {format.label}
                          </span>
                        </Button>
                      );
                    })}

                    {/* External open action (not from hook) */}
                    <Button
                      onClick={() => handleOpenExternal(state.currentArtifact ?? {
                        content: '',
                        mimeType: '',
                        title: '',
                        timestamp: new Date(),
                        size: 0,
                        id: '',
                      })}
                      disabled={false}
                      className="memori-artifact-action-btn"
                      ghost
                      icon={<Link className="memori-artifact-action-icon" />}
                      title={t('artifact.external') || 'External'}
                    >
                      <span className="memori-artifact-action-text">
                        {t('artifact.external') || 'External'}
                      </span>
                    </Button>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </>
        )}

        {/* Close Button */}
        {isMobile && (
          <Button
            onClick={closeArtifact}
            className={cx(
              'memori-artifact-drawer--close',
              'memori-button--icon-only'
            )}
            ghost
            title={t('artifact.close') || 'Close'}
          >
            <Close className="memori-artifact-panel--close-icon" />
          </Button>
        )}
      </div>

      <div className="memori-artifact-panel--header"></div>

      {/* Content */}
      <div className="memori-artifact-panel--content">
        <div className="memori-artifact-panel--main">
          <ArtifactPreview
            artifact={state.currentArtifact}
            activeTab={activeTab}
          />
        </div>
      </div>
    </ContentContainer>
  );
};

export default ArtifactDrawer;
