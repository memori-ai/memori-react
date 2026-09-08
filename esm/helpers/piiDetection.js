function getLocalized(record, lang, fallback) {
    var _a, _b, _c, _d;
    if (!record || typeof record !== 'object')
        return fallback;
    const normalizedLang = (lang === null || lang === void 0 ? void 0 : lang.toLowerCase()) || 'en';
    return ((_d = (_c = (_b = (_a = record[normalizedLang]) !== null && _a !== void 0 ? _a : record.en) !== null && _b !== void 0 ? _b : record['en']) !== null && _c !== void 0 ? _c : Object.values(record)[0]) !== null && _d !== void 0 ? _d : fallback);
}
export function checkPii(text, config, lang) {
    if (!(config === null || config === void 0 ? void 0 : config.enabled) || !Array.isArray(config.rules) || config.rules.length === 0) {
        return { matched: false };
    }
    const normalizedLang = (lang === null || lang === void 0 ? void 0 : lang.toLowerCase()) || 'en';
    const matchedRulesById = new Map();
    for (const rule of config.rules) {
        if (!rule.pattern || !rule.pattern.trim()) {
            continue;
        }
        try {
            const regex = new RegExp(rule.pattern);
            if (regex.test(text)) {
                if (!matchedRulesById.has(rule.id)) {
                    matchedRulesById.set(rule.id, rule);
                }
            }
        }
        catch (err) {
            console.warn('[PII] Invalid regex for rule:', rule.id, rule.pattern, err);
        }
    }
    if (matchedRulesById.size === 0) {
        return { matched: false };
    }
    const mainMessage = getLocalized(config.errorMessage, normalizedLang, 'The message contains personal or sensitive data.');
    const ruleMessages = Array.from(matchedRulesById.values()).map(rule => {
        const labelFallback = getLocalized(rule.label, normalizedLang, rule.id);
        return getLocalized(rule.message, normalizedLang, labelFallback);
    });
    const errorText = [mainMessage, ...ruleMessages].join('\n');
    return { matched: true, errorText };
}
//# sourceMappingURL=piiDetection.js.map