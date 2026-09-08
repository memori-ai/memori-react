"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_1 = require("@memori.ai/ui");
const DrawerFooter = ({ children, start, end, center, closeLabel, onClose, className = '', }) => {
    const hasSlots = start != null || end != null || center != null || closeLabel != null;
    return ((0, jsx_runtime_1.jsx)("footer", { className: `memori-drawer-footer ${className}`.trim(), children: center != null ? ((0, jsx_runtime_1.jsx)("div", { className: "memori-drawer-footer__inner memori-drawer-footer__inner--centered", children: center })) : children != null && !hasSlots ? ((0, jsx_runtime_1.jsx)("div", { className: "memori-drawer-footer__inner memori-drawer-footer__inner--centered", children: children })) : ((0, jsx_runtime_1.jsxs)("div", { className: "memori-drawer-footer__inner", children: [start != null && ((0, jsx_runtime_1.jsx)("div", { className: "memori-drawer-footer__start", children: start })), (0, jsx_runtime_1.jsxs)("div", { className: "memori-drawer-footer__end", children: [end, closeLabel != null && onClose != null && ((0, jsx_runtime_1.jsx)(ui_1.Button, { variant: "primary", onClick: onClose, children: closeLabel }))] })] })) }));
};
exports.default = DrawerFooter;
//# sourceMappingURL=DrawerFooter.js.map