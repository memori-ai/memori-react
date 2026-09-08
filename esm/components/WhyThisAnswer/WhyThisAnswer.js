import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useState } from 'react';
import Drawer from '../ui/Drawer';
import Spin from '../ui/Spin';
import Expandable from '../ui/Expandable';
import toast from 'react-hot-toast';
import { getErrori18nKey } from '../../helpers/error';
import { useTranslation } from 'react-i18next';
import Snippet from '../Snippet/Snippet';
import MediaWidget from '../MediaWidget/MediaWidget';
import Card from '../ui/Card';
import { stripAllInternalTags } from '../../helpers/message';
const addQuestionMark = (question) => question.endsWith('?') ? question : `${question}?`;
const WhyThisAnswer = ({ message, sessionID, visible = true, initialMatches = [], closeDrawer, client, _TEST_loading = false, }) => {
    const { t } = useTranslation();
    const searchMemory = client === null || client === void 0 ? void 0 : client.search.searchMemory;
    const sanitizedQuestionAnswered = stripAllInternalTags(message.questionAnswered || '');
    const [matches, setMatches] = useState(initialMatches);
    const [loading, setLoading] = useState(_TEST_loading);
    const fetchMemories = useCallback(async () => {
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
                toast.error(t(getErrori18nKey(response.resultCode)));
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
    useEffect(() => {
        fetchMemories();
    }, [fetchMemories, message, sessionID]);
    return (_jsxs(Drawer, { open: visible, width: "80%", animated: false, className: "memori-whythisanswer-drawer", onClose: () => closeDrawer(), title: t('whyThisAnswer'), children: [_jsx("p", { children: t('whyThisAnswerHelper') }), sanitizedQuestionAnswered && (_jsxs("p", { className: "memori--whythisanswer-question-answered", children: [_jsxs("strong", { children: [t('question') || 'Question', ":"] }), ' ', sanitizedQuestionAnswered] })), _jsxs(Spin, { primary: true, spinning: loading, children: [!loading && matches.length === 0 && (_jsx("p", { role: "info", className: "memori--whythisanswer-no-results", children: t('nothingFound') })), loading && matches.length === 0 && (_jsxs("ul", { className: "memori--whythisanswer-list memori--whythisanswer-skeleton", children: [_jsxs("li", { children: [_jsxs("div", { className: "memori--whythisanswer-title", children: [_jsx("span", { className: "memori--whythisanswer-confidence", children: _jsx("span", { className: "memori--whythisanswer-skeleton-text" }) }), _jsx("div", { className: "memori--whythisanswer-title-text", children: _jsx("p", { className: "memori--whythisanswer-skeleton-text" }) })] }), _jsxs("p", { children: [_jsx("div", { className: "memori--whythisanswer-skeleton-text" }), _jsx("div", { className: "memori--whythisanswer-skeleton-text" }), _jsx("div", { className: "memori--whythisanswer-skeleton-text" })] }), _jsx("div", { className: "memori--whythisanswer-skeleton-block" })] }), _jsxs("li", { children: [_jsxs("div", { className: "memori--whythisanswer-title", children: [_jsx("span", { className: "memori--whythisanswer-confidence", children: _jsx("span", { className: "memori--whythisanswer-skeleton-text" }) }), _jsxs("div", { className: "memori--whythisanswer-title-text", children: [_jsx("p", { className: "memori--whythisanswer-skeleton-text" }), _jsx("p", { className: "memori--whythisanswer-skeleton-text" })] })] }), _jsxs("p", { children: [_jsx("div", { className: "memori--whythisanswer-skeleton-text" }), _jsx("div", { className: "memori--whythisanswer-skeleton-text" })] }), _jsx("div", { className: "memori--whythisanswer-skeleton-block" })] })] })), matches.length > 0 && (_jsx("ul", { className: "memori--whythisanswer-list", children: matches.map(m => {
                            var _a, _b, _c, _d, _e, _f, _g;
                            return (_jsxs("li", { children: [_jsxs("div", { className: "memori--whythisanswer-title", children: [_jsx("span", { className: "memori--whythisanswer-confidence", children: m.confidenceLevel }), _jsxs("div", { className: "memori--whythisanswer-title-text", children: [_jsx("div", { className: "memori--whythisanswer-title-text-top-container", children: _jsx("p", { children: _jsx("strong", { children: addQuestionMark((_a = m.memory.title) !== null && _a !== void 0 ? _a : '') }) }) }), _jsx("p", { children: (_c = (_b = m.memory.titleVariants) === null || _b === void 0 ? void 0 : _b.map(t => addQuestionMark(t))) === null || _c === void 0 ? void 0 : _c.join(' | ') }), (m.memory.receiverName || m.memory.receiverTag) && (_jsxs("p", { className: "memori--whythisanswer-title-text-top", children: [t('receiverLabel'), ": ", m.memory.receiverTag, ' ', m.memory.receiverName] }))] })] }), m.memory.contextVars && (_jsx("div", { className: "memori--whythisanswer-contextvars", children: Object.entries(m.memory.contextVars || {}).map(([key, value]) => (_jsx(Card, { className: "memori--whythisanswer-contextvars-card", children: _jsxs("span", { children: [key, ": ", (value === null || value === void 0 ? void 0 : value.toString()) || '✔️'] }) }, key))) })), (_d = m.memory.answers) === null || _d === void 0 ? void 0 : _d.map((a, i) => (_jsx("p", { className: "memori--whythisanswer-answer", children: _jsx(Expandable, { mode: "rows", rows: 3, children: stripAllInternalTags(a.text || '') }) }, i))), _jsx(MediaWidget, { links: (_e = m.memory.media) === null || _e === void 0 ? void 0 : _e.filter(m => m.mimeType === 'text/html') }), (_g = (_f = m.memory.media) === null || _f === void 0 ? void 0 : _f.filter(m => m.mimeType === 'text/plain')) === null || _g === void 0 ? void 0 : _g.map(m => (_jsx(Expandable, { mode: "rows", rows: 2, lineHeightMultiplier: 2, innerClassName: "memori--whythisanswer-snippet-expandable", children: _jsx(Snippet, { medium: m, showCopyButton: false }, m.mediumID) }, m.mediumID)))] }, m.memory.memoryID));
                        }) }))] })] }));
};
export default WhyThisAnswer;
//# sourceMappingURL=WhyThisAnswer.js.map