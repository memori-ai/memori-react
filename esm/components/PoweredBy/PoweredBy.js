import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const PoweredBy = ({ tenant, userLang = 'en', integrationID, memoriHash, }) => {
    const tenantId = (tenant === null || tenant === void 0 ? void 0 : tenant.theme) === 'memorytwin'
        ? 'memorytwin'
        : (tenant === null || tenant === void 0 ? void 0 : tenant.theme) === 'twincreator'
            ? 'twincreator'
            : 'aisuru';
    return (_jsxs("div", { className: "memori--powered-by", children: [_jsx("img", { src: `https://aisuru.com/images/${tenantId}/logo.png`, alt: "" }), _jsxs("p", { children: [_jsx("span", { className: "sr-only", children: "Powered by" }), _jsx("a", { href: `https://memori.ai/${(userLang === null || userLang === void 0 ? void 0 : userLang.toLowerCase()) === 'it' ? 'it' : 'en'}${integrationID ? `?integrationID=${integrationID}` : ''}${memoriHash ? `${integrationID ? '&' : '?'}memori=${memoriHash}` : ''}`, target: "_blank", rel: "noopener noreferrer", children: "Memori.AI" })] })] }));
};
export default PoweredBy;
//# sourceMappingURL=PoweredBy.js.map