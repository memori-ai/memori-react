export const dialogKeywords = [
    'va bene',
    'no grazie',
    'si',
    'no',
    'sì',
    'arrivederci',
    "non c'entrava",
    'non mi è piaciuto',
];
const stripOutputTags = (text) => {
    return text.replaceAll(/<output.*?>(.*?)<\/output>/g, '');
};
const stripThinkTags = (text) => {
    return text.replaceAll(/<think.*?>(.*?)<\/think>/gs, '');
};
export const getTranslation = async (text, to, from, _baseUrl) => {
    let textToTranslate = stripOutputTags(stripThinkTags(text));
    const justTheThinkTags = text.match(/<think.*?>(.*?)<\/think>/gs);
    const isReservedKeyword = dialogKeywords.indexOf(text.toLowerCase()) > -1;
    const fromLanguage = isReservedKeyword ? 'IT' : from === null || from === void 0 ? void 0 : from.toUpperCase();
    const toLanguage = to.toUpperCase();
    return Promise.resolve({ text: textToTranslate });
};
//# sourceMappingURL=translations.js.map