import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { setLocalConfig } from '../../../../../helpers/configuration';
import { useTranslation } from 'react-i18next';
import Slider from '../../../../../components/ui/Slider';
import Button from '../../../../ui/Button';
import Close from '../../../../icons/Close';
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
    const settingsRef = useRef({
        height: avatarHeight,
        depth: avatarDepth,
        zoomed: false,
        normal: false,
        far: false,
    });
    const { t } = useTranslation();
    useEffect(() => {
        settingsRef.current.height = avatarHeight;
        settingsRef.current.depth = avatarDepth;
    }, [avatarHeight, avatarDepth]);
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === '-' ||
                (event.key === '_' && settingsRef.current.depth < 100)) {
                const newValue = Math.min(settingsRef.current.depth + 10, 100);
                setAvatarDepth(newValue);
                setLocalConfig('avatarDepth', newValue);
            }
            else if ((event.key === '+' || event.key === '=') &&
                settingsRef.current.depth > -100) {
                const newValue = Math.max(settingsRef.current.depth - 10, -100);
                setAvatarDepth(newValue);
                setLocalConfig('avatarDepth', newValue);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [setAvatarDepth]);
    useEffect(() => {
        const handleArrowUp = (event) => {
            if (event.key === 'ArrowUp' && settingsRef.current.height < 100) {
                const newValue = settingsRef.current.height + 5;
                setAvatarHeight(newValue);
                setLocalConfig('avatarHeight', newValue);
            }
        };
        const handleArrowDown = (event) => {
            if (event.key === 'ArrowDown' && settingsRef.current.height > 0) {
                const newValue = settingsRef.current.height - 5;
                setAvatarHeight(newValue);
                setLocalConfig('avatarHeight', newValue);
            }
        };
        window.addEventListener('keydown', handleArrowUp);
        window.addEventListener('keydown', handleArrowDown);
        return () => {
            window.removeEventListener('keydown', handleArrowUp);
            window.removeEventListener('keydown', handleArrowDown);
        };
    }, [setAvatarHeight]);
    return (_jsxs("div", { className: "memori--position-controls", children: [_jsx("div", { className: "memori--position-controls-close", children: _jsx(Button, { ghost: true, icon: _jsx(Close, {}), outlined: true, danger: true, shape: "circle", className: "memori--position-controls-close-button", onClick: () => {
                        setEnablePositionControls(false);
                    } }) }), _jsx(Slider, { defaultValue: settingsRef.current.height, min: 0.5, max: 100, label: t('write_and_speak.height'), step: 1, onChange: (value) => {
                    setAvatarHeight(value);
                    setLocalConfig('avatarHeight', value);
                } }), _jsx(Slider, { defaultValue: settingsRef.current.depth, min: 0.5, max: 100, step: 5, label: t('write_and_speak.depth'), onChange: (value) => {
                    setAvatarDepth(value);
                    setLocalConfig('avatarDepth', value);
                } }), _jsxs("div", { className: "memori--preset-buttons", children: [_jsx(Button, { outlined: true, isActive: avatarHeight ===
                            (halfBody ? zoomedPosition.height : normalPosition.height) &&
                            avatarDepth ===
                                (halfBody ? zoomedPosition.depth : normalPosition.depth), onClick: () => {
                            setAvatarHeight(zoomedPosition.height);
                            setAvatarDepth(zoomedPosition.depth);
                            setLocalConfig('avatarHeight', zoomedPosition.height);
                            setLocalConfig('avatarDepth', zoomedPosition.depth);
                        }, children: t('write_and_speak.zoomed') }), _jsx(Button, { outlined: true, isActive: avatarHeight ===
                            (halfBody ? normalPosition.height : zoomedPosition.height) &&
                            avatarDepth ===
                                (halfBody ? normalPosition.depth : zoomedPosition.depth), onClick: () => {
                            setAvatarHeight(normalPosition.height);
                            setAvatarDepth(normalPosition.depth);
                            setLocalConfig('avatarHeight', normalPosition.height);
                            setLocalConfig('avatarDepth', normalPosition.depth);
                        }, children: t('write_and_speak.normal') }), _jsx(Button, { outlined: true, isActive: avatarHeight ===
                            (halfBody ? farPosition.height : normalPosition.height) &&
                            avatarDepth ===
                                (halfBody ? farPosition.depth : normalPosition.depth), onClick: () => {
                            setAvatarHeight(farPosition.height);
                            setAvatarDepth(farPosition.depth);
                            setLocalConfig('avatarHeight', farPosition.height);
                            setLocalConfig('avatarDepth', farPosition.depth);
                        }, children: t('write_and_speak.far') })] })] }));
};
export default PositionControls;
//# sourceMappingURL=positionControls.js.map