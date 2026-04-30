import React from 'react';
import { Button } from '@memori.ai/ui';

export interface DrawerFooterProps {
  children?: React.ReactNode;
  /** Content aligned to the start (left in LTR) */
  start?: React.ReactNode;
  /** Content aligned to the end (right in LTR) */
  end?: React.ReactNode;
  /** Content centered in the footer */
  center?: React.ReactNode;
  /** Optional close button label; when set, a close button is rendered in the end slot */
  closeLabel?: string;
  onClose?: () => void;
  className?: string;
}

const DrawerFooter: React.FC<DrawerFooterProps> = ({
  children,
  start,
  end,
  center,
  closeLabel,
  onClose,
  className = '',
}) => {
  const hasSlots = start != null || end != null || center != null || closeLabel != null;

  return (
    <footer
      className={`memori-drawer-footer ${className}`.trim()}
      role="contentinfo"
    >
      {center != null ? (
        <div className="memori-drawer-footer__inner memori-drawer-footer__inner--centered">
          {center}
        </div>
      ) : children != null && !hasSlots ? (
        <div className="memori-drawer-footer__inner memori-drawer-footer__inner--centered">
          {children}
        </div>
      ) : (
        <div className="memori-drawer-footer__inner">
          {start != null && (
            <div className="memori-drawer-footer__start">{start}</div>
          )}
          <div className="memori-drawer-footer__end">
            {end}
            {closeLabel != null && onClose != null && (
              <Button variant="primary" onClick={onClose}>
                {closeLabel}
              </Button>
            )}
          </div>
        </div>
      )}
    </footer>
  );
};

export default DrawerFooter;
