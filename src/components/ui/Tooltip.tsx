import React, { FC, useRef, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import cx from 'classnames';

export interface Props {
  content: string | JSX.Element | React.ReactNode;
  className?: string;
  align?:
    | 'left'
    | 'right'
    | 'topLeft'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomRight';
  disabled?: boolean;
  children: React.ReactNode;
  visible?: boolean;
}

const Tooltip: FC<Props> = ({
  content,
  className,
  align = 'right',
  disabled = false,
  visible = false,
  children,
}) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const positionWrapperRef = useRef<HTMLDivElement | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
    }, 100);
  }, []);

  const handleContentEnter = useCallback(() => {
    clearCloseTimeout();
    setIsHovered(true);
  }, [clearCloseTimeout]);

  const handleContentLeave = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
      closeTimeoutRef.current = null;
    }, 100);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
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

  const setPositionWrapperRef = useCallback(
    (el: HTMLDivElement | null) => {
      positionWrapperRef.current = el;
      if (el && triggerRef.current) updatePosition();
    },
    [updatePosition]
  );

  const portalContent = isOpen
    ? createPortal(
        (
          <div
            ref={setPositionWrapperRef}
            className={cx(
              'memori-tooltip',
              'memori-tooltip--portal',
              `memori-tooltip--align-${align}`,
              className,
              { 'memori-tooltip--visible': true }
            )}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: 0,
              height: 0,
              pointerEvents: 'none',
              zIndex: 2147483647,
            }}
          >
            <div
              className="memori-tooltip--content memori-tooltip--content-portal"
              onMouseEnter={handleContentEnter}
              onMouseLeave={handleContentLeave}
            >
              {content}
            </div>
          </div>
        ) as Parameters<typeof createPortal>[0],
        document.body
      )
    : null;

  return (
    <>
      <div
        ref={triggerRef}
        className={cx(
          'memori-tooltip',
          `memori-tooltip--align-${align}`,
          className,
          {
            'memori-tooltip--disabled': disabled,
            'memori-tooltip--visible': visible && !isHovered,
            'memori-tooltip--portal-open': isOpen,
          }
        )}
        onMouseEnter={handleTriggerEnter}
        onMouseLeave={handleTriggerLeave}
      >
        <div className="memori-tooltip--trigger">{children}</div>
      </div>
      {portalContent}
    </>
  );
};

export default Tooltip;
