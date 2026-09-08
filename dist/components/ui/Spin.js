"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const Loading_1 = tslib_1.__importDefault(require("../icons/Loading"));
const Spin = ({ spinning = false, primary = false, className, children, }) => ((0, jsx_runtime_1.jsxs)("div", { className: (0, classnames_1.default)('memori-spin', className, {
        'memori-spin--spinning': spinning,
        'memori-spin--primary': primary,
    }), children: [children, (0, jsx_runtime_1.jsx)("div", { className: "memori-spin--spinner", children: (0, jsx_runtime_1.jsx)(Loading_1.default, { loading: true }) })] }));
exports.default = Spin;
//# sourceMappingURL=Spin.js.map