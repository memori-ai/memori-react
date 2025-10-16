import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { MAX_MSG_CHARS, MAX_MSG_WORDS } from './constants';
import { cleanUrl } from './utils';
import markedLinkifyIt from 'marked-linkify-it';
import markedKatex from 'marked-katex-extension';
import markedExtendedTables from './markedExtendedTables';

// Always configure marked with necessary extensions
marked.use({
  async: false,
  gfm: true,
  pedantic: false,
  renderer: {
    link: ({
      href,
      title,
      text,
    }: {
      href: string | null;
      title?: string | null;
      text: string;
    }) => {
      const cleanHref = href ? cleanUrl(href) : null;

      if (cleanHref === null) {
        return text;
      }
      href = cleanHref;
      let out = '<a href="' + href + '"';
      if (title) {
        out += ' title="' + title + '"';
      }
      out += ' target="_blank" rel="noopener noreferrer">' + text + '</a>';
      return out;
    },
  },
});

marked.use(markedLinkifyIt());
marked.use(markedExtendedTables());

export const needsTruncation = (message: string) => {
  return (
    message.length > MAX_MSG_CHARS || message.split(' ').length > MAX_MSG_WORDS
  );
};

export const truncateMessage = (message: string) => {
  let truncatedMessage = message;
  if (message.length > MAX_MSG_CHARS) {
    truncatedMessage = `${message.slice(0, MAX_MSG_CHARS)}\n<br />...`;
  }
  if (truncatedMessage.split(' ').length > MAX_MSG_WORDS) {
    truncatedMessage = truncatedMessage
      .split(' ')
      .slice(0, MAX_MSG_WORDS)
      .join(' ');
  }
  return truncatedMessage;
};

export const renderMsg = (
  text: string,
  useMathFormatting = false,
  reasoningText = 'Reasoning...',
  showReasoning: boolean
): {
  text: string;
} => {
  try {
    // Preprocessing del testo per gestire i delimitatori LaTeX
    let preprocessedText = text
      .trim()
      .replaceAll(
        /\[([^\]]+)\]\(([^\)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
      )
      .replaceAll(
        /<think.*?>(.*?)<\/think>/gs,
        showReasoning
          ? `<details class="memori-think"><summary>${reasoningText}</summary>$1</details>`
          : ''
      )
      // Remove document_attachment tags from text - they will be handled as media
      .replaceAll(
        /<document_attachment filename="([^"]+)" type="([^"]+)">([\s\S]*?)<\/document_attachment>/g,
        ''
      )
      .replaceAll(
        /<output\s+class\s*=\s*["\']memori-artifact["\'][^>]*data-mimetype\s*=\s*["\']([^"']+)["\'][^>]*>([\s\S]*?)(?:<\/output>|$)/gi,
        ''
      )
      .replaceAll(/```markdown([^```]+)```/g, '$1')
      .replaceAll('($', '( $')
      .replaceAll(':$', ': $')
      .replaceAll('\frac', '\\frac')
      .replaceAll('\beta', '\\beta')
      .replaceAll('cdot', '\\cdot');

    // Correzione dei delimitatori LaTeX inconsistenti
    if (useMathFormatting) {
      // Abilita il supporto per KaTeX
      marked.use(markedKatex({}));

      // Normalizza tutti i delimitatori LaTeX per equazioni su linea separata
      // Da \\[ ... \\] o \\[ ... ] a $$ ... $$
      preprocessedText = preprocessedText.replace(
        /\\+\[(.*?)\\*\]/gs,
        (_, content) => {
          return `$$${content}$$`;
        }
      );

      // Gestione dei delimitatori [ ... ] che dovrebbero essere equazioni
      preprocessedText = preprocessedText.replace(
        /\[([^[\]]+?)\]/g,
        (match, content) => {
          // Verifica se sembra una formula matematica
          if (
            /[\\+a-z0-9_{}^=\-\+\*\/]+/i.test(content) &&
            !match.startsWith('[http') &&
            !match.includes('](')
          ) {
            return `$$${content}$$`;
          }
          return match; // Mantieni invariati i link e altre strutture
        }
      );
    }

    // Extract output tags before markdown processing to preserve their content as raw text
    const outputTags: string[] = [];
    let outputPlaceholder = 0;

    // Replace output tags with placeholders to prevent markdown parsing inside them
    preprocessedText = preprocessedText.replace(
      /(<output[^>]*>)([\s\S]*?)(<\/output>)/g,
      (_, openTag, content, closeTag) => {
        const placeholder = `<!--OUTPUT_PLACEHOLDER_${outputPlaceholder++}-->`;
        outputTags.push(`${openTag}${content}${closeTag}`);
        return placeholder;
      }
    );

    // Ensure proper separation after placeholders
    preprocessedText = preprocessedText.replace(
      /(<!--OUTPUT_PLACEHOLDER_\d+-->)\s*([^\s<\n-])/g,
      '$1\n\n$2'
    );

    // Ora procedi con il parsing markdown
    let parsedText = marked.parse(preprocessedText).toString().trim();

    // Restore output tags from placeholders (after markdown processing)
    outputTags.forEach((tag, index) => {
      parsedText = parsedText.replace(
        `<!--OUTPUT_PLACEHOLDER_${index}-->`,
        tag
      );
    });

    // Sanitize HTML
    parsedText = DOMPurify.sanitize(parsedText, {
      ADD_ATTR: ['target'],
    });

    // Clean up final text
    const finalText = parsedText
      .replace(/(<br>)+/g, '<br>')
      .replace(/<p><\/p>/g, '<br>')
      .replace(/<p><br><\/p>/g, '<br>');

    return { text: finalText };
  } catch (e) {
    console.error('Error rendering message:', e);
    return { text };
  }
};
