"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePressTooltip = usePressTooltip;
const react_1 = require("react");
function usePressTooltip(defaultOpen = false) {
    const [open, setOpen] = (0, react_1.useState)(defaultOpen);
    const toggleOpen = (0, react_1.useCallback)((e) => {
        e.stopPropagation();
        setOpen(prev => !prev);
    }, []);
    const pressTriggerProps = {
        onPointerDown: (e) => {
            e.stopPropagation();
        },
        onClick: toggleOpen,
    };
    const tooltipProps = {
        open,
        onOpenChange: setOpen,
    };
    return { open, setOpen, pressTriggerProps, tooltipProps };
}
//# sourceMappingURL=usePressTooltip.js.map