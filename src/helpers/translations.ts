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

export const getTranslation = async (
  text: string,
  to: string,
  from?: string,
  baseUrl?: string
): Promise<DeeplTranslation> => {
  const isReservedKeyword = dialogKeywords.indexOf(text.toLowerCase()) > -1;
  const fromLanguage = isReservedKeyword ? 'IT' : from?.toUpperCase();
  const deeplResult = await fetch(
    `${baseUrl ||
      'https://app.twincreator.com'}/api/translate?text=${encodeURIComponent(
      text
    )}&target_lang=${to.toUpperCase()}${
      fromLanguage ? `&source_lang=${fromLanguage}` : ''
    }`,
    {
      method: 'GET',
      headers: {
        Accept: '*/*',
      },
    }
  );
  const deeplResponse = await deeplResult.json();
  return deeplResponse?.translations?.[0];
};
