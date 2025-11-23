import React, { useEffect, useState, memo } from 'react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';

export interface Props {
  defaultDate?: string | Date;
  disabled?: boolean;
  onChange: (date: DateTime) => void;
}

const DateSelector = memo(
  ({ defaultDate, onChange, disabled = false }: Props) => {
    const { t } = useTranslation();

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

    const handleNativeChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const { value } = event.target;
      if (!value) {
        return;
      }

      // value is in format yyyy-MM-dd
      const nextDate = DateTime.fromISO(value);
      if (nextDate.isValid) {
        setDate(nextDate);
      }
    };

    const value = date.toISODate() ?? '';

    return (
      <div className="memori--date-selector">
        <label className="memori--date-selector__label">
          <span className="memori--date-selector__label-text">{t('date')}</span>
          <input
            type="date"
            className="memori--date-selector__input"
            value={value}
            onChange={handleNativeChange}
            disabled={disabled}
            aria-label={t('date') || undefined}
          />
        </label>
      </div>
    );
  }
);

DateSelector.displayName = 'DateSelector';

export default DateSelector;
