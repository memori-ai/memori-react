import type { PiiDetectionConfig, PiiDetectionRule } from '../types/layout';

/**
 * Picks a localized string from a Record with fallback: lang -> 'en' -> first value -> fallback.
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
 * Deduplicates by rule.id. Invalid regexes are caught and treated as no match.
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

  const mainMessage = getLocalized(
    config.errorMessage,
    normalizedLang,
    'The message contains personal or sensitive data.'
  );
  const ruleMessages = Array.from(matchedRulesById.values()).map(rule =>
    getLocalized(rule.message, normalizedLang, rule.label)
  );
  const errorText = [mainMessage, ...ruleMessages].join('\n');

  return { matched: true, errorText };
}
