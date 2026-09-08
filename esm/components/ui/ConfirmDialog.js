import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Button from './Button';
const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, }) => {
    return (_jsx(Transition, { appear: true, show: isOpen, as: React.Fragment, children: _jsxs(Dialog, { as: "div", className: "memori-confirm-dialog", onClose: onClose, children: [_jsx("div", { className: "memori-confirm-dialog--backdrop" }), _jsx("div", { className: "memori-confirm-dialog--container", children: _jsx(Transition.Child, { as: React.Fragment, enter: "ease-out duration-300", enterFrom: "opacity-0 scale-95", enterTo: "opacity-100 scale-100", leave: "ease-in duration-200", leaveFrom: "opacity-100 scale-100", leaveTo: "opacity-0 scale-95", children: _jsxs(Dialog.Panel, { className: "memori-confirm-dialog--panel", children: [_jsx(Dialog.Title, { className: "memori-confirm-dialog--title", children: title }), _jsx(Dialog.Description, { className: "memori-confirm-dialog--message", children: message }), _jsxs("div", { className: "memori-confirm-dialog--actions", children: [_jsx(Button, { onClick: onClose, children: cancelText }), _jsx(Button, { primary: true, onClick: onConfirm, children: confirmText })] })] }) }) })] }) }));
};
export default ConfirmDialog;
//# sourceMappingURL=ConfirmDialog.js.map