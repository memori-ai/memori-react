"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const luxon_1 = require("luxon");
const react_i18next_1 = require("react-i18next");
const DateSelector = (0, react_1.memo)(({ defaultDate, onChange, disabled = false, minAge = 18 }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const maxDate = (0, react_1.useMemo)(() => luxon_1.DateTime.now().minus({ years: minAge }).startOf('day'), [minAge]);
    const minDate = (0, react_1.useMemo)(() => luxon_1.DateTime.fromObject({ year: 1900, month: 1, day: 1 }), []);
    const [day, setDay] = (0, react_1.useState)('');
    const [month, setMonth] = (0, react_1.useState)('');
    const [year, setYear] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        if (defaultDate) {
            const dt = typeof defaultDate === 'string'
                ? luxon_1.DateTime.fromISO(defaultDate)
                : luxon_1.DateTime.fromJSDate(defaultDate);
            if (dt.isValid) {
                setDay(dt.day.toString());
                setMonth(dt.month.toString());
                setYear(dt.year.toString());
            }
        }
    }, [defaultDate]);
    const [isMobile, setIsMobile] = (0, react_1.useState)(false);
    const dayRef = (0, react_1.useRef)(null);
    const monthRef = (0, react_1.useRef)(null);
    const yearRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    const onChangeRef = (0, react_1.useRef)(onChange);
    onChangeRef.current = onChange;
    const lastEmittedRef = (0, react_1.useRef)(undefined);
    (0, react_1.useEffect)(() => {
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
        const newDate = luxon_1.DateTime.fromObject({ year: y, month: m, day: d });
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
            const newDate = luxon_1.DateTime.fromISO(value);
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
            ? luxon_1.DateTime.fromObject({ year: parseInt(year), month: parseInt(month), day: parseInt(day) })
            : null;
        return ((0, jsx_runtime_1.jsxs)("div", { className: "memori--date-selector memori--date-selector--mobile", children: [(0, jsx_runtime_1.jsxs)("label", { className: "memori--date-selector__mobile-label", children: [t('birthDate') || 'Birth Date', ":"] }), (0, jsx_runtime_1.jsx)("input", { type: "date", className: "memori--date-selector__mobile-input", value: (currentDate === null || currentDate === void 0 ? void 0 : currentDate.isValid) ? currentDate.toISODate() || '' : '', onChange: handleMobileChange, disabled: disabled, min: minDate.toISODate() || '1900-01-01', max: maxDate.toISODate() || '', "aria-label": String(t('dateOfBirth') || t('date')) })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "memori--date-selector memori--date-selector--desktop", children: [(0, jsx_runtime_1.jsxs)("div", { className: "memori--date-selector__input-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "memori--date-selector__label", children: t('day') || 'Day' }), (0, jsx_runtime_1.jsx)("input", { ref: dayRef, type: "number", className: "memori--date-selector__input", value: day, onChange: handleDayChange, placeholder: t('dayPlaceholder') || 'DD', min: 1, max: 31, disabled: disabled })] }), (0, jsx_runtime_1.jsxs)("div", { className: "memori--date-selector__input-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "memori--date-selector__label", children: t('month') || 'Month' }), (0, jsx_runtime_1.jsx)("input", { ref: monthRef, type: "number", className: "memori--date-selector__input", value: month, onChange: handleMonthChange, placeholder: t('monthPlaceholder') || 'MM', min: 1, max: 12, disabled: disabled })] }), (0, jsx_runtime_1.jsxs)("div", { className: "memori--date-selector__input-group memori--date-selector__input-group--year", children: [(0, jsx_runtime_1.jsx)("label", { className: "memori--date-selector__label", children: t('year') || 'Year' }), (0, jsx_runtime_1.jsx)("input", { ref: yearRef, type: "number", className: "memori--date-selector__input", value: year, onChange: handleYearChange, placeholder: t('yearPlaceholder') || 'YYYY', min: minDate.year, max: maxDate.year, disabled: disabled })] })] }));
});
DateSelector.displayName = 'DateSelector';
exports.default = DateSelector;
//# sourceMappingURL=DateSelector.js.map