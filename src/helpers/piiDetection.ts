import type { PiiDetectionConfig, PiiDetectionRule } from '../types/layout';

/**
 * PII detection helper: runs regex rules on message text and returns whether any matched
 * and the localized error text to show in the chat (as a system error bubble).
 *
 * Edge cases handled:
 * - config disabled, null, or missing rules → no match
 * - empty or non-array rules → no match
 * - empty or whitespace-only regex pattern → skipped (avoid matching everything)
 * - invalid regex (throws) → caught, treated as no match, console.warn
 * - multiple rules with same id → deduplicated so message appears once
 * - missing message/errorMessage for lang → fallback: lang → en → first value → default string
 */

/**
 * Picks a localized string from a Record with fallback: lang -> 'en' -> first value -> fallback.
 * Used for errorMessage and each rule's message so the bubble uses the chat-selected language.
 */
function getLocalized(
  record: Record<string, string> | undefined,
  lang: string,
  fallback: string
): string {
  if (!record || typeof record !== 'object') return fallback;
  const normalizedLang = lang?.toLowerCase() || 'en';
  return (
    record[normalizedLang] ??
    record.en ??
    record['en'] ??
    Object.values(record)[0] ??
    fallback
  );
}

/**
 * Runs PII detection on text: tests each rule's regex and returns matched rules and error text.
 * - Deduplicates by rule.id so the same "kind" of PII doesn't appear twice in the message.
 * - Invalid regexes are caught and treated as no match (with a console.warn).
 *
 * @param text - Full message text to check (including any attached document content).
 * @param config - PII config from layout (enabled, rules, errorMessage).
 * @param lang - Chat-selected language (e.g. userLang) for picking localized strings.
 * @returns { matched: false } if no rule matches, or { matched: true, errorText } with the full error string to show.
 */
export function checkPii(
  text: string,
  config: PiiDetectionConfig,
  lang: string
): { matched: boolean; errorText?: string } {
  if (!config?.enabled || !Array.isArray(config.rules) || config.rules.length === 0) {
    return { matched: false };
  }

  const normalizedLang = lang?.toLowerCase() || 'en';
  const matchedRulesById = new Map<string, PiiDetectionRule>();

  for (const rule of config.rules) {
    if (!rule.pattern || !rule.pattern.trim()) {
      continue; // empty pattern would match everything; skip
    }
    try {
      const regex = new RegExp(rule.pattern);
      if (regex.test(text)) {
        if (!matchedRulesById.has(rule.id)) {
          matchedRulesById.set(rule.id, rule);
        }
      }
    } catch (err) {
      console.warn('[PII] Invalid regex for rule:', rule.id, rule.pattern, err);
    }
  }

  if (matchedRulesById.size === 0) {
    return { matched: false };
  }

  // Build one string: main errorMessage line + one line per matched rule (in selected language).
  const mainMessage = getLocalized(
    config.errorMessage,
    normalizedLang,
    'The message contains personal or sensitive data.'
  );
  const ruleMessages = Array.from(matchedRulesById.values()).map(rule => {
    const labelFallback = getLocalized(rule.label, normalizedLang, rule.id);
    return getLocalized(rule.message, normalizedLang, labelFallback);
  });
  const errorText = [mainMessage, ...ruleMessages].join('\n');

  return { matched: true, errorText };
}
