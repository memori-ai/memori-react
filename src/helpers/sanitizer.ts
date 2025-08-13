// tts/TextSanitizer.ts

import { escapeHTML, stripEmojis, stripHTML, stripMarkdown, stripOutputTags, stripReasoningTags } from "./utils";



/**
 * Sanitizza completamente il testo per la sintesi vocale
 * @param text Testo da sanitizzare
 */
export function sanitizeText(text: string): string {
  return escapeHTML(
    stripMarkdown(
      stripEmojis(stripHTML(stripReasoningTags(stripOutputTags(text))))
    )
  );
}
