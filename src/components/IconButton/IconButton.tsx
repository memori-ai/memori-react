import React from 'react';
import cx from 'classnames';
import { Button } from '@memori.ai/ui';

export type IconButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  'variant' | 'active'
> & {
  /**
   * Toggle / popover-open / selected. Soft primary chrome — never solid primary fill.
   */
  active?: boolean;
  /**
   * Mic (or similar) recording state. Soft error chrome — never primary.
   */
  recording?: boolean;
  /**
   * Optional override; defaults to toolbar so outline+active solid fill from the UI lib
   * cannot leak into secondary icon tools.
   */
  variant?: React.ComponentProps<typeof Button>['variant'];
};

function hasVisibleLabel(children: React.ReactNode): boolean {
  return React.Children.toArray(children).some(child => {
    if (child === null || child === undefined) return false;
    if (typeof child === 'boolean') return false;
    if (typeof child === 'string') return child.trim().length > 0;
    if (typeof child === 'number') return true;
    return true;
  });
}

/**
 * Shared secondary icon control for chat header + input bar.
 * CTA actions (Accedi, send) must keep using Button variant="primary".
 */
const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      active = false,
      recording = false,
      className,
      variant = 'toolbar',
      shape = 'default',
      size = 'sm',
      children,
      ...rest
    },
    ref
  ) => {
    const isRecording = !!recording;
    const isActive = !!active && !isRecording;
    const isLabeled = hasVisibleLabel(children);
    // Never inherit CTA / outline solid-active chrome from layout buttonVariant.
    const resolvedVariant =
      variant === 'primary' ||
      variant === 'secondary' ||
      variant === 'danger' ||
      variant === 'outline' ||
      variant === 'ghost'
        ? 'toolbar'
        : variant;

    return (
      <Button
        ref={ref}
        variant={resolvedVariant}
        shape={shape}
        size={size}
        active={isActive}
        className={cx(
          'memori-icon-button',
          isLabeled && 'memori-icon-button--labeled',
          isActive && 'memori-icon-button--active',
          isRecording && 'memori-icon-button--recording',
          className
        )}
        {...rest}
      >
        {children}
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';

export default IconButton;
