"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Info = ({ className, title }) => ((0, jsx_runtime_1.jsxs)("svg", { width: "800px", height: "800px", viewBox: "0 0 24 24", fill: "none", ...(!title ? { 'aria-hidden': 'true' } : {}), xmlns: "http://www.w3.org/2000/svg", className: className, "aria-label": title, children: [(0, jsx_runtime_1.jsx)("circle", { cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "1.5" }), (0, jsx_runtime_1.jsx)("path", { d: "M12 17V11", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }), (0, jsx_runtime_1.jsx)("circle", { cx: "1", cy: "1", r: "1", transform: "matrix(1 0 0 -1 11 9)", fill: "currentColor" })] }));
exports.default = Info;
//# sourceMappingURL=Info.js.map