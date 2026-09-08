"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = tslib_1.__importDefault(require("react"));
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const ui_1 = require("@memori.ai/ui");
function hasVisibleLabel(children) {
    return react_1.default.Children.toArray(children).some(child => {
        if (child === null || child === undefined)
            return false;
        if (typeof child === 'boolean')
            return false;
        if (typeof child === 'string')
            return child.trim().length > 0;
        if (typeof child === 'number')
            return true;
        return true;
    });
}
const IconButton = react_1.default.forwardRef(({ active = false, recording = false, className, variant = 'toolbar', shape = 'default', size = 'sm', children, ...rest }, ref) => {
    const isRecording = !!recording;
    const isActive = !!active && !isRecording;
    const isLabeled = hasVisibleLabel(children);
    const resolvedVariant = variant === 'primary' ||
        variant === 'secondary' ||
        variant === 'danger' ||
        variant === 'outline' ||
        variant === 'ghost'
        ? 'toolbar'
        : variant;
    return ((0, jsx_runtime_1.jsx)(ui_1.Button, { ref: ref, variant: resolvedVariant, shape: shape, size: size, active: isActive, className: (0, classnames_1.default)('memori-icon-button', isLabeled && 'memori-icon-button--labeled', isActive && 'memori-icon-button--active', isRecording && 'memori-icon-button--recording', className), ...rest, children: children }));
});
IconButton.displayName = 'IconButton';
exports.default = IconButton;
//# sourceMappingURL=IconButton.js.map