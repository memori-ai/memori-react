"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ThumbUp = ({ className, title, }) => ((0, jsx_runtime_1.jsx)("svg", { ...(!title ? { 'aria-hidden': 'true' } : {}), focusable: "false", role: "img", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", tabIndex: -1, className: className, "aria-label": title, children: (0, jsx_runtime_1.jsx)("path", { d: "M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" }) }));
exports.default = ThumbUp;
//# sourceMappingURL=ThumbUp.js.map