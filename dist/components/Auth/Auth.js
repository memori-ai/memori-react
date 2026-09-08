"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthWidget = void 0;
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const Button_1 = tslib_1.__importDefault(require("../ui/Button"));
const Modal_1 = tslib_1.__importDefault(require("../ui/Modal"));
const react_hook_form_1 = require("react-hook-form");
const Plus_1 = tslib_1.__importDefault(require("../icons/Plus"));
function createArrayWithNumbers(length) {
    return Array.from({ length }, (_, i) => i);
}
const AuthWidget = ({ pwdOrTokens, setPwdOrTokens, onFinish, minimumNumberOfRecoveryTokens = 1, showTokens = true, openModal = false, withModal = false, }) => {
    var _a, _b, _c;
    const { t } = (0, react_i18next_1.useTranslation)();
    const { register, handleSubmit, formState: { errors }, setError, } = (0, react_hook_form_1.useForm)();
    const [numTokens, setNumTokens] = (0, react_1.useState)(1);
    const [showModal, setShowModal] = (0, react_1.useState)(!!pwdOrTokens);
    const [isSubmitting, setIsSubmitting] = (0, react_1.useState)(false);
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
    const form = ((0, jsx_runtime_1.jsxs)("form", { name: "memoriAuth", onSubmit: handleSubmit(onSubmit), className: "memori-auth-widget--form", children: [(pwdOrTokens === 'password' || !showTokens) && ((0, jsx_runtime_1.jsxs)("fieldset", { className: "memori-auth-widget--password-fieldset", children: [(0, jsx_runtime_1.jsxs)("label", { children: ["Password:", ' ', (0, jsx_runtime_1.jsx)("input", { className: "memori-auth-widget--input", required: true, type: "password", placeholder: "Password", ...register('password', { required: true }) })] }), showTokens && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("hr", {}), (0, jsx_runtime_1.jsx)(Button_1.default, { outlined: true, onClick: () => setPwdOrTokens('tokens'), children: t('auth.useRecoveryTokens') || 'Recovery tokens' })] }))] })), pwdOrTokens === 'tokens' && showTokens && ((0, jsx_runtime_1.jsxs)("fieldset", { className: "memori-auth-widget--tokens-fieldset", name: "tokens", children: [(0, jsx_runtime_1.jsxs)("legend", { children: [t('auth.tokens'), ": "] }), createArrayWithNumbers(numTokens).map(idx => {
                        return ((0, jsx_runtime_1.jsx)("label", { className: "memori-auth-widget--token", children: (0, jsx_runtime_1.jsx)("input", { type: "password", className: "memori-auth-widget--input", placeholder: "Recovery token", required: true, autoComplete: "off", ...register(`tokens.${idx}`, {
                                    required: true,
                                }) }) }, idx));
                    }), (0, jsx_runtime_1.jsx)(Button_1.default, { onClick: () => setNumTokens(t => t + 1), className: "memori-auth-widget--token-add", icon: (0, jsx_runtime_1.jsx)(Plus_1.default, {}), children: t('auth.addToken') || 'Add token' }), (0, jsx_runtime_1.jsx)("hr", {}), (0, jsx_runtime_1.jsx)(Button_1.default, { outlined: true, onClick: () => setPwdOrTokens('password'), children: t('auth.usePassword') || 'Password' })] })), ((_a = errors.tokens) === null || _a === void 0 ? void 0 : _a.type) === 'minLength' && ((0, jsx_runtime_1.jsxs)("div", { className: "memori-auth-widget--error", children: [t('auth.atLeast') || 'At least', " ", minimumNumberOfRecoveryTokens] })), ((_b = errors.password) === null || _b === void 0 ? void 0 : _b.type) === 'auth' && ((0, jsx_runtime_1.jsx)("div", { className: "memori-auth-widget--error", children: errors.password.message })), ((_c = errors.tokens) === null || _c === void 0 ? void 0 : _c.type) === 'auth' && ((0, jsx_runtime_1.jsx)("div", { className: "memori-auth-widget--error", children: errors.tokens.message })), (0, jsx_runtime_1.jsx)(Button_1.default, { htmlType: "submit", primary: true, className: "memori-auth-widget--submit", loading: isSubmitting, children: t('confirm') || 'Submit' })] }));
    return withModal ? ((0, jsx_runtime_1.jsx)(Modal_1.default, { open: openModal || showModal, title: t('auth.title') || 'Authentication', onClose: () => setPwdOrTokens(null), closable: false, children: form })) : (form);
};
exports.AuthWidget = AuthWidget;
exports.default = exports.AuthWidget;
//# sourceMappingURL=Auth.js.map