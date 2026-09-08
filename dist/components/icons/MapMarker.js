"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const MapMarker = ({ className, title, }) => ((0, jsx_runtime_1.jsx)("svg", { ...(!title ? { 'aria-hidden': 'true' } : {}), focusable: "false", role: "img", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 384 512", className: className, "aria-label": title, children: (0, jsx_runtime_1.jsx)("path", { fill: "currentColor", d: "M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" }) }));
exports.default = MapMarker;
//# sourceMappingURL=MapMarker.js.map