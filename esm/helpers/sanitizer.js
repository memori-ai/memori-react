import { escapeHTML, stripEmojis, stripHTML, stripMarkdown, stripOutputTags, stripReasoningTags } from "./utils";
export function sanitizeText(text) {
    return escapeHTML(stripMarkdown(stripEmojis(stripHTML(stripReasoningTags(stripOutputTags(text))))));
}
//# sourceMappingURL=sanitizer.js.map