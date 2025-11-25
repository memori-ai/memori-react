import { useEffect, useState, memo, useMemo, useRef, ChangeEvent } from 'react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';

export interface Props {
  defaultDate?: string | Date;
  disabled?: boolean;
  onChange: (date: DateTime | undefined) => void;
}

const DateSelector = memo(
  ({ defaultDate, onChange, disabled = false }: Props) => {
    const { t } = useTranslation();

    // Calculate constraints for birth date (18 years ago to 1900)
    const maxDate = useMemo(() => DateTime.now().minus({ years: 18 }), []);
    const minDate = useMemo(() => DateTime.fromObject({ year: 1900, month: 1, day: 1 }), []);

    // State for individual fields as strings to allow empty values
    const [day, setDay] = useState<string>('');
    const [month, setMonth] = useState<string>('');
    const [year, setYear] = useState<string>('');

    // Initialize from defaultDate if provided
    useEffect(() => {
      if (defaultDate) {
        const dt = typeof defaultDate === 'string'
          ? DateTime.fromISO(defaultDate)
          : DateTime.fromJSDate(defaultDate);

        if (dt.isValid) {
          setDay(dt.day.toString());
          setMonth(dt.month.toString());
          setYear(dt.year.toString());
        }
      }
    }, [defaultDate]);

    const [isMobile, setIsMobile] = useState(false);

    // Refs for auto-focus
    const dayRef = useRef<HTMLInputElement>(null);
    const monthRef = useRef<HTMLInputElement>(null);
    const yearRef = useRef<HTMLInputElement>(null);

    // Detect mobile viewport
    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };

      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Validate and propagate changes
    useEffect(() => {
      if (!day || !month || !year) {
        onChange(undefined);
        return;
      }

      const d = parseInt(day);
      const m = parseInt(month);
      const y = parseInt(year);

      if (isNaN(d) || isNaN(m) || isNaN(y)) {
        onChange(undefined);
        return;
      }

      const newDate = DateTime.fromObject({ year: y, month: m, day: d });

      // Basic validation: check if it's a valid date (e.g. not Feb 30)
      // and within range.
      if (newDate.isValid && newDate >= minDate && newDate <= maxDate) {
        onChange(newDate);
      } else {
        onChange(undefined);
      }
    }, [day, month, year, onChange, minDate, maxDate]);

    // Handle mobile native input change
    const handleMobileChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value) {
        const newDate = DateTime.fromISO(value);
        if (newDate.isValid) {
          setDay(newDate.day.toString());
          setMonth(newDate.month.toString());
          setYear(newDate.year.toString());
          // The useEffect will handle calling onChange
        }
      } else {
        setDay('');
        setMonth('');
        setYear('');
      }
    };

    const handleDayChange = (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      // Allow empty or numbers only
      if (val === '' || /^\d+$/.test(val)) {
        // Limit length to 2
        if (val.length > 2) return;

        // Limit value to 31
        const numVal = parseInt(val);
        if (numVal > 31) return;

        setDay(val);
        if (val.length >= 2) {
          monthRef.current?.focus();
        }
      }
    };

    const handleMonthChange = (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (val === '' || /^\d+$/.test(val)) {
        // Limit length to 2
        if (val.length > 2) return;

        // Limit value to 12
        const numVal = parseInt(val);
        if (numVal > 12) return;

        setMonth(val);
        if (val.length >= 2) {
          yearRef.current?.focus();
        }
      }
    };

    const handleYearChange = (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (val === '' || /^\d+$/.test(val)) {
        // Limit length to 4
        if (val.length > 4) return;

        setYear(val);
      }
    };

    // Mobile native input
    if (isMobile) {
      const currentDate = (day && month && year)
        ? DateTime.fromObject({ year: parseInt(year), month: parseInt(month), day: parseInt(day) })
        : null;

      return (
        <div className="memori--date-selector memori--date-selector--mobile">
          <label className="memori--date-selector__mobile-label">
            {t('birthDate') || 'Birth Date'}:
          </label>
          <input
            type="date"
            className="memori--date-selector__mobile-input"
            value={currentDate?.isValid ? currentDate.toISODate() || '' : ''}
            onChange={handleMobileChange}
            disabled={disabled}
            min={minDate.toISODate() || '1900-01-01'}
            max={maxDate.toISODate() || ''}
            aria-label={String(t('dateOfBirth') || t('date'))}
          />
        </div>
      );
    }

    // Desktop simple inputs
    return (
      <div className="memori--date-selector memori--date-selector--desktop">
        <div className="memori--date-selector__input-group">
          <label className="memori--date-selector__label">
            {t('day') || 'Day'}
          </label>
          <input
            ref={dayRef}
            type="number"
            className="memori--date-selector__input"
            value={day}
            onChange={handleDayChange}
            placeholder={t('dayPlaceholder') || 'DD'}
            min={1}
            max={31}
            disabled={disabled}
          />
        </div>

        <div className="memori--date-selector__input-group">
          <label className="memori--date-selector__label">
            {t('month') || 'Month'}
          </label>
          <input
            ref={monthRef}
            type="number"
            className="memori--date-selector__input"
            value={month}
            onChange={handleMonthChange}
            placeholder={t('monthPlaceholder') || 'MM'}
            min={1}
            max={12}
            disabled={disabled}
          />
        </div>

        <div className="memori--date-selector__input-group memori--date-selector__input-group--year">
          <label className="memori--date-selector__label">
            {t('year') || 'Year'}
          </label>
          <input
            ref={yearRef}
            type="number"
            className="memori--date-selector__input"
            value={year}
            onChange={handleYearChange}
            placeholder={t('yearPlaceholder') || 'YYYY'}
            min={minDate.year}
            max={maxDate.year}
            disabled={disabled}
          />
        </div>
      </div>
    );
  }
);

DateSelector.displayName = 'DateSelector';

export default DateSelector;
