/**
 * useCopyArtifact hook for handling artifact copy operations
 * Supports multiple formats and PDF generation
 */

import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CopyFormat,
  UseCopyArtifactReturn,
  CopyState,
  PDFExportOptions,
} from '../types';
import { pdfExporter } from '../utils/PDFExporter';

export const useCopyArtifact = (
  artifact: { content: string; mimeType: string; title?: string },
  onCopy?: () => void,
  onDownload?: () => void,
  onPrint?: () => void
): UseCopyArtifactReturn => {
  const { t } = useTranslation();
  const [copyState, setCopyState] = useState<CopyState>({
    isOpen: false,
    loading: false,
    success: false,
    error: null,
    activeFormat: null,
  });

  /**
   * Get available copy formats based on artifact mimeType
   */
  const formats = useMemo((): CopyFormat[] => {
    const baseFormats: CopyFormat[] = [];

    switch (artifact.mimeType) {
      case 'markdown':
        baseFormats.push(
          {
            id: 'markdown',
            label: t('artifact.downloadAsMarkdown') || 'Download as Markdown',
            description: t('artifact.downloadRawMarkdownText') || 'Download raw markdown text',
            mimeType: 'text/markdown',
            action: 'download',
          },
          {
            id: 'pdf',
            label: t('artifact.downloadAsPdf') || 'Download as PDF',
            description: t('artifact.exportAsPdfDocument') || 'Export as PDF document',
            mimeType: 'application/pdf',
            action: 'pdf',
            isAsync: true,
          }
        );
        break;

      case 'html':
        baseFormats.push({
          id: 'html',
          label: t('artifact.downloadAsHtml') || 'Download as HTML',
          description: t('artifact.downloadFormattedHtml') || 'Download formatted HTML',
          mimeType: 'text/html',
          action: 'download',
        });
        break;

      case 'json':
        baseFormats.push({
          id: 'json',
          label: t('artifact.downloadAsJson') || 'Download as JSON',
          description: t('artifact.downloadJsonData') || 'Download JSON data',
          mimeType: 'application/json',
          action: 'download',
        });
        break;

      case 'image/png':
        baseFormats.push({
          id: 'png',
          label: t('artifact.downloadAsPng') || 'Download as PNG',
          description: t('artifact.downloadPngImage') || 'Download PNG image',
          mimeType: 'image/png',
          action: 'download',
        });
        break;

      case 'image/jpeg':
        baseFormats.push({
          id: 'jpeg',
          label: t('artifact.downloadAsJpeg') || 'Download as JPEG',
          description: t('artifact.downloadJpegImage') || 'Download JPEG image',
          mimeType: 'image/jpeg',
          action: 'download',
        });
        break;

      case 'image/gif':
        baseFormats.push({
          id: 'gif',
          label: t('artifact.downloadAsGif') || 'Download as GIF',
          description: t('artifact.downloadGifImage') || 'Download GIF image',
          mimeType: 'image/gif',
          action: 'download',
        });
        break;

      case 'image/webp':
        baseFormats.push({
          id: 'webp',
          label: t('artifact.downloadAsWebp') || 'Download as WebP',
          description: t('artifact.downloadWebpImage') || 'Download WebP image',
          mimeType: 'image/webp',
          action: 'download',
        });
        break;

      case 'image/svg+xml':
        baseFormats.push(
          {
            id: 'svg',
            label: t('artifact.copyAsSvg') || 'Copy as SVG',
            description: t('artifact.copySvgSourceCode') || 'Copy SVG source code',
            mimeType: 'image/svg+xml',
            action: 'copy',
          },
          {
            id: 'plain',
            label: t('artifact.copyAsPlainText') || 'Copy as Plain Text',
            description: t('artifact.copyAsText') || 'Copy as text',
            mimeType: 'text/plain',
            action: 'copy',
          }
        );
        break;

      default:
        // Handle code artifacts (application/vnd.ant.code)
        if (artifact.mimeType.startsWith('application/vnd.ant.code')) {
          const language = artifact.mimeType.split('.').pop() || 'text';
          baseFormats.push(
            {
              id: 'code',
              label: t('artifact.copyAsLanguage', { language: language.charAt(0).toUpperCase() + language.slice(1) }) || `Copy as ${language.charAt(0).toUpperCase() + language.slice(1)}`,
              description: t('artifact.copyLanguageCode', { language }) || `Copy ${language} code`,
              mimeType: artifact.mimeType,
              action: 'copy',
            },
            {
              id: 'plain',
              label: t('artifact.copyAsPlainText') || 'Copy as Plain Text',
              description: t('artifact.copyWithoutSyntaxHighlighting') || 'Copy without syntax highlighting',
              mimeType: 'text/plain',
              action: 'copy',
            }
          );
        } else {
          // Generic text content
          baseFormats.push({
            id: 'text',
            label: t('artifact.copyAsText') || 'Copy as Text',
            description: t('artifact.copyTextContent') || 'Copy text content',
            mimeType: 'text/plain',
            action: 'copy',
          });
        }
        break;
    }

    return baseFormats;
  }, [artifact.mimeType, t]);

  /**
   * Convert content based on format
   */
  const convertContent = useCallback(
    (format: CopyFormat): string => {
      const { content } = artifact;

      switch (format.id) {
        case 'plain':
          // Strip HTML tags and markdown formatting
          return content
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/#{1,6}\s+/g, '') // Remove markdown headers
            .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
            .replace(/\*(.*?)\*/g, '$1') // Remove italic
            .replace(/`([^`]+)`/g, '$1') // Remove inline code
            .replace(/```[\s\S]*?```/g, '') // Remove code blocks
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
            .trim();

        case 'html':
          // Return HTML content as-is
          return content;

        case 'raw':
          // Return raw HTML with escaped characters
          return content
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        case 'markdown':
          // Return markdown content as-is
          return content;

        case 'svg':
          // Return SVG content as-is
          return content;

        default:
          // Return content as-is for code and other formats
          return content;
      }
    },
    [artifact.content]
  );

  /**
   * Copy content to clipboard
   */
  const copyToClipboard = useCallback(async (text: string): Promise<void> => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }, []);

  /**
   * Handle copy operation
   */
  const handleCopy = useCallback(
    async (format: CopyFormat): Promise<void> => {
      setCopyState(prev => ({
        ...prev,
        loading: true,
        error: null,
        activeFormat: format.id,
      }));

      try {
        if (format.action === 'pdf') {
          // Handle PDF generation
          // First check if PDF export is supported in this browser
          // If not, throw a translated error message
          if (!pdfExporter.isSupported()) {
            throw new Error(t('artifact.pdfExportNotSupported') || 'PDF export is not supported in this browser');
          }

          // Configure PDF export options with sensible defaults
          const pdfOptions: PDFExportOptions = {
            title: artifact.title || 'Artifact', // Use artifact title or fallback
            fontSize: '12pt', // Standard readable font size
            fontFamily: 'system-ui, -apple-system, sans-serif', // System fonts
            lineHeight: '1.6', // Comfortable line height for reading
            color: '#333', // Dark gray text for good contrast
            backgroundColor: '#fff', // White background
          };

          // Export the artifact content to PDF using the configured options
          await pdfExporter.exportAsPDF(
            artifact.content,
            artifact.title || 'Artifact',
            pdfOptions
          );

          // Call the optional onPrint callback if provided
          onPrint?.();
        } else if (format.action === 'print') {
          // Handle print operation
          const printContent = convertContent(format);
          const printWindow = window.open('', '_blank');

          if (!printWindow) {
            throw new Error(t('artifact.popupBlocked') || 'Popup blocked! Please enable popups to print.');
          }

          const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>${artifact.title || 'Artifact'}</title>
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
          <body>${printContent
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')}</body>
          </html>
        `;

          printWindow.document.write(htmlContent);
          printWindow.document.close();

          setTimeout(() => {
            printWindow.print();
            printWindow.close();
          }, 500);

          onPrint?.();
        } else if (format.action === 'download') {
          // Handle download operation
          const contentToDownload = convertContent(format);
          const blob = new Blob([contentToDownload], { type: format.mimeType });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${artifact.title || 'Artifact'}.${
            format.mimeType.split('/')[1]
          }`;
          a.click();
          URL.revokeObjectURL(url);
          onDownload?.();
        } else if (format.action === 'copy') {
          // Handle regular copy operation
          const contentToCopy = convertContent(format);
          await copyToClipboard(contentToCopy);
          onCopy?.();
        }

        setCopyState(prev => ({
          ...prev,
          loading: false,
          success: format.action === 'copy',
          error: null,
        }));

        // Reset success state after delay (only for copy actions)
        if (format.action === 'copy') {
          setTimeout(() => {
            setCopyState(prev => ({
              ...prev,
              success: false,
            }));
          }, 2000);
        }
      } catch (error) {
        console.error('Copy operation failed:', error);
        setCopyState(prev => ({
          ...prev,
          loading: false,
          success: false,
          error:
            error instanceof Error ? error.message : 'Copy operation failed',
        }));

        // Reset error state after delay
        setTimeout(() => {
          setCopyState(prev => ({
            ...prev,
            error: null,
          }));
        }, 3000);
      }
    },
    [artifact, convertContent, copyToClipboard, onCopy, onPrint, t]
  );

  /**
   * Handle copy button click - always copy the first/default format
   */
  const handleCopyClick = useCallback(async () => {
    // Handle regular copy operation
    const contentToCopy = convertContent(formats[0]);
    await copyToClipboard(contentToCopy);

    setCopyState(prev => ({
      ...prev,
      loading: false,
      success: true,
      error: null,
    }));

    onCopy?.();
  }, [convertContent, copyToClipboard, onCopy, formats]);

  /**
   * Toggle dropdown visibility
   */
  const toggleDropdown = useCallback(() => {
    setCopyState(prev => ({
      ...prev,
      isOpen: !prev.isOpen,
      error: null,
    }));
  }, []);

  /**
   * Close dropdown
   */
  const closeDropdown = useCallback(() => {
    setCopyState(prev => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  /**
   * Reset all state
   */
  const resetState = useCallback(() => {
    setCopyState({
      isOpen: false,
      loading: false,
      success: false,
      error: null,
      activeFormat: null,
    });
  }, []);

  return {
    copyState,
    formats,
    handleCopy,
    handleCopyClick,
    toggleDropdown,
    closeDropdown,
    resetState,
  };
};
