"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeText = void 0;
const utils_1 = require("./utils");
function sanitizeText(text) {
    return (0, utils_1.escapeHTML)((0, utils_1.stripMarkdown)((0, utils_1.stripEmojis)((0, utils_1.stripHTML)((0, utils_1.stripReasoningTags)((0, utils_1.stripOutputTags)(text))))));
}
exports.sanitizeText = sanitizeText;
//# sourceMappingURL=sanitizer.js.map