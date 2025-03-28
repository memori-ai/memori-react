import React, { Fragment, useState, useEffect } from 'react';
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
  // Added props from Ant Design
  showSearch?: boolean;
  optionFilterProp?: string;
  filterOption?: (input: string, option: { value: T; label: any }) => boolean;
  defaultValue?: T;
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
  // Added props
  showSearch = false,
  optionFilterProp = 'label',
  filterOption,
  defaultValue,
}: Props) => {
  // Set initial value based on defaultValue if value is not provided
  const [internalValue, setInternalValue] = useState(value || defaultValue);
  // For search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);

  // Update internal value when the external value changes
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Handle defaultValue
  useEffect(() => {
    if (defaultValue && !value) {
      setInternalValue(defaultValue);
      // Trigger onChange to sync the defaultValue with parent component
      onChange(defaultValue);
    }
  }, [defaultValue]);

  // Filter options based on search query
  useEffect(() => {
    if (showSearch && searchQuery) {
      const filtered = options.filter(option => {
        if (filterOption) {
          return filterOption(searchQuery, option);
        }
        const optionValue = optionFilterProp === 'label' ? option.label : option.value;
        return String(optionValue).toLowerCase().includes(searchQuery.toLowerCase());
      });
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [searchQuery, options, filterOption, optionFilterProp, showSearch]);

  const handleChange = (selectedValue: any) => {
    setInternalValue(selectedValue);
    onChange(selectedValue);
    setSearchQuery('');  // Clear search on selection
  };

  return (
    <div className={cx('memori-select', className)}>
      <Listbox
        value={internalValue}
        onChange={handleChange}
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
              'memori-select--value-placeholder': !internalValue,
            })}
          >
            {internalValue ? displayValue || internalValue : placeholder}
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
            {showSearch && (
              <div className="memori-select--search">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={placeholder || "Search..."}
                  onClick={(e) => e.stopPropagation()}
                  className="memori-select--search-input"
                />
              </div>
            )}
            {filteredOptions.map(opt => (
              <Listbox.Option
                key={String(opt.value)}
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