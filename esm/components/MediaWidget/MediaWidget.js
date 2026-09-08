import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, memo } from 'react';
import Button from '../ui/Button';
import MediaItemWidget from './MediaItemWidget';
import { Transition } from '@headlessui/react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
const MediaWidget = ({ hints = [], links = [], media = [], simulateUserPrompt = () => { }, sessionID, baseUrl, apiUrl, translateTo, customMediaRenderer, fromUser = false, }) => {
    const { t } = useTranslation();
    const [showHints, setShowHints] = useState(true);
    const [hintsPagination, setHintsPagination] = useState(6);
    useEffect(() => {
        setShowHints(true);
    }, [hints]);
    return (_jsxs("div", { className: "memori-media-widget", children: [((media === null || media === void 0 ? void 0 : media.length) > 0 || (links === null || links === void 0 ? void 0 : links.length) > 0) && (_jsx(MediaItemWidget, { items: [...(media || []), ...(links || [])], sessionID: sessionID, translateTo: translateTo, baseURL: baseUrl, apiURL: apiUrl, customMediaRenderer: customMediaRenderer, fromUser: fromUser })), (hints === null || hints === void 0 ? void 0 : hints.length) > 0 && showHints && (_jsxs(_Fragment, { children: [_jsx(Transition, { appear: true, show: true, as: "ul", className: "memori-media--hints", children: hints.slice(0, hintsPagination).map((item, index) => (_jsx(Transition.Child, { as: "li", enter: "ease-out duration-500", enterFrom: "opacity-0 translate-y-1", enterTo: "opacity-1 translate-y-0", leave: "ease-in duration-300", leaveFrom: "opacity-1", leaveTo: "opacity-0", children: _jsx(Button, { className: cx('memori-media--hint'), primary: true, onClick: () => {
                                    simulateUserPrompt(item.originalText, item.text);
                                    setShowHints(false);
                                }, onTouchEnd: () => {
                                    simulateUserPrompt(item.originalText, item.text);
                                    setShowHints(false);
                                }, children: item.text }, item.text + index) }, item.text + index))) }), hints.length > hintsPagination && (_jsx("div", { className: "memori-hints--show-more", children: _jsx(Button, { className: "memori-hints--show-more-button", id: "showMoreHints", onClick: () => setHintsPagination(hintsPagination + 6), children: t('expand') || 'Expand' }) }))] }))] }));
};
export default memo(MediaWidget);
//# sourceMappingURL=MediaWidget.js.map