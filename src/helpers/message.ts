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
  reasoningText = 'Reasoning...'
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
        /<think>([\s\S]*?)<\/think>/g,
        `<details class="memori-think"><summary>${reasoningText}</summary>$1</details>`
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
      marked.use(
        markedKatex({
        })
      );

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

    // Ora procedi con il parsing markdown
    let parsedText = marked.parse(preprocessedText).toString().trim();

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
