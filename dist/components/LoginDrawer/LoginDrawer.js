"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Button_1 = tslib_1.__importDefault(require("../ui/Button"));
const Drawer_1 = tslib_1.__importDefault(require("../ui/Drawer"));
const react_hot_toast_1 = tslib_1.__importDefault(require("react-hot-toast"));
const react_i18next_1 = require("react-i18next");
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const error_1 = require("../../helpers/error");
const utils_1 = require("../../helpers/utils");
const LoginDrawer = ({ open = false, onClose, onLogin, user, loginToken, setUser, tenant, apiClient, __TEST__signup = false, __TEST__needMissingData = false, drawerClassName, }) => {
    var _a;
    const { t, i18n } = (0, react_i18next_1.useTranslation)();
    const lang = i18n.language === 'it' ? 'it' : 'en';
    const { pwlUpdateUser, loginWithOTP, validateOTPCode, pwlGetCurrentUser, uploadAsset, } = apiClient.backend;
    const isUserLoggedIn = (user === null || user === void 0 ? void 0 : user.userID) && loginToken;
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const [otpCode, setOtpCode] = (0, react_1.useState)('');
    const [otpEmail, setOtpEmail] = (0, react_1.useState)('');
    const [otpError, setOtpError] = (0, react_1.useState)(null);
    const [showOtpForm, setShowOtpForm] = (0, react_1.useState)(true);
    const [showOtpCodeForm, setShowOtpCodeForm] = (0, react_1.useState)(false);
    const [otpTimer, setOtpTimer] = (0, react_1.useState)(null);
    const [otpSent, setOtpSent] = (0, react_1.useState)(false);
    const [avatar, setAvatar] = (0, react_1.useState)(null);
    const [isResending, setIsResending] = (0, react_1.useState)(false);
    const [otpSuccess, setOtpSuccess] = (0, react_1.useState)(false);
    const [emailValid, setEmailValid] = (0, react_1.useState)(false);
    const [birthDate, setBirthDate] = (0, react_1.useState)('');
    const [tnCAndPPAccepted, setTnCAndPPAccepted] = (0, react_1.useState)(false);
    const [pAndCUAccepted, setPAndCUAccepted] = (0, react_1.useState)(false);
    const [showSignup, setShowSignup] = (0, react_1.useState)(__TEST__signup);
    const [needsMissingData, setNeedsMissingData] = (0, react_1.useState)(__TEST__needMissingData
        ? {
            token: 'token',
            birthDate: true,
            tnCAndPPAccepted: true,
        }
        : {});
    (0, react_1.useEffect)(() => {
        let interval;
        if (otpTimer && otpTimer > 0) {
            interval = setInterval(() => {
                setOtpTimer(prev => (prev && prev > 0 ? prev - 1 : 0));
            }, 1000);
        }
        return () => {
            if (interval)
                clearInterval(interval);
        };
    }, [otpTimer]);
    const sendOtpToEmail = async (email, isResend = false) => {
        if (!email || !utils_1.mailRegEx.test(email)) {
            setOtpError(t('login.emailInvalid'));
            return;
        }
        if (isResend) {
            setIsResending(true);
        }
        else {
            setLoading(true);
        }
        setOtpError(null);
        try {
            const response = await loginWithOTP({
                tenant: tenant.name,
                eMail: email.trim(),
            });
            if (response.resultCode === 0) {
                react_hot_toast_1.default.success(isResend ? t('login.otpResent') : t('login.otpSent'));
                setOtpEmail(email.trim());
                setOtpSent(true);
                setShowOtpCodeForm(true);
                startOtpTimer();
                setOtpSuccess(false);
            }
            else {
                setOtpError(response.resultMessage || t('login.otpSendError'));
            }
        }
        catch (err) {
            console.error('[OTP SEND]', err);
            setOtpError(t('login.otpSendError'));
        }
        finally {
            setLoading(false);
            setIsResending(false);
        }
    };
    const validateOtp = async (otp) => {
        if (!otp || otp.length !== 4) {
            setOtpError(t('login.otpInvalidFormat'));
            return;
        }
        if (!otpEmail || otpEmail.trim().length === 0) {
            setOtpError(t('login.emailRequired'));
            return;
        }
        setLoading(true);
        setOtpError(null);
        try {
            const response = await validateOTPCode(otp, tenant.name, undefined, otpEmail.trim());
            if (response.resultCode === 0) {
                setOtpSuccess(true);
                react_hot_toast_1.default.success(t('login.otpSuccess'));
                setTimeout(async () => {
                    var _a, _b, _c;
                    try {
                        const { user, ...resp } = await pwlGetCurrentUser(response.newSessionToken);
                        if (!user.age || !user.tnCAndPPAccepted) {
                            setUser(user);
                            setBirthDate((_a = user === null || user === void 0 ? void 0 : user.birthDate) !== null && _a !== void 0 ? _a : '');
                            setTnCAndPPAccepted((_b = user === null || user === void 0 ? void 0 : user.tnCAndPPAccepted) !== null && _b !== void 0 ? _b : false);
                            setPAndCUAccepted((_c = user === null || user === void 0 ? void 0 : user.pAndCUAccepted) !== null && _c !== void 0 ? _c : false);
                            setNeedsMissingData({
                                token: response.newSessionToken,
                                birthDate: !user.age,
                                tnCAndPPAccepted: !user.tnCAndPPAccepted,
                            });
                        }
                        else {
                            onLogin(user, response.newSessionToken);
                        }
                    }
                    catch (err) {
                        console.error('[GET USER]', err);
                        react_hot_toast_1.default.error(t('login.userFetchError'));
                    }
                }, 1000);
                setTimeout(() => {
                    setShowOtpForm(false);
                    setShowOtpCodeForm(false);
                    setOtpCode('');
                    setOtpEmail('');
                    setOtpSent(false);
                    setOtpSuccess(false);
                }, 2000);
            }
            else {
                if (response.resultCode === -107) {
                    setOtpError(t('login.otpNotFound'));
                }
                else if (response.resultCode === -108) {
                    setOtpError(t('login.otpExpired'));
                }
                else if (response.resultCode === -109) {
                    setOtpError(t('login.otpMissing'));
                }
                else {
                    setOtpError(response.resultMessage || t('login.otpInvalid'));
                }
            }
        }
        catch (err) {
            console.error('[OTP VALIDATION]', err);
            setOtpError(t('login.otpError'));
        }
        finally {
            setLoading(false);
        }
    };
    const handleOtpChange = (value) => {
        const numericValue = value.replace(/\D/g, '').slice(0, 4);
        setOtpCode(numericValue);
        setOtpError(null);
        if (numericValue.length === 4 && otpEmail.trim().length > 0) {
            validateOtp(numericValue);
        }
    };
    const handleEmailChange = (value) => {
        setOtpEmail(value);
        setOtpError(null);
        setEmailValid(utils_1.mailRegEx.test(value));
    };
    const handleResendOtp = () => {
        if (otpEmail && utils_1.mailRegEx.test(otpEmail)) {
            sendOtpToEmail(otpEmail, true);
        }
    };
    const startOtpTimer = () => {
        setOtpTimer(60);
    };
    const updateMissingData = async (e) => {
        e.preventDefault();
        if (!(user === null || user === void 0 ? void 0 : user.userID) || !(needsMissingData === null || needsMissingData === void 0 ? void 0 : needsMissingData.token)) {
            setError(t('login.userNotFound'));
            return;
        }
        if (!birthDate || !tnCAndPPAccepted) {
            setError(t('missingData'));
            return;
        }
        let newUser = {
            userID: user.userID,
            birthDate: (user === null || user === void 0 ? void 0 : user.birthDate) || !needsMissingData.birthDate ? undefined : birthDate,
            tnCAndPPAccepted: tnCAndPPAccepted || (user === null || user === void 0 ? void 0 : user.tnCAndPPAccepted),
            tnCAndPPAcceptanceDate: tnCAndPPAccepted
                ? new Date().toISOString()
                : undefined,
            pAndCUAccepted: pAndCUAccepted || (user === null || user === void 0 ? void 0 : user.pAndCUAccepted),
            pAndCUAcceptanceDate: pAndCUAccepted
                ? new Date().toISOString()
                : undefined,
        };
        const { user: patchedUser, ...resp } = await pwlUpdateUser(needsMissingData.token, user.userID, newUser);
        if (resp.resultCode !== 0) {
            console.error(resp);
            react_hot_toast_1.default.error(t((0, error_1.getErrori18nKey)(resp.resultCode)));
            setError(resp.resultMessage);
        }
        else {
            react_hot_toast_1.default.success(t('success'));
            onLogin(patchedUser || newUser, needsMissingData.token);
        }
    };
    return ((0, jsx_runtime_1.jsx)(Drawer_1.default, { open: open, onClose: onClose, className: (0, classnames_1.default)('memori--login-drawer', {
            'memori--login-drawer--logged': isUserLoggedIn,
            'memori--login-drawer--signup': showSignup,
        }, drawerClassName), children: ((_a = needsMissingData === null || needsMissingData === void 0 ? void 0 : needsMissingData.token) === null || _a === void 0 ? void 0 : _a.length) ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("h3", { children: t('login.missingData') }), (0, jsx_runtime_1.jsx)("p", { children: t('login.missingDataHelper') }), (0, jsx_runtime_1.jsxs)("form", { className: "memori--login-drawer--form", onSubmit: updateMissingData, children: [needsMissingData.birthDate && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("label", { htmlFor: "#birthDate", children: [t('login.birthDate'), (0, jsx_runtime_1.jsx)("input", { id: "birthDate", name: "birthDate", type: "date", required: true, onChange: e => setBirthDate(e.target.value), value: birthDate, autoComplete: "bday" })] }), (0, jsx_runtime_1.jsx)("p", { children: (0, jsx_runtime_1.jsx)("small", { children: t('login.birthDateHelper') }) })] })), (needsMissingData === null || needsMissingData === void 0 ? void 0 : needsMissingData.tnCAndPPAccepted) && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("label", { className: "memori-checkbox", children: [(0, jsx_runtime_1.jsxs)("span", { className: "memori-checkbox--input-wrapper", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", name: "tnCAndPPAccepted", className: "memori-checkbox--input", onChange: e => setTnCAndPPAccepted(e.target.checked), checked: tnCAndPPAccepted }), (0, jsx_runtime_1.jsx)("span", { className: "memori-checkbox--inner" })] }), (0, jsx_runtime_1.jsxs)("span", { className: "memori-checkbox--text", children: [t('login.privacyLabel'), ' ', (0, jsx_runtime_1.jsx)("a", { href: `https://memori.ai/${lang}/privacy_and_cookie`, target: "_blank", rel: "noopener noreferrer", children: t('login.privacyAndCookiePolicy') }), ' ', t('login.and'), ' ', (0, jsx_runtime_1.jsx)("a", { href: `https://memori.ai/${lang}/tos`, target: "_blank", rel: "noopener noreferrer", children: t('login.termsOfService') })] })] }), (0, jsx_runtime_1.jsxs)("label", { className: "memori-checkbox", children: [(0, jsx_runtime_1.jsxs)("span", { className: "memori-checkbox--input-wrapper", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", name: "pAndCUAccepted", onChange: e => setPAndCUAccepted(e.target.checked), checked: pAndCUAccepted, className: "memori-checkbox--input" }), (0, jsx_runtime_1.jsx)("span", { className: "memori-checkbox--inner" })] }), (0, jsx_runtime_1.jsxs)("span", { className: "memori-checkbox--text", children: [t('login.pAndCUAccepted'), ' ', (0, jsx_runtime_1.jsx)("small", { children: (0, jsx_runtime_1.jsxs)("em", { children: ["(", t('login.optional'), ")"] }) })] })] }), (0, jsx_runtime_1.jsx)("p", { children: (0, jsx_runtime_1.jsx)("small", { children: t('login.goToAccountToChangeYourPreferences') }) }), (0, jsx_runtime_1.jsx)("p", { children: (0, jsx_runtime_1.jsx)("small", { children: t('login.deepThoughtExplaination') }) })] })), error && ((0, jsx_runtime_1.jsx)("p", { className: "memori--login-drawer--inline-error", children: error })), (0, jsx_runtime_1.jsx)(Button_1.default, { htmlType: "submit", primary: true, loading: loading, children: t('login.save') })] })] })) : showOtpCodeForm ? ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)("div", { className: "memori--login-drawer--otp-container", children: [(0, jsx_runtime_1.jsxs)("div", { className: "memori--login-drawer--otp-header", children: [otpSuccess && ((0, jsx_runtime_1.jsx)("div", { className: "memori--login-drawer--otp-icon", children: "\u2705" })), (0, jsx_runtime_1.jsx)("h3", { children: t('login.otpTitle') }), (0, jsx_runtime_1.jsx)("p", { className: "memori--login-drawer--otp-description", children: otpSuccess
                                    ? t('login.otpSuccessMessage')
                                    : t('login.otpCodeDescription', { email: otpEmail }) })] }), !otpSuccess && ((0, jsx_runtime_1.jsx)("div", { className: (0, classnames_1.default)('memori--login-drawer--otp-form', { loading }), children: (0, jsx_runtime_1.jsxs)("label", { htmlFor: "otp-code", className: "memori--login-drawer--otp-label", children: [(0, jsx_runtime_1.jsx)("span", { className: "memori--login-drawer--otp-label-text", style: { textAlign: 'center' }, children: t('login.otpCode') }), (0, jsx_runtime_1.jsxs)("div", { className: "memori--login-drawer--otp-input-container", children: [(0, jsx_runtime_1.jsx)("input", { id: "otp-code", type: "text", className: (0, classnames_1.default)('memori--login-drawer--otp-input', {
                                                success: otpCode.length === 4 && !otpError,
                                                error: otpError,
                                                loading: loading,
                                            }), value: otpCode, onChange: e => handleOtpChange(e.target.value), placeholder: "0000", maxLength: 4, autoComplete: "one-time-code", required: true, disabled: loading, "aria-describedby": "otp-help" }), loading && ((0, jsx_runtime_1.jsx)("div", { className: "memori--login-drawer--otp-loading", children: (0, jsx_runtime_1.jsx)("div", { className: "memori--login-drawer--otp-spinner" }) }))] }), (0, jsx_runtime_1.jsx)("small", { id: "otp-help", className: "memori--login-drawer--otp-help", children: t('login.otpHelp') })] }) })), otpTimer && otpTimer > 0 && !otpSuccess && ((0, jsx_runtime_1.jsx)("div", { className: "memori--login-drawer--otp-timer", children: (0, jsx_runtime_1.jsx)("span", { children: t('login.otpTimer', { seconds: otpTimer }) }) })), !otpSuccess && ((0, jsx_runtime_1.jsxs)("div", { className: "memori--login-drawer--otp-actions", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { outlined: true, onClick: () => {
                                    setShowOtpCodeForm(false);
                                    setOtpCode('');
                                    setOtpError(null);
                                }, disabled: loading, children: t('login.backToEmail') }), (0, jsx_runtime_1.jsx)(Button_1.default, { outlined: true, onClick: handleResendOtp, disabled: loading ||
                                    isResending ||
                                    (otpTimer && otpTimer > 0) ||
                                    !otpEmail, loading: isResending, children: isResending ? t('login.resending') : t('login.resendOtp') })] })), otpError && ((0, jsx_runtime_1.jsxs)("div", { role: "alert", className: "memori--login-drawer--otp-error", children: [(0, jsx_runtime_1.jsx)("span", { className: "memori--login-drawer--otp-error-icon", children: "\u26A0\uFE0F" }), (0, jsx_runtime_1.jsx)("span", { children: otpError })] }))] }) })) : showOtpForm ? ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)("div", { className: "memori--login-drawer--otp-container", children: [(0, jsx_runtime_1.jsxs)("div", { className: "memori--login-drawer--otp-header", children: [(0, jsx_runtime_1.jsx)("h3", { children: t('login.otpEmailTitle') }), (0, jsx_runtime_1.jsx)("p", { className: "memori--login-drawer--otp-description", children: t('login.otpEmailDescription') })] }), (0, jsx_runtime_1.jsx)("div", { className: (0, classnames_1.default)('memori--login-drawer--otp-form', { loading }), children: (0, jsx_runtime_1.jsxs)("label", { htmlFor: "otp-email", className: "memori--login-drawer--otp-label", children: [(0, jsx_runtime_1.jsx)("span", { className: "memori--login-drawer--otp-label-text", children: t('login.email') }), (0, jsx_runtime_1.jsxs)("div", { className: "memori--login-drawer--otp-input-container", children: [(0, jsx_runtime_1.jsx)("input", { id: "otp-email", type: "email", className: (0, classnames_1.default)('memori--login-drawer--otp-email-input', {
                                                error: otpError && !utils_1.mailRegEx.test(otpEmail),
                                                valid: emailValid && !otpError,
                                                loading: loading,
                                            }), value: otpEmail, onChange: e => handleEmailChange(e.target.value), placeholder: t('login.emailPlaceholder') || 'Enter your email', autoComplete: "email", required: true, disabled: loading, "aria-describedby": "email-help" }), emailValid && !loading && ((0, jsx_runtime_1.jsx)("div", { className: "memori--login-drawer--otp-valid-icon", children: "\u2713" })), loading && ((0, jsx_runtime_1.jsx)("div", { className: "memori--login-drawer--otp-loading", children: (0, jsx_runtime_1.jsx)("div", { className: "memori--login-drawer--otp-spinner" }) }))] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "memori--login-drawer--otp-actions", children: [showOtpCodeForm && (0, jsx_runtime_1.jsx)(Button_1.default, { outlined: true, onClick: () => {
                                    setShowOtpForm(false);
                                    setOtpEmail('');
                                    setOtpError(null);
                                    setEmailValid(false);
                                }, disabled: loading, children: t('login.backToLogin') }), (0, jsx_runtime_1.jsx)(Button_1.default, { primary: true, onClick: () => {
                                    sendOtpToEmail(otpEmail);
                                }, disabled: loading || !emailValid, loading: loading, children: t('login.sendOtp') })] }), otpError && ((0, jsx_runtime_1.jsxs)("div", { role: "alert", className: "memori--login-drawer--otp-error", children: [(0, jsx_runtime_1.jsx)("span", { className: "memori--login-drawer--otp-error-icon", children: "\u26A0\uFE0F" }), (0, jsx_runtime_1.jsx)("span", { children: otpError })] }))] }) })) : null }));
};
exports.default = LoginDrawer;
//# sourceMappingURL=LoginDrawer.js.map