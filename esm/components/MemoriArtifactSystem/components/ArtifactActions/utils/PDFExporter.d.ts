import { PDFExportOptions } from '../types';
export declare class PDFExporter {
    private static instance;
    private printWindow;
    static getInstance(): PDFExporter;
    private convertMarkdownToHTML;
    private generatePDFCSS;
    private createPDFDocument;
    exportAsPDFSafari(content: string, title?: string, options?: PDFExportOptions): Promise<void>;
    exportAsPDF(content: string, title?: string, options?: PDFExportOptions): Promise<void>;
    isSupported(): boolean;
    isSafariSupported(): boolean;
    cleanup(): void;
}
export declare const pdfExporter: PDFExporter;
