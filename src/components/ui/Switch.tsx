import React, { useState, useEffect } from 'react';
import { Switch as HeadlessSwitch } from '@headlessui/react';
import cx from 'classnames';

export interface Props {
  className?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'small' | 'default' | 'large';
  checkedChildren?: React.ReactNode;
  unCheckedChildren?: React.ReactNode;
  loading?: boolean;
  'data-testid'?: string;
  label?: string;
  id?: string;
}

const Switch = ({
  className,
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  size = 'default',
  checkedChildren,
  unCheckedChildren,
  loading = false,
  'data-testid': testId,
  label,
  id,
}: Props) => {
  // Handle controlled vs uncontrolled
  const [innerChecked, setInnerChecked] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : innerChecked;

  // Sync with external value changes
  useEffect(() => {
    if (isControlled && checked !== undefined) {
      setInnerChecked(checked);
    }
  }, [isControlled, checked]);

  const handleChange = (newChecked: boolean) => {
    if (!disabled && !loading) {
      if (!isControlled) {
        setInnerChecked(newChecked);
      }
      
      if (onChange) {
        onChange(newChecked);
      }
    }
  };

  return (
    <div className={cx('memori-switch-wrapper', className)}>
      {label && (
        <label htmlFor={id} className="memori-switch--label">
          {label}
        </label>
      )}
      
      <HeadlessSwitch
        checked={isChecked}
        onChange={handleChange}
        className={cx('memori-switch', `memori-switch--${size}`, {
          'memori-switch--checked': isChecked,
          'memori-switch--disabled': disabled || loading,
          'memori-switch--loading': loading
        })}
        disabled={disabled || loading}
        data-testid={testId}
        id={id}
      >
        <span 
          aria-hidden="true" 
          className={cx('memori-switch--handle', {
            'memori-switch--handle-checked': isChecked,
            'memori-switch--handle-disabled': disabled || loading,
            'memori-switch--handle-loading': loading
          })}
        >
          {loading && (
            <span className="memori-switch--loading-icon">
              <svg 
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="memori-switch--loading-spinner"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v2"></path>
              </svg>
            </span>
          )}
        </span>
        
        {(checkedChildren || unCheckedChildren) && (
          <span className="memori-switch--inner">
            {isChecked ? checkedChildren : unCheckedChildren}
          </span>
        )}
      </HeadlessSwitch>
    </div>
  );
};

export default Switch;