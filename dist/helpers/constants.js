"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pasteAsCardCharThreshold = exports.pasteAsCardLineThreshold = exports.maxDocumentContentLength = exports.maxDocumentsPerMessage = exports.MAX_MSG_WORDS = exports.MAX_MSG_CHARS = exports.boardOfExpertsLoadingSentences = exports.prismSyntaxLangs = exports.anonTag = exports.officeExtensionShortLabels = exports.officeMimeShortLabels = exports.allowedMediaTypes = exports.documentConversionExtensions = exports.localTextExtensions = exports.officeNativeExtensions = exports.uiLanguages = exports.getGroupedChatLanguages = exports.popularLanguageCodes = exports.chatLanguages = void 0;
exports.chatLanguages = [
    { value: 'AR', label: 'العربية' },
    { value: 'BG', label: 'български' },
    { value: 'CS', label: 'Čeština / český jazyk' },
    { value: 'DA', label: 'Dansk' },
    { value: 'DE', label: 'Deutsch' },
    { value: 'EL', label: 'Ελληνικά' },
    { value: 'EN', label: 'English' },
    { value: 'ES', label: 'Español' },
    { value: 'ET', label: 'Eesti keel' },
    { value: 'FI', label: 'Suomi' },
    { value: 'FR', label: 'Français' },
    { value: 'HR', label: 'Hrvatski' },
    { value: 'HU', label: 'Magyar' },
    { value: 'IT', label: 'Italiano' },
    { value: 'JA', label: '日本語' },
    { value: 'LT', label: 'Lietuvių kalba' },
    { value: 'LV', label: 'Latvian' },
    { value: 'NL', label: 'Nederlands' },
    { value: 'PL', label: 'Polski' },
    { value: 'PT', label: 'Português' },
    { value: 'RO', label: 'Română' },
    { value: 'RU', label: 'Русский' },
    { value: 'SK', label: 'Slovenčina' },
    { value: 'SL', label: 'Slovenščina' },
    { value: 'SV', label: 'Svenska' },
    { value: 'UK', label: 'Українська' },
    { value: 'ZH', label: '中文' },
];
exports.popularLanguageCodes = ['IT', 'EN'];
const getGroupedChatLanguages = () => {
    const popular = exports.chatLanguages.filter(lang => exports.popularLanguageCodes.includes(lang.value));
    const all = exports.chatLanguages.filter(lang => !exports.popularLanguageCodes.includes(lang.value));
    return {
        popular,
        all,
    };
};
exports.getGroupedChatLanguages = getGroupedChatLanguages;
exports.uiLanguages = ['en', 'it', 'fr', 'es', 'de'];
exports.officeNativeExtensions = [];
exports.localTextExtensions = [
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
];
exports.documentConversionExtensions = [
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
];
exports.allowedMediaTypes = [
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
exports.officeMimeShortLabels = {
    'application/msword': 'Word',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.template': 'Word',
    'application/vnd.ms-excel': 'Excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.template': 'Excel',
    'application/vnd.openxmlformats-officedocument.presentationml.template': 'PPT',
};
exports.officeExtensionShortLabels = {
    DOC: 'Word',
    DOCX: 'Word',
    DOTX: 'Word',
    XLS: 'Excel',
    XLSX: 'Excel',
    XLTX: 'Excel',
    POTX: 'PPT',
};
exports.anonTag = '👤';
exports.prismSyntaxLangs = [
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
exports.boardOfExpertsLoadingSentences = {
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
exports.MAX_MSG_CHARS = 4000;
exports.MAX_MSG_WORDS = 300;
exports.maxDocumentsPerMessage = 10;
exports.maxDocumentContentLength = 300000;
exports.pasteAsCardLineThreshold = 100;
exports.pasteAsCardCharThreshold = 4200;
//# sourceMappingURL=constants.js.map