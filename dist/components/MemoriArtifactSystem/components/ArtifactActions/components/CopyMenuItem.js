"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const Copy_1 = tslib_1.__importDefault(require("../../../../icons/Copy"));
const Download_1 = tslib_1.__importDefault(require("../../../../icons/Download"));
const Print_1 = tslib_1.__importDefault(require("../../../../icons/Print"));
const Link_1 = tslib_1.__importDefault(require("../../../../icons/Link"));
const CopyMenuItem = ({ format, onClick, loading = false, disabled = false, active = false, }) => {
    const handleClick = () => {
        if (!disabled && !loading) {
            onClick(format);
        }
    };
    const getIcon = () => {
        if (loading) {
            return ((0, jsx_runtime_1.jsx)("div", { className: "memori-copy-menu-item-loading", children: (0, jsx_runtime_1.jsx)("div", { className: "memori-copy-menu-item-spinner" }) }));
        }
        switch (format.action) {
            case 'pdf':
                return (0, jsx_runtime_1.jsx)(Download_1.default, { className: "memori-copy-menu-item-icon" });
            case 'print':
                return (0, jsx_runtime_1.jsx)(Print_1.default, { className: "memori-copy-menu-item-icon" });
            case 'link':
                return (0, jsx_runtime_1.jsx)(Link_1.default, { className: "memori-copy-menu-item-icon" });
            default:
                return (0, jsx_runtime_1.jsx)(Copy_1.default, { className: "memori-copy-menu-item-icon" });
        }
    };
    return ((0, jsx_runtime_1.jsx)("button", { type: "button", className: (0, classnames_1.default)('memori-copy-menu-item', {
            'memori-copy-menu-item--loading': loading,
            'memori-copy-menu-item--disabled': disabled,
            'memori-copy-menu-item--pdf': format.action === 'pdf',
            'memori-copy-menu-item--print': format.action === 'print',
            'memori-copy-menu-item--active': active,
            'memori-copy-menu-item--external': format.action === 'link',
            'memori-copy-menu-item--copy': format.action === 'copy',
            'memori-copy-menu-item--download': format.action === 'download',
        }), onClick: handleClick, disabled: disabled || loading, title: format.description, children: (0, jsx_runtime_1.jsxs)("div", { className: "memori-copy-menu-item-content", children: [(0, jsx_runtime_1.jsx)("div", { className: "memori-copy-menu-item-icon-wrapper", children: getIcon() }), (0, jsx_runtime_1.jsxs)("div", { className: "memori-copy-menu-item-text", children: [(0, jsx_runtime_1.jsx)("div", { className: "memori-copy-menu-item-label", children: format.label }), format.description && ((0, jsx_runtime_1.jsx)("div", { className: "memori-copy-menu-item-description", children: format.description }))] }), format.isAsync && ((0, jsx_runtime_1.jsx)("div", { className: "memori-copy-menu-item-async-indicator", children: (0, jsx_runtime_1.jsx)("span", { className: "memori-copy-menu-item-async-badge", children: "PDF" }) }))] }) }));
};
exports.default = CopyMenuItem;
//# sourceMappingURL=CopyMenuItem.js.map