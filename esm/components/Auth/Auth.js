import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { useForm } from 'react-hook-form';
import Plus from '../icons/Plus';
function createArrayWithNumbers(length) {
    return Array.from({ length }, (_, i) => i);
}
export const AuthWidget = ({ pwdOrTokens, setPwdOrTokens, onFinish, minimumNumberOfRecoveryTokens = 1, showTokens = true, openModal = false, withModal = false, }) => {
    var _a, _b, _c;
    const { t } = useTranslation();
    const { register, handleSubmit, formState: { errors }, setError, } = useForm();
    const [numTokens, setNumTokens] = useState(1);
    const [showModal, setShowModal] = useState(!!pwdOrTokens);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const onSubmit = data => {
        var _a, _b, _c;
        const missingPassword = pwdOrTokens === 'password' && !((_a = data.password) === null || _a === void 0 ? void 0 : _a.length);
        const invalidTokens = pwdOrTokens === 'tokens' &&
            ((((_b = data === null || data === void 0 ? void 0 : data.tokens) === null || _b === void 0 ? void 0 : _b.length) || 0) < minimumNumberOfRecoveryTokens ||
                !((_c = data === null || data === void 0 ? void 0 : data.tokens) === null || _c === void 0 ? void 0 : _c.every(t => t.length)));
        if (missingPassword) {
            setError('password', {
                type: 'required',
                message: t('auth.passwordRequired') || 'Password required',
            });
            return;
        }
        if (invalidTokens) {
            setError('tokens', {
                type: 'minLength',
                message: t('auth.tokens') || 'Tokens',
            });
            return;
        }
        if (onFinish) {
            setIsSubmitting(true);
            onFinish(data)
                .then(() => {
                setShowModal(false);
            })
                .catch(() => {
                if (pwdOrTokens === 'password') {
                    setError('password', {
                        type: 'auth',
                        message: t('auth.invalidCredentials') || 'Invalid credentials',
                    });
                }
                else if (pwdOrTokens === 'tokens') {
                    setError('tokens', {
                        type: 'auth',
                        message: t('auth.invalidCredentials') || 'Invalid credentials',
                    });
                }
            })
                .finally(() => {
                setIsSubmitting(false);
            });
        }
    };
    const form = (_jsxs("form", { name: "memoriAuth", onSubmit: handleSubmit(onSubmit), className: "memori-auth-widget--form", children: [(pwdOrTokens === 'password' || !showTokens) && (_jsxs("fieldset", { className: "memori-auth-widget--password-fieldset", children: [_jsxs("label", { children: ["Password:", ' ', _jsx("input", { className: "memori-auth-widget--input", required: true, type: "password", placeholder: "Password", ...register('password', { required: true }) })] }), showTokens && (_jsxs(_Fragment, { children: [_jsx("hr", {}), _jsx(Button, { outlined: true, onClick: () => setPwdOrTokens('tokens'), children: t('auth.useRecoveryTokens') || 'Recovery tokens' })] }))] })), pwdOrTokens === 'tokens' && showTokens && (_jsxs("fieldset", { className: "memori-auth-widget--tokens-fieldset", name: "tokens", children: [_jsxs("legend", { children: [t('auth.tokens'), ": "] }), createArrayWithNumbers(numTokens).map(idx => {
                        return (_jsx("label", { className: "memori-auth-widget--token", children: _jsx("input", { type: "password", className: "memori-auth-widget--input", placeholder: "Recovery token", required: true, autoComplete: "off", ...register(`tokens.${idx}`, {
                                    required: true,
                                }) }) }, idx));
                    }), _jsx(Button, { onClick: () => setNumTokens(t => t + 1), className: "memori-auth-widget--token-add", icon: _jsx(Plus, {}), children: t('auth.addToken') || 'Add token' }), _jsx("hr", {}), _jsx(Button, { outlined: true, onClick: () => setPwdOrTokens('password'), children: t('auth.usePassword') || 'Password' })] })), ((_a = errors.tokens) === null || _a === void 0 ? void 0 : _a.type) === 'minLength' && (_jsxs("div", { className: "memori-auth-widget--error", children: [t('auth.atLeast') || 'At least', " ", minimumNumberOfRecoveryTokens] })), ((_b = errors.password) === null || _b === void 0 ? void 0 : _b.type) === 'auth' && (_jsx("div", { className: "memori-auth-widget--error", children: errors.password.message })), ((_c = errors.tokens) === null || _c === void 0 ? void 0 : _c.type) === 'auth' && (_jsx("div", { className: "memori-auth-widget--error", children: errors.tokens.message })), _jsx(Button, { htmlType: "submit", primary: true, className: "memori-auth-widget--submit", loading: isSubmitting, children: t('confirm') || 'Submit' })] }));
    return withModal ? (_jsx(Modal, { open: openModal || showModal, title: t('auth.title') || 'Authentication', onClose: () => setPwdOrTokens(null), closable: false, children: form })) : (form);
};
export default AuthWidget;
//# sourceMappingURL=Auth.js.map