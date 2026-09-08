import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import Button from './Button';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { truncateMessage } from '../../helpers/message';
import { MAX_MSG_CHARS, MAX_MSG_WORDS } from '../../helpers/constants';
const Expandable = ({ rows, className, innerClassName, btnClassName, lineHeightMultiplier = 1.2, defaultExpanded = false, expandSymbol = () => '...', collapseSymbol = (lang) => lang === 'it' ? 'Mostra meno' : 'Show less', children, mode = 'rows', }) => {
    const { i18n } = useTranslation();
    const lang = i18n.language;
    const collapseSymbolText = collapseSymbol(lang);
    const expandSymbolText = expandSymbol(lang);
    const [expanded, setExpanded] = useState(defaultExpanded);
    const [needsExpanding, setNeedsExpanding] = useState(false);
    const [rowHeight, setRowHeight] = useState(16);
    const ref = useRef(null);
    useEffect(() => {
        if (ref.current) {
            if (mode === 'rows') {
                let height = ref.current.getBoundingClientRect().height;
                let computedStyle = getComputedStyle(ref.current);
                let elLineHeight = computedStyle.lineHeight;
                let lineHeight = elLineHeight === 'normal' || !(elLineHeight === null || elLineHeight === void 0 ? void 0 : elLineHeight.length)
                    ? lineHeightMultiplier * parseInt(computedStyle.fontSize, 10)
                    : parseInt(elLineHeight, 10);
                setRowHeight(lineHeight);
                if (height && rows && height > rows * lineHeight) {
                    setNeedsExpanding(true);
                }
            }
            else if (mode === 'characters') {
                const textContent = ref.current.textContent || '';
                if (textContent.length > MAX_MSG_CHARS ||
                    textContent.split(' ').length > MAX_MSG_WORDS) {
                    setNeedsExpanding(true);
                }
            }
        }
    }, [rows, mode, ref.current]);
    const renderContent = () => {
        var _a;
        if (mode === 'characters' && !expanded && needsExpanding) {
            const content = ((_a = ref.current) === null || _a === void 0 ? void 0 : _a.textContent) || '';
            let truncatedContent = truncateMessage(content);
            return truncatedContent;
        }
        return children;
    };
    return (_jsxs("div", { className: cx('memori-expandable', className), children: [_jsx("div", { ref: ref, className: cx('memori-expandable--inner', innerClassName), style: {
                    maxHeight: expanded || !needsExpanding || mode === 'characters'
                        ? '9999px'
                        : `${rowHeight * (rows || 1)}px`,
                }, children: renderContent() }), needsExpanding && !expanded && (_jsx(Button, { ghost: true, padded: false, className: btnClassName, onClick: () => setExpanded(true), children: expandSymbolText })), needsExpanding && expanded && (_jsx(Button, { ghost: true, padded: false, className: btnClassName, onClick: () => setExpanded(false), children: collapseSymbolText }))] }));
};
export default Expandable;
//# sourceMappingURL=Expandable.js.map