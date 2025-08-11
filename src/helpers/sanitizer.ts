// tts/TextSanitizer.ts

import { stripEmojis, stripHTML, stripMarkdown, stripOutputTags } from "./utils";



/**
 * Sanitizza completamente il testo per la sintesi vocale
 * @param text Testo da sanitizzare
 */
export function sanitizeText(text: string): string {
  return stripMarkdown(stripEmojis(stripHTML(stripOutputTags(text))));
}
