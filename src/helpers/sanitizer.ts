// tts/TextSanitizer.ts

/**
 * Rimuove la formattazione Markdown dal testo
 * @param text Testo da processare
 */
export function stripMarkdown(text: string): string {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
      .replace(/\*(.*?)\*/g, '$1')     // Italic
      .replace(/__(.*?)__/g, '$1')     // Bold
      .replace(/_(.*?)_/g, '$1')       // Italic
      .replace(/~~(.*?)~~/g, '$1')     // Strikethrough
      .replace(/```(.*?)```/gs, '$1')  // Code blocks
      .replace(/`(.*?)`/g, '$1')       // Inline code
      .replace(/\[(.*?)\]\((.*?)\)/g, '$1'); // Links
  }
  
  /**
   * Rimuove gli emoji dal testo
   * @param text Testo da processare
   */
  export function stripEmojis(text: string): string {
    return text.replace(/[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}]/gu, '');
  }
  
  /**
   * Rimuove i tag HTML dal testo
   * @param text Testo da processare
   */
  export function stripHTML(text: string): string {
    return text.replace(/<[^>]*>/g, '');
  }
  
  /**
   * Rimuove i tag di output specifici dal testo
   * @param text Testo da processare
   */
  export function stripOutputTags(text: string): string {
    // Implementa se necessario per il tuo caso specifico
    return text;
  }
  
  /**
   * Esegue l'escape dei caratteri speciali HTML
   * @param text Testo da processare
   */
  export function escapeHTML(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
  
  /**
   * Sanitizza completamente il testo per la sintesi vocale
   * @param text Testo da sanitizzare
   */
  export function sanitizeText(text: string): string {
    return escapeHTML(
      stripMarkdown(
        stripEmojis(
          stripHTML(
            stripOutputTags(text)
          )
        )
      )
    );
  }