import React, { Fragment } from 'react';
import cx from 'classnames';
import { Listbox, Transition } from '@headlessui/react';
import SelectIcon from '../icons/SelectIcon';

export interface Props<T = any> {
  className?: string;
  value?: T;
  name?: string;
  displayValue?: string;
  onChange: (value: T) => void;
  options: { value: T; label: any }[];
  disabled?: boolean;
  label?: string;
  placeholder?: string;
}

const Select = ({
  className,
  value,
  name,
  displayValue,
  options,
  onChange,
  disabled = false,
  label,
  placeholder,
}: Props) => {
  return (
    <div className={cx('memori-select', className)}>
      <Listbox
        value={value}
        onChange={value => {
          onChange(value);
        }}
        disabled={disabled}
        name={name}
      >
        {label && (
          <Listbox.Label className="memori-select--label">
            {label}:
          </Listbox.Label>
        )}
        <Listbox.Button aria-label={label} className="memori-select--button">
          <span
            className={cx('memori-select--value', {
              'memori-select--value-placeholder': !value,
            })}
          >
            {value ? displayValue || value : placeholder}
          </span>
          <span className="memori-select--icon">
            <SelectIcon />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="memori-select--options">
            {options.map(opt => (
              <Listbox.Option
                key={opt.value}
                value={opt.value}
                className="memori-select--option"
              >
                {opt.label}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox>
    </div>
  );
};

export default Select;
