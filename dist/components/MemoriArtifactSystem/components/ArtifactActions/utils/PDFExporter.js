"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfExporter = exports.PDFExporter = void 0;
const marked_1 = require("marked");
const utils_1 = require("../../../../../helpers/utils");
class PDFExporter {
    constructor() {
        this.printWindow = null;
    }
    static getInstance() {
        if (!PDFExporter.instance) {
            PDFExporter.instance = new PDFExporter();
        }
        return PDFExporter.instance;
    }
    convertMarkdownToHTML(markdown) {
        return (0, marked_1.marked)(markdown);
    }
    generatePDFCSS(options = {}) {
        const { margin = { top: '1in', right: '1in', bottom: '1in', left: '1in' }, fontSize = '12pt', fontFamily = 'system-ui, -apple-system, sans-serif', lineHeight = '1.6', color = '#333', backgroundColor = '#fff', } = options;
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
    createPDFDocument(content, title = 'Artifact', options = {}) {
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
    async exportAsPDFSafari(content, title = 'Artifact', options = {}) {
        return new Promise((resolve, reject) => {
            try {
                const htmlContent = this.createPDFDocument(content, title, options);
                const printWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
                if (!printWindow) {
                    const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;
                    const link = document.createElement('a');
                    link.href = dataUrl;
                    link.download = `${title}.html`;
                    link.target = '_blank';
                    link.style.display = 'none';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    resolve();
                    return;
                }
                printWindow.document.open('text/html', 'replace');
                printWindow.document.write(htmlContent);
                printWindow.document.close();
                printWindow.document.title = title;
                setTimeout(() => {
                    try {
                        printWindow.focus();
                        printWindow.print();
                        setTimeout(() => {
                            if (printWindow && !printWindow.closed) {
                                printWindow.close();
                            }
                            resolve();
                        }, 3000);
                    }
                    catch (printError) {
                        console.warn('Print failed, trying alternative:', printError);
                        if (printWindow && !printWindow.closed) {
                            const instructionDiv = printWindow.document.createElement('div');
                            instructionDiv.style.cssText = `
                position: fixed;
                top: 20px;
                left: 20px;
                right: 20px;
                background: #f0f8ff;
                border: 2px solid #0066cc;
                padding: 20px;
                border-radius: 8px;
                font-family: system-ui, sans-serif;
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
              `;
                            instructionDiv.innerHTML = `
                <h3 style="margin: 0 0 10px 0; color: #0066cc;">📄 PDF Export Instructions</h3>
                <p style="margin: 0 0 10px 0;">To save as PDF:</p>
                <ol style="margin: 0 0 15px 0; padding-left: 20px;">
                  <li>Press <strong>Cmd+P</strong> (Mac) or <strong>Ctrl+P</strong> (Windows)</li>
                  <li>In the print dialog, click the "PDF" dropdown</li>
                  <li>Select "Save as PDF"</li>
                  <li>Choose your save location and click "Save"</li>
                </ol>
                <button onclick="this.parentElement.remove()" style="
                  background: #0066cc;
                  color: white;
                  border: none;
                  padding: 8px 16px;
                  border-radius: 4px;
                  cursor: pointer;
                ">Got it!</button>
              `;
                            printWindow.document.body.appendChild(instructionDiv);
                        }
                        resolve();
                    }
                }, 1000);
            }
            catch (error) {
                reject(new Error(`Safari PDF export failed: ${error}`));
            }
        });
    }
    async exportAsPDF(content, title = 'Artifact', options = {}) {
        if ((0, utils_1.isSafari)()) {
            return this.exportAsPDFSafari(content, title, options);
        }
        return new Promise((resolve, reject) => {
            try {
                if (this.printWindow && !this.printWindow.closed) {
                    this.printWindow.close();
                }
                const windowFeatures = (0, utils_1.isSafariIOS)()
                    ? 'width=800,height=600,scrollbars=yes,resizable=yes'
                    : 'width=800,height=600,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,status=no';
                this.printWindow = window.open('', '_blank', windowFeatures);
                if (!this.printWindow) {
                    reject(new Error('Popup blocked! Please enable popups to export PDF.'));
                    return;
                }
                const htmlContent = this.createPDFDocument(content, title, options);
                if ((0, utils_1.isSafari)()) {
                    this.printWindow.document.open('text/html', 'replace');
                    this.printWindow.document.write(htmlContent);
                    this.printWindow.document.close();
                    setTimeout(() => {
                        if (this.printWindow && !this.printWindow.closed) {
                            try {
                                this.printWindow.document.title = title;
                                this.printWindow.focus();
                                this.printWindow.print();
                                setTimeout(() => {
                                    if (this.printWindow && !this.printWindow.closed) {
                                        this.printWindow.close();
                                    }
                                    resolve();
                                }, 2000);
                            }
                            catch (printError) {
                                console.warn('Print dialog failed, trying alternative method:', printError);
                                this.printWindow.print();
                                setTimeout(() => {
                                    if (this.printWindow && !this.printWindow.closed) {
                                        this.printWindow.close();
                                    }
                                    resolve();
                                }, 2000);
                            }
                        }
                    }, 1000);
                }
                else {
                    this.printWindow.document.write(htmlContent);
                    this.printWindow.document.close();
                    this.printWindow.onload = () => {
                        setTimeout(() => {
                            if (this.printWindow) {
                                this.printWindow.document.title = title;
                                this.printWindow.print();
                                setTimeout(() => {
                                    if (this.printWindow) {
                                        this.printWindow.close();
                                        resolve();
                                    }
                                }, 1000);
                            }
                        }, 500);
                    };
                    this.printWindow.onerror = (error) => {
                        reject(new Error(`PDF export failed: ${error}`));
                    };
                }
            }
            catch (error) {
                reject(new Error(`PDF export failed: ${error}`));
            }
        });
    }
    isSupported() {
        return typeof window !== 'undefined' && typeof window.open === 'function';
    }
    isSafariSupported() {
        return (0, utils_1.isSafari)() && typeof window !== 'undefined' && typeof window.open === 'function';
    }
    cleanup() {
        if (this.printWindow && !this.printWindow.closed) {
            this.printWindow.close();
        }
        this.printWindow = null;
    }
}
exports.PDFExporter = PDFExporter;
exports.pdfExporter = PDFExporter.getInstance();
//# sourceMappingURL=PDFExporter.js.map