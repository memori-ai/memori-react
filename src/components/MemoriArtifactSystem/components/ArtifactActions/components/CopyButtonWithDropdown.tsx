/**
 * CopyButtonWithDropdown - Main component with dropdown menu
 * Similar to Claude's copy system with format-specific options using headless-ui
 */

import React, { useRef, useEffect, useCallback } from 'react';
import { Menu, Transition } from '@headlessui/react';
import cx from 'classnames';
import { CopyButtonWithDropdownProps, CopyFormat } from '../types';
import { useCopyArtifact } from '../hooks/useCopyArtifact';
import CopyMenuItem from './CopyMenuItem';
import Button from '../../../../ui/Button';
import Copy from '../../../../icons/Copy';
import ChevronDown from '../../../../icons/ChevronDown';
import ThumbUp from '../../../../icons/ThumbUp';
import Alert from '../../../../icons/Alert';
import { useTranslation } from 'react-i18next';
import Link from '../../../../icons/Link';
import PrintIcon from '../../../../icons/Print';

const CopyButtonWithDropdown: React.FC<CopyButtonWithDropdownProps> = ({
  artifact,
  onCopy,
  onDownload,
  onPrint,
  onOpenExternal,
  loading = false,
  className,
  disabled = false,
}) => {
  const { copyState, formats, handleCopy, handleCopyClick } = useCopyArtifact(
    artifact,
    onCopy,
    onDownload,
    onPrint
  );
  const { t } = useTranslation();

  /**
   * Handle format selection from dropdown
   */
  const handleFormatSelect = async (format: typeof formats[0]) => {
    await handleCopy(format);
  };

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
   * Get button content based on state
   */
  const getButtonContent = () => {
    if (copyState.success) {
      return (
        <>
          <ThumbUp className="memori-copy-button-icon memori-copy-button-icon--success" />
          <span className="memori-copy-button-text">
            {t('artifact.copied') || 'Copied!'}
          </span>
        </>
      );
    }

    if (copyState.error) {
      return (
        <>
          <Alert className="memori-copy-button-icon memori-copy-button-icon--error" />
          <span className="memori-copy-button-text">
            {t('artifact.error') || 'Error'}
          </span>
        </>
      );
    }

    if (copyState.loading) {
      return (
        <>
          <div className="memori-copy-button-loading">
            <div className="memori-copy-button-spinner" />
          </div>
          <span className="memori-copy-button-text">
            {copyState.activeFormat === 'pdf'
              ? t('artifact.generatingPdf') || 'Generating PDF...'
              : t('artifact.copying') || 'Copying...'}
          </span>
        </>
      );
    }

    return (
      <>
        <Copy className="memori-copy-button-icon" />
        <span className="memori-copy-button-text">
          {t('artifact.copy') || 'Copy'}
        </span>
      </>
    );
  };

  /**
   * Handle print action
   */
  const handlePrint = useCallback(() => {
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Popup blocked! Please enable popups to print the artifact.');
        return;
      }

      let printContent: string;
      if (artifact.mimeType === 'html') {
        printContent = artifact.content;
      } else {
        printContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <title>Artifact - ${artifact.mimeType.toUpperCase()}</title>
              <style>
                body { 
                  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace; 
                  white-space: pre-wrap; 
                  margin: 20px; 
                  line-height: 1.4;
                }
                @media print { 
                  body { margin: 0; } 
                }
              </style>
            </head>
            <body>${artifact.content
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')}</body>
            </html>
          `;
      }

      printWindow.document.write(printContent);
      printWindow.document.close();

      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);

      onPrint?.();
    } catch (error) {
      console.error('Print failed:', error);
    }
  }, [artifact, onPrint]);

  /**
   * Handle external open action
   */
  const handleOpenExternal = useCallback(() => {
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

      onOpenExternal?.();
    } catch (error) {
      console.error('External open failed:', error);
    }
  }, [artifact, getMimeTypeString, onOpenExternal]);

  /**
   * Get button title/tooltip
   */
  const getButtonTitle = () => {
    if (copyState.success) {
      return 'Copied successfully!';
    }

    if (copyState.error) {
      return `Error: ${copyState.error}`;
    }

    if (copyState.loading) {
      return copyState.activeFormat === 'pdf'
        ? 'Generating PDF...'
        : 'Copying...';
    }

    if (formats.length > 0) {
      return `Copy as ${formats[0].label}`;
    }

    return 'Copy';
  };

  return (
    <div className="memori-copy-button-wrapper">
      <div className="memori-copy-button-group">
        {/* Main copy button */}
        <Button
          onClick={handleCopyClick}
          disabled={disabled || loading || copyState.loading}
          className={cx(
            'memori-copy-button memori-copy-button--main',
            {
              'memori-copy-button--success': copyState.success,
              'memori-copy-button--error': copyState.error,
              'memori-copy-button--loading': copyState.loading,
            },
            className
          )}
          ghost
          title={getButtonTitle()}
        >
          {getButtonContent()}
        </Button>

        {/* Dropdown button (only show if multiple formats) */}
        {formats.length > 0 && (
          <Menu as="div" className="memori-copy-menu-wrapper">
            {() => (
              <>
                <Menu.Button as="div" className="memori-copy-button-trigger">
                  <Button
                    disabled={disabled || loading || copyState.loading}
                    className="memori-copy-button--dropdown"
                    ghost
                    title="More copy options"
                  >
                    <ChevronDown className="memori-copy-button-chevron" />
                  </Button>
                </Menu.Button>

                <Transition
                  as={React.Fragment}
                  enter="memori-copy-dropdown-enter"
                  enterFrom="memori-copy-dropdown-enter-from"
                  enterTo="memori-copy-dropdown-enter-to"
                  leave="memori-copy-dropdown-leave"
                  leaveFrom="memori-copy-dropdown-leave-from"
                  leaveTo="memori-copy-dropdown-leave-to"
                >
                  <Menu.Items className="memori-copy-dropdown">
                    <div className="memori-copy-dropdown-content">
                      <div className="memori-copy-dropdown-list">
                        {formats.map(format => (
                          <Menu.Item key={format.id}>
                            {({ active }) => (
                              <CopyMenuItem
                                format={format}
                                onClick={handleFormatSelect}
                                loading={copyState.loading}
                                active={active}
                              />
                            )}
                          </Menu.Item>
                        ))}
                        <CopyMenuItem
                          format={{
                            id: 'external',
                            label: t('artifact.external') || 'External',
                            action: 'link',
                            mimeType: artifact.mimeType,
                          }}
                          onClick={handleOpenExternal}
                          loading={copyState.loading}
                          active={false}
                        />
                        <CopyMenuItem
                          format={{
                            id: 'print',
                            label: t('artifact.print') || 'Print',
                            action: 'print',
                            mimeType: artifact.mimeType,
                          }}
                          onClick={handlePrint}
                          loading={copyState.loading}
                          active={false}
                        />

                      </div>
                    </div>
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>
        )}
      </div>
    </div>
  );
};

export default CopyButtonWithDropdown;
