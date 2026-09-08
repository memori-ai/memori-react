import type { PiiDetectionConfig } from '../types/layout';
export declare function checkPii(text: string, config: PiiDetectionConfig, lang: string): {
    matched: boolean;
    errorText?: string;
};
