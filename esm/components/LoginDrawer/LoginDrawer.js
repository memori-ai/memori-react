import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import Button from '../ui/Button';
import Drawer from '../ui/Drawer';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { getErrori18nKey } from '../../helpers/error';
import { mailRegEx } from '../../helpers/utils';
const LoginDrawer = ({ open = false, onClose, onLogin, user, loginToken, setUser, tenant, apiClient, __TEST__signup = false, __TEST__needMissingData = false, drawerClassName, }) => {
    var _a;
    const { t, i18n } = useTranslation();
    const lang = i18n.language === 'it' ? 'it' : 'en';
    const { pwlUpdateUser, loginWithOTP, validateOTPCode, pwlGetCurrentUser, uploadAsset, } = apiClient.backend;
    const isUserLoggedIn = (user === null || user === void 0 ? void 0 : user.userID) && loginToken;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [otpCode, setOtpCode] = useState('');
    const [otpEmail, setOtpEmail] = useState('');
    const [otpError, setOtpError] = useState(null);
    const [showOtpForm, setShowOtpForm] = useState(true);
    const [showOtpCodeForm, setShowOtpCodeForm] = useState(false);
    const [otpTimer, setOtpTimer] = useState(null);
    const [otpSent, setOtpSent] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [isResending, setIsResending] = useState(false);
    const [otpSuccess, setOtpSuccess] = useState(false);
    const [emailValid, setEmailValid] = useState(false);
    const [birthDate, setBirthDate] = useState('');
    const [tnCAndPPAccepted, setTnCAndPPAccepted] = useState(false);
    const [pAndCUAccepted, setPAndCUAccepted] = useState(false);
    const [showSignup, setShowSignup] = useState(__TEST__signup);
    const [needsMissingData, setNeedsMissingData] = useState(__TEST__needMissingData
        ? {
            token: 'token',
            birthDate: true,
            tnCAndPPAccepted: true,
        }
        : {});
    useEffect(() => {
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
        if (!email || !mailRegEx.test(email)) {
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
                toast.success(isResend ? t('login.otpResent') : t('login.otpSent'));
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
                toast.success(t('login.otpSuccess'));
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
                        toast.error(t('login.userFetchError'));
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
        setEmailValid(mailRegEx.test(value));
    };
    const handleResendOtp = () => {
        if (otpEmail && mailRegEx.test(otpEmail)) {
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
            toast.error(t(getErrori18nKey(resp.resultCode)));
            setError(resp.resultMessage);
        }
        else {
            toast.success(t('success'));
            onLogin(patchedUser || newUser, needsMissingData.token);
        }
    };
    return (_jsx(Drawer, { open: open, onClose: onClose, className: cx('memori--login-drawer', {
            'memori--login-drawer--logged': isUserLoggedIn,
            'memori--login-drawer--signup': showSignup,
        }, drawerClassName), children: ((_a = needsMissingData === null || needsMissingData === void 0 ? void 0 : needsMissingData.token) === null || _a === void 0 ? void 0 : _a.length) ? (_jsxs(_Fragment, { children: [_jsx("h3", { children: t('login.missingData') }), _jsx("p", { children: t('login.missingDataHelper') }), _jsxs("form", { className: "memori--login-drawer--form", onSubmit: updateMissingData, children: [needsMissingData.birthDate && (_jsxs(_Fragment, { children: [_jsxs("label", { htmlFor: "#birthDate", children: [t('login.birthDate'), _jsx("input", { id: "birthDate", name: "birthDate", type: "date", required: true, onChange: e => setBirthDate(e.target.value), value: birthDate, autoComplete: "bday" })] }), _jsx("p", { children: _jsx("small", { children: t('login.birthDateHelper') }) })] })), (needsMissingData === null || needsMissingData === void 0 ? void 0 : needsMissingData.tnCAndPPAccepted) && (_jsxs(_Fragment, { children: [_jsxs("label", { className: "memori-checkbox", children: [_jsxs("span", { className: "memori-checkbox--input-wrapper", children: [_jsx("input", { type: "checkbox", name: "tnCAndPPAccepted", className: "memori-checkbox--input", onChange: e => setTnCAndPPAccepted(e.target.checked), checked: tnCAndPPAccepted }), _jsx("span", { className: "memori-checkbox--inner" })] }), _jsxs("span", { className: "memori-checkbox--text", children: [t('login.privacyLabel'), ' ', _jsx("a", { href: `https://memori.ai/${lang}/privacy_and_cookie`, target: "_blank", rel: "noopener noreferrer", children: t('login.privacyAndCookiePolicy') }), ' ', t('login.and'), ' ', _jsx("a", { href: `https://memori.ai/${lang}/tos`, target: "_blank", rel: "noopener noreferrer", children: t('login.termsOfService') })] })] }), _jsxs("label", { className: "memori-checkbox", children: [_jsxs("span", { className: "memori-checkbox--input-wrapper", children: [_jsx("input", { type: "checkbox", name: "pAndCUAccepted", onChange: e => setPAndCUAccepted(e.target.checked), checked: pAndCUAccepted, className: "memori-checkbox--input" }), _jsx("span", { className: "memori-checkbox--inner" })] }), _jsxs("span", { className: "memori-checkbox--text", children: [t('login.pAndCUAccepted'), ' ', _jsx("small", { children: _jsxs("em", { children: ["(", t('login.optional'), ")"] }) })] })] }), _jsx("p", { children: _jsx("small", { children: t('login.goToAccountToChangeYourPreferences') }) }), _jsx("p", { children: _jsx("small", { children: t('login.deepThoughtExplaination') }) })] })), error && (_jsx("p", { className: "memori--login-drawer--inline-error", children: error })), _jsx(Button, { htmlType: "submit", primary: true, loading: loading, children: t('login.save') })] })] })) : showOtpCodeForm ? (_jsx(_Fragment, { children: _jsxs("div", { className: "memori--login-drawer--otp-container", children: [_jsxs("div", { className: "memori--login-drawer--otp-header", children: [otpSuccess && (_jsx("div", { className: "memori--login-drawer--otp-icon", children: "\u2705" })), _jsx("h3", { children: t('login.otpTitle') }), _jsx("p", { className: "memori--login-drawer--otp-description", children: otpSuccess
                                    ? t('login.otpSuccessMessage')
                                    : t('login.otpCodeDescription', { email: otpEmail }) })] }), !otpSuccess && (_jsx("div", { className: cx('memori--login-drawer--otp-form', { loading }), children: _jsxs("label", { htmlFor: "otp-code", className: "memori--login-drawer--otp-label", children: [_jsx("span", { className: "memori--login-drawer--otp-label-text", style: { textAlign: 'center' }, children: t('login.otpCode') }), _jsxs("div", { className: "memori--login-drawer--otp-input-container", children: [_jsx("input", { id: "otp-code", type: "text", className: cx('memori--login-drawer--otp-input', {
                                                success: otpCode.length === 4 && !otpError,
                                                error: otpError,
                                                loading: loading,
                                            }), value: otpCode, onChange: e => handleOtpChange(e.target.value), placeholder: "0000", maxLength: 4, autoComplete: "one-time-code", required: true, disabled: loading, "aria-describedby": "otp-help" }), loading && (_jsx("div", { className: "memori--login-drawer--otp-loading", children: _jsx("div", { className: "memori--login-drawer--otp-spinner" }) }))] }), _jsx("small", { id: "otp-help", className: "memori--login-drawer--otp-help", children: t('login.otpHelp') })] }) })), otpTimer && otpTimer > 0 && !otpSuccess && (_jsx("div", { className: "memori--login-drawer--otp-timer", children: _jsx("span", { children: t('login.otpTimer', { seconds: otpTimer }) }) })), !otpSuccess && (_jsxs("div", { className: "memori--login-drawer--otp-actions", children: [_jsx(Button, { outlined: true, onClick: () => {
                                    setShowOtpCodeForm(false);
                                    setOtpCode('');
                                    setOtpError(null);
                                }, disabled: loading, children: t('login.backToEmail') }), _jsx(Button, { outlined: true, onClick: handleResendOtp, disabled: loading ||
                                    isResending ||
                                    (otpTimer && otpTimer > 0) ||
                                    !otpEmail, loading: isResending, children: isResending ? t('login.resending') : t('login.resendOtp') })] })), otpError && (_jsxs("div", { role: "alert", className: "memori--login-drawer--otp-error", children: [_jsx("span", { className: "memori--login-drawer--otp-error-icon", children: "\u26A0\uFE0F" }), _jsx("span", { children: otpError })] }))] }) })) : showOtpForm ? (_jsx(_Fragment, { children: _jsxs("div", { className: "memori--login-drawer--otp-container", children: [_jsxs("div", { className: "memori--login-drawer--otp-header", children: [_jsx("h3", { children: t('login.otpEmailTitle') }), _jsx("p", { className: "memori--login-drawer--otp-description", children: t('login.otpEmailDescription') })] }), _jsx("div", { className: cx('memori--login-drawer--otp-form', { loading }), children: _jsxs("label", { htmlFor: "otp-email", className: "memori--login-drawer--otp-label", children: [_jsx("span", { className: "memori--login-drawer--otp-label-text", children: t('login.email') }), _jsxs("div", { className: "memori--login-drawer--otp-input-container", children: [_jsx("input", { id: "otp-email", type: "email", className: cx('memori--login-drawer--otp-email-input', {
                                                error: otpError && !mailRegEx.test(otpEmail),
                                                valid: emailValid && !otpError,
                                                loading: loading,
                                            }), value: otpEmail, onChange: e => handleEmailChange(e.target.value), placeholder: t('login.emailPlaceholder') || 'Enter your email', autoComplete: "email", required: true, disabled: loading, "aria-describedby": "email-help" }), emailValid && !loading && (_jsx("div", { className: "memori--login-drawer--otp-valid-icon", children: "\u2713" })), loading && (_jsx("div", { className: "memori--login-drawer--otp-loading", children: _jsx("div", { className: "memori--login-drawer--otp-spinner" }) }))] })] }) }), _jsxs("div", { className: "memori--login-drawer--otp-actions", children: [showOtpCodeForm && _jsx(Button, { outlined: true, onClick: () => {
                                    setShowOtpForm(false);
                                    setOtpEmail('');
                                    setOtpError(null);
                                    setEmailValid(false);
                                }, disabled: loading, children: t('login.backToLogin') }), _jsx(Button, { primary: true, onClick: () => {
                                    sendOtpToEmail(otpEmail);
                                }, disabled: loading || !emailValid, loading: loading, children: t('login.sendOtp') })] }), otpError && (_jsxs("div", { role: "alert", className: "memori--login-drawer--otp-error", children: [_jsx("span", { className: "memori--login-drawer--otp-error-icon", children: "\u26A0\uFE0F" }), _jsx("span", { children: otpError })] }))] }) })) : null }));
};
export default LoginDrawer;
//# sourceMappingURL=LoginDrawer.js.map