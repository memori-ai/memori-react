import React, { ReactNode, useState, useRef, useEffect, Fragment } from 'react';
import cx from 'classnames';
import { Transition } from '@headlessui/react';
import CloseIcon from '../icons/Close';

export interface Props {
  className?: string;
  type?: 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url';
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPressEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  allowClear?: boolean;
  addonBefore?: ReactNode;
  addonAfter?: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  label?: string;
  id?: string;
  maxLength?: number;
  autoFocus?: boolean;
  // Added search related props to match Ant Design
  showSearch?: boolean;
  onSearch?: (value: string) => void;
  // Help text
  help?: ReactNode;
  // Validation status
  status?: 'error' | 'warning' | 'success';
}

const Input = ({
  className,
  type = 'text',
  name,
  value,
  defaultValue,
  onChange,
  onPressEnter,
  placeholder,
  disabled = false,
  readOnly = false,
  allowClear = false,
  addonBefore,
  addonAfter,
  prefix,
  suffix,
  label,
  id,
  maxLength,
  autoFocus = false,
  showSearch = false,
  onSearch,
  help,
  status,
}: Props) => {
  const [innerValue, setInnerValue] = useState(defaultValue || '');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Determine if controlled or uncontrolled
  const isControlled = value !== undefined;
  const inputValue = isControlled ? value : innerValue;
  
  // Sync with external value changes
  useEffect(() => {
    if (isControlled && value !== undefined) {
      // If component is controlled, update innerValue to match value prop
      setInnerValue(value);
    }
  }, [isControlled, value]);
  
  // Focus management
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    if (!isControlled) {
      setInnerValue(newValue);
    }
    
    if (onChange) {
      onChange(e);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (showSearch && onSearch) {
        onSearch(inputValue);
      }
      
      if (onPressEnter) {
        onPressEnter(e);
      }
    }
  };
  
  const handleClear = () => {
    // Create a synthetic event that mimics a change event
    const syntheticEvent = {
      target: {
        name,
        value: ''
      },
      currentTarget: {
        name,
        value: ''
      },
      preventDefault: () => {},
      stopPropagation: () => {}
    } as React.ChangeEvent<HTMLInputElement>;
    
    if (!isControlled) {
      setInnerValue('');
    }
    
    if (onChange) {
      onChange(syntheticEvent);
    }
    
    // Focus input after clearing
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  const showClearButton = allowClear && inputValue && !disabled && !readOnly;
  
  return (
    <div className={cx('memori-input-wrapper', className)}>
      {label && (
        <label htmlFor={id || name} className="memori-input--label">
          {label}
        </label>
      )}
      
      <div className={cx('memori-input-container', {
        'memori-input--disabled': disabled,
        'memori-input--readonly': readOnly,
        'memori-input--with-addon-before': addonBefore,
        'memori-input--with-addon-after': addonAfter,
        'memori-input--with-prefix': prefix,
        'memori-input--with-suffix': suffix || showClearButton,
        'memori-input--focused': isFocused,
        'memori-input--error': status === 'error',
        'memori-input--warning': status === 'warning',
        'memori-input--success': status === 'success'
      })}>
        {addonBefore && (
          <div className="memori-input--addon-before">
            {addonBefore}
          </div>
        )}
        
        <div className={cx('memori-input--field-container', {
          'memori-input--field-focused': isFocused,
          'memori-input--field-error': status === 'error',
          'memori-input--field-warning': status === 'warning',
          'memori-input--field-success': status === 'success'
        })}>
          {prefix && (
            <div className="memori-input--prefix">
              {prefix}
            </div>
          )}
          
          <input
            ref={inputRef}
            className="memori-input--field"
            type={type}
            id={id || name}
            name={name}
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            maxLength={maxLength}
            autoFocus={autoFocus}
            role={type === 'search' ? 'searchbox' : undefined}
          />
          
          <Transition
            as={Fragment}
            show={showClearButton || false}
            enter="transition ease-out duration-100"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div 
              className="memori-input--clear" 
              onClick={handleClear}
              title="Clear"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleClear();
                  e.preventDefault();
                }
              }}
            >
              <CloseIcon className="memori-input--clear-icon" />
            </div>
          </Transition>
          
          {suffix && !showClearButton && (
            <div className="memori-input--suffix">
              {suffix}
            </div>
          )}
        </div>
        
        {addonAfter && (
          <div className="memori-input--addon-after">
            {addonAfter}
          </div>
        )}
      </div>
      
      {help && (
        <Transition
          show={!!help}
          enter="transition ease-out duration-100"
          enterFrom="opacity-0 -translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-75"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 -translate-y-1"
        >
          <div className={cx('memori-input--help', {
            'memori-input--help-error': status === 'error',
            'memori-input--help-warning': status === 'warning',
            'memori-input--help-success': status === 'success'
          })}>
            {help}
          </div>
        </Transition>
      )}
    </div>
  );
};

export default Input;