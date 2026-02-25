/**
 * Layout name (string union used for layout selection).
 */
export type LayoutName =
  | 'DEFAULT'
  | 'FULLPAGE'
  | 'TOTEM'
  | 'CHAT'
  | 'WEBSITE_ASSISTANT'
  | 'HIDDEN_CHAT'
  | 'ZOOMED_FULL_BODY';

/**
 * Single PII detection rule: id, label, regex pattern, and localized messages.
 */
export interface PiiDetectionRule {
  id: string;
  label: string;
  pattern: string;
  message: Record<string, string>;
}

/**
 * PII detection config: enabled flag, rules array, and localized error message.
 */
export interface PiiDetectionConfig {
  enabled: boolean;
  rules: PiiDetectionRule[];
  errorMessage: Record<string, string>;
}

/**
 * Layout prop: either a layout name string or an object with name + optional piiDetection.
 */
export type LayoutProp =
  | LayoutName
  | { name: LayoutName; piiDetection?: PiiDetectionConfig };
