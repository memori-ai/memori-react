import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { DateTime } from 'luxon';
import DateSelector from '../DateSelector/DateSelector';
import { useCallback, useState } from 'react';
const AgeVerificationModal = ({ visible = false, onClose, minAge }) => {
    const { t } = useTranslation();
    const [birthDate, setBirthDate] = useState();
    const [error, setError] = useState();
    const [submitting, setSubmitting] = useState(false);
    const onSubmit = useCallback(() => {
        setSubmitting(true);
        if (!birthDate) {
            toast.error(t('requiredField'));
            setError(t('requiredField') || 'Required field');
            setSubmitting(false);
            return;
        }
        let age = DateTime.now().diff(birthDate, 'years').years;
        if (age < minAge) {
            toast.error(t('underageTwinSession', { age: minAge }));
            setError(t('underageTwinSession', { age: minAge }) ||
                `You must be at least ${minAge} years old to interact with this Agent`);
            setSubmitting(false);
            return;
        }
        onClose(birthDate.toJSDate().toISOString());
    }, [birthDate, minAge, onClose, t]);
    const handleDateChange = useCallback((date) => {
        setBirthDate(date);
    }, []);
    return (_jsxs(Modal, { open: visible, width: "600px", widthMd: "600px", title: t('ageVerification'), className: "age-verification-modal", closable: true, onClose: () => onClose(), children: [_jsx("p", { children: t('ageVerificationText', { minAge }) }), _jsxs("form", { className: "age-verification-form", onSubmit: e => {
                    e.preventDefault();
                    onSubmit();
                }, children: [_jsx("div", { className: "form-item", children: _jsxs("fieldset", { name: "birthDate", children: [_jsx("legend", { className: "sr-only", children: t('birthDate') }), _jsx(DateSelector, { minAge: minAge, onChange: handleDateChange }), _jsx("p", { className: "form-item-help", children: t('birthDateHelper') }), error && _jsx("p", { className: "form-item-error", children: error })] }) }), _jsx("div", { className: "form-item form-submit", children: _jsx(Button, { primary: true, htmlType: "submit", className: "age-verification-submit", loading: submitting, disabled: !birthDate, children: t('confirm') }) })] })] }));
};
export default AgeVerificationModal;
//# sourceMappingURL=AgeVerificationModal.js.map