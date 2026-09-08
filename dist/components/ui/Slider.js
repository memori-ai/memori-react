"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_2 = require("@headlessui/react");
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const CustomSlider = ({ min = 0, max = 100, step = 1, defaultValue = 50, label, onChange, disabled = false, }) => {
    const [value, setValue] = (0, react_1.useState)(defaultValue);
    const [isDragging, setIsDragging] = (0, react_1.useState)(false);
    const sliderRef = (0, react_1.useRef)(null);
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
    (0, react_1.useEffect)(() => {
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
    (0, react_1.useEffect)(() => {
        setValue(defaultValue);
    }, [defaultValue]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: (0, classnames_1.default)('memori--slider-container', { 'memori--slider-disabled': disabled }), style: { '--percentage': `${percentage}%` }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "memori--slider-header", children: [label && (0, jsx_runtime_1.jsx)("div", { className: "memori--slider-label", children: label }), (0, jsx_runtime_1.jsx)("div", { className: "memori--slider-value", children: value })] }), (0, jsx_runtime_1.jsxs)("div", { ref: sliderRef, className: "memori--slider-track-container", onMouseDown: (e) => handleInteractionStart(e.clientX), onTouchStart: (e) => handleInteractionStart(e.touches[0].clientX), children: [(0, jsx_runtime_1.jsx)("div", { className: "memori--slider-track", children: (0, jsx_runtime_1.jsx)("div", { className: "memori--slider-track-fill" }) }), (0, jsx_runtime_1.jsx)("div", { className: "memori--slider-marks", children: marks.map((mark) => ((0, jsx_runtime_1.jsxs)("div", { className: "memori--slider-mark", children: [(0, jsx_runtime_1.jsx)("div", { className: "memori--slider-mark-line" }), (0, jsx_runtime_1.jsx)("span", { className: "memori--slider-mark-value", children: mark })] }, mark))) }), (0, jsx_runtime_1.jsx)(react_2.Listbox, { value: value, onChange: setValue, disabled: disabled, children: (0, jsx_runtime_1.jsx)("div", { className: "memori--slider-thumb", role: "slider", "aria-valuemin": min, "aria-valuemax": max, "aria-valuenow": value, tabIndex: disabled ? -1 : 0 }) })] })] }));
};
exports.default = CustomSlider;
//# sourceMappingURL=Slider.js.map