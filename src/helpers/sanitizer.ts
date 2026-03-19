// tts/TextSanitizer.ts

import {
  escapeHTML,
  stripEmojis,
  stripHTML,
  stripMarkdown,
  stripOutputTags,
  stripReasoningTags,
} from './utils';

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

/** Placeholder prefix per preservare i tag di pausa durante la sanitizzazione TTS */
const TTS_PAUSE_PLACEHOLDER_PREFIX = 'TTSBREAK';

/**
 * Regex che matcha tag SSML <break .../> o custom <pause .../> (self-closing o con contenuto).
 * Usato per estrarre e preservare i tag di pausa prima di stripHTML.
 */
const TTS_PAUSE_TAG_REGEX =
  /<(break|pause)\s[^>]*?(?:\/\s*>|>[\s\S]*?<\/\1>)/gi;

/**
 * Converte i tag custom <pause ms="X"/> in SSML <break time="Xms"/>.
 * I tag <break ...> già in formato SSML vengono lasciati invariati.
 */
export function normalizePauseToBreak(text: string): string {
  return text
    .replace(
      /<pause\s+ms="(\d+)"([^>]*?)\/\s*>/gi,
      '<break time="$1ms"$2/>'
    )
    .replace(/<pause\s+ms="(\d+)"([^>]*)>/gi, '<break time="$1ms"$2>')
    .replace(/<\/pause>/gi, '</break>');
}

/**
 * Sanitizza il testo per la sintesi vocale preservando i tag di pausa
 * (<break .../> e <pause .../>). Rimuove solo output, think, HTML non-TTS, markdown, emoji.
 * Non applica escapeHTML perché il risultato deve essere inviato all'API TTS con SSML.
 *
 * Da usare quando si prepara il testo da passare a speak() / API TTS.
 */
export function sanitizeTextForTTS(text: string): string {
  const preservedTags: string[] = [];

  const withPlaceholders = text.replace(TTS_PAUSE_TAG_REGEX, (match) => {
    preservedTags.push(match);
    return ` ${TTS_PAUSE_PLACEHOLDER_PREFIX}${preservedTags.length - 1} `;
  });

  const stripped = stripMarkdown(
    stripEmojis(
      stripHTML(stripReasoningTags(stripOutputTags(withPlaceholders)))
    )
  );

  let restored = stripped;
  preservedTags.forEach((tag, i) => {
    const placeholder = ` ${TTS_PAUSE_PLACEHOLDER_PREFIX}${i} `;
    restored = restored.replace(placeholder, tag);
  });

  return normalizePauseToBreak(restored);
}
