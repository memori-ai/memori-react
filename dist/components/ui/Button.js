"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const Loading_1 = tslib_1.__importDefault(require("../icons/Loading"));
const Button = ({ primary = false, outlined = false, ghost = false, padded = true, shape = 'rounded', danger = false, loading = false, disabled = false, block = false, icon, className, title, id, htmlType, onClick, onMouseDown, onMouseUp, onMouseLeave, onTouchStart, onTouchEnd, children, isActive, }) => ((0, jsx_runtime_1.jsxs)("button", { id: id, type: htmlType, onClick: onClick, onMouseDown: onMouseDown, onMouseUp: onMouseUp, onMouseLeave: onMouseLeave, onTouchStart: onTouchStart, onTouchEnd: onTouchEnd, title: title, disabled: loading || disabled, className: (0, classnames_1.default)('memori-button', {
        'memori-button--primary': primary,
        'memori-button--outlined': outlined,
        'memori-button--ghost': ghost,
        'memori-button--square': shape === 'square',
        'memori-button--rounded': shape === 'rounded',
        'memori-button--circle': shape === 'circle',
        'memori-button--padded': padded,
        'memori-button--block': block,
        'memori-button--with-icon': (icon || loading) && children,
        'memori-button--icon-only': (icon || loading) && !children,
        'memori-button--danger': danger,
        'memori-button--loading': loading,
        'memori-button--active': isActive,
    }, className), children: [icon && !loading && (0, jsx_runtime_1.jsx)("span", { className: "memori-button--icon", children: icon }), loading && ((0, jsx_runtime_1.jsx)("span", { className: "memori-button--icon loading-icon", children: (0, jsx_runtime_1.jsx)(Loading_1.default, { loading: true }) })), children] }));
exports.default = Button;
//# sourceMappingURL=Button.js.map