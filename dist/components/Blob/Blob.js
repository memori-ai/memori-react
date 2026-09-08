"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const ExperienceBlob = ({ avatar, speaking = false }) => {
    return ((0, jsx_runtime_1.jsxs)("div", { className: (0, classnames_1.default)('memori-blob', { 'memori-blob--speaking': speaking }), children: [avatar && ((0, jsx_runtime_1.jsx)("figure", { children: (0, jsx_runtime_1.jsx)("img", { src: avatar, alt: "", role: "presentation" }) })), (0, jsx_runtime_1.jsx)("div", { className: "mainDiv" }), (0, jsx_runtime_1.jsx)("div", { className: "mainDiv" }), (0, jsx_runtime_1.jsx)("div", { className: "mainDiv" }), (0, jsx_runtime_1.jsx)("div", { className: "mainDiv" }), (0, jsx_runtime_1.jsx)("div", { className: "mainDiv" })] }));
};
exports.default = ExperienceBlob;
//# sourceMappingURL=Blob.js.map