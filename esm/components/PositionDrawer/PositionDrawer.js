import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Drawer from '../ui/Drawer';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import VenueWidget from '../VenueWidget/VenueWidget';
const PositionDrawer = ({ memori, open, onClose, venue, setVenue, drawerClassName, }) => {
    const { t } = useTranslation();
    return (_jsxs(Drawer, { className: cx('memori-position-drawer', drawerClassName), open: open, onClose: () => onClose(venue), title: t('widget.position') || 'Position', animated: false, children: [_jsx("p", { children: t('write_and_speak.requirePositionHelp', { name: memori.name }) }), _jsx(VenueWidget, { venue: venue, setVenue: setVenue, showUncertainty: false, saveAndClose: venue => {
                    setVenue(venue);
                    onClose(venue);
                } })] }));
};
export default PositionDrawer;
//# sourceMappingURL=PositionDrawer.js.map