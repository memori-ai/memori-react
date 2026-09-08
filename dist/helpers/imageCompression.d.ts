export interface CompressionOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    maxSizeMB?: number;
}
export declare const compressImage: (file: File, options?: CompressionOptions) => Promise<File>;
