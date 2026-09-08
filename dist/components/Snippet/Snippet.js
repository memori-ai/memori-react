"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Button_1 = tslib_1.__importDefault(require("../ui/Button"));
const Copy_1 = tslib_1.__importDefault(require("../icons/Copy"));
const constants_1 = require("../../helpers/constants");
const react_i18next_1 = require("react-i18next");
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const utils_1 = require("../../helpers/utils");
const loadPrismScripts = () => {
    return new Promise((resolve) => {
        const existingScript = document.getElementById('memori-prism-script');
        if (existingScript) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js';
        script.async = true;
        script.id = 'memori-prism-script';
        script.onload = () => {
            const autoloaderScript = document.createElement('script');
            autoloaderScript.src =
                'https://cdn.jsdelivr.net/npm/prismjs@v1.29.0/plugins/autoloader/prism-autoloader.min.js';
            autoloaderScript.async = true;
            autoloaderScript.id = 'memori-prism-autoloader-script';
            autoloaderScript.onload = () => {
                if (window.Prism && window.Prism.plugins && window.Prism.plugins.autoloader) {
                    window.Prism.plugins.autoloader.languages_path = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/';
                }
                resolve();
            };
            document.head.appendChild(autoloaderScript);
        };
        const prismCss = document.createElement('link');
        prismCss.rel = 'stylesheet';
        prismCss.href =
            'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css';
        document.head.appendChild(prismCss);
        document.head.appendChild(script);
    });
};
const Snippet = ({ medium, className, preview = false, showCopyButton = true, }) => {
    var _a, _b, _c, _d, _e, _f;
    const { t } = (0, react_i18next_1.useTranslation)();
    const [copied, setCopied] = (0, react_1.useState)(false);
    const highlightCode = () => {
        if ('Prism' in window && window.Prism.highlightAll) {
            setTimeout(() => {
                Prism.highlightAll();
            }, 100);
        }
    };
    (0, react_1.useEffect)(() => {
        loadPrismScripts().then(() => {
            highlightCode();
        });
    }, []);
    (0, react_1.useEffect)(() => {
        highlightCode();
    }, [medium.content, medium.mimeType]);
    const handleCopy = async () => {
        var _a;
        const contentToCopy = (0, utils_1.stripDocumentAttachmentTags)((_a = medium.content) !== null && _a !== void 0 ? _a : '');
        try {
            await navigator.clipboard.writeText(contentToCopy);
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        }
        catch (error) {
            console.error('Failed to copy text:', error);
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: (0, classnames_1.default)('memori-snippet', { 'memori-snippet--preview': preview }), children: (0, jsx_runtime_1.jsxs)("div", { className: "memori-snippet--content", children: [(0, jsx_runtime_1.jsx)("pre", { className: (0, classnames_1.default)('line-numbers', className), "aria-labelledby": !!((_a = medium.title) === null || _a === void 0 ? void 0 : _a.length) ? `#snippet-${medium.mediumID}` : undefined, children: (0, jsx_runtime_1.jsx)("code", { className: `language-${(_c = (_b = constants_1.prismSyntaxLangs.find(l => medium.mimeType === l.mimeType)) === null || _b === void 0 ? void 0 : _b.lang) !== null && _c !== void 0 ? _c : 'text'}`, "data-language": (_e = (_d = constants_1.prismSyntaxLangs.find(l => medium.mimeType === l.mimeType)) === null || _d === void 0 ? void 0 : _d.lang) !== null && _e !== void 0 ? _e : 'text', children: (0, utils_1.stripDocumentAttachmentTags)((_f = medium.content) !== null && _f !== void 0 ? _f : '') }) }), showCopyButton && ((0, jsx_runtime_1.jsxs)("div", { className: "memori-snippet--copy-wrapper", children: [copied && ((0, jsx_runtime_1.jsx)("span", { className: "memori-snippet--copied-text", children: t('copied') || 'Copied!' })), (0, jsx_runtime_1.jsx)(Button_1.default, { padded: false, ghost: true, className: "memori-snippet--copy-button", title: t('copy') || 'Copy', icon: (0, jsx_runtime_1.jsx)(Copy_1.default, {}), onClick: handleCopy })] }))] }) }));
};
exports.default = Snippet;
//# sourceMappingURL=Snippet.js.map