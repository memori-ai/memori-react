import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Transition } from '@headlessui/react';
import cx from 'classnames';
import Close from '../icons/Close';
import Button from './Button';
import { useTranslation } from 'react-i18next';
const Alert = ({ open = false, onClose, className, title, description, children, type = 'info', icon, closable = true, duration = null, action, width = '400px', }) => {
    const { t } = useTranslation();
    React.useEffect(() => {
        if (duration && open) {
            const timer = setTimeout(() => {
                onClose(false);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, open, onClose]);
    const getTypeStyles = (type) => {
        switch (type) {
            case 'success':
                return 'memori-alert--success';
            case 'warning':
                return 'memori-alert--warning';
            case 'error':
                return 'memori-alert--error';
            default:
                return 'memori-alert--info';
        }
    };
    return (_jsx(Transition, { show: open, as: React.Fragment, appear: true, children: _jsxs("div", { className: cx('memori-alert', getTypeStyles(type), className), children: [_jsx("style", { dangerouslySetInnerHTML: {
                        __html: `
              .memori-alert {
                --memori-alert--width: ${width};
              }
            `,
                    } }), _jsx(Transition.Child, { as: React.Fragment, enter: "ease-out duration-300", enterFrom: "opacity-0 translate-y-4", enterTo: "opacity-100 translate-y-0", leave: "ease-in duration-200", leaveFrom: "opacity-100 translate-y-0", leaveTo: "opacity-0 translate-y-4", children: _jsxs("div", { className: "memori-alert--container", children: [icon && _jsx("div", { className: "memori-alert--icon", children: icon }), _jsxs("div", { className: "memori-alert--content", children: [title && (_jsx("div", { className: "memori-alert--title", children: title })), description && (_jsx("div", { className: "memori-alert--description", children: description })), children] }), _jsxs("div", { className: "memori-alert--actions", children: [action && _jsx("div", { className: "memori-alert--action", children: action }), closable && (_jsx(Button, { ghost: true, padded: true, shape: "circle", icon: _jsx(Close, {}), title: t('close') || 'Close', onClick: () => onClose(false), className: "memori-alert--close" }))] })] }) })] }) }));
};
export default Alert;
//# sourceMappingURL=Alert.js.map