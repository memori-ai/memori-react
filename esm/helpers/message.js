import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { MAX_MSG_CHARS, MAX_MSG_WORDS } from './constants';
import { cleanUrl } from './utils';
import markedLinkifyIt from 'marked-linkify-it';
import markedKatex from 'marked-katex-extension';
import markedExtendedTables from './markedExtendedTables';
marked.use({
    async: false,
    gfm: true,
    pedantic: false,
    renderer: {
        link: ({ href, title, text, }) => {
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
export const stripAttachmentTags = (value) => value
    .replaceAll(/<document_attachment filename="([^"]+)" type="([^"]+)">([\s\S]*?)<\/document_attachment>/g, '')
    .replaceAll(/<attachment_source>\s*[\s\S]*?\s*<\/attachment_source>/g, '')
    .replaceAll(/<attachment_link>\s*[\s\S]*?\s*<\/attachment_link>/g, '');
const ASSET_URL_RE = /https?:\/\/\S*\/api\/v\d+\/asset\/\S+/gi;
export const stripAllInternalTags = (value) => stripAttachmentTags(value)
    .replace(/<\/?documents?\b[^>]*>/gi, '')
    .replace(/<documents?\b[^>]*\/>/gi, '')
    .replace(/<\/?attachments?\b[^>]*>/gi, '')
    .replace(/<attachments?\b[^>]*\/>/gi, '')
    .replace(ASSET_URL_RE, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
export const needsTruncation = (message) => {
    return (message.length > MAX_MSG_CHARS || message.split(' ').length > MAX_MSG_WORDS);
};
export const truncateMessage = (message) => {
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
export const sanitizeMsg = (msg) => DOMPurify.sanitize(msg, { ADD_ATTR: ['target'] });
export const renderMsg = (text, useMathFormatting = false, reasoningText = 'Reasoning...', showReasoning) => {
    try {
        let preprocessedText = text
            .trim()
            .replaceAll(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
            .replaceAll(/<think.*?>(.*?)<\/think>/gs, showReasoning
            ? `<details class="memori-think"><summary>${reasoningText}</summary>$1</details>`
            : '')
            .replaceAll(/<output\s+class\s*=\s*["\']memori-artifact["\'][^>]*data-mimetype\s*=\s*["\']([^"']+)["\'][^>]*>([\s\S]*?)(?:<\/output>|$)/gi, '')
            .replaceAll(/<output\s+class\s*=\s*["\']memori-artifact["\'][^>]*data-action\s*=\s*["\']update["\'][^>]*>([\s\S]*?)(?:<\/output>|$)/gi, '')
            .replaceAll(/<output\s+[^>]*data-action\s*=\s*["\']update["\'][^>]*class\s*=\s*["\'][^"']*memori-artifact[^"']*["\'][^>]*>([\s\S]*?)(?:<\/output>|$)/gi, '')
            .replaceAll(/<output\s+class\s*=\s*["\']memori-artifact-update["\'][^>]*>([\s\S]*?)(?:<\/output>|$)/gi, '')
            .replaceAll(/```markdown([^```]+)```/g, '$1')
            .replaceAll('($', '( $')
            .replaceAll(':$', ': $')
            .replaceAll('\frac', '\\frac')
            .replaceAll('\beta', '\\beta')
            .replaceAll('cdot', '\\cdot');
        preprocessedText = stripAttachmentTags(preprocessedText);
        if (useMathFormatting) {
            marked.use(markedKatex({}));
            preprocessedText = preprocessedText.replace(/\\+\[(.*?)\\*\]/gs, (_, content) => {
                return `$$${content}$$`;
            });
            preprocessedText = preprocessedText.replace(/\[([^[\]]+?)\]/g, (match, content) => {
                if (/[\\+a-z0-9_{}^=\-\+\*\/]+/i.test(content) &&
                    !match.startsWith('[http') &&
                    !match.includes('](')) {
                    return `$$${content}$$`;
                }
                return match;
            });
        }
        const outputTags = [];
        let outputPlaceholder = 0;
        preprocessedText = preprocessedText.replace(/(<output[^>]*>)([\s\S]*?)(<\/output>)/g, (_, openTag, content, closeTag) => {
            const placeholder = `<!--OUTPUT_PLACEHOLDER_${outputPlaceholder++}-->`;
            outputTags.push(`${openTag}${content}${closeTag}`);
            return placeholder;
        });
        preprocessedText = preprocessedText.replace(/(<!--OUTPUT_PLACEHOLDER_\d+-->)\s*([^\s<\n-])/g, '$1\n\n$2');
        let parsedText = marked.parse(preprocessedText).toString().trim();
        outputTags.forEach((tag, index) => {
            parsedText = parsedText.replace(`<!--OUTPUT_PLACEHOLDER_${index}-->`, tag);
        });
        parsedText = DOMPurify.sanitize(parsedText, {
            ADD_ATTR: ['target'],
        });
        const finalText = parsedText
            .replace(/(<br>)+/g, '<br>')
            .replace(/<p><\/p>/g, '<br>')
            .replace(/<p><br><\/p>/g, '<br>');
        return { text: finalText };
    }
    catch (e) {
        console.error('Error rendering message:', e);
        return { text: sanitizeMsg(text) };
    }
};
//# sourceMappingURL=message.js.map