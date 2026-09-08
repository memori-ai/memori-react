import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { Listbox } from '@headlessui/react';
import cx from 'classnames';
const CustomSlider = ({ min = 0, max = 100, step = 1, defaultValue = 50, label, onChange, disabled = false, }) => {
    const [value, setValue] = useState(defaultValue);
    const [isDragging, setIsDragging] = useState(false);
    const sliderRef = useRef(null);
    const percentage = ((value - min) / (max - min)) * 100;
    const marks = [];
    for (let i = min; i <= max; i += (max - min) / 4) {
        marks.push(Math.round(i));
    }
    const calculateNewValue = (clientX) => {
        if (!sliderRef.current)
            return value;
        const bounds = sliderRef.current.getBoundingClientRect();
        const position = clientX - bounds.left;
        const sliderWidth = bounds.width;
        const percentage = Math.max(0, Math.min(100, (position / sliderWidth) * 100));
        const newValue = Math.round((percentage / 100) * (max - min) + min);
        const steppedValue = Math.round(newValue / step) * step;
        return Math.min(Math.max(steppedValue, min), max);
    };
    const handleInteractionStart = (clientX) => {
        if (disabled)
            return;
        setIsDragging(true);
        const newValue = calculateNewValue(clientX);
        setValue(newValue);
        onChange === null || onChange === void 0 ? void 0 : onChange(newValue);
    };
    const handleInteractionMove = (clientX) => {
        if (!isDragging || disabled)
            return;
        const newValue = calculateNewValue(clientX);
        setValue(newValue);
        onChange === null || onChange === void 0 ? void 0 : onChange(newValue);
    };
    const handleInteractionEnd = () => {
        setIsDragging(false);
    };
    useEffect(() => {
        const handleTouchMove = (e) => {
            if (!isDragging)
                return;
            e.preventDefault();
            handleInteractionMove(e.touches[0].clientX);
        };
        const handleMouseMove = (e) => {
            handleInteractionMove(e.clientX);
        };
        const handleEndInteraction = () => {
            handleInteractionEnd();
        };
        if (isDragging) {
            window.addEventListener('touchmove', handleTouchMove, { passive: false });
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('touchend', handleEndInteraction);
            window.addEventListener('mouseup', handleEndInteraction);
        }
        return () => {
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchend', handleEndInteraction);
            window.removeEventListener('mouseup', handleEndInteraction);
        };
    }, [isDragging]);
    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);
    return (_jsxs("div", { className: cx('memori--slider-container', { 'memori--slider-disabled': disabled }), style: { '--percentage': `${percentage}%` }, children: [_jsxs("div", { className: "memori--slider-header", children: [label && _jsx("div", { className: "memori--slider-label", children: label }), _jsx("div", { className: "memori--slider-value", children: value })] }), _jsxs("div", { ref: sliderRef, className: "memori--slider-track-container", onMouseDown: (e) => handleInteractionStart(e.clientX), onTouchStart: (e) => handleInteractionStart(e.touches[0].clientX), children: [_jsx("div", { className: "memori--slider-track", children: _jsx("div", { className: "memori--slider-track-fill" }) }), _jsx("div", { className: "memori--slider-marks", children: marks.map((mark) => (_jsxs("div", { className: "memori--slider-mark", children: [_jsx("div", { className: "memori--slider-mark-line" }), _jsx("span", { className: "memori--slider-mark-value", children: mark })] }, mark))) }), _jsx(Listbox, { value: value, onChange: setValue, disabled: disabled, children: _jsx("div", { className: "memori--slider-thumb", role: "slider", "aria-valuemin": min, "aria-valuemax": max, "aria-valuenow": value, tabIndex: disabled ? -1 : 0 }) })] })] }));
};
export default CustomSlider;
//# sourceMappingURL=Slider.js.map