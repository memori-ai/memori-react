import { useEffect, useState, memo, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import SelectIcon from '../icons/SelectIcon';

export interface Props {
  defaultDate?: string | Date;
  disabled?: boolean;
  onChange: (date: DateTime) => void;
}

const months = {
  en: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  it: [
    'Gennaio',
    'Febbraio',
    'Marzo',
    'Aprile',
    'Maggio',
    'Giugno',
    'Luglio',
    'Agosto',
    'Settembre',
    'Ottobre',
    'Novembre',
    'Dicembre',
  ],
};

const DateSelector = memo(
  ({ defaultDate, onChange, disabled = false }: Props) => {
    const { t, i18n } = useTranslation();

    const [date, setDate] = useState(
      !defaultDate
        ? DateTime.now()
        : typeof defaultDate === 'string'
        ? DateTime.fromISO(defaultDate)
        : DateTime.fromJSDate(defaultDate)
    );
    useEffect(() => {
      onChange(date);
    }, [date, onChange]);

    return (
      <div className="memori--date-selector">
        <div className="memori--date-selector__select">
          <Listbox
            value={date}
            onChange={value => {
              setDate(value);
            }}
            disabled={disabled}
            name="day"
          >
            <Listbox.Label className="memori--date-selector__select-label">
              {t('day')}:
            </Listbox.Label>
            <Listbox.Button
              aria-label={t('day')}
              className="memori--date-selector__select-button"
            >
              <span className="memori--date-selector__select--value">
                {date.day}
              </span>
              <span className="memori--date-selector__select--icon">
                <SelectIcon />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="memori--date-selector__select-options">
                {[...Array(31).keys()].map(day => (
                  <Listbox.Option
                    key={day}
                    value={date.set({ day: day + 1 })}
                    className="memori--date-selector__select-option"
                  >
                    {day + 1}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </Listbox>
        </div>

        <div className="memori--date-selector__select">
          <Listbox
            value={date}
            onChange={value => {
              setDate(value);
            }}
            disabled={disabled}
            name="month"
          >
            <Listbox.Label className="memori--date-selector__select-label">
              {t('month')}:
            </Listbox.Label>
            <Listbox.Button
              aria-label={t('month')}
              className="memori--date-selector__select-button"
            >
              <span className="memori--date-selector__select--value">
                {months[i18n.language === 'it' ? 'it' : 'en'][date.month - 1]}
              </span>
              <span className="memori--date-selector__select--icon">
                <SelectIcon />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="memori--date-selector__select-options">
                {months[i18n.language === 'it' ? 'it' : 'en'].map(month => (
                  <Listbox.Option
                    key={month}
                    className="memori--date-selector__select-option"
                    value={date.set({
                      month:
                        months[i18n.language === 'it' ? 'it' : 'en'].findIndex(
                          m => m === month
                        ) + 1,
                    })}
                  >
                    {month}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </Listbox>
        </div>

        <div className="memori--date-selector__select">
          <Listbox
            value={date}
            onChange={value => {
              setDate(value);
            }}
            disabled={disabled}
            name="year"
          >
            <Listbox.Label className="memori--date-selector__select-label">
              {t('year')}:
            </Listbox.Label>
            <Listbox.Button
              aria-label={t('year')}
              className="memori--date-selector__select-button"
            >
              <span className="memori--date-selector__select--value">
                {date.year}
              </span>
              <span className="memori--date-selector__select--icon">
                <SelectIcon />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="memori--date-selector__select-options">
                {[...Array(DateTime.now().year - 1899).keys()]
                  .sort((a, b) => b - a)
                  .map(year => (
                    <Listbox.Option
                      key={year}
                      value={date.set({ year: year + 1900 })}
                      className="memori--date-selector__select-option"
                    >
                      {year + 1900}
                    </Listbox.Option>
                  ))}
              </Listbox.Options>
            </Transition>
          </Listbox>
        </div>
      </div>
    );
  }
);

DateSelector.displayName = 'DateSelector';

export default DateSelector;
