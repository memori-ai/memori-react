"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_dom_1 = require("react-dom");
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const Tooltip = ({ content, className, align = 'right', disabled = false, visible = false, children, }) => {
    const triggerRef = (0, react_1.useRef)(null);
    const positionWrapperRef = (0, react_1.useRef)(null);
    const closeTimeoutRef = (0, react_1.useRef)(null);
    const [isHovered, setIsHovered] = (0, react_1.useState)(false);
    const isOpen = !disabled && (visible || isHovered);
    const updatePosition = (0, react_1.useCallback)(() => {
        const trigger = triggerRef.current;
        const wrapper = positionWrapperRef.current;
        if (trigger && wrapper) {
            const rect = trigger.getBoundingClientRect();
            wrapper.style.top = `${rect.top}px`;
            wrapper.style.left = `${rect.left}px`;
            wrapper.style.width = `${rect.width}px`;
            wrapper.style.height = `${rect.height}px`;
        }
    }, []);
    const clearCloseTimeout = (0, react_1.useCallback)(() => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
    }, []);
    const handleTriggerEnter = (0, react_1.useCallback)(() => {
        clearCloseTimeout();
        setIsHovered(true);
    }, [clearCloseTimeout]);
    const handleTriggerLeave = (0, react_1.useCallback)(() => {
        closeTimeoutRef.current = setTimeout(() => {
            setIsHovered(false);
            closeTimeoutRef.current = null;
        }, 300);
    }, []);
    const handleContentEnter = (0, react_1.useCallback)(() => {
        clearCloseTimeout();
        setIsHovered(true);
    }, [clearCloseTimeout]);
    const handleContentLeave = (0, react_1.useCallback)(() => {
        closeTimeoutRef.current = setTimeout(() => {
            setIsHovered(false);
            closeTimeoutRef.current = null;
        }, 300);
    }, []);
    (0, react_1.useEffect)(() => {
        if (!isOpen)
            return;
        updatePosition();
        const onScrollOrResize = () => updatePosition();
        window.addEventListener('scroll', onScrollOrResize, {
            passive: true,
            capture: true,
        });
        window.addEventListener('resize', onScrollOrResize);
        return () => {
            window.removeEventListener('scroll', onScrollOrResize, true);
            window.removeEventListener('resize', onScrollOrResize);
        };
    }, [isOpen, updatePosition]);
    (0, react_1.useEffect)(() => () => clearCloseTimeout(), [clearCloseTimeout]);
    const setPositionWrapperRef = (0, react_1.useCallback)((el) => {
        positionWrapperRef.current = el;
        if (el && triggerRef.current)
            updatePosition();
    }, [updatePosition]);
    const portalContent = isOpen
        ? (0, react_dom_1.createPortal)(((0, jsx_runtime_1.jsx)("div", { ref: setPositionWrapperRef, className: (0, classnames_1.default)('memori-tooltip', 'memori-tooltip--portal', `memori-tooltip--align-${align}`, className, { 'memori-tooltip--visible': true }), style: {
                position: 'fixed',
                top: 0,
                left: 0,
                width: 0,
                height: 0,
                pointerEvents: 'none',
                zIndex: 2147483647,
            }, children: (0, jsx_runtime_1.jsx)("div", { className: "memori-tooltip--content memori-tooltip--content-portal", style: { pointerEvents: 'auto' }, onMouseEnter: handleContentEnter, onMouseLeave: handleContentLeave, children: content }) })), document.body)
        : null;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { ref: triggerRef, className: (0, classnames_1.default)('memori-tooltip', `memori-tooltip--align-${align}`, className, {
                    'memori-tooltip--disabled': disabled,
                    'memori-tooltip--visible': visible && !isHovered,
                    'memori-tooltip--portal-open': isOpen,
                }), onMouseEnter: handleTriggerEnter, onMouseLeave: handleTriggerLeave, children: (0, jsx_runtime_1.jsx)("div", { className: "memori-tooltip--trigger", children: children }) }), portalContent] }));
};
exports.default = Tooltip;
//# sourceMappingURL=Tooltip.js.map