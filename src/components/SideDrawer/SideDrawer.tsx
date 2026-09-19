import React from 'react';
import cx from 'classnames';
import { Drawer } from '@memori.ai/ui';

export interface SideDrawerProps {
  open?: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  closeLabel?: string;
}

/**
 * Shared shell for the chat side drawers: header (title + close),
 * scrollable body, optional footer. Wraps `@memori.ai/ui` Drawer so overlay,
 * motion and tokens stay in the design system.
 */
const SideDrawer: React.FC<SideDrawerProps> = ({
  open = true,
  onClose,
  title,
  description,
  footer,
  children,
  className,
  size = 'md',
  loading,
  closeLabel,
}) => {
  return (
    <Drawer
      open={open}
      anchor="right"
      size={size}
      loading={loading}
      closeLabel={closeLabel}
      className={cx('memori-side-drawer', className)}
      title={title}
      description={description}
      footer={footer}
      onClose={onClose}
      onOpenChange={nextOpen => {
        if (!nextOpen) onClose();
      }}
    >
      <div className="memori-side-drawer__body">{children}</div>
    </Drawer>
  );
};

export interface SideDrawerEmptyProps {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
}

export const SideDrawerEmpty: React.FC<SideDrawerEmptyProps> = ({
  icon,
  title,
  description,
  children,
}) => (
  <div className="memori-side-drawer-empty" role="status">
    {icon != null && (
      <span className="memori-side-drawer-empty__icon" aria-hidden>
        {icon}
      </span>
    )}
    <p className="memori-side-drawer-empty__title">{title}</p>
    {description != null && (
      <p className="memori-side-drawer-empty__text">{description}</p>
    )}
    {children}
  </div>
);

export default SideDrawer;
