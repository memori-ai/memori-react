"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = tslib_1.__importDefault(require("react"));
const react_2 = require("@headlessui/react");
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const Close_1 = tslib_1.__importDefault(require("../icons/Close"));
const Button_1 = tslib_1.__importDefault(require("./Button"));
const react_i18next_1 = require("react-i18next");
const Alert = ({ open = false, onClose, className, title, description, children, type = 'info', icon, closable = true, duration = null, action, width = '400px', }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    react_1.default.useEffect(() => {
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
    return ((0, jsx_runtime_1.jsx)(react_2.Transition, { show: open, as: react_1.default.Fragment, appear: true, children: (0, jsx_runtime_1.jsxs)("div", { className: (0, classnames_1.default)('memori-alert', getTypeStyles(type), className), children: [(0, jsx_runtime_1.jsx)("style", { dangerouslySetInnerHTML: {
                        __html: `
              .memori-alert {
                --memori-alert--width: ${width};
              }
            `,
                    } }), (0, jsx_runtime_1.jsx)(react_2.Transition.Child, { as: react_1.default.Fragment, enter: "ease-out duration-300", enterFrom: "opacity-0 translate-y-4", enterTo: "opacity-100 translate-y-0", leave: "ease-in duration-200", leaveFrom: "opacity-100 translate-y-0", leaveTo: "opacity-0 translate-y-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "memori-alert--container", children: [icon && (0, jsx_runtime_1.jsx)("div", { className: "memori-alert--icon", children: icon }), (0, jsx_runtime_1.jsxs)("div", { className: "memori-alert--content", children: [title && ((0, jsx_runtime_1.jsx)("div", { className: "memori-alert--title", children: title })), description && ((0, jsx_runtime_1.jsx)("div", { className: "memori-alert--description", children: description })), children] }), (0, jsx_runtime_1.jsxs)("div", { className: "memori-alert--actions", children: [action && (0, jsx_runtime_1.jsx)("div", { className: "memori-alert--action", children: action }), closable && ((0, jsx_runtime_1.jsx)(Button_1.default, { ghost: true, padded: true, shape: "circle", icon: (0, jsx_runtime_1.jsx)(Close_1.default, {}), title: t('close') || 'Close', onClick: () => onClose(false), className: "memori-alert--close" }))] })] }) })] }) }));
};
exports.default = Alert;
//# sourceMappingURL=Alert.js.map