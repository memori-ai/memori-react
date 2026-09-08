"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Microphone_1 = tslib_1.__importDefault(require("../icons/Microphone"));
const Button_1 = tslib_1.__importDefault(require("../ui/Button"));
const Tooltip_1 = tslib_1.__importDefault(require("../ui/Tooltip"));
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const react_i18next_1 = require("react-i18next");
const MicrophoneButton = ({ listening, stopAudio, startListening, stopListening, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [micBtnTooltip, setMicBtnTooltip] = (0, react_1.useState)();
    const intervalRef = (0, react_1.useRef)(null);
    const startHold = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setMicBtnTooltip(t('write_and_speak.holdToSpeak') || 'Hold to record');
        if (intervalRef.current)
            return;
        intervalRef.current = setTimeout(() => {
            stopAudio();
            setMicBtnTooltip(t('write_and_speak.releaseToEndListening') || 'Release to end listening');
            startListening();
        }, 300);
    };
    const stopHold = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (intervalRef.current) {
            clearTimeout(intervalRef.current);
            intervalRef.current = null;
        }
        stopListening();
        setMicBtnTooltip(undefined);
    };
    const handleContextMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleTouchStart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        startHold(e);
    };
    const handleTouchEnd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        stopHold(e);
    };
    (0, react_1.useEffect)(() => {
        return () => stopHold();
    }, []);
    return ((0, jsx_runtime_1.jsx)(Tooltip_1.default, { visible: !!micBtnTooltip, className: "memori-chat-inputs--mic-tooltip", content: (0, jsx_runtime_1.jsx)("span", { children: micBtnTooltip ||
                t('write_and_speak.pressAndHoldToSpeak') ||
                'Press and hold to speak' }), align: "topLeft", children: (0, jsx_runtime_1.jsx)("div", { onContextMenu: handleContextMenu, children: (0, jsx_runtime_1.jsx)(Button_1.default, { primary: true, className: (0, classnames_1.default)('memori-chat-inputs--mic', {
                    'memori-chat-inputs--mic--listening': listening,
                }), title: listening
                    ? t('write_and_speak.micButtonPopoverListening') || 'Listening'
                    : t('write_and_speak.micButtonPopover') || 'Start listening', onMouseDown: startHold, onTouchStart: handleTouchStart, onMouseUp: stopHold, onTouchEnd: handleTouchEnd, onMouseLeave: stopHold, shape: "circle", icon: (0, jsx_runtime_1.jsx)(Microphone_1.default, {}) }) }) }));
};
exports.default = MicrophoneButton;
//# sourceMappingURL=MicrophoneButton.js.map