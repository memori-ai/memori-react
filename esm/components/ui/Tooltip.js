import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import cx from 'classnames';
const Tooltip = ({ content, className, align = 'right', disabled = false, visible = false, children, }) => {
    const triggerRef = useRef(null);
    const positionWrapperRef = useRef(null);
    const closeTimeoutRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const isOpen = !disabled && (visible || isHovered);
    const updatePosition = useCallback(() => {
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
    const clearCloseTimeout = useCallback(() => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
    }, []);
    const handleTriggerEnter = useCallback(() => {
        clearCloseTimeout();
        setIsHovered(true);
    }, [clearCloseTimeout]);
    const handleTriggerLeave = useCallback(() => {
        closeTimeoutRef.current = setTimeout(() => {
            setIsHovered(false);
            closeTimeoutRef.current = null;
        }, 300);
    }, []);
    const handleContentEnter = useCallback(() => {
        clearCloseTimeout();
        setIsHovered(true);
    }, [clearCloseTimeout]);
    const handleContentLeave = useCallback(() => {
        closeTimeoutRef.current = setTimeout(() => {
            setIsHovered(false);
            closeTimeoutRef.current = null;
        }, 300);
    }, []);
    useEffect(() => {
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
    useEffect(() => () => clearCloseTimeout(), [clearCloseTimeout]);
    const setPositionWrapperRef = useCallback((el) => {
        positionWrapperRef.current = el;
        if (el && triggerRef.current)
            updatePosition();
    }, [updatePosition]);
    const portalContent = isOpen
        ? createPortal((_jsx("div", { ref: setPositionWrapperRef, className: cx('memori-tooltip', 'memori-tooltip--portal', `memori-tooltip--align-${align}`, className, { 'memori-tooltip--visible': true }), style: {
                position: 'fixed',
                top: 0,
                left: 0,
                width: 0,
                height: 0,
                pointerEvents: 'none',
                zIndex: 2147483647,
            }, children: _jsx("div", { className: "memori-tooltip--content memori-tooltip--content-portal", style: { pointerEvents: 'auto' }, onMouseEnter: handleContentEnter, onMouseLeave: handleContentLeave, children: content }) })), document.body)
        : null;
    return (_jsxs(_Fragment, { children: [_jsx("div", { ref: triggerRef, className: cx('memori-tooltip', `memori-tooltip--align-${align}`, className, {
                    'memori-tooltip--disabled': disabled,
                    'memori-tooltip--visible': visible && !isHovered,
                    'memori-tooltip--portal-open': isOpen,
                }), onMouseEnter: handleTriggerEnter, onMouseLeave: handleTriggerLeave, children: _jsx("div", { className: "memori-tooltip--trigger", children: children }) }), portalContent] }));
};
export default Tooltip;
//# sourceMappingURL=Tooltip.js.map