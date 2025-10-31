export const chatLanguages = [
  { value: 'IT', label: 'Italiano' },
  { value: 'EN', label: 'English' },
  { value: 'DE', label: 'Deutsch' },
  { value: 'ES', label: 'Español' },
  { value: 'FR', label: 'Français' },
  { value: 'PT', label: 'Português' },
  { value: 'NL', label: 'Nederlands' },        // Dutch
  { value: 'SV', label: 'Svenska' },           // Swedish
  { value: 'DA', label: 'Dansk' },             // Danish
  { value: 'FI', label: 'Suomi' },             // Finnish
  { value: 'ET', label: 'Eesti keel' },        // Estonian
  { value: 'LT', label: 'Lietuvių kalba' },    // Lithuanian
  { value: 'HU', label: 'Magyar' },            // Hungarian
  { value: 'RO', label: 'Română' },            // Romanian
  { value: 'BG', label: 'български' },         // Bulgarian
  { value: 'HR', label: 'Hrvatski' },          // Croatian
  { value: 'CS', label: 'Čeština / český jazyk' }, // Czech
  { value: 'SK', label: 'Slovenčina' },        // Slovak
  { value: 'SL', label: 'Slovenščina' },       // Slovenian
  { value: 'LV', label: 'Latvian' },           // Lettonian
  { value: 'UK', label: 'Українська' },        // Ukrainian
  { value: 'RU', label: 'Русский' },           // Russian
  { value: 'PL', label: 'Polski' },
  { value: 'EL', label: 'Ελληνικά' },
  { value: 'AR', label: 'العربية' },
  { value: 'ZH', label: '中文' },
  { value: 'JA', label: '日本語' },
];

export const popularLanguageCodes = ['IT', 'EN', 'FR', 'DE', 'ES', 'PT'];

export const getGroupedChatLanguages = () => {
  const popular = chatLanguages.filter(lang =>
    popularLanguageCodes.includes(lang.value)
  );
  return {
    popular,
    all: chatLanguages,
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
    name: 'text',
    lang: 'text',
    mimeType: 'text/plain',
    monacoLang: 'plaintext',
    executable: true,
  },
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

// Document upload limits
export const MAX_DOCUMENTS_PER_MESSAGE = 5;
// export const MAX_TOTAL_MESSAGE_PAYLOAD = 200000; // 200KB total payload limit
export const MAX_DOCUMENT_CONTENT_LENGTH = 200000; // 200KB per document content