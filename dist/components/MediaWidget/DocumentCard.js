"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
function DocumentCard({ title, badge, }) {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "memori-media-item--document", children: [(0, jsx_runtime_1.jsx)("div", { className: "memori-media-item--document-header", children: (0, jsx_runtime_1.jsx)("div", { className: "memori-media-item--document-title", children: title }) }), (0, jsx_runtime_1.jsx)("span", { className: "memori-media-item--document-badge", children: badge })] }));
}
exports.DocumentCard = DocumentCard;
//# sourceMappingURL=DocumentCard.js.map