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
  baseUrl?: string
): Promise<DeeplTranslation> => {
  let textToTranslate = stripOutputTags(stripThinkTags(text));
  const justTheThinkTags = text.match(/<think.*?>(.*?)<\/think>/gs);

  const isReservedKeyword = dialogKeywords.indexOf(text.toLowerCase()) > -1;
  const fromLanguage = isReservedKeyword ? 'IT' : from?.toUpperCase();
  const toLanguage = to.toUpperCase();

  const deeplResult = await fetch(
    `${baseUrl || 'https://www.aisuru.com'}/api/translate`,
    {
      cache: 'no-cache',
      method: 'POST',
      body: JSON.stringify({
        text: textToTranslate,
        target_lang: toLanguage,
        source_lang: fromLanguage,
      }),
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
      },
    }
  );
  const deeplResponse = await deeplResult.json();

  //reapply the think tags to the translated text
  if(deeplResponse && deeplResponse.translations && deeplResponse.translations[0]) {
    deeplResponse.translations[0].text = (justTheThinkTags ? `<think>${justTheThinkTags}</think>` : '') + deeplResponse?.translations?.[0]?.text;
  }

  return deeplResponse?.translations?.[0] ?? { text: textToTranslate };
};
