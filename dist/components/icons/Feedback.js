"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Feedback = ({ className, title, }) => ((0, jsx_runtime_1.jsxs)("svg", { ...(!title ? { 'aria-hidden': 'true' } : {}), focusable: "false", role: "img", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", className: className, "aria-label": title, children: [(0, jsx_runtime_1.jsx)("path", { fill: "none", d: "M0 0h24v24H0V0z" }), (0, jsx_runtime_1.jsx)("path", { d: "M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17l-.59.59-.58.58V4h16v12zm-9-4h2v2h-2zm0-6h2v4h-2z" })] }));
exports.default = Feedback;
//# sourceMappingURL=Feedback.js.map