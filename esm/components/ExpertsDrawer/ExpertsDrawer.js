import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Drawer from '../ui/Drawer';
import { useTranslation } from 'react-i18next';
import { getResourceUrl } from '../../helpers/media';
const ExpertsDrawer = ({ open = false, baseUrl, apiUrl, tenant, experts, onClose, }) => {
    const { t } = useTranslation();
    return (_jsx(Drawer, { open: open, onClose: onClose, className: "memori--experts-drawer", title: _jsx("h2", { className: "memori--experts-drawer--title", children: t('widget.expertsInTheBoard') }), children: _jsx("ul", { className: "memori--experts-drawer--list", children: experts.map(expert => (_jsxs("li", { className: "memori--experts-drawer--item", children: [_jsx("figure", { className: "memori--experts-drawer--avatar", children: _jsx("img", { src: `${new URL(apiUrl).origin}/api/v1/memoriai/memori/avatar/${expert.expertMemoriID}`, alt: expert.name, onError: e => {
                                e.currentTarget.src = getResourceUrl({
                                    tenantID: tenant === null || tenant === void 0 ? void 0 : tenant.name,
                                    type: 'avatar',
                                    baseURL: baseUrl,
                                });
                                e.currentTarget.onerror = null;
                            } }) }), _jsx("div", { className: "memori--experts-drawer--content", children: _jsx("h3", { className: "memori--experts-drawer--name", children: expert.name }) })] }, expert.expertID))) }) }));
};
export default ExpertsDrawer;
//# sourceMappingURL=ExpertsDrawer.js.map