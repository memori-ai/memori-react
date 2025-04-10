import React, { Fragment, useState, useEffect } from 'react';
import cx from 'classnames';
import { Popover, Transition } from '@headlessui/react';
import { format, parse, isValid, addDays, addMonths, subMonths, setHours, setMinutes, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addWeeks, Day } from 'date-fns';
import { enUS, it } from 'date-fns/locale';
import ChevronLeft from '../icons/ChevronLeft';
import ChevronRight from '../icons/ChevronRight';
import Clear from '../icons/Clear';

export interface Props {
  name?: string;
  className?: string;
  placeholderText?: string;
  selected?: Date | null;
  onChange: (date: Date | null) => void;
  locale?: 'en' | 'it';
  showTimeSelect?: boolean;
  calendarStartDay?: number;
  timeIntervals?: number;
  timeCaption?: string;
  dateFormat?: string;
  icon?: React.ReactNode;
  popperPlacement?: 'bottom-start' | 'bottom-end';
  isClearable?: boolean;
  disabled?: boolean;
  label?: string;
}

const DatePicker = ({
  name,
  className,
  placeholderText = 'DD/MM/YYYY',
  selected,
  onChange,
  locale = 'en',
  showTimeSelect = false,
  calendarStartDay = 0,
  timeIntervals = 30,
  timeCaption = 'Time',
  dateFormat = 'PP',
  icon,
  popperPlacement = 'bottom-start',
  isClearable = false,
  disabled = false,
  label,
}: Props) => {
  const [currentMonth, setCurrentMonth] = useState(selected || new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(selected || null);
  const [selectedTime, setSelectedTime] = useState<{ hours: number; minutes: number } | null>(
    selected ? { hours: selected.getHours(), minutes: selected.getMinutes() } : null
  );
  const [inputValue, setInputValue] = useState('');

  const localeObj = locale === 'it' ? it : enUS;

  useEffect(() => {
    if (selected) {
      setSelectedDate(selected);
      setCurrentMonth(selected);
      setSelectedTime(showTimeSelect ? { hours: selected.getHours(), minutes: selected.getMinutes() } : null);
      setInputValue(formatDate(selected));
    } else {
      setInputValue('');
    }
  }, [selected, showTimeSelect]);

  const formatDate = (date: Date): string => {
    if (!isValid(date)) return '';
    
    try {
      return format(date, dateFormat, { locale: localeObj });
    } catch (error) {
      return format(date, 'PP', { locale: localeObj });
    }
  };

  const handleDateChange = (date: Date) => {
    let newDate = date;
    
    if (selectedTime) {
      newDate = setHours(newDate, selectedTime.hours);
      newDate = setMinutes(newDate, selectedTime.minutes);
    }
    
    setSelectedDate(newDate);
    setInputValue(formatDate(newDate));
    onChange(newDate);
  };

  const handleTimeChange = (hours: number, minutes: number) => {
    if (!selectedDate) return;
    
    const newTime = { hours, minutes };
    setSelectedTime(newTime);
    
    const newDate = setMinutes(setHours(selectedDate, hours), minutes);
    setInputValue(formatDate(newDate));
    onChange(newDate);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Try to parse the input value
    if (value) {
      try {
        const parsedDate = parse(value, dateFormat, new Date(), { locale: localeObj });
        if (isValid(parsedDate)) {
          setSelectedDate(parsedDate);
          setCurrentMonth(parsedDate);
          onChange(parsedDate);
          return;
        }
      } catch (error) {
        // Parsing failed, continue with setting just the input value
      }
    }
    
    // If parsing failed or value is empty
    if (!value && isClearable) {
      setSelectedDate(null);
      onChange(null);
    }
  };

  const handleClear = () => {
    setSelectedDate(null);
    setInputValue('');
    onChange(null);
  };

  const renderHeader = () => {
    const monthName = format(currentMonth, 'MMMM yyyy', { locale: localeObj });
    
    return (
      <div className="memori-datepicker--header">
        <button
          type="button"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="memori-datepicker--nav-button"
          aria-label="Previous month"
        >
          <ChevronLeft />
        </button>
        <span className="memori-datepicker--current-month">{monthName}</span>
        <button
          type="button"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="memori-datepicker--nav-button"
          aria-label="Next month"
        >
          <ChevronRight />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    let startDate = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: calendarStartDay as Day });
    
    // If we need to start from another day (e.g. Monday(1) instead of Sunday(0))
    if (calendarStartDay !== 0) {
      startDate = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: calendarStartDay as Day });
    }

    // Create day name headers
    const dayNames = [];
    for (let i = 0; i < 7; i++) {
      const dayOfWeek = addDays(startDate, i);
      dayNames.push(
        <div key={`day-name-${i}`} className="memori-datepicker--day-name">
          {format(dayOfWeek, 'EEEEEE', { locale: localeObj })}
        </div>
      );
    }

    // Create calendar days
    for (let i = 0; i < 42; i++) {
      const day = addDays(startDate, i);
      const isCurrentMonth = isSameMonth(day, currentMonth);
      const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
      const isToday = isSameDay(day, new Date());

      days.push(
        <button
          type="button"
          key={`day-${i}`}
          onClick={() => handleDateChange(day)}
          className={cx('memori-datepicker--day', {
            'memori-datepicker--day-selected': isSelected,
            'memori-datepicker--day-outside-month': !isCurrentMonth,
            'memori-datepicker--day-today': isToday,
          })}
        >
          {format(day, 'd')}
        </button>
      );

      // Break after we've rendered a full month
      if (i === 41 || (i > 27 && !isCurrentMonth && isSameMonth(addDays(day, 1), endOfMonth(currentMonth)))) {
        break;
      }
    }

    return (
      <div className="memori-datepicker--calendar">
        <div className="memori-datepicker--days-header">{dayNames}</div>
        <div className="memori-datepicker--days-grid">{days}</div>
      </div>
    );
  };

  const renderTimeSelect = () => {
    if (!showTimeSelect) return null;

    const hours = [];
    const minutes = [];

    // Generate hours
    for (let i = 0; i < 24; i++) {
      hours.push(
        <button
          key={`hour-${i}`}
          type="button"
          className={cx('memori-datepicker--time-option', {
            'memori-datepicker--time-option-selected': selectedTime?.hours === i,
          })}
          onClick={() => handleTimeChange(i, selectedTime?.minutes || 0)}
        >
          {String(i).padStart(2, '0')}
        </button>
      );
    }

    // Generate minutes based on intervals
    for (let i = 0; i < 60; i += timeIntervals) {
      minutes.push(
        <button
          key={`minute-${i}`}
          type="button"
          className={cx('memori-datepicker--time-option', {
            'memori-datepicker--time-option-selected': selectedTime?.minutes === i,
          })}
          onClick={() => handleTimeChange(selectedTime?.hours || 0, i)}
        >
          {String(i).padStart(2, '0')}
        </button>
      );
    }

    return (
      <div className="memori-datepicker--time-select">
        <div className="memori-datepicker--time-caption">{timeCaption}</div>
        <div className="memori-datepicker--time-container">
          <div className="memori-datepicker--time-column">
            <div className="memori-datepicker--time-label">Hours</div>
            <div className="memori-datepicker--time-options">{hours}</div>
          </div>
          <div className="memori-datepicker--time-column">
            <div className="memori-datepicker--time-label">Minutes</div>
            <div className="memori-datepicker--time-options">{minutes}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cx('memori-datepicker', className)}>
      {label && <label className="memori-datepicker--label">{label}</label>}
      <Popover className="memori-datepicker--container">
        {({ open }) => (
          <>
            <div className="memori-datepicker--input-container">
              {icon && <span className="memori-datepicker--icon">{icon}</span>}
              <Popover.Button
                as="div"
                className="memori-datepicker--input-wrapper"
              >
                <input
                  type="text"
                  name={name}
                  className="memori-datepicker--input"
                  placeholder={placeholderText}
                  value={inputValue}
                  onChange={handleInputChange}
                  disabled={disabled}
                  aria-label={label || "Date picker"}
                />
                {isClearable && inputValue && (
                  <button
                    type="button"
                    className="memori-datepicker--clear-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClear();
                    }}
                    aria-label="Clear date"
                  >
                    <Clear />
                  </button>
                )}
              </Popover.Button>
            </div>

            <Transition
              as={Fragment}
              show={open}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel 
                className={cx('memori-datepicker--popup', {
                  'memori-datepicker--popup-end': popperPlacement === 'bottom-end'
                })}
              >
                <div className="memori-datepicker--popup-content">
                  {renderHeader()}
                  {renderDays()}
                  {renderTimeSelect()}
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
};

export default DatePicker;