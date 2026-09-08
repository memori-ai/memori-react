"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@headlessui/react");
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const react_i18next_1 = require("react-i18next");
const Button_1 = tslib_1.__importDefault(require("../ui/Button"));
const SendOnEnterMenu = ({ sendOnEnter, setSendOnEnter }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(react_1.Menu, { as: "div", className: "memori-send-on-enter-menu", children: [(0, jsx_runtime_1.jsx)(react_1.Menu.Button, { className: (0, classnames_1.default)('memori-button', 'memori-button--circle', 'memori-button--icon-only', 'memori-share-button--button', 'memori--conversation-button'), children: (0, jsx_runtime_1.jsx)("div", { className: "memori-button--icon", children: (0, jsx_runtime_1.jsx)("span", { style: {
                            display: 'block',
                            width: '1rem',
                            height: '1rem',
                        }, children: "\u2026" }) }) }), (0, jsx_runtime_1.jsx)(react_1.Menu.Items, { className: "memori-menu--overlay", children: (0, jsx_runtime_1.jsxs)(react_1.RadioGroup, { value: sendOnEnter, onChange: setSendOnEnter, children: [(0, jsx_runtime_1.jsx)(react_1.RadioGroup.Option, { value: "keypress", className: "memori-menu--option", children: ({ checked }) => ((0, jsx_runtime_1.jsx)(react_1.Menu.Item, { children: (0, jsx_runtime_1.jsx)(Button_1.default, { className: "memori-menu--button", ghost: true, outlined: checked, icon: (0, jsx_runtime_1.jsx)("span", { className: "memori-menu--icon", children: checked ? '✓' : '' }), children: t('widget.sendOnKeypress') }) })) }), (0, jsx_runtime_1.jsx)(react_1.RadioGroup.Option, { value: "click", className: "memori-menu--option", children: ({ checked }) => ((0, jsx_runtime_1.jsx)(react_1.Menu.Item, { children: (0, jsx_runtime_1.jsx)(Button_1.default, { className: "memori-menu--button", ghost: true, outlined: checked, icon: (0, jsx_runtime_1.jsx)("span", { className: "memori-menu--icon", children: checked ? '✓' : '' }), children: t('widget.sendOnClick') }) })) })] }) })] }));
};
exports.default = SendOnEnterMenu;
//# sourceMappingURL=SendOnEnterMenu.js.map