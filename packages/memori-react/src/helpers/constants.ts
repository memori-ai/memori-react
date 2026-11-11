/**
 * Display names for the language picker.
 * `label` is English; `labelIt` is Italian. The picker shows the one that matches the UI language.
 */
export const chatLanguages = [
  { value: 'AR', label: 'Arabic', labelIt: 'Arabo' },
  { value: 'BG', label: 'Bulgarian', labelIt: 'Bulgaro' },
  { value: 'CS', label: 'Czech', labelIt: 'Ceco' },
  { value: 'DA', label: 'Danish', labelIt: 'Danese' },
  { value: 'DE', label: 'German', labelIt: 'Tedesco' },
  { value: 'EL', label: 'Greek', labelIt: 'Greco' },
  { value: 'EN', label: 'English', labelIt: 'Inglese' },
  { value: 'ES', label: 'Spanish', labelIt: 'Spagnolo' },
  { value: 'ET', label: 'Estonian', labelIt: 'Estone' },
  { value: 'FI', label: 'Finnish', labelIt: 'Finlandese' },
  { value: 'FR', label: 'French', labelIt: 'Francese' },
  { value: 'HR', label: 'Croatian', labelIt: 'Croato' },
  { value: 'HU', label: 'Hungarian', labelIt: 'Ungherese' },
  { value: 'IT', label: 'Italian', labelIt: 'Italiano' },
  { value: 'JA', label: 'Japanese', labelIt: 'Giapponese' },
  { value: 'LT', label: 'Lithuanian', labelIt: 'Lituano' },
  { value: 'LV', label: 'Latvian', labelIt: 'Lettone' },
  { value: 'NL', label: 'Dutch', labelIt: 'Olandese' },
  { value: 'PL', label: 'Polish', labelIt: 'Polacco' },
  { value: 'PT', label: 'Portuguese', labelIt: 'Portoghese' },
  { value: 'RO', label: 'Romanian', labelIt: 'Rumeno' },
  { value: 'RU', label: 'Russian', labelIt: 'Russo' },
  { value: 'SK', label: 'Slovak', labelIt: 'Slovacco' },
  { value: 'SL', label: 'Slovenian', labelIt: 'Sloveno' },
  { value: 'SV', label: 'Swedish', labelIt: 'Svedese' },
  { value: 'UK', label: 'Ukrainian', labelIt: 'Ucraino' },
  { value: 'ZH', label: 'Chinese', labelIt: 'Cinese' },
];

export const popularLanguageCodes = ['IT', 'EN'];

export const getChatLanguageLabel = (
  lang: (typeof chatLanguages)[number],
  uiLanguage?: string
) => {
  const code = (uiLanguage ?? 'en').toLowerCase().split('-')[0];
  return code === 'it' ? lang.labelIt : lang.label;
};

export const getGroupedChatLanguages = (uiLanguage?: string) => {
  const withLabel = (lang: (typeof chatLanguages)[number]) => ({
    value: lang.value,
    label: getChatLanguageLabel(lang, uiLanguage),
  });
  const popular = chatLanguages
    .filter(lang => popularLanguageCodes.includes(lang.value))
    .map(withLabel);
  const all = chatLanguages
    .filter(lang => !popularLanguageCodes.includes(lang.value))
    .map(withLabel);
  return {
    popular,
    all,
  };
};

export const uiLanguages = ['en', 'it', 'fr', 'es', 'de'];

/** Extensions uploaded as original Office binaries (no text extraction) */
export const officeNativeExtensions = [] as const;

/** Extensions read as UTF-8 in the browser, without calling the conversion API */
export const localTextExtensions = [
  '.txt',
  '.csv',
  '.tsv',
  '.html',
  '.xhtml',
  '.htm',
  '.xml',
  '.json',
  '.md',
  '.log',
  '.yml',
  '.yaml',
] as const;

export const documentConversionExtensions = [
  '.pdf',
  '.docx',
  '.docm',
  '.dotx',
  '.xlsx',
  '.xlsm',
  '.xls',
  '.xltx',
  '.ods',
  '.pptx',
  '.pptm',
  '.potx',
] as const;

export const allowedMediaTypes = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/gif',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
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

/** Short badge labels for Office document cards */
export const officeMimeShortLabels: Record<string, string> = {
  'application/msword': 'Word',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.template': 'Word',
  'application/vnd.ms-excel': 'Excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.template': 'Excel',
  'application/vnd.openxmlformats-officedocument.presentationml.template': 'PPT',
};

export const officeExtensionShortLabels: Record<string, string> = {
  DOC: 'Word',
  DOCX: 'Word',
  DOTX: 'Word',
  XLS: 'Excel',
  XLSX: 'Excel',
  XLTX: 'Excel',
  POTX: 'PPT',
};

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

export const maxDocumentsPerMessage = 10;
export const maxDocumentContentLength = 300000;
export const pasteAsCardLineThreshold = 100;
export const pasteAsCardCharThreshold = 4200;
