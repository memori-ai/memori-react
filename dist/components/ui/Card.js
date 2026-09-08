"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const Spin_1 = tslib_1.__importDefault(require("./Spin"));
const Card = ({ loading = false, className, title, description, cover, hoverable = false, children, onClick, }) => ((0, jsx_runtime_1.jsx)("div", { onClick: onClick, className: (0, classnames_1.default)('memori-card', className, {
        'memori-card--loading': loading,
        'memori-card--with-cover': cover,
        'memori-card--hoverable': hoverable,
        'memori-card--pointer': !!onClick,
    }), children: (0, jsx_runtime_1.jsxs)(Spin_1.default, { spinning: loading, children: [cover && (0, jsx_runtime_1.jsx)("div", { className: "memori-card--cover", children: cover }), (0, jsx_runtime_1.jsxs)("div", { className: "memori-card--content", children: [title && (0, jsx_runtime_1.jsx)("h3", { className: "memori-card--title", children: title }), description && ((0, jsx_runtime_1.jsx)("p", { className: "memori-card--description", children: description })), (0, jsx_runtime_1.jsx)("div", { className: "memori-card--children", children: children })] })] }) }));
exports.default = Card;
//# sourceMappingURL=Card.js.map