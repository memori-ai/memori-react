import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import Microphone from '../icons/Microphone';
import Button from '../ui/Button';
import Tooltip from '../ui/Tooltip';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
const MicrophoneButton = ({ listening, stopAudio, startListening, stopListening, }) => {
    const { t } = useTranslation();
    const [micBtnTooltip, setMicBtnTooltip] = useState();
    const intervalRef = useRef(null);
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
    useEffect(() => {
        return () => stopHold();
    }, []);
    return (_jsx(Tooltip, { visible: !!micBtnTooltip, className: "memori-chat-inputs--mic-tooltip", content: _jsx("span", { children: micBtnTooltip ||
                t('write_and_speak.pressAndHoldToSpeak') ||
                'Press and hold to speak' }), align: "topLeft", children: _jsx("div", { onContextMenu: handleContextMenu, children: _jsx(Button, { primary: true, className: cx('memori-chat-inputs--mic', {
                    'memori-chat-inputs--mic--listening': listening,
                }), title: listening
                    ? t('write_and_speak.micButtonPopoverListening') || 'Listening'
                    : t('write_and_speak.micButtonPopover') || 'Start listening', onMouseDown: startHold, onTouchStart: handleTouchStart, onMouseUp: stopHold, onTouchEnd: handleTouchEnd, onMouseLeave: stopHold, shape: "circle", icon: _jsx(Microphone, {}) }) }) }));
};
export default MicrophoneButton;
//# sourceMappingURL=MicrophoneButton.js.map