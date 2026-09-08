"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Button_1 = tslib_1.__importDefault(require("../ui/Button"));
const MediaItemWidget_1 = tslib_1.__importDefault(require("./MediaItemWidget"));
const react_2 = require("@headlessui/react");
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const react_i18next_1 = require("react-i18next");
const MediaWidget = ({ hints = [], links = [], media = [], simulateUserPrompt = () => { }, sessionID, baseUrl, apiUrl, translateTo, customMediaRenderer, fromUser = false, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [showHints, setShowHints] = (0, react_1.useState)(true);
    const [hintsPagination, setHintsPagination] = (0, react_1.useState)(6);
    (0, react_1.useEffect)(() => {
        setShowHints(true);
    }, [hints]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "memori-media-widget", children: [((media === null || media === void 0 ? void 0 : media.length) > 0 || (links === null || links === void 0 ? void 0 : links.length) > 0) && ((0, jsx_runtime_1.jsx)(MediaItemWidget_1.default, { items: [...(media || []), ...(links || [])], sessionID: sessionID, translateTo: translateTo, baseURL: baseUrl, apiURL: apiUrl, customMediaRenderer: customMediaRenderer, fromUser: fromUser })), (hints === null || hints === void 0 ? void 0 : hints.length) > 0 && showHints && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(react_2.Transition, { appear: true, show: true, as: "ul", className: "memori-media--hints", children: hints.slice(0, hintsPagination).map((item, index) => ((0, jsx_runtime_1.jsx)(react_2.Transition.Child, { as: "li", enter: "ease-out duration-500", enterFrom: "opacity-0 translate-y-1", enterTo: "opacity-1 translate-y-0", leave: "ease-in duration-300", leaveFrom: "opacity-1", leaveTo: "opacity-0", children: (0, jsx_runtime_1.jsx)(Button_1.default, { className: (0, classnames_1.default)('memori-media--hint'), primary: true, onClick: () => {
                                    simulateUserPrompt(item.originalText, item.text);
                                    setShowHints(false);
                                }, onTouchEnd: () => {
                                    simulateUserPrompt(item.originalText, item.text);
                                    setShowHints(false);
                                }, children: item.text }, item.text + index) }, item.text + index))) }), hints.length > hintsPagination && ((0, jsx_runtime_1.jsx)("div", { className: "memori-hints--show-more", children: (0, jsx_runtime_1.jsx)(Button_1.default, { className: "memori-hints--show-more-button", id: "showMoreHints", onClick: () => setHintsPagination(hintsPagination + 6), children: t('expand') || 'Expand' }) }))] }))] }));
};
exports.default = (0, react_1.memo)(MediaWidget);
//# sourceMappingURL=MediaWidget.js.map