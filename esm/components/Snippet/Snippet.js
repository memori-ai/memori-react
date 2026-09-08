import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import Button from '../ui/Button';
import Copy from '../icons/Copy';
import { prismSyntaxLangs } from '../../helpers/constants';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { stripDocumentAttachmentTags } from '../../helpers/utils';
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
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);
    const highlightCode = () => {
        if ('Prism' in window && window.Prism.highlightAll) {
            setTimeout(() => {
                Prism.highlightAll();
            }, 100);
        }
    };
    useEffect(() => {
        loadPrismScripts().then(() => {
            highlightCode();
        });
    }, []);
    useEffect(() => {
        highlightCode();
    }, [medium.content, medium.mimeType]);
    const handleCopy = async () => {
        var _a;
        const contentToCopy = stripDocumentAttachmentTags((_a = medium.content) !== null && _a !== void 0 ? _a : '');
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
    return (_jsx("div", { className: cx('memori-snippet', { 'memori-snippet--preview': preview }), children: _jsxs("div", { className: "memori-snippet--content", children: [_jsx("pre", { className: cx('line-numbers', className), "aria-labelledby": !!((_a = medium.title) === null || _a === void 0 ? void 0 : _a.length) ? `#snippet-${medium.mediumID}` : undefined, children: _jsx("code", { className: `language-${(_c = (_b = prismSyntaxLangs.find(l => medium.mimeType === l.mimeType)) === null || _b === void 0 ? void 0 : _b.lang) !== null && _c !== void 0 ? _c : 'text'}`, "data-language": (_e = (_d = prismSyntaxLangs.find(l => medium.mimeType === l.mimeType)) === null || _d === void 0 ? void 0 : _d.lang) !== null && _e !== void 0 ? _e : 'text', children: stripDocumentAttachmentTags((_f = medium.content) !== null && _f !== void 0 ? _f : '') }) }), showCopyButton && (_jsxs("div", { className: "memori-snippet--copy-wrapper", children: [copied && (_jsx("span", { className: "memori-snippet--copied-text", children: t('copied') || 'Copied!' })), _jsx(Button, { padded: false, ghost: true, className: "memori-snippet--copy-button", title: t('copy') || 'Copy', icon: _jsx(Copy, {}), onClick: handleCopy })] }))] }) }));
};
export default Snippet;
//# sourceMappingURL=Snippet.js.map