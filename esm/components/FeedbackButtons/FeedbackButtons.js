import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import Tooltip from '../ui/Tooltip';
import Button from '../ui/Button';
import Feedback from '../icons/Feedback';
const feedbackMsgs = {
    'it-IT': 'Non è quello che ti ho chiesto',
    'fr-FR': "Ce n'est pas ce que je t'ai demandé",
    'en-GB': "It's not what I asked",
};
const feedbackMsgsHelpers = {
    'it-IT': 'La risposta non era corretta',
    'fr-FR': "La réponse n'était pas correcte",
    'en-GB': 'The answer was not correct',
};
const dislikeMsgs = {
    'it-IT': 'Non mi è piaciuta la risposta',
    'fr-FR': "Je n'ai pas aimé la réponse",
    'en-GB': "I didn't like the answer",
};
const FeedbackButtons = ({ memori, className, onNegativeClick, toggle = false, dropdown = false, }) => {
    const [clicked, setClicked] = useState();
    const culture = memori.culture === 'it-IT'
        ? 'it-IT'
        : memori.culture === 'fr-FR'
            ? 'fr-FR'
            : 'en-GB';
    const feedbackMsg = feedbackMsgs[culture];
    const feedbackMsgHelper = feedbackMsgsHelpers[culture];
    const dislikeMsg = dislikeMsgs[culture];
    return (_jsx("div", { className: `memori-chat--feedback${className ? ` ${className}` : ''}`, children: dropdown ? (_jsxs(Menu, { as: "div", className: "memori-chat--feedback-menu", children: [_jsx(Menu.Button, { as: React.Fragment, children: _jsx(Button, { ghost: true, shape: "circle", title: "Feedback", className: "memori-chat--feedback-menu-button", disabled: !!clicked, icon: _jsx(Feedback, { className: clicked ? 'memori-chat--feedback-clicked' : undefined }) }) }), _jsx(Transition, { as: React.Fragment, enter: "transition ease-out duration-200", enterFrom: "transform opacity-0 scale-95", enterTo: "transform opacity-100 scale-100", leave: "transition ease-in duration-75", leaveFrom: "transform opacity-100 scale-100", leaveTo: "transform opacity-0 scale-95", children: _jsx(Menu.Items, { className: "memori-chat--feedback-menu-items", children: _jsxs("div", { className: "memori-chat--feedback-menu-items-container", children: [_jsx(Menu.Item, { children: ({ active }) => (_jsx("button", { className: `memori-chat--feedback-menu-item${active ? ' memori-chat--feedback-menu-item-active' : ''}`, onClick: () => {
                                            if (clicked === 'up' && !!toggle) {
                                                setClicked(undefined);
                                            }
                                            else {
                                                setClicked('up');
                                            }
                                        }, children: dislikeMsg })) }, "ok"), _jsx(Menu.Item, { children: ({ active }) => (_jsx("button", { className: `memori-chat--feedback-menu-item${active ? ' memori-chat--feedback-menu-item-active' : ''}`, onClick: () => {
                                            if (clicked === 'down' && !!toggle) {
                                                setClicked(undefined);
                                            }
                                            else {
                                                setClicked('down');
                                            }
                                            onNegativeClick(feedbackMsg);
                                        }, children: feedbackMsgHelper })) }, "no")] }) }) })] })) : (_jsx(Tooltip, { align: "left", content: "Feedback", children: _jsx(Button, { title: "Feedback", onClick: () => {
                    if (clicked === 'down' && !!toggle) {
                        setClicked(undefined);
                    }
                    else {
                        setClicked('down');
                    }
                    onNegativeClick(feedbackMsg);
                }, ghost: true, shape: "circle", icon: _jsx(Feedback, { className: clicked ? 'memori-chat--feedback-clicked' : undefined }) }) })) }));
};
export default FeedbackButtons;
//# sourceMappingURL=FeedbackButtons.js.map