"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const drei_1 = require("@react-three/drei");
const Spin_1 = tslib_1.__importDefault(require("../../../../ui/Spin"));
const Loader = ({ fallbackImg }) => {
    const { progress } = (0, drei_1.useProgress)();
    return ((0, jsx_runtime_1.jsx)(drei_1.Html, { center: true, className: "avatar-loader", children: (0, jsx_runtime_1.jsx)(Spin_1.default, { spinning: true, children: fallbackImg ? ((0, jsx_runtime_1.jsxs)("figure", { children: [(0, jsx_runtime_1.jsx)("img", { src: fallbackImg, alt: `${Math.round(progress)}% loaded`, title: `${Math.round(progress)}% loaded` }), (0, jsx_runtime_1.jsx)("figcaption", { children: `${Math.round(progress)}%` })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [Math.round(progress), " % loaded"] })) }) }));
};
exports.default = Loader;
//# sourceMappingURL=loader.js.map