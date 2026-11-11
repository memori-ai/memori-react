import { ArtifactEdit } from '../types/artifact.types';

export interface ApplyEditsResult {
  content: string;
  failedEdits: ArtifactEdit[];
  appliedCount: number;
}

/**
 * Normalize runs of whitespace to a single space for tolerant matching.
 */
const normalizeWhitespace = (s: string): string => s.replace(/\s+/g, ' ');

/**
 * Find the first occurrence of `needle` in `haystack` after normalizing
 * whitespace in both, then map the match back to original haystack indices.
 * Returns [start, end] in original string coords, or null if not found.
 */
const findWhitespaceTolerant = (
  haystack: string,
  needle: string
): [number, number] | null => {
  const normNeedle = normalizeWhitespace(needle.trim());
  if (!normNeedle) return null;

  // Build mapping from normalized index → original index
  const normChars: string[] = [];
  const normToOrig: number[] = [];
  let lastWasSpace = false;

  for (let i = 0; i < haystack.length; i++) {
    const ch = haystack[i];
    if (/\s/.test(ch)) {
      if (!lastWasSpace && normChars.length > 0) {
        normChars.push(' ');
        normToOrig.push(i);
        lastWasSpace = true;
      }
    } else {
      normChars.push(ch);
      normToOrig.push(i);
      lastWasSpace = false;
    }
  }

  // Trim trailing space from normalized form
  while (normChars.length > 0 && normChars[normChars.length - 1] === ' ') {
    normChars.pop();
    normToOrig.pop();
  }

  const normHaystack = normChars.join('');
  const idx = normHaystack.indexOf(normNeedle);
  if (idx === -1) return null;

  const startOrig = normToOrig[idx];
  const endNormIdx = idx + normNeedle.length - 1;
  // End is exclusive: one past the last matched original char
  const lastOrig = normToOrig[endNormIdx];
  // Include any trailing whitespace that was collapsed after the last char
  let endOrig = lastOrig + 1;
  while (endOrig < haystack.length && /\s/.test(haystack[endOrig])) {
    // Only consume whitespace that was part of a collapsed run inside the match
    // Stop if we've already covered the normalized span
    break;
  }

  return [startOrig, endOrig];
};

/**
 * Apply a list of string replacements to content.
 * Each edit replaces the first occurrence of `old` with `new`.
 * Exact match is tried first; whitespace-tolerant fallback second.
 * Failed edits are collected without aborting the rest.
 */
export const applyEdits = (
  content: string,
  edits: ArtifactEdit[]
): ApplyEditsResult => {
  let result = content;
  const failedEdits: ArtifactEdit[] = [];
  let appliedCount = 0;

  for (const edit of edits) {
    if (!edit || typeof edit.old !== 'string' || typeof edit.new !== 'string') {
      failedEdits.push(edit);
      continue;
    }

    const exactIdx = result.indexOf(edit.old);
    if (exactIdx !== -1) {
      result =
        result.slice(0, exactIdx) +
        edit.new +
        result.slice(exactIdx + edit.old.length);
      appliedCount++;
      continue;
    }

    const tolerant = findWhitespaceTolerant(result, edit.old);
    if (tolerant) {
      const [start, end] = tolerant;
      result = result.slice(0, start) + edit.new + result.slice(end);
      appliedCount++;
      continue;
    }

    failedEdits.push(edit);
  }

  return { content: result, failedEdits, appliedCount };
};

const HTML_ENTITIES: Record<string, string> = {
  '&quot;': '"',
  '&#34;': '"',
  '&apos;': "'",
  '&#39;': "'",
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
};

/**
 * Unescape common HTML entities that LLMs sometimes emit inside JSON bodies.
 */
const unescapeHtmlEntities = (s: string): string =>
  s.replace(
    /&quot;|&#34;|&apos;|&#39;|&amp;|&lt;|&gt;/g,
    m => HTML_ENTITIES[m] ?? m
  );

const isValidEditsArray = (value: unknown): value is ArtifactEdit[] => {
  if (!Array.isArray(value)) return false;
  return value.every(
    item =>
      item &&
      typeof item === 'object' &&
      typeof (item as ArtifactEdit).old === 'string' &&
      typeof (item as ArtifactEdit).new === 'string'
  );
};

/**
 * Parse the body of a memori-artifact update tag into an edits array.
 * Handles valid JSON and HTML-entity-encoded JSON. Returns null on failure.
 */
export const parseEdits = (body: string): ArtifactEdit[] | null => {
  if (!body || typeof body !== 'string') return null;

  const trimmed = body.trim();
  if (!trimmed) return null;

  const tryParse = (raw: string): ArtifactEdit[] | null => {
    try {
      const parsed = JSON.parse(raw);
      return isValidEditsArray(parsed) ? parsed : null;
    } catch {
      return null;
    }
  };

  const direct = tryParse(trimmed);
  if (direct) return direct;

  const unescaped = unescapeHtmlEntities(trimmed);
  if (unescaped !== trimmed) {
    return tryParse(unescaped);
  }

  return null;
};
