"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const Drawer_1 = tslib_1.__importDefault(require("../ui/Drawer"));
const react_i18next_1 = require("react-i18next");
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const VenueWidget_1 = tslib_1.__importDefault(require("../VenueWidget/VenueWidget"));
const PositionDrawer = ({ memori, open, onClose, venue, setVenue, drawerClassName, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(Drawer_1.default, { className: (0, classnames_1.default)('memori-position-drawer', drawerClassName), open: open, onClose: () => onClose(venue), title: t('widget.position') || 'Position', animated: false, children: [(0, jsx_runtime_1.jsx)("p", { children: t('write_and_speak.requirePositionHelp', { name: memori.name }) }), (0, jsx_runtime_1.jsx)(VenueWidget_1.default, { venue: venue, setVenue: setVenue, showUncertainty: false, saveAndClose: venue => {
                    setVenue(venue);
                    onClose(venue);
                } })] }));
};
exports.default = PositionDrawer;
//# sourceMappingURL=PositionDrawer.js.map