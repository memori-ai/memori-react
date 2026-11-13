export type DeeplTranslation = {
  detected_source_language: string;
  text: string;
};

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

const stripOutputTags = (text: string) => {
  return text.replaceAll(/<output.*?>(.*?)<\/output>/g, '');
};

const stripThinkTags = (text: string) => {
  return text.replaceAll(/<think.*?>(.*?)<\/think>/gs, '');
};

export const getTranslation = async (
  text: string,
  to: string,
  from?: string,
  _baseUrl?: string
): Promise<DeeplTranslation> => {
  let textToTranslate = stripOutputTags(stripThinkTags(text));
  const justTheThinkTags = text.match(/<think.*?>(.*?)<\/think>/gs);

  const isReservedKeyword = dialogKeywords.indexOf(text.toLowerCase()) > -1;
  const fromLanguage = isReservedKeyword ? 'IT' : from?.toUpperCase();
  const toLanguage = to.toUpperCase();

  return Promise.resolve({ text: textToTranslate } as DeeplTranslation);
};
