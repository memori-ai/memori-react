"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_i18next_1 = require("react-i18next");
const react_hot_toast_1 = tslib_1.__importDefault(require("react-hot-toast"));
const Button_1 = tslib_1.__importDefault(require("../ui/Button"));
const Modal_1 = tslib_1.__importDefault(require("../ui/Modal"));
const luxon_1 = require("luxon");
const DateSelector_1 = tslib_1.__importDefault(require("../DateSelector/DateSelector"));
const react_1 = require("react");
const AgeVerificationModal = ({ visible = false, onClose, minAge }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [birthDate, setBirthDate] = (0, react_1.useState)();
    const [error, setError] = (0, react_1.useState)();
    const [submitting, setSubmitting] = (0, react_1.useState)(false);
    const onSubmit = (0, react_1.useCallback)(() => {
        setSubmitting(true);
        if (!birthDate) {
            react_hot_toast_1.default.error(t('requiredField'));
            setError(t('requiredField') || 'Required field');
            setSubmitting(false);
            return;
        }
        let age = luxon_1.DateTime.now().diff(birthDate, 'years').years;
        if (age < minAge) {
            react_hot_toast_1.default.error(t('underageTwinSession', { age: minAge }));
            setError(t('underageTwinSession', { age: minAge }) ||
                `You must be at least ${minAge} years old to interact with this Agent`);
            setSubmitting(false);
            return;
        }
        onClose(birthDate.toJSDate().toISOString());
    }, [birthDate, minAge, onClose, t]);
    const handleDateChange = (0, react_1.useCallback)((date) => {
        setBirthDate(date);
    }, []);
    return ((0, jsx_runtime_1.jsxs)(Modal_1.default, { open: visible, width: "600px", widthMd: "600px", title: t('ageVerification'), className: "age-verification-modal", closable: true, onClose: () => onClose(), children: [(0, jsx_runtime_1.jsx)("p", { children: t('ageVerificationText', { minAge }) }), (0, jsx_runtime_1.jsxs)("form", { className: "age-verification-form", onSubmit: e => {
                    e.preventDefault();
                    onSubmit();
                }, children: [(0, jsx_runtime_1.jsx)("div", { className: "form-item", children: (0, jsx_runtime_1.jsxs)("fieldset", { name: "birthDate", children: [(0, jsx_runtime_1.jsx)("legend", { className: "sr-only", children: t('birthDate') }), (0, jsx_runtime_1.jsx)(DateSelector_1.default, { minAge: minAge, onChange: handleDateChange }), (0, jsx_runtime_1.jsx)("p", { className: "form-item-help", children: t('birthDateHelper') }), error && (0, jsx_runtime_1.jsx)("p", { className: "form-item-error", children: error })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "form-item form-submit", children: (0, jsx_runtime_1.jsx)(Button_1.default, { primary: true, htmlType: "submit", className: "age-verification-submit", loading: submitting, disabled: !birthDate, children: t('confirm') }) })] })] }));
};
exports.default = AgeVerificationModal;
//# sourceMappingURL=AgeVerificationModal.js.map