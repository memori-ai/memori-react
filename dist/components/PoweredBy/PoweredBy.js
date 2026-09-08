"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const PoweredBy = ({ tenant, userLang = 'en', integrationID, memoriHash, }) => {
    const tenantId = (tenant === null || tenant === void 0 ? void 0 : tenant.theme) === 'memorytwin'
        ? 'memorytwin'
        : (tenant === null || tenant === void 0 ? void 0 : tenant.theme) === 'twincreator'
            ? 'twincreator'
            : 'aisuru';
    return ((0, jsx_runtime_1.jsxs)("div", { className: "memori--powered-by", children: [(0, jsx_runtime_1.jsx)("img", { src: `https://aisuru.com/images/${tenantId}/logo.png`, alt: "" }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("span", { className: "sr-only", children: "Powered by" }), (0, jsx_runtime_1.jsx)("a", { href: `https://memori.ai/${(userLang === null || userLang === void 0 ? void 0 : userLang.toLowerCase()) === 'it' ? 'it' : 'en'}${integrationID ? `?integrationID=${integrationID}` : ''}${memoriHash ? `${integrationID ? '&' : '?'}memori=${memoriHash}` : ''}`, target: "_blank", rel: "noopener noreferrer", children: "Memori.AI" })] })] }));
};
exports.default = PoweredBy;
//# sourceMappingURL=PoweredBy.js.map