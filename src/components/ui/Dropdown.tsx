import React, { useRef, useEffect, useState } from 'react';
import cx from 'classnames';

export interface Props {
  open?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  className?: string;
  trigger?: React.ReactNode;
  placement?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
}

const Dropdown: React.FC<Props> = ({
  open = false,
  onClose,
  children,
  className,
  trigger,
  placement = 'bottom-right',
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={cx('memori-dropdown', className)} ref={dropdownRef}>
      <div className="memori-dropdown--trigger" onClick={handleTriggerClick}>
        {trigger}
      </div>
      {isOpen && (
        <div className={cx('memori-dropdown--content', `memori-dropdown--content--${placement}`)}>
          {children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
