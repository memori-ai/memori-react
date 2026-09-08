"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const Drawer_1 = tslib_1.__importDefault(require("../ui/Drawer"));
const react_i18next_1 = require("react-i18next");
const media_1 = require("../../helpers/media");
const ExpertsDrawer = ({ open = false, baseUrl, apiUrl, tenant, experts, onClose, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsx)(Drawer_1.default, { open: open, onClose: onClose, className: "memori--experts-drawer", title: (0, jsx_runtime_1.jsx)("h2", { className: "memori--experts-drawer--title", children: t('widget.expertsInTheBoard') }), children: (0, jsx_runtime_1.jsx)("ul", { className: "memori--experts-drawer--list", children: experts.map(expert => ((0, jsx_runtime_1.jsxs)("li", { className: "memori--experts-drawer--item", children: [(0, jsx_runtime_1.jsx)("figure", { className: "memori--experts-drawer--avatar", children: (0, jsx_runtime_1.jsx)("img", { src: `${new URL(apiUrl).origin}/api/v1/memoriai/memori/avatar/${expert.expertMemoriID}`, alt: expert.name, onError: e => {
                                e.currentTarget.src = (0, media_1.getResourceUrl)({
                                    tenantID: tenant === null || tenant === void 0 ? void 0 : tenant.name,
                                    type: 'avatar',
                                    baseURL: baseUrl,
                                });
                                e.currentTarget.onerror = null;
                            } }) }), (0, jsx_runtime_1.jsx)("div", { className: "memori--experts-drawer--content", children: (0, jsx_runtime_1.jsx)("h3", { className: "memori--experts-drawer--name", children: expert.name }) })] }, expert.expertID))) }) }));
};
exports.default = ExpertsDrawer;
//# sourceMappingURL=ExpertsDrawer.js.map