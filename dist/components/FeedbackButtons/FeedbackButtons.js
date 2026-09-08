"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = tslib_1.__importStar(require("react"));
const react_2 = require("@headlessui/react");
const Tooltip_1 = tslib_1.__importDefault(require("../ui/Tooltip"));
const Button_1 = tslib_1.__importDefault(require("../ui/Button"));
const Feedback_1 = tslib_1.__importDefault(require("../icons/Feedback"));
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
    const [clicked, setClicked] = (0, react_1.useState)();
    const culture = memori.culture === 'it-IT'
        ? 'it-IT'
        : memori.culture === 'fr-FR'
            ? 'fr-FR'
            : 'en-GB';
    const feedbackMsg = feedbackMsgs[culture];
    const feedbackMsgHelper = feedbackMsgsHelpers[culture];
    const dislikeMsg = dislikeMsgs[culture];
    return ((0, jsx_runtime_1.jsx)("div", { className: `memori-chat--feedback${className ? ` ${className}` : ''}`, children: dropdown ? ((0, jsx_runtime_1.jsxs)(react_2.Menu, { as: "div", className: "memori-chat--feedback-menu", children: [(0, jsx_runtime_1.jsx)(react_2.Menu.Button, { as: react_1.default.Fragment, children: (0, jsx_runtime_1.jsx)(Button_1.default, { ghost: true, shape: "circle", title: "Feedback", className: "memori-chat--feedback-menu-button", disabled: !!clicked, icon: (0, jsx_runtime_1.jsx)(Feedback_1.default, { className: clicked ? 'memori-chat--feedback-clicked' : undefined }) }) }), (0, jsx_runtime_1.jsx)(react_2.Transition, { as: react_1.default.Fragment, enter: "transition ease-out duration-200", enterFrom: "transform opacity-0 scale-95", enterTo: "transform opacity-100 scale-100", leave: "transition ease-in duration-75", leaveFrom: "transform opacity-100 scale-100", leaveTo: "transform opacity-0 scale-95", children: (0, jsx_runtime_1.jsx)(react_2.Menu.Items, { className: "memori-chat--feedback-menu-items", children: (0, jsx_runtime_1.jsxs)("div", { className: "memori-chat--feedback-menu-items-container", children: [(0, jsx_runtime_1.jsx)(react_2.Menu.Item, { children: ({ active }) => ((0, jsx_runtime_1.jsx)("button", { className: `memori-chat--feedback-menu-item${active ? ' memori-chat--feedback-menu-item-active' : ''}`, onClick: () => {
                                            if (clicked === 'up' && !!toggle) {
                                                setClicked(undefined);
                                            }
                                            else {
                                                setClicked('up');
                                            }
                                        }, children: dislikeMsg })) }, "ok"), (0, jsx_runtime_1.jsx)(react_2.Menu.Item, { children: ({ active }) => ((0, jsx_runtime_1.jsx)("button", { className: `memori-chat--feedback-menu-item${active ? ' memori-chat--feedback-menu-item-active' : ''}`, onClick: () => {
                                            if (clicked === 'down' && !!toggle) {
                                                setClicked(undefined);
                                            }
                                            else {
                                                setClicked('down');
                                            }
                                            onNegativeClick(feedbackMsg);
                                        }, children: feedbackMsgHelper })) }, "no")] }) }) })] })) : ((0, jsx_runtime_1.jsx)(Tooltip_1.default, { align: "left", content: "Feedback", children: (0, jsx_runtime_1.jsx)(Button_1.default, { title: "Feedback", onClick: () => {
                    if (clicked === 'down' && !!toggle) {
                        setClicked(undefined);
                    }
                    else {
                        setClicked('down');
                    }
                    onNegativeClick(feedbackMsg);
                }, ghost: true, shape: "circle", icon: (0, jsx_runtime_1.jsx)(Feedback_1.default, { className: clicked ? 'memori-chat--feedback-clicked' : undefined }) }) })) }));
};
exports.default = FeedbackButtons;
//# sourceMappingURL=FeedbackButtons.js.map