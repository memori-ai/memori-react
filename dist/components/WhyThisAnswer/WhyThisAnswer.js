"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Drawer_1 = tslib_1.__importDefault(require("../ui/Drawer"));
const Spin_1 = tslib_1.__importDefault(require("../ui/Spin"));
const Expandable_1 = tslib_1.__importDefault(require("../ui/Expandable"));
const react_hot_toast_1 = tslib_1.__importDefault(require("react-hot-toast"));
const error_1 = require("../../helpers/error");
const react_i18next_1 = require("react-i18next");
const Snippet_1 = tslib_1.__importDefault(require("../Snippet/Snippet"));
const MediaWidget_1 = tslib_1.__importDefault(require("../MediaWidget/MediaWidget"));
const Card_1 = tslib_1.__importDefault(require("../ui/Card"));
const message_1 = require("../../helpers/message");
const addQuestionMark = (question) => question.endsWith('?') ? question : `${question}?`;
const WhyThisAnswer = ({ message, sessionID, visible = true, initialMatches = [], closeDrawer, client, _TEST_loading = false, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const searchMemory = client === null || client === void 0 ? void 0 : client.search.searchMemory;
    const sanitizedQuestionAnswered = (0, message_1.stripAllInternalTags)(message.questionAnswered || '');
    const [matches, setMatches] = (0, react_1.useState)(initialMatches);
    const [loading, setLoading] = (0, react_1.useState)(_TEST_loading);
    const fetchMemories = (0, react_1.useCallback)(async () => {
        setLoading(true);
        if (_TEST_loading || !searchMemory)
            return;
        try {
            const { matches, ...response } = await searchMemory(sessionID, {
                searchType: 'Semantic',
                numberOfResults: 3,
                text: sanitizedQuestionAnswered,
                date: message.date,
                placeName: message.placeName,
                placeLatitude: message.placeLatitude,
                placeLongitude: message.placeLongitude,
                placeUncertaintyKm: message.placeUncertaintyKm,
                contextVars: message.contextVars,
                tag: message.tag,
                memoryTags: message.memoryTags,
            });
            if (response.resultCode !== 0) {
                console.error(response);
                react_hot_toast_1.default.error(t((0, error_1.getErrori18nKey)(response.resultCode)));
            }
            else {
                setMatches(matches !== null && matches !== void 0 ? matches : []);
            }
        }
        catch (err) {
            console.error('WHYTHISANSWER/FETCH', err);
            setMatches(initialMatches !== null && initialMatches !== void 0 ? initialMatches : []);
        }
        setLoading(false);
    }, [message, sessionID]);
    (0, react_1.useEffect)(() => {
        fetchMemories();
    }, [fetchMemories, message, sessionID]);
    return ((0, jsx_runtime_1.jsxs)(Drawer_1.default, { open: visible, width: "80%", animated: false, className: "memori-whythisanswer-drawer", onClose: () => closeDrawer(), title: t('whyThisAnswer'), children: [(0, jsx_runtime_1.jsx)("p", { children: t('whyThisAnswerHelper') }), sanitizedQuestionAnswered && ((0, jsx_runtime_1.jsxs)("p", { className: "memori--whythisanswer-question-answered", children: [(0, jsx_runtime_1.jsxs)("strong", { children: [t('question') || 'Question', ":"] }), ' ', sanitizedQuestionAnswered] })), (0, jsx_runtime_1.jsxs)(Spin_1.default, { primary: true, spinning: loading, children: [!loading && matches.length === 0 && ((0, jsx_runtime_1.jsx)("p", { role: "info", className: "memori--whythisanswer-no-results", children: t('nothingFound') })), loading && matches.length === 0 && ((0, jsx_runtime_1.jsxs)("ul", { className: "memori--whythisanswer-list memori--whythisanswer-skeleton", children: [(0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "memori--whythisanswer-title", children: [(0, jsx_runtime_1.jsx)("span", { className: "memori--whythisanswer-confidence", children: (0, jsx_runtime_1.jsx)("span", { className: "memori--whythisanswer-skeleton-text" }) }), (0, jsx_runtime_1.jsx)("div", { className: "memori--whythisanswer-title-text", children: (0, jsx_runtime_1.jsx)("p", { className: "memori--whythisanswer-skeleton-text" }) })] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("div", { className: "memori--whythisanswer-skeleton-text" }), (0, jsx_runtime_1.jsx)("div", { className: "memori--whythisanswer-skeleton-text" }), (0, jsx_runtime_1.jsx)("div", { className: "memori--whythisanswer-skeleton-text" })] }), (0, jsx_runtime_1.jsx)("div", { className: "memori--whythisanswer-skeleton-block" })] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "memori--whythisanswer-title", children: [(0, jsx_runtime_1.jsx)("span", { className: "memori--whythisanswer-confidence", children: (0, jsx_runtime_1.jsx)("span", { className: "memori--whythisanswer-skeleton-text" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "memori--whythisanswer-title-text", children: [(0, jsx_runtime_1.jsx)("p", { className: "memori--whythisanswer-skeleton-text" }), (0, jsx_runtime_1.jsx)("p", { className: "memori--whythisanswer-skeleton-text" })] })] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("div", { className: "memori--whythisanswer-skeleton-text" }), (0, jsx_runtime_1.jsx)("div", { className: "memori--whythisanswer-skeleton-text" })] }), (0, jsx_runtime_1.jsx)("div", { className: "memori--whythisanswer-skeleton-block" })] })] })), matches.length > 0 && ((0, jsx_runtime_1.jsx)("ul", { className: "memori--whythisanswer-list", children: matches.map(m => {
                            var _a, _b, _c, _d, _e, _f, _g;
                            return ((0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "memori--whythisanswer-title", children: [(0, jsx_runtime_1.jsx)("span", { className: "memori--whythisanswer-confidence", children: m.confidenceLevel }), (0, jsx_runtime_1.jsxs)("div", { className: "memori--whythisanswer-title-text", children: [(0, jsx_runtime_1.jsx)("div", { className: "memori--whythisanswer-title-text-top-container", children: (0, jsx_runtime_1.jsx)("p", { children: (0, jsx_runtime_1.jsx)("strong", { children: addQuestionMark((_a = m.memory.title) !== null && _a !== void 0 ? _a : '') }) }) }), (0, jsx_runtime_1.jsx)("p", { children: (_c = (_b = m.memory.titleVariants) === null || _b === void 0 ? void 0 : _b.map(t => addQuestionMark(t))) === null || _c === void 0 ? void 0 : _c.join(' | ') }), (m.memory.receiverName || m.memory.receiverTag) && ((0, jsx_runtime_1.jsxs)("p", { className: "memori--whythisanswer-title-text-top", children: [t('receiverLabel'), ": ", m.memory.receiverTag, ' ', m.memory.receiverName] }))] })] }), m.memory.contextVars && ((0, jsx_runtime_1.jsx)("div", { className: "memori--whythisanswer-contextvars", children: Object.entries(m.memory.contextVars || {}).map(([key, value]) => ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "memori--whythisanswer-contextvars-card", children: (0, jsx_runtime_1.jsxs)("span", { children: [key, ": ", (value === null || value === void 0 ? void 0 : value.toString()) || '✔️'] }) }, key))) })), (_d = m.memory.answers) === null || _d === void 0 ? void 0 : _d.map((a, i) => ((0, jsx_runtime_1.jsx)("p", { className: "memori--whythisanswer-answer", children: (0, jsx_runtime_1.jsx)(Expandable_1.default, { mode: "rows", rows: 3, children: (0, message_1.stripAllInternalTags)(a.text || '') }) }, i))), (0, jsx_runtime_1.jsx)(MediaWidget_1.default, { links: (_e = m.memory.media) === null || _e === void 0 ? void 0 : _e.filter(m => m.mimeType === 'text/html') }), (_g = (_f = m.memory.media) === null || _f === void 0 ? void 0 : _f.filter(m => m.mimeType === 'text/plain')) === null || _g === void 0 ? void 0 : _g.map(m => ((0, jsx_runtime_1.jsx)(Expandable_1.default, { mode: "rows", rows: 2, lineHeightMultiplier: 2, innerClassName: "memori--whythisanswer-snippet-expandable", children: (0, jsx_runtime_1.jsx)(Snippet_1.default, { medium: m, showCopyButton: false }, m.mediumID) }, m.mediumID)))] }, m.memory.memoryID));
                        }) }))] })] }));
};
exports.default = WhyThisAnswer;
//# sourceMappingURL=WhyThisAnswer.js.map