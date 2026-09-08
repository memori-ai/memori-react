"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const Drawer_1 = tslib_1.__importDefault(require("../ui/Drawer"));
const react_i18next_1 = require("react-i18next");
const Checkbox_1 = tslib_1.__importDefault(require("../ui/Checkbox"));
const configuration_1 = require("../../helpers/configuration");
const react_1 = require("@headlessui/react");
const Button_1 = tslib_1.__importDefault(require("../ui/Button"));
const silenceSeconds = [2, 3, 5, 10, 15, 20, 30, 60];
const SettingsDrawer = ({ open, layout = 'DEFAULT', onClose, controlsPosition, setControlsPosition, hideEmissions, setHideEmissions, additionalSettings, avatarType, setAvatarType, enablePositionControls, setEnablePositionControls, isAvatar3d, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(Drawer_1.default, { className: "memori-settings-drawer", open: open, onClose: onClose, title: t('widget.settings') || 'Settings', description: t('write_and_speak.settingsHeaderLabel'), children: [layout === 'TOTEM' && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "memori-settings-drawer--field controls", children: [(0, jsx_runtime_1.jsxs)("label", { htmlFor: "#controlsPosition", children: [t('write_and_speak.controlsPosition') || 'Controls', ":"] }), (0, jsx_runtime_1.jsxs)(react_1.RadioGroup, { id: "controlsPosition", name: "controlsPosition", value: controlsPosition, defaultValue: controlsPosition, className: "memori-settings-drawer--controlsposition-radio", onChange: (value) => {
                                    setControlsPosition(value);
                                    (0, configuration_1.setLocalConfig)('controlsPosition', value);
                                }, children: [(0, jsx_runtime_1.jsx)(react_1.RadioGroup.Option, { value: "center", className: "memori-settings-drawer--controlsposition-radio-button", children: ({ checked }) => ((0, jsx_runtime_1.jsx)(Button_1.default, { primary: checked, outlined: !checked, children: t('center') || 'Center' })) }), (0, jsx_runtime_1.jsx)(react_1.RadioGroup.Option, { value: "bottom", className: "memori-settings-drawer--controlsposition-radio-button", children: ({ checked }) => ((0, jsx_runtime_1.jsx)(Button_1.default, { primary: checked, outlined: !checked, children: t('bottom') || 'Bottom' })) })] })] }), isAvatar3d && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "memori-settings-drawer--field controls", children: [(0, jsx_runtime_1.jsxs)("label", { htmlFor: "avatarType", className: "memori-settings-drawer-label", children: [t('write_and_speak.avatarType') || 'Avatar type', ":"] }), (0, jsx_runtime_1.jsxs)(react_1.RadioGroup, { id: "avatarType", name: "avatarType", value: avatarType, defaultValue: avatarType, className: "memori-settings-drawer--avatarType-radio", onChange: (value) => {
                                            setAvatarType && setAvatarType(value);
                                            (0, configuration_1.setLocalConfig)('avatarType', value);
                                        }, children: [(0, jsx_runtime_1.jsx)(react_1.RadioGroup.Option, { value: "blob", className: "memori-settings-drawer--avatarType-radio-button", children: ({ checked }) => ((0, jsx_runtime_1.jsx)(Button_1.default, { primary: checked, outlined: !checked, children: t('write_and_speak.blob') || 'Blob' })) }), (0, jsx_runtime_1.jsx)(react_1.RadioGroup.Option, { value: "avatar3d", className: "memori-settings-drawer--avatarType-radio-button", children: ({ checked }) => ((0, jsx_runtime_1.jsx)(Button_1.default, { primary: checked, outlined: !checked, children: t('write_and_speak.avatar3d') || 'Avatar 3D' })) })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "memori-settings-drawer--field", children: (0, jsx_runtime_1.jsx)(Checkbox_1.default, { label: t('write_and_speak.enablePositionControls') ||
                                        'Enable position controls', name: "enablePositionControls", checked: enablePositionControls, onChange: e => {
                                        setEnablePositionControls(e.target.checked);
                                    } }) })] })), (0, jsx_runtime_1.jsx)("div", { className: "memori-settings-drawer--field", children: (0, jsx_runtime_1.jsx)(Checkbox_1.default, { label: t('write_and_speak.hideEmissionsLabel') || 'Hide emissions', name: "hideControls", checked: hideEmissions, onChange: e => {
                                setHideEmissions(e.target.checked);
                                (0, configuration_1.setLocalConfig)('hideEmissions', e.target.checked);
                            } }) })] })), additionalSettings && ((0, jsx_runtime_1.jsx)("div", { className: "memori-settings-drawer--field controls", children: additionalSettings }))] }));
};
exports.default = SettingsDrawer;
//# sourceMappingURL=SettingsDrawer.js.map