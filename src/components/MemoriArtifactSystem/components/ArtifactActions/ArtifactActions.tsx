/**
 * ArtifactActions Component
 * Provides action buttons for artifact operations (copy, download, print, etc.)
 * Following the project's component patterns and design system
 */

import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import Button from '../../../ui/Button';
import { ArtifactData } from '../../types/artifact.types';
import Download from '../../../icons/Download';
import Link from '../../../icons/Link';
import Fullscreen from '../../../icons/Fullscreen';
import FullscreenExit from '../../../icons/FullscreenExit';
import PrintIcon from '../../../icons/Print';
import { CopyButtonWithDropdown } from './';
import { Menu, Transition } from '@headlessui/react';
import MenuHorizontal from '../../../icons/MenuHorizontal';

const ArtifactActions: React.FC<{
  artifact: ArtifactData;
  onCopy: () => void;
  onDownload: () => void;
  onPrint: () => void;
  onOpenExternal: () => void;
  loading: boolean;
}> = ({
  artifact,
  onCopy,
  onDownload,
  onPrint,
  onOpenExternal,
  loading = false,
}) => {
  const { t } = useTranslation();

  /**
   * Get file extension for download
   */
  const getFileExtension = useCallback((mimeType: string): string => {
    const extensions: Record<string, string> = {
      html: 'html',
      json: 'json',
      markdown: 'md',
      css: 'css',
      javascript: 'js',
      typescript: 'ts',
      svg: 'svg',
      xml: 'xml',
      text: 'txt',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      csharp: 'cs',
      php: 'php',
      ruby: 'rb',
      go: 'go',
      rust: 'rs',
      yaml: 'yml',
      sql: 'sql',
    };
    return extensions[mimeType] || 'txt';
  }, []);

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

      onPrint();
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

      onOpenExternal();
    } catch (error) {
      console.error('External open failed:', error);
    }
  }, [artifact, getMimeTypeString, onOpenExternal]);

  return (
    <div className="memori-artifact-actions">
      <div className="memori-artifact-actions-row">
        <CopyButtonWithDropdown
          artifact={artifact}
          onCopy={onCopy}
          onDownload={onDownload}
          onPrint={onPrint}
          loading={loading}
          className="memori-artifact-action-btn"
        />
        <Menu as="div" className="memori-copy-menu-wrapper">
          <Menu.Button as="div" className="memori-copy-button-trigger">
            <Button
              disabled={loading}
              className={cx(
                'memori-button',
                'memori-button--circle',
                'memori-button--icon-only'
              )}
              ghost
              title="More copy options"
            >
              <MenuHorizontal className="memori-artifact-action-icon" />
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
            <Menu.Items className="memori-copy-dropdown" style={{minWidth: '200px'}}>
              <div className="memori-copy-dropdown-list">
                <Button
                  onClick={handlePrint}
                  disabled={loading}
                  className="memori-artifact-action-btn"
                  ghost
                  icon={<PrintIcon className="memori-artifact-action-icon" />}
                  title={t('artifact.print') || 'Print'}
                >
                  <span className="memori-artifact-action-text">
                    {t('artifact.print') || 'Print'}
                  </span>
                </Button>

                <Button
                  onClick={handleOpenExternal}
                  disabled={loading}
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
      </div>
    </div>
  );
};

export default ArtifactActions;
