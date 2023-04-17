import { useEffect, useState, memo, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import SelectIcon from '../icons/SelectIcon';

export interface Props {
  defaultDate?: moment.Moment | string | Date;
  disabled?: boolean;
  onChange: (date: moment.Moment) => void;
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

    const [date, setDate] = useState(moment(defaultDate || Date.now()));
    useEffect(() => {
      onChange(date);
    }, [date, onChange]);

    moment.locale(i18n.language);

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
                {date.date()}
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
                    value={date.clone().date(day + 1)}
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
                {months[i18n.language === 'it' ? 'it' : 'en'][date.month()]}
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
                    value={date
                      .clone()
                      .month(
                        months[i18n.language === 'it' ? 'it' : 'en'].findIndex(
                          m => m === month
                        )
                      )}
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
                {date.year()}
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
                {[...Array(moment().year() - 1899).keys()]
                  .sort((a, b) => b - a)
                  .map(year => (
                    <Listbox.Option
                      key={year}
                      value={date.clone().year(year + 1900)}
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
