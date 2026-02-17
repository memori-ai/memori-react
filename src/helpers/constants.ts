export const chatLanguages = [
  { value: 'AR', label: 'العربية' },           // Arabic
  { value: 'BG', label: 'български' },         // Bulgarian
  { value: 'CS', label: 'Čeština / český jazyk' }, // Czech
  { value: 'DA', label: 'Dansk' },             // Danish
  { value: 'DE', label: 'Deutsch' },           // German
  { value: 'EL', label: 'Ελληνικά' },          // Greek
  { value: 'EN', label: 'English' },           // English
  { value: 'ES', label: 'Español' },           // Spanish
  { value: 'ET', label: 'Eesti keel' },        // Estonian
  { value: 'FI', label: 'Suomi' },             // Finnish
  { value: 'FR', label: 'Français' },          // French
  { value: 'HR', label: 'Hrvatski' },          // Croatian
  { value: 'HU', label: 'Magyar' },            // Hungarian
  { value: 'IT', label: 'Italiano' },          // Italian
  { value: 'JA', label: '日本語' },             // Japanese
  { value: 'LT', label: 'Lietuvių kalba' },    // Lithuanian
  { value: 'LV', label: 'Latvian' },           // Latvian / Lettonian
  { value: 'NL', label: 'Nederlands' },        // Dutch
  { value: 'PL', label: 'Polski' },            // Polish
  { value: 'PT', label: 'Português' },         // Portuguese
  { value: 'RO', label: 'Română' },            // Romanian
  { value: 'RU', label: 'Русский' },           // Russian
  { value: 'SK', label: 'Slovenčina' },        // Slovak
  { value: 'SL', label: 'Slovenščina' },       // Slovenian
  { value: 'SV', label: 'Svenska' },           // Swedish
  { value: 'UK', label: 'Українська' },        // Ukrainian
  { value: 'ZH', label: '中文' },              // Chinese
];

export const popularLanguageCodes = ['IT', 'EN'];

export const getGroupedChatLanguages = () => {
  const popular = chatLanguages.filter(lang =>
    popularLanguageCodes.includes(lang.value)
  );
  const all = chatLanguages.filter(lang => !popularLanguageCodes.includes(lang.value));
  return {  
    popular,
    all,
  };
};

export const uiLanguages = ['en', 'it', 'fr', 'es', 'de'];

export const allowedMediaTypes = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/gif',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/pdf',
  'video/mp4',
  'video/avi',
  'audio/mpeg3',
  'audio/wav',
  'audio/mpeg',
  'video/mpeg',
  'model/gltf-binary',
];

export const anonTag = '👤';

export const prismSyntaxLangs = [
  {
    name: 'javascript/jsx',
    lang: 'jsx',
    mimeType: 'text/javascript',
    monacoLang: 'javascript',
    executable: true,
  },
  {
    name: 'typescript/tsx',
    lang: 'tsx',
    mimeType: 'text/ecmascript',
    monacoLang: 'typescript',
    executable: true,
  },
  {
    name: 'json',
    lang: 'json',
    mimeType: 'application/json',
    monacoLang: 'json',
    executable: true,
  },
  {
    name: 'css',
    lang: 'scss',
    mimeType: 'text/css',
    monacoLang: 'css',
    executable: true,
  },
  {
    name: 'html/xml',
    lang: 'tsx',
    mimeType: 'application/xml',
    monacoLang: 'xml',
  },
  {
    name: 'bash',
    lang: 'bash',
    mimeType: 'application/x-sh',
    monacoLang: 'shell',
  },
  {
    name: 'python',
    lang: 'python',
    mimeType: 'text/x-python',
    monacoLang: 'python',
  },
  {
    name: 'cpp/csharp',
    lang: 'cpp',
    mimeType: 'text/x-c++src',
    monacoLang: 'cpp',
  },
  {
    name: 'php',
    lang: 'php',
    mimeType: 'application/x-php',
    monacoLang: 'php',
  },
  {
    name: 'ruby',
    lang: 'ruby',
    mimeType: 'text/x-ruby',
    monacoLang: 'ruby',
  },
  {
    name: 'sql',
    lang: 'sql',
    mimeType: 'text/x-sql',
    monacoLang: 'sql',
  },
];

export const boardOfExpertsLoadingSentences: {
  [lang: string]: {
    /**
     * Sentence to show
     */
    text: string;
    /**
     * Seconds to wait after the sentence is completed
     */
    delayAfter: number;
  }[];
} = {
  it: [
    {
      text: '',
      delayAfter: 10,
    },
    {
      text: "Cerco l'esperto più adatto",
      delayAfter: 5,
    },
    {
      text: "Contatto l'esperto",
      delayAfter: 3,
    },
    {
      text: "Spiego all'esperto la domanda",
      delayAfter: 2,
    },
    {
      text: "L'esperto sta preparando una risposta",
      delayAfter: 6,
    },
    {
      text: 'Genero una risposta adatta',
      delayAfter: 3,
    },
  ],
  en: [
    {
      text: '',
      delayAfter: 10,
    },
    {
      text: "I'm looking for the most suitable expert",
      delayAfter: 5,
    },
    {
      text: "I'm contacting the expert",
      delayAfter: 3,
    },
    {
      text: "I'm explaining the question to the expert",
      delayAfter: 2,
    },
    {
      text: 'The expert is preparing an answer',
      delayAfter: 6,
    },
    {
      text: 'I am generating a suitable answer',
      delayAfter: 3,
    },
  ],
};

export const MAX_MSG_CHARS = 4000;
export const MAX_MSG_WORDS = 300;

// Document / attachment limits (index prop maxTotalMessagePayload overrides BOTH total payload and per-document limit)
// • MAX_DOCUMENTS_PER_MESSAGE: max attachments (docs + images) per message
// • MAX_TOTAL_MESSAGE_PAYLOAD: max combined content length (chars) for all documents
// • MAX_DOCUMENT_CONTENT_LENGTH: max content length (chars) per single document
// • File size (bytes): 10MB per file, enforced in UploadButton
export const MAX_DOCUMENTS_PER_MESSAGE = 10;
/** Total document payload limit (character count of all document contents combined). Default 200000 ≈ 200k chars. */
export const MAX_TOTAL_MESSAGE_PAYLOAD = 200000;
/** Per-document content character limit (default 200k chars). */
export const MAX_DOCUMENT_CONTENT_LENGTH = 200000;

/** When pasted text has more than this many lines, it is added as a document card instead of inline. */
export const PASTE_AS_CARD_LINE_THRESHOLD = 100;

/** When pasted text exceeds this length (e.g. one long line from CSV/table), it is added as a document card. */
export const PASTE_AS_CARD_CHAR_THRESHOLD = 4200;