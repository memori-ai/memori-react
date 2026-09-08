"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const configuration_1 = require("../../../../../helpers/configuration");
const react_i18next_1 = require("react-i18next");
const Slider_1 = tslib_1.__importDefault(require("../../../../../components/ui/Slider"));
const Button_1 = tslib_1.__importDefault(require("../../../../ui/Button"));
const Close_1 = tslib_1.__importDefault(require("../../../../icons/Close"));
const PositionControls = ({ avatarHeight, avatarDepth, setAvatarHeight, setAvatarDepth, halfBody, setEnablePositionControls, }) => {
    const normalPosition = halfBody
        ? { height: 80, depth: 50 }
        : { height: 25, depth: 25 };
    const zoomedPosition = halfBody
        ? { height: 55, depth: 10 }
        : { height: 15, depth: 5 };
    const farPosition = halfBody
        ? { height: 100, depth: 80 }
        : { height: 65, depth: 100 };
    const settingsRef = (0, react_1.useRef)({
        height: avatarHeight,
        depth: avatarDepth,
        zoomed: false,
        normal: false,
        far: false,
    });
    const { t } = (0, react_i18next_1.useTranslation)();
    (0, react_1.useEffect)(() => {
        settingsRef.current.height = avatarHeight;
        settingsRef.current.depth = avatarDepth;
    }, [avatarHeight, avatarDepth]);
    (0, react_1.useEffect)(() => {
        const handleKeyDown = (event) => {
            if (event.key === '-' ||
                (event.key === '_' && settingsRef.current.depth < 100)) {
                const newValue = Math.min(settingsRef.current.depth + 10, 100);
                setAvatarDepth(newValue);
                (0, configuration_1.setLocalConfig)('avatarDepth', newValue);
            }
            else if ((event.key === '+' || event.key === '=') &&
                settingsRef.current.depth > -100) {
                const newValue = Math.max(settingsRef.current.depth - 10, -100);
                setAvatarDepth(newValue);
                (0, configuration_1.setLocalConfig)('avatarDepth', newValue);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [setAvatarDepth]);
    (0, react_1.useEffect)(() => {
        const handleArrowUp = (event) => {
            if (event.key === 'ArrowUp' && settingsRef.current.height < 100) {
                const newValue = settingsRef.current.height + 5;
                setAvatarHeight(newValue);
                (0, configuration_1.setLocalConfig)('avatarHeight', newValue);
            }
        };
        const handleArrowDown = (event) => {
            if (event.key === 'ArrowDown' && settingsRef.current.height > 0) {
                const newValue = settingsRef.current.height - 5;
                setAvatarHeight(newValue);
                (0, configuration_1.setLocalConfig)('avatarHeight', newValue);
            }
        };
        window.addEventListener('keydown', handleArrowUp);
        window.addEventListener('keydown', handleArrowDown);
        return () => {
            window.removeEventListener('keydown', handleArrowUp);
            window.removeEventListener('keydown', handleArrowDown);
        };
    }, [setAvatarHeight]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "memori--position-controls", children: [(0, jsx_runtime_1.jsx)("div", { className: "memori--position-controls-close", children: (0, jsx_runtime_1.jsx)(Button_1.default, { ghost: true, icon: (0, jsx_runtime_1.jsx)(Close_1.default, {}), outlined: true, danger: true, shape: "circle", className: "memori--position-controls-close-button", onClick: () => {
                        setEnablePositionControls(false);
                    } }) }), (0, jsx_runtime_1.jsx)(Slider_1.default, { defaultValue: settingsRef.current.height, min: 0.5, max: 100, label: t('write_and_speak.height'), step: 1, onChange: (value) => {
                    setAvatarHeight(value);
                    (0, configuration_1.setLocalConfig)('avatarHeight', value);
                } }), (0, jsx_runtime_1.jsx)(Slider_1.default, { defaultValue: settingsRef.current.depth, min: 0.5, max: 100, step: 5, label: t('write_and_speak.depth'), onChange: (value) => {
                    setAvatarDepth(value);
                    (0, configuration_1.setLocalConfig)('avatarDepth', value);
                } }), (0, jsx_runtime_1.jsxs)("div", { className: "memori--preset-buttons", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { outlined: true, isActive: avatarHeight ===
                            (halfBody ? zoomedPosition.height : normalPosition.height) &&
                            avatarDepth ===
                                (halfBody ? zoomedPosition.depth : normalPosition.depth), onClick: () => {
                            setAvatarHeight(zoomedPosition.height);
                            setAvatarDepth(zoomedPosition.depth);
                            (0, configuration_1.setLocalConfig)('avatarHeight', zoomedPosition.height);
                            (0, configuration_1.setLocalConfig)('avatarDepth', zoomedPosition.depth);
                        }, children: t('write_and_speak.zoomed') }), (0, jsx_runtime_1.jsx)(Button_1.default, { outlined: true, isActive: avatarHeight ===
                            (halfBody ? normalPosition.height : zoomedPosition.height) &&
                            avatarDepth ===
                                (halfBody ? normalPosition.depth : zoomedPosition.depth), onClick: () => {
                            setAvatarHeight(normalPosition.height);
                            setAvatarDepth(normalPosition.depth);
                            (0, configuration_1.setLocalConfig)('avatarHeight', normalPosition.height);
                            (0, configuration_1.setLocalConfig)('avatarDepth', normalPosition.depth);
                        }, children: t('write_and_speak.normal') }), (0, jsx_runtime_1.jsx)(Button_1.default, { outlined: true, isActive: avatarHeight ===
                            (halfBody ? farPosition.height : normalPosition.height) &&
                            avatarDepth ===
                                (halfBody ? farPosition.depth : normalPosition.depth), onClick: () => {
                            setAvatarHeight(farPosition.height);
                            setAvatarDepth(farPosition.depth);
                            (0, configuration_1.setLocalConfig)('avatarHeight', farPosition.height);
                            (0, configuration_1.setLocalConfig)('avatarDepth', farPosition.depth);
                        }, children: t('write_and_speak.far') })] })] }));
};
exports.default = PositionControls;
//# sourceMappingURL=positionControls.js.map