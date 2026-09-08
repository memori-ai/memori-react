import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Spin from './Spin';
import Button from './Button';
import Close from '../icons/Close';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
const Modal = ({ open = false, onClose, className, title, description, children, footer, loading = false, closable = true, width = '100%', widthMd = '100%', }) => {
    const { t } = useTranslation();
    return (_jsx(Transition, { appear: true, show: open, as: React.Fragment, children: _jsxs(Dialog, { open: open, onClose: onClose, className: cx('memori-modal', className), children: [_jsx(Transition.Child, { as: React.Fragment, enter: "ease-out duration-300", enterFrom: "opacity-0", enterTo: "opacity-100", leave: "ease-in duration-200", leaveFrom: "opacity-100", leaveTo: "opacity-0", children: _jsx("div", { className: "memori-modal--backdrop" }) }), _jsx("div", { className: "memori-modal--container", children: _jsx("div", { className: "memori-modal--container-scrollable", children: _jsx(Transition.Child, { as: React.Fragment, enter: "ease-out duration-300", enterFrom: "opacity-0 scale-95", enterTo: "opacity-100 scale-100", leave: "ease-in duration-200", leaveFrom: "opacity-100 scale-100", leaveTo: "opacity-0 scale-95", children: _jsxs(Dialog.Panel, { className: "memori-modal--panel", children: [_jsx("style", { dangerouslySetInnerHTML: {
                                            __html: `
                    .memori-modal--panel {
                      --memori-modal--width: ${width};
                      --memori-modal--width-md: ${widthMd};
                    }
                  `,
                                        } }), closable && (_jsx("div", { className: "memori-modal--close", children: _jsx(Button, { ghost: true, padded: true, shape: "circle", icon: _jsx(Close, {}), title: t('close') || 'Close', onClick: () => onClose(false) }) })), _jsxs(Spin, { spinning: loading, children: [title && (_jsx(Dialog.Title, { className: "memori-modal--title", children: title })), description && (_jsx(Dialog.Description, { className: "memori-modal--description", children: description })), children, footer && (_jsx("div", { className: "memori-modal--footer", children: footer }))] })] }) }) }) })] }) }));
};
export default Modal;
//# sourceMappingURL=Modal.js.map