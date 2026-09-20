/**
 * ArtifactDrawer Component
 * Displays artifacts as a drawer on mobile and as a split panel on web
 * Following the project's design system and responsive patterns
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dropdown, Drawer } from '@memori.ai/ui';
import {
  X,
  MoreVertical,
  Download,
  Link as LinkIcon,
  Printer,
  Copy,
} from 'lucide-react';
import ArtifactActions from '../ArtifactActions/ArtifactActions';
import { useArtifact } from '../../context/ArtifactContext';
import ArtifactPreview from '../ArtifactPreview/ArtifactPreview';
import { ArtifactData, ArtifactTab } from '../../types/artifact.types';
import cx from 'classnames';
import { useCopyArtifact } from '../ArtifactActions/hooks/useCopyArtifact';
import TabSwitch from './components/TabSwitch';
import IconButton from '../../../IconButton/IconButton';
import { formatArtifactType } from '../../../../helpers/artifactPanel';

const ArtifactDrawer: React.FC<{
  isChatLogPanel?: boolean;
  /** Render as a plain flex column (no Drawer overlay). Used when the drawer
   *  is mounted as a proper flex sibling in the page layout. */
  isLayoutColumn?: boolean;
}> = ({ isChatLogPanel = false, isLayoutColumn = false }) => {
  const { state, closeArtifact } = useArtifact();
  const { t } = useTranslation();
  const [isCompactToolbar, setIsCompactToolbar] = useState(false);
  const [activeTab, setActiveTab] = useState<ArtifactTab>('preview');

  const handleTabChange = useCallback((tab: ArtifactTab) => {
    setActiveTab(tab);
  }, []);

  const {
    copyState,
    formats,
    handleCopy: handleCopyFormat,
  } = useCopyArtifact(
    state.currentArtifact || { content: '', mimeType: 'text/plain' },
    () => console.log('Copy completed'),
    () => console.log('Download completed'),
    () => console.log('Print completed')
  );

  useEffect(() => {
    const checkCompact = () => {
      setIsCompactToolbar(window.innerWidth <= 768);
    };

    checkCompact();
    window.addEventListener('resize', checkCompact);

    return () => window.removeEventListener('resize', checkCompact);
  }, []);

  const handleCopy = useCallback(async () => {
    if (!state.currentArtifact) return;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(state.currentArtifact.content);
      } else {
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

  const handleClose = useCallback(() => {
    closeArtifact();
  }, [closeArtifact]);

  const hasPreview =
    state.currentArtifact?.mimeType === 'html' ||
    state.currentArtifact?.mimeType === 'markdown';

  const ContentContainer = useCallback(
    ({ children }: { children: React.ReactNode }) => {
      if (isChatLogPanel) {
        return (
          <div
            style={{
              minHeight: '75vh',
              maxHeight: '75vh',
              background: 'var(--memori-secondary-background)',
              marginTop: '-24px',
              border: '2px solid var(--memori-border-primary)',
            }}
            className="memori-artifact-panel"
          >
            {children}
          </div>
        );
      } else if (isLayoutColumn) {
        return <div className="memori-artifact-layout-column">{children}</div>;
      } else {
        return (
          <Drawer
            open={state.isDrawerOpen}
            onClose={handleClose}
            anchor="right"
            size="md"
            className={
              state.isFullscreen || isCompactToolbar
                ? 'memori-artifact-panel-drawer-fullscreen'
                : 'memori-artifact-panel-drawer'
            }
            closable={false}
          >
            {children}
          </Drawer>
        );
      }
    },
    [
      isChatLogPanel,
      isLayoutColumn,
      handleClose,
      state.isDrawerOpen,
      state.isFullscreen,
      isCompactToolbar,
    ]
  );

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

  const handleOpenExternal = useCallback(
    (artifact: ArtifactData) => {
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

        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 60000);
      } catch (error) {
        console.error('External open failed:', error);
      }
    },
    [getMimeTypeString]
  );

  if (!state.currentArtifact) {
    return null;
  }

  const closeButton = !isChatLogPanel ? (
    <IconButton
      onClick={closeArtifact}
      aria-label={t('artifact.close') || 'Close'}
      title={t('artifact.close') || 'Close'}
      className="memori-artifact-drawer--close"
      icon={<X className="memori-icon-close" aria-hidden />}
    />
  ) : null;

  return (
    <ContentContainer>
      <header
        className={cx('memori-artifact-toolbar', {
          'memori-artifact-toolbar--chatlog': isChatLogPanel,
        })}
      >
        <div className="memori-artifact-toolbar--identity">
          <h2 className="memori-artifact-toolbar--title">
            {state.currentArtifact.title}
          </h2>
          <span className="memori-artifact-toolbar--type">
            {formatArtifactType(state.currentArtifact.mimeType)}
          </span>
        </div>

        <div className="memori-artifact-toolbar--controls">
          {hasPreview && (
            <TabSwitch
              activeTab={activeTab}
              onTabChange={handleTabChange}
              hasPreview={hasPreview}
            />
          )}

          {isCompactToolbar ? (
            <div className="memori-artifact-toolbar--mobile-actions">
              <Dropdown className="memori-mobile-actions-menu">
                <Dropdown.Trigger
                  showChevron={false}
                  className="memori-mobile-actions-trigger"
                  render={(
                    props: React.ButtonHTMLAttributes<HTMLButtonElement>
                  ) => (
                    <Button
                      {...props}
                      className={cx(
                        'memori-button',
                        'memori-button--more-options',
                        'memori-button--icon-only'
                      )}
                      variant="ghost"
                      title={t('artifact.actions') || 'Actions'}
                    >
                      <MoreVertical className="memori-artifact-action-icon" />
                    </Button>
                  )}
                />
                <Dropdown.Menu
                  className="memori-mobile-dropdown"
                  placement="bottom"
                  align="end"
                  sideOffset={8}
                >
                  <Dropdown.Item
                    className="memori-artifact-action-btn"
                    onClick={handleCopy}
                    icon={<Copy className="memori-artifact-action-icon" />}
                    label={t('artifact.copy') || 'Copy'}
                  >
                    {t('artifact.copy') || 'Copy'}
                  </Dropdown.Item>

                  {formats.map(format => {
                    const getIcon = () => {
                      switch (format.action) {
                        case 'copy':
                          return (
                            <LinkIcon className="memori-artifact-action-icon" />
                          );
                        case 'download':
                          return (
                            <Download className="memori-artifact-action-icon" />
                          );
                        case 'print':
                        case 'pdf':
                          return (
                            <Printer className="memori-artifact-action-icon" />
                          );
                        default:
                          return (
                            <LinkIcon className="memori-artifact-action-icon" />
                          );
                      }
                    };

                    return (
                      <Dropdown.Item
                        key={format.id}
                        className="memori-artifact-action-btn"
                        onClick={() => handleCopyFormat(format)}
                        disabled={
                          copyState.loading &&
                          copyState.activeFormat === format.id
                        }
                        icon={getIcon()}
                        label={format.label}
                      >
                        {format.label}
                      </Dropdown.Item>
                    );
                  })}

                  <Dropdown.Item
                    className="memori-artifact-action-btn"
                    onClick={() =>
                      handleOpenExternal(
                        state.currentArtifact ?? {
                          content: '',
                          mimeType: '',
                          title: '',
                          timestamp: new Date(),
                          size: 0,
                          id: '',
                          artifactId: '',
                        }
                      )
                    }
                    icon={<LinkIcon className="memori-artifact-action-icon" />}
                    label={t('artifact.external') || 'External'}
                  >
                    {t('artifact.external') || 'External'}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              {closeButton}
            </div>
          ) : (
            <>
              <ArtifactActions
                artifact={state.currentArtifact}
                onCopy={handleCopy}
                loading={false}
                isMobile={isCompactToolbar}
              />
              {closeButton}
            </>
          )}
        </div>
      </header>

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
