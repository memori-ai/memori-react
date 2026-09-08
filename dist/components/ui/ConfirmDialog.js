"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = tslib_1.__importDefault(require("react"));
const react_2 = require("@headlessui/react");
const Button_1 = tslib_1.__importDefault(require("./Button"));
const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, }) => {
    return ((0, jsx_runtime_1.jsx)(react_2.Transition, { appear: true, show: isOpen, as: react_1.default.Fragment, children: (0, jsx_runtime_1.jsxs)(react_2.Dialog, { as: "div", className: "memori-confirm-dialog", onClose: onClose, children: [(0, jsx_runtime_1.jsx)("div", { className: "memori-confirm-dialog--backdrop" }), (0, jsx_runtime_1.jsx)("div", { className: "memori-confirm-dialog--container", children: (0, jsx_runtime_1.jsx)(react_2.Transition.Child, { as: react_1.default.Fragment, enter: "ease-out duration-300", enterFrom: "opacity-0 scale-95", enterTo: "opacity-100 scale-100", leave: "ease-in duration-200", leaveFrom: "opacity-100 scale-100", leaveTo: "opacity-0 scale-95", children: (0, jsx_runtime_1.jsxs)(react_2.Dialog.Panel, { className: "memori-confirm-dialog--panel", children: [(0, jsx_runtime_1.jsx)(react_2.Dialog.Title, { className: "memori-confirm-dialog--title", children: title }), (0, jsx_runtime_1.jsx)(react_2.Dialog.Description, { className: "memori-confirm-dialog--message", children: message }), (0, jsx_runtime_1.jsxs)("div", { className: "memori-confirm-dialog--actions", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { onClick: onClose, children: cancelText }), (0, jsx_runtime_1.jsx)(Button_1.default, { primary: true, onClick: onConfirm, children: confirmText })] })] }) }) })] }) }));
};
exports.default = ConfirmDialog;
//# sourceMappingURL=ConfirmDialog.js.map