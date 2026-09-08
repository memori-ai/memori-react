"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderMsg = exports.sanitizeMsg = exports.truncateMessage = exports.needsTruncation = exports.stripAllInternalTags = exports.stripAttachmentTags = void 0;
const tslib_1 = require("tslib");
const marked_1 = require("marked");
const dompurify_1 = tslib_1.__importDefault(require("dompurify"));
const constants_1 = require("./constants");
const utils_1 = require("./utils");
const marked_linkify_it_1 = tslib_1.__importDefault(require("marked-linkify-it"));
const marked_katex_extension_1 = tslib_1.__importDefault(require("marked-katex-extension"));
const markedExtendedTables_1 = tslib_1.__importDefault(require("./markedExtendedTables"));
marked_1.marked.use({
    async: false,
    gfm: true,
    pedantic: false,
    renderer: {
        link: ({ href, title, text, }) => {
            const cleanHref = href ? (0, utils_1.cleanUrl)(href) : null;
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
marked_1.marked.use((0, marked_linkify_it_1.default)());
marked_1.marked.use((0, markedExtendedTables_1.default)());
const stripAttachmentTags = (value) => value
    .replaceAll(/<document_attachment filename="([^"]+)" type="([^"]+)">([\s\S]*?)<\/document_attachment>/g, '')
    .replaceAll(/<attachment_source>\s*[\s\S]*?\s*<\/attachment_source>/g, '')
    .replaceAll(/<attachment_link>\s*[\s\S]*?\s*<\/attachment_link>/g, '');
exports.stripAttachmentTags = stripAttachmentTags;
const ASSET_URL_RE = /https?:\/\/\S*\/api\/v\d+\/asset\/\S+/gi;
const stripAllInternalTags = (value) => (0, exports.stripAttachmentTags)(value)
    .replace(/<\/?documents?\b[^>]*>/gi, '')
    .replace(/<documents?\b[^>]*\/>/gi, '')
    .replace(/<\/?attachments?\b[^>]*>/gi, '')
    .replace(/<attachments?\b[^>]*\/>/gi, '')
    .replace(ASSET_URL_RE, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
exports.stripAllInternalTags = stripAllInternalTags;
const needsTruncation = (message) => {
    return (message.length > constants_1.MAX_MSG_CHARS || message.split(' ').length > constants_1.MAX_MSG_WORDS);
};
exports.needsTruncation = needsTruncation;
const truncateMessage = (message) => {
    let truncatedMessage = message;
    if (message.length > constants_1.MAX_MSG_CHARS) {
        truncatedMessage = `${message.slice(0, constants_1.MAX_MSG_CHARS)}\n<br />...`;
    }
    if (truncatedMessage.split(' ').length > constants_1.MAX_MSG_WORDS) {
        truncatedMessage = truncatedMessage
            .split(' ')
            .slice(0, constants_1.MAX_MSG_WORDS)
            .join(' ');
    }
    return truncatedMessage;
};
exports.truncateMessage = truncateMessage;
const sanitizeMsg = (msg) => dompurify_1.default.sanitize(msg, { ADD_ATTR: ['target'] });
exports.sanitizeMsg = sanitizeMsg;
const renderMsg = (text, useMathFormatting = false, reasoningText = 'Reasoning...', showReasoning) => {
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
        preprocessedText = (0, exports.stripAttachmentTags)(preprocessedText);
        if (useMathFormatting) {
            marked_1.marked.use((0, marked_katex_extension_1.default)({}));
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
        let parsedText = marked_1.marked.parse(preprocessedText).toString().trim();
        outputTags.forEach((tag, index) => {
            parsedText = parsedText.replace(`<!--OUTPUT_PLACEHOLDER_${index}-->`, tag);
        });
        parsedText = dompurify_1.default.sanitize(parsedText, {
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
        return { text: (0, exports.sanitizeMsg)(text) };
    }
};
exports.renderMsg = renderMsg;
//# sourceMappingURL=message.js.map