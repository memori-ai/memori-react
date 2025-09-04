/**
 * ArtifactActions Component
 * Provides action buttons for artifact operations (copy, download, print, etc.)
 * Following the project's component patterns and design system
 */

import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import Button from '../../../ui/Button';
import { ArtifactActionsProps } from '../../types/artifact.types';
import Download from '../../../icons/Download';
import Link from '../../../icons/Link';
import Fullscreen from '../../../icons/Fullscreen';
import FullscreenExit from '../../../icons/FullscreenExit';
import PrintIcon from '../../../icons/Print';
import Copy from '../../../icons/Copy';

const ArtifactActions: React.FC<ArtifactActionsProps> = ({
  artifact,
  onCopy,
  onDownload,
  onPrint,
  onOpenExternal,
  onToggleFullscreen,
  isFullscreen,
  loading = false,
}) => {
  const { t } = useTranslation();
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  /**
   * Handle copy action with feedback
   */
  const handleCopy = useCallback(async () => {
    try {
      await onCopy();
      setCopyFeedback('✅ Copied!');
      setTimeout(() => setCopyFeedback(null), 2000);
    } catch (error) {
      setCopyFeedback('❌ Error');
      setTimeout(() => setCopyFeedback(null), 2000);
    }
  }, [onCopy]);

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
   * Handle download action
   */
  const handleDownload = useCallback(() => {
    try {
      const extension = getFileExtension(artifact.mimeType);
      const filename = `artifact-${Date.now()}.${extension}`;
      const mimeType = getMimeTypeString(artifact.mimeType);
      
      const blob = new Blob([artifact.content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      onDownload();
    } catch (error) {
      console.error('Download failed:', error);
    }
  }, [artifact, getFileExtension, getMimeTypeString, onDownload]);

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
          <body>${artifact.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</body>
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
        alert('Popup blocked! Please enable popups to open the artifact in a new window.');
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
      <Button
        onClick={handleCopy}
        disabled={loading}
        title={t('artifact.copy', 'Copy code') || 'Copy code'}
        className="memori-artifact-action-btn"
        ghost
      >
      <Copy className="memori-artifact-action-icon" />
        <span className="memori-artifact-action-text">
          {copyFeedback || t('artifact.copy', 'Copy')}
        </span>
      </Button>

      <Button
        onClick={handleDownload}
        disabled={loading}
        title={t('artifact.download', 'Download artifact') || 'Download artifact'}
        className="memori-artifact-action-btn"
        ghost
      >
        <Download className="memori-artifact-action-icon" />
        <span className="memori-artifact-action-text">
          {t('artifact.download', 'Download')}
        </span>
      </Button>

      <Button
        onClick={handlePrint}
        disabled={loading}
        title={t('artifact.print', 'Print artifact') || 'Print artifact'}
        className="memori-artifact-action-btn"
        ghost
      >
        <PrintIcon className="memori-artifact-action-icon" />
        <span className="memori-artifact-action-text">
          {t('artifact.print', 'Print')}
        </span>
      </Button>

      <Button
        onClick={handleOpenExternal}
        disabled={loading}
        title={t('artifact.external', 'Open in new window') || 'Open in new window'}
        className="memori-artifact-action-btn"
        ghost
      >
        <Link className="memori-artifact-action-icon" />
        <span className="memori-artifact-action-text">
          {t('artifact.external', 'External')}
        </span>
      </Button>

      <Button
        onClick={onToggleFullscreen}
        disabled={loading}
        title={isFullscreen ? (t('artifact.exitFullscreen', 'Exit fullscreen') || 'Exit fullscreen') : (t('artifact.fullscreen', 'Fullscreen') || 'Fullscreen')}
        className={cx('memori-artifact-action-btn', 'memori-artifact-fullscreen-btn', {
          'memori-artifact-fullscreen-btn--active': isFullscreen,
        })}
        primary={isFullscreen}
        ghost={!isFullscreen}
      >
        {isFullscreen ? <Fullscreen className="memori-artifact-action-icon" /> : <FullscreenExit className="memori-artifact-action-icon" />}
        <span className="memori-artifact-action-text">
          {isFullscreen ? t('artifact.exitFullscreen', 'Exit') : t('artifact.fullscreen', 'Full')}
        </span>
      </Button>
    </div>
  );
};

export default ArtifactActions;
