/**
 * PDFExporter utility for converting markdown content to PDF
 * Uses browser's print functionality with optimized CSS for PDF output
 */

import { PDFExportOptions } from '../types';
import { marked } from 'marked';

export class PDFExporter {
  private static instance: PDFExporter;
  private printWindow: Window | null = null;

  static getInstance(): PDFExporter {
    if (!PDFExporter.instance) {
      PDFExporter.instance = new PDFExporter();
    }
    return PDFExporter.instance;
  }

  /**
   * Convert markdown content to clean HTML for PDF export
   */
  private convertMarkdownToHTML(markdown: string): string {
    return marked(markdown) as string;
  }

  /**
   * Generate PDF-optimized CSS
   */
  private generatePDFCSS(options: PDFExportOptions = {}): string {
    const {
      margin = { top: '1in', right: '1in', bottom: '1in', left: '1in' },
      fontSize = '12pt',
      fontFamily = 'system-ui, -apple-system, sans-serif',
      lineHeight = '1.6',
      color = '#333',
      backgroundColor = '#fff',
    } = options;

    return `
      <style>
        @page {
          margin: ${margin.top} ${margin.right} ${margin.bottom} ${margin.left};
          size: A4;
        }

        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          body {
            font-family: ${fontFamily};
            font-size: ${fontSize};
            line-height: ${lineHeight};
            color: ${color};
            background-color: ${backgroundColor};
            margin: 0;
            padding: 0;
            max-width: none;
            word-wrap: break-word;
            overflow-wrap: break-word;
          }

          h1, h2, h3, h4, h5, h6 {
            page-break-after: avoid;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
            font-weight: 600;
          }

          h1 { font-size: 1.8em; }
          h2 { font-size: 1.5em; }
          h3 { font-size: 1.3em; }

          p {
            margin: 0 0 1em 0;
            orphans: 3;
            widows: 3;
          }

          pre, code {
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 0.9em;
            background-color: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 3px;
            padding: 0.2em 0.4em;
            page-break-inside: avoid;
          }

          pre {
            padding: 1em;
            overflow-x: auto;
            white-space: pre;
            margin: 1em 0;
          }

          pre code {
            background: none;
            border: none;
            padding: 0;
          }

          blockquote {
            margin: 1em 0;
            padding-left: 1em;
            border-left: 3px solid #ddd;
            font-style: italic;
            page-break-inside: avoid;
          }

          ul, ol {
            margin: 1em 0;
            padding-left: 2em;
          }

          li {
            margin: 0.25em 0;
            page-break-inside: avoid;
          }

          table {
            border-collapse: collapse;
            width: 100%;
            margin: 1em 0;
            page-break-inside: avoid;
          }

          th, td {
            border: 1px solid #ddd;
            padding: 0.5em;
            text-align: left;
          }

          th {
            background-color: #f5f5f5;
            font-weight: 600;
          }

          a {
            color: #0066cc;
            text-decoration: none;
          }

          a:hover {
            text-decoration: underline;
          }

          img {
            max-width: 100%;
            height: auto;
            page-break-inside: avoid;
          }

          .page-break {
            page-break-before: always;
          }

          .no-print {
            display: none !important;
          }
        }

        @media screen {
          body {
            font-family: ${fontFamily};
            font-size: ${fontSize};
            line-height: ${lineHeight};
            color: ${color};
            background-color: ${backgroundColor};
            margin: 20px;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
          }
        }
      </style>
    `;
  }

  /**
   * Create the complete HTML document for PDF export
   */
  private createPDFDocument(
    content: string,
    title: string = 'Artifact',
    options: PDFExportOptions = {}
  ): string {
    const htmlContent = this.convertMarkdownToHTML(content);
    const css = this.generatePDFCSS(options);

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        ${css}
      </head>
      <body>
        <div class="content">
          ${htmlContent}
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Export content as PDF using browser save functionality
   */
  async exportAsPDF(
    content: string,
    title: string = 'Artifact', 
    options: PDFExportOptions = {}
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Close any existing window
        if (this.printWindow && !this.printWindow.closed) {
          this.printWindow.close();
        }

        // Create new window
        this.printWindow = window.open('', '_blank', 'width=800,height=600');
        if (!this.printWindow) {
          reject(new Error('Popup blocked! Please enable popups to export PDF.'));
          return;
        }

        // Generate HTML content
        const htmlContent = this.createPDFDocument(content, title, options);

        // Write content to window
        this.printWindow.document.write(htmlContent);
        this.printWindow.document.close();

        // Wait for content to load
        this.printWindow.onload = () => {
          setTimeout(() => {
            if (this.printWindow) {
              // Trigger print dialog with PDF save option
              this.printWindow.document.title = title;
              this.printWindow.print();
              
              // Close window after print dialog closes
              setTimeout(() => {
                if (this.printWindow) {
                  this.printWindow.close();
                  resolve();
                }
              }, 1000);
            }
          }, 500);
        };

        // Handle errors
        this.printWindow.onerror = (error) => {
          reject(new Error(`PDF export failed: ${error}`));
        };

      } catch (error) {
        reject(new Error(`PDF export failed: ${error}`));
      }
    });
  }

  /**
   * Check if PDF export is supported
   */
  isSupported(): boolean {
    return typeof window !== 'undefined' && typeof window.open === 'function';
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    if (this.printWindow && !this.printWindow.closed) {
      this.printWindow.close();
    }
    this.printWindow = null;
  }
}

// Export singleton instance
export const pdfExporter = PDFExporter.getInstance();
