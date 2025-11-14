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
import { marked } from 'marked';
import DOMPurify from 'dompurify';

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
   * Render markdown content to HTML
   */
  const renderMarkdownToHtml = useCallback((markdown: string): string => {
    try {
      // Configure marked for basic markdown rendering
      marked.use({
        async: false,
        gfm: true,
        pedantic: false,
        renderer: {
          link: ({ href, title, text }: { href: string | null; title?: string | null; text: string }) => {
            if (!href) return text;
            const cleanHref = href.startsWith('http') ? href : `https://${href}`;
            return `<a href="${cleanHref}" target="_blank" rel="noopener noreferrer"${title ? ` title="${title}"` : ''}>${text}</a>`;
          },
        },
      });

      // Parse markdown to HTML
      const htmlContent = marked.parse(markdown).toString().trim();

      // Sanitize HTML for security
      const sanitizedHtml = DOMPurify.sanitize(htmlContent, {
        ADD_ATTR: ['target', 'rel'],
        ALLOWED_TAGS: [
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'p', 'br', 'strong', 'em', 'u', 's',
          'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
          'a', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
          'div', 'span'
        ],
        ALLOWED_ATTR: ['href', 'title', 'target', 'rel', 'src', 'alt', 'class', 'id']
      });

      return sanitizedHtml;
    } catch (error) {
      console.error('Error rendering markdown:', error);
      // Fallback to basic HTML escaping
      return markdown
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>');
    }
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
      let content = artifact.content;
      let mimeType = getMimeTypeString(artifact.mimeType);

      // For markdown files, render as HTML
      if (artifact.mimeType === 'markdown') {
        const renderedHtml = renderMarkdownToHtml(artifact.content);
        content = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${artifact.title || 'Artifact'}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background-color: #fff;
    }
    h1, h2, h3, h4, h5, h6 {
      color: #2c3e50;
      margin-top: 1.5em;
      margin-bottom: 0.5em;
    }
    h1 { border-bottom: 2px solid #eee; padding-bottom: 10px; }
    h2 { border-bottom: 1px solid #eee; padding-bottom: 5px; }
    code {
      background-color: #f4f4f4;
      padding: 2px 4px;
      border-radius: 3px;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    }
    pre {
      background-color: #f8f8f8;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
      border: 1px solid #e1e1e1;
    }
    pre code {
      background-color: transparent;
      padding: 0;
    }
    blockquote {
      border-left: 4px solid #ddd;
      margin: 0;
      padding-left: 20px;
      color: #666;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px 12px;
      text-align: left;
    }
    th {
      background-color: #f5f5f5;
      font-weight: 600;
    }
    a {
      color: #007acc;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    ul, ol {
      padding-left: 20px;
    }
    img {
      max-width: 100%;
      height: auto;
    }
  </style>
</head>
<body>
  ${renderedHtml}
</body>
</html>`;
        mimeType = 'text/html';
      }

      const blob = new Blob([content], { type: mimeType });
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
  }, [artifact, getMimeTypeString, renderMarkdownToHtml, onOpenExternal]);

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
            'memori-copy-button memori-copy-button--main ',
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
