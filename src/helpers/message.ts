import { marked, Token } from 'marked';
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

export const stripAttachmentTags = (value: string) =>
  value
    .replaceAll(
      /<document_attachment filename="([^"]+)" type="([^"]+)">([\s\S]*?)<\/document_attachment>/g,
      ''
    )
    .replaceAll(/<attachment_source>\s*[\s\S]*?\s*<\/attachment_source>/g, '')
    .replaceAll(/<attachment_link>\s*[\s\S]*?\s*<\/attachment_link>/g, '');

const ASSET_URL_RE = /https?:\/\/\S*\/api\/v\d+\/asset\/\S+/gi;

/**
 * Strips all internal document/attachment wrapper tags AND bare asset URLs.
 * Use this for any user-facing text output (copy, export, tooltips, etc.).
 */
export const stripAllInternalTags = (value: string) =>
  stripAttachmentTags(value)
    .replace(/<\/?documents?\b[^>]*>/gi, '')
    .replace(/<documents?\b[^>]*\/>/gi, '')
    .replace(/<\/?attachments?\b[^>]*>/gi, '')
    .replace(/<attachments?\b[^>]*\/>/gi, '')
    .replace(ASSET_URL_RE, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

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

export const sanitizeMsg = (msg: string) =>
  DOMPurify.sanitize(msg, { ADD_ATTR: ['target'] });

const CODE_SEGMENT_RE = /(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]+`)/g;

/**
 * Fullwidth lookalikes that models sometimes emit instead of ASCII markdown
 * markers. Only matched pairs on one line are converted, and code is skipped,
 * so a lone `＊` (CJK notes) or `∗` (math operators) stays as written.
 */
const normalizeMarkdownMarkers = (text: string) => {
  if (!/[\uFF0A\uFE61\u204E\uFF3F]/.test(text)) return text;

  const normalize = (chunk: string) =>
    chunk
      .replace(
        /([\uFF0A\uFE61\u204E]{1,2})(?=\S)([^\n]*?\S)\1/g,
        (_, marker: string, inner: string) =>
          `${'*'.repeat(marker.length)}${inner}${'*'.repeat(marker.length)}`
      )
      .replace(
        /(\uFF3F{1,2})(?=\S)([^\n]*?\S)\1/g,
        (_, marker: string, inner: string) =>
          `${'_'.repeat(marker.length)}${inner}${'_'.repeat(marker.length)}`
      );

  return text
    .split(CODE_SEGMENT_RE)
    .map((part, index) => (index % 2 === 1 ? part : normalize(part)))
    .join('');
};

const INLINE_MARKDOWN_RE = /\*\*?\S|__?\S|`[^`]+`|~~\S/;
// Text in these tags is literal or already linked; inline markdown would corrupt it.
const RAW_TEXT_TAG_RE = /^<(\/?)(a|pre|code|script|style|textarea)\b/i;

/**
 * Marked leaves the contents of HTML blocks untouched, so `<p>**bold**</p>`
 * shows raw asterisks. Render inline markdown inside the text nodes of those
 * blocks and keep every tag (attributes, nesting, list numbering) as is.
 */
const renderInlineMarkdownInHtml = (html: string) => {
  if (!INLINE_MARKDOWN_RE.test(html)) return html;

  let rawTextDepth = 0;
  return html.replace(
    /(<!--[\s\S]*?-->|<\/?[a-zA-Z][^>]*>)|([^<]+)/g,
    (match, tag: string | undefined, text: string | undefined) => {
      if (tag) {
        const raw = RAW_TEXT_TAG_RE.exec(tag);
        if (raw) rawTextDepth = Math.max(0, rawTextDepth + (raw[1] ? -1 : 1));
        return tag;
      }
      if (!text || rawTextDepth > 0 || !INLINE_MARKDOWN_RE.test(text)) {
        return match;
      }
      const [, lead, core, trail] = /^(\s*)([\s\S]*?)(\s*)$/.exec(text)!;
      return `${lead}${marked.parseInline(core, { breaks: false })}${trail}`;
    }
  );
};

const renderMarkdownInHtmlBlocks = (token: Token) => {
  if (token.type === 'html' && token.block) {
    token.text = renderInlineMarkdownInHtml(token.text);
  }
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
      .replaceAll(
        /<output\s+class\s*=\s*["\']memori-artifact["\'][^>]*data-mimetype\s*=\s*["\']([^"']+)["\'][^>]*>([\s\S]*?)(?:<\/output>|$)/gi,
        ''
      )
      // Preferred: data-action="update" on memori-artifact
      .replaceAll(
        /<output\s+class\s*=\s*["\']memori-artifact["\'][^>]*data-action\s*=\s*["\']update["\'][^>]*>([\s\S]*?)(?:<\/output>|$)/gi,
        ''
      )
      // data-action may appear before class
      .replaceAll(
        /<output\s+[^>]*data-action\s*=\s*["\']update["\'][^>]*class\s*=\s*["\'][^"']*memori-artifact[^"']*["\'][^>]*>([\s\S]*?)(?:<\/output>|$)/gi,
        ''
      )
      // Legacy class name
      .replaceAll(
        /<output\s+class\s*=\s*["\']memori-artifact-update["\'][^>]*>([\s\S]*?)(?:<\/output>|$)/gi,
        ''
      )
      .replaceAll(/```markdown([^```]+)```/g, '$1')
      .replaceAll('($', '( $')
      .replaceAll(':$', ': $')
      .replaceAll('\frac', '\\frac')
      .replaceAll('\beta', '\\beta')
      .replaceAll('cdot', '\\cdot');

    preprocessedText = stripAttachmentTags(preprocessedText);

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

    preprocessedText = normalizeMarkdownMarkers(preprocessedText);

    // Ora procedi con il parsing markdown
    let parsedText = marked
      .parse(preprocessedText, {
        breaks: true,
        walkTokens: renderMarkdownInHtmlBlocks,
      })
      .toString()
      .trim();

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
    return { text: sanitizeMsg(text) };
  }
};
