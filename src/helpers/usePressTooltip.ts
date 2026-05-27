import {
  useCallback,
  useState,
  type MouseEvent,
  type PointerEvent,
} from 'react';

export function usePressTooltip(defaultOpen = false) {
  const [open, setOpen] = useState(defaultOpen);

  const toggleOpen = useCallback((e: MouseEvent | PointerEvent) => {
    e.stopPropagation();
    setOpen(prev => !prev);
  }, []);

  const pressTriggerProps = {
    onPointerDown: (e: PointerEvent) => {
      e.stopPropagation();
    },
    onClick: toggleOpen,
  } as const;

  const tooltipProps = {
    open,
    onOpenChange: setOpen,
  } as const;

  return { open, setOpen, pressTriggerProps, tooltipProps };
}
