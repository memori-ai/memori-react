/**
 * Layout types and PII (Personally Identifiable Information) detection config.
 * Used when the widget accepts layout as either a string or an object with optional PII rules.
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
 * Layout prop: either a layout name string (backward compatible) or an object with
 * name + optional piiDetection. When piiDetection.enabled is true, sendMessage runs
 * the rules and blocks send + shows error bubble if any rule matches.
 */
export type LayoutProp =
  | LayoutName
  | { name: LayoutName; piiDetection?: PiiDetectionConfig };
