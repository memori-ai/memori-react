import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import Drawer from '../ui/Drawer';
import { useTranslation } from 'react-i18next';
import Checkbox from '../ui/Checkbox';
import { setLocalConfig } from '../../helpers/configuration';
import { RadioGroup } from '@headlessui/react';
import Button from '../ui/Button';
const silenceSeconds = [2, 3, 5, 10, 15, 20, 30, 60];
const SettingsDrawer = ({ open, layout = 'DEFAULT', onClose, controlsPosition, setControlsPosition, hideEmissions, setHideEmissions, additionalSettings, avatarType, setAvatarType, enablePositionControls, setEnablePositionControls, isAvatar3d, }) => {
    const { t } = useTranslation();
    return (_jsxs(Drawer, { className: "memori-settings-drawer", open: open, onClose: onClose, title: t('widget.settings') || 'Settings', description: t('write_and_speak.settingsHeaderLabel'), children: [layout === 'TOTEM' && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "memori-settings-drawer--field controls", children: [_jsxs("label", { htmlFor: "#controlsPosition", children: [t('write_and_speak.controlsPosition') || 'Controls', ":"] }), _jsxs(RadioGroup, { id: "controlsPosition", name: "controlsPosition", value: controlsPosition, defaultValue: controlsPosition, className: "memori-settings-drawer--controlsposition-radio", onChange: (value) => {
                                    setControlsPosition(value);
                                    setLocalConfig('controlsPosition', value);
                                }, children: [_jsx(RadioGroup.Option, { value: "center", className: "memori-settings-drawer--controlsposition-radio-button", children: ({ checked }) => (_jsx(Button, { primary: checked, outlined: !checked, children: t('center') || 'Center' })) }), _jsx(RadioGroup.Option, { value: "bottom", className: "memori-settings-drawer--controlsposition-radio-button", children: ({ checked }) => (_jsx(Button, { primary: checked, outlined: !checked, children: t('bottom') || 'Bottom' })) })] })] }), isAvatar3d && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "memori-settings-drawer--field controls", children: [_jsxs("label", { htmlFor: "avatarType", className: "memori-settings-drawer-label", children: [t('write_and_speak.avatarType') || 'Avatar type', ":"] }), _jsxs(RadioGroup, { id: "avatarType", name: "avatarType", value: avatarType, defaultValue: avatarType, className: "memori-settings-drawer--avatarType-radio", onChange: (value) => {
                                            setAvatarType && setAvatarType(value);
                                            setLocalConfig('avatarType', value);
                                        }, children: [_jsx(RadioGroup.Option, { value: "blob", className: "memori-settings-drawer--avatarType-radio-button", children: ({ checked }) => (_jsx(Button, { primary: checked, outlined: !checked, children: t('write_and_speak.blob') || 'Blob' })) }), _jsx(RadioGroup.Option, { value: "avatar3d", className: "memori-settings-drawer--avatarType-radio-button", children: ({ checked }) => (_jsx(Button, { primary: checked, outlined: !checked, children: t('write_and_speak.avatar3d') || 'Avatar 3D' })) })] })] }), _jsx("div", { className: "memori-settings-drawer--field", children: _jsx(Checkbox, { label: t('write_and_speak.enablePositionControls') ||
                                        'Enable position controls', name: "enablePositionControls", checked: enablePositionControls, onChange: e => {
                                        setEnablePositionControls(e.target.checked);
                                    } }) })] })), _jsx("div", { className: "memori-settings-drawer--field", children: _jsx(Checkbox, { label: t('write_and_speak.hideEmissionsLabel') || 'Hide emissions', name: "hideControls", checked: hideEmissions, onChange: e => {
                                setHideEmissions(e.target.checked);
                                setLocalConfig('hideEmissions', e.target.checked);
                            } }) })] })), additionalSettings && (_jsx("div", { className: "memori-settings-drawer--field controls", children: additionalSettings }))] }));
};
export default SettingsDrawer;
//# sourceMappingURL=SettingsDrawer.js.map