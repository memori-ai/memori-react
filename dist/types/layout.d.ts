export type LayoutName = 'DEFAULT' | 'FULLPAGE' | 'TOTEM' | 'CHAT' | 'WEBSITE_ASSISTANT' | 'HIDDEN_CHAT' | 'ZOOMED_FULL_BODY';
export interface PiiDetectionRule {
    id: string;
    label: Record<string, string>;
    pattern: string;
    message: Record<string, string>;
}
export interface PiiDetectionConfig {
    enabled: boolean;
    rules: PiiDetectionRule[];
    errorMessage: Record<string, string>;
}
export type LayoutProp = LayoutName | {
    name: LayoutName;
    piiDetection?: PiiDetectionConfig;
};
