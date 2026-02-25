/**
 * Layout types and PII (Personally Identifiable Information) detection config.
 * The widget's `layout` prop is always a string (LayoutName). PII is only configured
 * via integration: integration.customData (JSON) can have layout as an object (LayoutProp).
 */

/** Layout name (string union used for layout selection across the app). */
export type LayoutName =
  | 'DEFAULT'
  | 'FULLPAGE'
  | 'TOTEM'
  | 'CHAT'
  | 'WEBSITE_ASSISTANT'
  | 'HIDDEN_CHAT'
  | 'ZOOMED_FULL_BODY';

/**
 * Single PII detection rule: one regex pattern and its localized violation message.
 * - id: unique key (used to deduplicate when multiple rules share the same id).
 * - label: human-readable name (e.g. "Email", "IBAN").
 * - pattern: regex string (e.g. "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b").
 * - message: { [lang]: string } for the chat-selected language when multilingual is on (e.g. { it: "...", en: "..." }).
 */
export interface PiiDetectionRule {
  id: string;
  label: string;
  pattern: string;
  message: Record<string, string>;
}

/**
 * PII detection config attached to the layout when enabled.
 * - enabled: when true, messages are checked before sending.
 * - rules: list of regex rules; if any matches, the message is blocked and an error is shown.
 * - errorMessage: localized main line shown in the error bubble (e.g. "The message contains personal or sensitive data.").
 */
export interface PiiDetectionConfig {
  enabled: boolean;
  rules: PiiDetectionRule[];
  errorMessage: Record<string, string>;
}

/**
 * Layout as object: only used inside integration customData (not as the layout prop).
 * When customData.layout is this shape and piiDetection.enabled is true, the widget
 * runs PII checks before sending and shows an error bubble if any rule matches.
 */
export type LayoutProp =
  | LayoutName
  | { name: LayoutName; piiDetection?: PiiDetectionConfig };
