import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState, memo, useMemo, useRef } from 'react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
const DateSelector = memo(({ defaultDate, onChange, disabled = false, minAge = 18 }) => {
    const { t } = useTranslation();
    const maxDate = useMemo(() => DateTime.now().minus({ years: minAge }).startOf('day'), [minAge]);
    const minDate = useMemo(() => DateTime.fromObject({ year: 1900, month: 1, day: 1 }), []);
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
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
    const dayRef = useRef(null);
    const monthRef = useRef(null);
    const yearRef = useRef(null);
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;
    const lastEmittedRef = useRef(undefined);
    useEffect(() => {
        const emit = (next) => {
            const key = (next === null || next === void 0 ? void 0 : next.isValid) ? next.toISODate() : null;
            if (key === lastEmittedRef.current)
                return;
            lastEmittedRef.current = key;
            onChangeRef.current(next);
        };
        if (!day || !month || !year) {
            emit(undefined);
            return;
        }
        const d = parseInt(day);
        const m = parseInt(month);
        const y = parseInt(year);
        if (isNaN(d) || isNaN(m) || isNaN(y)) {
            emit(undefined);
            return;
        }
        const newDate = DateTime.fromObject({ year: y, month: m, day: d });
        if (newDate.isValid && newDate >= minDate && newDate <= maxDate) {
            emit(newDate);
        }
        else {
            emit(undefined);
        }
    }, [day, month, year, minDate, maxDate]);
    const handleMobileChange = (e) => {
        const value = e.target.value;
        if (value) {
            const newDate = DateTime.fromISO(value);
            if (newDate.isValid) {
                setDay(newDate.day.toString());
                setMonth(newDate.month.toString());
                setYear(newDate.year.toString());
            }
        }
        else {
            setDay('');
            setMonth('');
            setYear('');
        }
    };
    const handleDayChange = (e) => {
        var _a;
        const val = e.target.value;
        if (val === '' || /^\d+$/.test(val)) {
            if (val.length > 2)
                return;
            const numVal = parseInt(val);
            if (numVal > 31)
                return;
            setDay(val);
            if (val.length >= 2) {
                (_a = monthRef.current) === null || _a === void 0 ? void 0 : _a.focus();
            }
        }
    };
    const handleMonthChange = (e) => {
        var _a;
        const val = e.target.value;
        if (val === '' || /^\d+$/.test(val)) {
            if (val.length > 2)
                return;
            const numVal = parseInt(val);
            if (numVal > 12)
                return;
            setMonth(val);
            if (val.length >= 2) {
                (_a = yearRef.current) === null || _a === void 0 ? void 0 : _a.focus();
            }
        }
    };
    const handleYearChange = (e) => {
        const val = e.target.value;
        if (val === '' || /^\d+$/.test(val)) {
            if (val.length > 4)
                return;
            setYear(val);
        }
    };
    if (isMobile) {
        const currentDate = (day && month && year)
            ? DateTime.fromObject({ year: parseInt(year), month: parseInt(month), day: parseInt(day) })
            : null;
        return (_jsxs("div", { className: "memori--date-selector memori--date-selector--mobile", children: [_jsxs("label", { className: "memori--date-selector__mobile-label", children: [t('birthDate') || 'Birth Date', ":"] }), _jsx("input", { type: "date", className: "memori--date-selector__mobile-input", value: (currentDate === null || currentDate === void 0 ? void 0 : currentDate.isValid) ? currentDate.toISODate() || '' : '', onChange: handleMobileChange, disabled: disabled, min: minDate.toISODate() || '1900-01-01', max: maxDate.toISODate() || '', "aria-label": String(t('dateOfBirth') || t('date')) })] }));
    }
    return (_jsxs("div", { className: "memori--date-selector memori--date-selector--desktop", children: [_jsxs("div", { className: "memori--date-selector__input-group", children: [_jsx("label", { className: "memori--date-selector__label", children: t('day') || 'Day' }), _jsx("input", { ref: dayRef, type: "number", className: "memori--date-selector__input", value: day, onChange: handleDayChange, placeholder: t('dayPlaceholder') || 'DD', min: 1, max: 31, disabled: disabled })] }), _jsxs("div", { className: "memori--date-selector__input-group", children: [_jsx("label", { className: "memori--date-selector__label", children: t('month') || 'Month' }), _jsx("input", { ref: monthRef, type: "number", className: "memori--date-selector__input", value: month, onChange: handleMonthChange, placeholder: t('monthPlaceholder') || 'MM', min: 1, max: 12, disabled: disabled })] }), _jsxs("div", { className: "memori--date-selector__input-group memori--date-selector__input-group--year", children: [_jsx("label", { className: "memori--date-selector__label", children: t('year') || 'Year' }), _jsx("input", { ref: yearRef, type: "number", className: "memori--date-selector__input", value: year, onChange: handleYearChange, placeholder: t('yearPlaceholder') || 'YYYY', min: minDate.year, max: maxDate.year, disabled: disabled })] })] }));
});
DateSelector.displayName = 'DateSelector';
export default DateSelector;
//# sourceMappingURL=DateSelector.js.map