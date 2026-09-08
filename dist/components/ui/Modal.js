"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = tslib_1.__importDefault(require("react"));
const react_2 = require("@headlessui/react");
const Spin_1 = tslib_1.__importDefault(require("./Spin"));
const Button_1 = tslib_1.__importDefault(require("./Button"));
const Close_1 = tslib_1.__importDefault(require("../icons/Close"));
const react_i18next_1 = require("react-i18next");
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const Modal = ({ open = false, onClose, className, title, description, children, footer, loading = false, closable = true, width = '100%', widthMd = '100%', }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsx)(react_2.Transition, { appear: true, show: open, as: react_1.default.Fragment, children: (0, jsx_runtime_1.jsxs)(react_2.Dialog, { open: open, onClose: onClose, className: (0, classnames_1.default)('memori-modal', className), children: [(0, jsx_runtime_1.jsx)(react_2.Transition.Child, { as: react_1.default.Fragment, enter: "ease-out duration-300", enterFrom: "opacity-0", enterTo: "opacity-100", leave: "ease-in duration-200", leaveFrom: "opacity-100", leaveTo: "opacity-0", children: (0, jsx_runtime_1.jsx)("div", { className: "memori-modal--backdrop" }) }), (0, jsx_runtime_1.jsx)("div", { className: "memori-modal--container", children: (0, jsx_runtime_1.jsx)("div", { className: "memori-modal--container-scrollable", children: (0, jsx_runtime_1.jsx)(react_2.Transition.Child, { as: react_1.default.Fragment, enter: "ease-out duration-300", enterFrom: "opacity-0 scale-95", enterTo: "opacity-100 scale-100", leave: "ease-in duration-200", leaveFrom: "opacity-100 scale-100", leaveTo: "opacity-0 scale-95", children: (0, jsx_runtime_1.jsxs)(react_2.Dialog.Panel, { className: "memori-modal--panel", children: [(0, jsx_runtime_1.jsx)("style", { dangerouslySetInnerHTML: {
                                            __html: `
                    .memori-modal--panel {
                      --memori-modal--width: ${width};
                      --memori-modal--width-md: ${widthMd};
                    }
                  `,
                                        } }), closable && ((0, jsx_runtime_1.jsx)("div", { className: "memori-modal--close", children: (0, jsx_runtime_1.jsx)(Button_1.default, { ghost: true, padded: true, shape: "circle", icon: (0, jsx_runtime_1.jsx)(Close_1.default, {}), title: t('close') || 'Close', onClick: () => onClose(false) }) })), (0, jsx_runtime_1.jsxs)(Spin_1.default, { spinning: loading, children: [title && ((0, jsx_runtime_1.jsx)(react_2.Dialog.Title, { className: "memori-modal--title", children: title })), description && ((0, jsx_runtime_1.jsx)(react_2.Dialog.Description, { className: "memori-modal--description", children: description })), children, footer && ((0, jsx_runtime_1.jsx)("div", { className: "memori-modal--footer", children: footer }))] })] }) }) }) })] }) }));
};
exports.default = Modal;
//# sourceMappingURL=Modal.js.map