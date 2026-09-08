"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Button_1 = tslib_1.__importDefault(require("./Button"));
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const react_i18next_1 = require("react-i18next");
const message_1 = require("../../helpers/message");
const constants_1 = require("../../helpers/constants");
const Expandable = ({ rows, className, innerClassName, btnClassName, lineHeightMultiplier = 1.2, defaultExpanded = false, expandSymbol = () => '...', collapseSymbol = (lang) => lang === 'it' ? 'Mostra meno' : 'Show less', children, mode = 'rows', }) => {
    const { i18n } = (0, react_i18next_1.useTranslation)();
    const lang = i18n.language;
    const collapseSymbolText = collapseSymbol(lang);
    const expandSymbolText = expandSymbol(lang);
    const [expanded, setExpanded] = (0, react_1.useState)(defaultExpanded);
    const [needsExpanding, setNeedsExpanding] = (0, react_1.useState)(false);
    const [rowHeight, setRowHeight] = (0, react_1.useState)(16);
    const ref = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
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
                if (textContent.length > constants_1.MAX_MSG_CHARS ||
                    textContent.split(' ').length > constants_1.MAX_MSG_WORDS) {
                    setNeedsExpanding(true);
                }
            }
        }
    }, [rows, mode, ref.current]);
    const renderContent = () => {
        var _a;
        if (mode === 'characters' && !expanded && needsExpanding) {
            const content = ((_a = ref.current) === null || _a === void 0 ? void 0 : _a.textContent) || '';
            let truncatedContent = (0, message_1.truncateMessage)(content);
            return truncatedContent;
        }
        return children;
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: (0, classnames_1.default)('memori-expandable', className), children: [(0, jsx_runtime_1.jsx)("div", { ref: ref, className: (0, classnames_1.default)('memori-expandable--inner', innerClassName), style: {
                    maxHeight: expanded || !needsExpanding || mode === 'characters'
                        ? '9999px'
                        : `${rowHeight * (rows || 1)}px`,
                }, children: renderContent() }), needsExpanding && !expanded && ((0, jsx_runtime_1.jsx)(Button_1.default, { ghost: true, padded: false, className: btnClassName, onClick: () => setExpanded(true), children: expandSymbolText })), needsExpanding && expanded && ((0, jsx_runtime_1.jsx)(Button_1.default, { ghost: true, padded: false, className: btnClassName, onClick: () => setExpanded(false), children: collapseSymbolText }))] }));
};
exports.default = Expandable;
//# sourceMappingURL=Expandable.js.map