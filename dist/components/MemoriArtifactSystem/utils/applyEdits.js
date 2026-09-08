"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseEdits = exports.applyEdits = void 0;
const normalizeWhitespace = (s) => s.replace(/\s+/g, ' ');
const findWhitespaceTolerant = (haystack, needle) => {
    const normNeedle = normalizeWhitespace(needle.trim());
    if (!normNeedle)
        return null;
    const normChars = [];
    const normToOrig = [];
    let lastWasSpace = false;
    for (let i = 0; i < haystack.length; i++) {
        const ch = haystack[i];
        if (/\s/.test(ch)) {
            if (!lastWasSpace && normChars.length > 0) {
                normChars.push(' ');
                normToOrig.push(i);
                lastWasSpace = true;
            }
        }
        else {
            normChars.push(ch);
            normToOrig.push(i);
            lastWasSpace = false;
        }
    }
    while (normChars.length > 0 && normChars[normChars.length - 1] === ' ') {
        normChars.pop();
        normToOrig.pop();
    }
    const normHaystack = normChars.join('');
    const idx = normHaystack.indexOf(normNeedle);
    if (idx === -1)
        return null;
    const startOrig = normToOrig[idx];
    const endNormIdx = idx + normNeedle.length - 1;
    const lastOrig = normToOrig[endNormIdx];
    let endOrig = lastOrig + 1;
    while (endOrig < haystack.length && /\s/.test(haystack[endOrig])) {
        break;
    }
    return [startOrig, endOrig];
};
const applyEdits = (content, edits) => {
    let result = content;
    const failedEdits = [];
    let appliedCount = 0;
    for (const edit of edits) {
        if (!edit || typeof edit.old !== 'string' || typeof edit.new !== 'string') {
            failedEdits.push(edit);
            continue;
        }
        const exactIdx = result.indexOf(edit.old);
        if (exactIdx !== -1) {
            result =
                result.slice(0, exactIdx) +
                    edit.new +
                    result.slice(exactIdx + edit.old.length);
            appliedCount++;
            continue;
        }
        const tolerant = findWhitespaceTolerant(result, edit.old);
        if (tolerant) {
            const [start, end] = tolerant;
            result = result.slice(0, start) + edit.new + result.slice(end);
            appliedCount++;
            continue;
        }
        failedEdits.push(edit);
    }
    return { content: result, failedEdits, appliedCount };
};
exports.applyEdits = applyEdits;
const HTML_ENTITIES = {
    '&quot;': '"',
    '&#34;': '"',
    '&apos;': "'",
    '&#39;': "'",
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
};
const unescapeHtmlEntities = (s) => s.replace(/&quot;|&#34;|&apos;|&#39;|&amp;|&lt;|&gt;/g, m => { var _a; return (_a = HTML_ENTITIES[m]) !== null && _a !== void 0 ? _a : m; });
const isValidEditsArray = (value) => {
    if (!Array.isArray(value))
        return false;
    return value.every(item => item &&
        typeof item === 'object' &&
        typeof item.old === 'string' &&
        typeof item.new === 'string');
};
const parseEdits = (body) => {
    if (!body || typeof body !== 'string')
        return null;
    const trimmed = body.trim();
    if (!trimmed)
        return null;
    const tryParse = (raw) => {
        try {
            const parsed = JSON.parse(raw);
            return isValidEditsArray(parsed) ? parsed : null;
        }
        catch (_a) {
            return null;
        }
    };
    const direct = tryParse(trimmed);
    if (direct)
        return direct;
    const unescaped = unescapeHtmlEntities(trimmed);
    if (unescaped !== trimmed) {
        return tryParse(unescaped);
    }
    return null;
};
exports.parseEdits = parseEdits;
//# sourceMappingURL=applyEdits.js.map