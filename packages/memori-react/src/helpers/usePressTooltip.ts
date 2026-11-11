import {
  useCallback,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type RefCallback,
} from 'react';

/**
 * Click-to-toggle for Base UI tooltips (touch / explicit open).
 *
 * Hover opens through Base UI with the trigger attached synchronously
 * (`flushSync`). A controlled `open` flip from a nested button click does
 * not — `stopPropagation` also blocks `referencePress` dismiss, so Floating UI
 * can mount the positioner with no reference and stick at viewport 0,0.
 *
 * Attach `anchorRef` to the press target and merge `positionerProps` into
 * Tooltip `slotProps.positioner` so click-open stays aligned with the control.
 */
export function usePressTooltip(defaultOpen = false) {
  const [open, setOpen] = useState(defaultOpen);
  const anchorRef = useRef<HTMLElement | null>(null);

  const toggleOpen = useCallback((e: MouseEvent | PointerEvent) => {
    e.stopPropagation();
    setOpen(prev => !prev);
  }, []);

  const setAnchorRef = useCallback<RefCallback<HTMLElement>>(node => {
    anchorRef.current = node;
  }, []);

  const pressTriggerProps = {
    onPointerDown: (e: PointerEvent) => {
      e.stopPropagation();
    },
    onClick: toggleOpen,
  } as const;

  const positionerProps = {
    anchor: anchorRef,
    positionMethod: 'fixed' as const,
  };

  const tooltipProps = {
    open,
    onOpenChange: setOpen,
  } as const;

  return {
    open,
    setOpen,
    anchorRef: setAnchorRef,
    pressTriggerProps,
    positionerProps,
    tooltipProps,
  };
}
