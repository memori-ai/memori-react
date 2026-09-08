"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = render;
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@testing-library/react");
const ui_1 = require("@memori.ai/ui");
function AlertProviderWrapper({ children }) {
    return ((0, jsx_runtime_1.jsxs)(ui_1.AlertProvider, { children: [children, (0, jsx_runtime_1.jsx)(ui_1.AlertViewport, {})] }));
}
function render(ui, options) {
    return (0, react_1.render)(ui, {
        wrapper: AlertProviderWrapper,
        ...options,
    });
}
tslib_1.__exportStar(require("@testing-library/react"), exports);
//# sourceMappingURL=testUtils.js.map