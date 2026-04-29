import { User, Tenant } from '@memori.ai/memori-api-client/dist/types';
import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Checkbox,
  Drawer,
  Input,
  useAlertManager,
  createAlertOptions,
  Card,
  Form,
} from '@memori.ai/ui';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import memoriApiClient from '@memori.ai/memori-api-client';
import { getErrori18nKey } from '../../helpers/error';
import { mailRegEx, pwdRegEx } from '../../helpers/utils';
import {
  AlertTriangle,
  ArrowLeftIcon,
  Check,
  RefreshCcwIcon,
} from 'lucide-react';

export interface Props {
  open?: boolean;
  onClose: () => void;
  user?: User;
  loginToken?: string;
  onLogin: (user: User, token: string) => void;
  onLogout: () => void;
  tenant: Tenant;
  apiClient: ReturnType<typeof memoriApiClient>;
  __TEST__signup?: boolean;
  __TEST__needMissingData?: boolean;
  setUser: (user: User) => void;
  /** Optional class for the drawer root (e.g. for z-index when layout is WEBSITE_ASSISTANT). */
  drawerClassName?: string;
}

const LoginDrawer = ({
  open = false,
  onClose,
  onLogin,
  user,
  loginToken,
  setUser,
  tenant,
  apiClient,
  __TEST__signup = false,
  __TEST__needMissingData = false,
}: Props) => {
  const { t, i18n } = useTranslation();
  const { add } = useAlertManager();
  const lang = i18n.language === 'it' ? 'it' : 'en';

  const {
    pwlUpdateUser,
    loginWithOTP,
    validateOTPCode,
    pwlGetCurrentUser,
    uploadAsset,
  } = apiClient.backend;

  const isUserLoggedIn = user?.userID && loginToken;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // OTP-related state
  const [otpCode, setOtpCode] = useState<string>('');
  const [otpEmail, setOtpEmail] = useState<string>('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [showOtpForm, setShowOtpForm] = useState(true);
  const [showOtpCodeForm, setShowOtpCodeForm] = useState(false);
  const [otpTimer, setOtpTimer] = useState<number | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [avatar, setAvatar] = useState<Blob | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [otpFocusedIndex, setOtpFocusedIndex] = useState(0);
  const [birthDate, setBirthDate] = useState<string>('');
  const [isBirthDateFocused, setIsBirthDateFocused] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [tnCAndPPAccepted, setTnCAndPPAccepted] = useState(false);
  const [pAndCUAccepted, setPAndCUAccepted] = useState(false);

  const [showSignup, setShowSignup] = useState(__TEST__signup);
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [needsMissingData, setNeedsMissingData] = useState<{
    token: string;
    birthDate?: boolean;
    tnCAndPPAccepted?: boolean;
  }>(
    __TEST__needMissingData
      ? {
          token: 'token',
          birthDate: true,
          tnCAndPPAccepted: true,
        }
      : ({} as any)
  );

  // OTP timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => (prev && prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpTimer]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const onChange = () => setIsMobileViewport(mediaQuery.matches);
    onChange();
    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  // Send OTP to email
  const sendOtpToEmail = async (email: string, isResend = false) => {
    if (!email || !mailRegEx.test(email)) {
      setOtpError(t('login.emailInvalid'));
      return;
    }

    if (isResend) {
      setIsResending(true);
    } else {
      setLoading(true);
    }
    setOtpError(null);

    try {
      const response = await loginWithOTP({
        tenant: tenant.name,
        eMail: email.trim(),
      });

      if (response.resultCode === 0) {
        add(
          createAlertOptions({
            description: isResend ? t('login.otpResent') : t('login.otpSent'),
            severity: 'success',
          })
        );
        setOtpEmail(email.trim());
        setOtpSent(true);
        setShowOtpCodeForm(true);
        startOtpTimer();
        setOtpSuccess(false);
      } else {
        setOtpError(response.resultMessage || t('login.otpSendError'));
      }
    } catch (err) {
      console.error('[OTP SEND]', err);
      setOtpError(t('login.otpSendError'));
    } finally {
      setLoading(false);
      setIsResending(false);
    }
  };

  // Validate OTP code
  const validateOtp = async (otp: string) => {
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
      const response = await validateOTPCode(
        otp,
        tenant.name,
        undefined,
        otpEmail.trim()
      );

      if (response.resultCode === 0) {
        setOtpSuccess(true);
        add(
          createAlertOptions({
            description: t('login.otpSuccess'),
            severity: 'success',
          })
        );

        // Add a small delay for better UX
        setTimeout(async () => {
          try {
            // Call the get user with the new token
            const { user, ...resp } = await pwlGetCurrentUser(
              response.newSessionToken
            );

            if (!user.age || !user.tnCAndPPAccepted) {
              setUser(user);
              setBirthDate(user?.birthDate ?? '');
              setTnCAndPPAccepted(user?.tnCAndPPAccepted ?? false);
              setPAndCUAccepted(user?.pAndCUAccepted ?? false);
              setNeedsMissingData({
                token: response.newSessionToken,
                birthDate: !user.age,
                tnCAndPPAccepted: !user.tnCAndPPAccepted,
              });
            } else {
              onLogin(user, response.newSessionToken);
            }
          } catch (err) {
            console.error('[GET USER]', err);
            add(
              createAlertOptions({
                description: t('login.userFetchError'),
                severity: 'error',
              })
            );
          }
        }, 1000);

        // Reset states
        setTimeout(() => {
          setShowOtpForm(false);
          setShowOtpCodeForm(false);
          setOtpCode('');
          setOtpEmail('');
          setOtpSent(false);
          setOtpSuccess(false);
        }, 2000);
      } else {
        // Handle specific error codes
        if (response.resultCode === -107) {
          setOtpError(t('login.otpNotFound'));
        } else if (response.resultCode === -108) {
          setOtpError(t('login.otpExpired'));
        } else if (response.resultCode === -109) {
          setOtpError(t('login.otpMissing'));
        } else {
          setOtpError(response.resultMessage || t('login.otpInvalid'));
        }
      }
    } catch (err) {
      console.error('[OTP VALIDATION]', err);
      setOtpError(t('login.otpError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showOtpCodeForm && !loading) {
      window.setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 50);
    }
  }, [showOtpCodeForm, loading]);

  const handleOtpDigitChange = (index: number, value: string) => {
    const digits = value.replace(/\D/g, '');
    const current = otpCode.padEnd(4, ' ').split('');

    if (!digits.length) {
      current[index] = ' ';
      setOtpCode(current.join('').replace(/\s/g, ''));
      setOtpError(null);
      return;
    }

    if (digits.length > 1) {
      const next = [...current];
      digits
        .slice(0, 4)
        .split('')
        .forEach((digit, i) => {
          if (index + i < 4) {
            next[index + i] = digit;
          }
        });
      const nextCode = next.join('').replace(/\s/g, '').slice(0, 4);
      setOtpCode(nextCode);
      setOtpError(null);
      const nextFocus = Math.min(index + digits.length, 3);
      otpInputRefs.current[nextFocus]?.focus();
      setOtpFocusedIndex(nextFocus);
      if (nextCode.length === 4 && otpEmail.trim().length > 0) {
        validateOtp(nextCode);
      }
      return;
    }

    current[index] = digits[0];
    const nextCode = current.join('').replace(/\s/g, '').slice(0, 4);
    setOtpCode(nextCode);
    setOtpError(null);
    if (nextCode.length === 4 && otpEmail.trim().length > 0) {
      validateOtp(nextCode);
    }
    if (index < 3) {
      otpInputRefs.current[index + 1]?.focus();
      setOtpFocusedIndex(index + 1);
    }
  };

  const handleOtpDigitKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
      setOtpFocusedIndex(index - 1);
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      otpInputRefs.current[index - 1]?.focus();
      setOtpFocusedIndex(index - 1);
    }

    if (event.key === 'ArrowRight' && index < 3) {
      event.preventDefault();
      otpInputRefs.current[index + 1]?.focus();
      setOtpFocusedIndex(index + 1);
    }
  };

  // Handle email input change
  const handleEmailChange = (value: string) => {
    setOtpEmail(value);
    setOtpError(null);
    setEmailValid(mailRegEx.test(value));
  };

  // Handle resend OTP
  const handleResendOtp = () => {
    if (otpEmail && mailRegEx.test(otpEmail)) {
      sendOtpToEmail(otpEmail, true);
    }
  };

  // Start OTP timer
  const startOtpTimer = () => {
    setOtpTimer(60);
  };

  const updateMissingData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user?.userID || !needsMissingData?.token) {
      setError(t('login.userNotFound'));
      return;
    }
    if (!birthDate || !tnCAndPPAccepted) {
      setError(t('missingData'));
      return;
    }

    let newUser: Partial<User> = {
      userID: user.userID,
      birthDate:
        user?.birthDate || !needsMissingData.birthDate ? undefined : birthDate,
      tnCAndPPAccepted: tnCAndPPAccepted || user?.tnCAndPPAccepted,
      tnCAndPPAcceptanceDate: tnCAndPPAccepted
        ? new Date().toISOString()
        : undefined,
      pAndCUAccepted: pAndCUAccepted || user?.pAndCUAccepted,
      pAndCUAcceptanceDate: pAndCUAccepted
        ? new Date().toISOString()
        : undefined,
    };

    const { user: patchedUser, ...resp } = await pwlUpdateUser(
      needsMissingData.token,
      user.userID,
      newUser
    );
    if (resp.resultCode !== 0) {
      console.error(resp);
      add(
        createAlertOptions({
          description: t(getErrori18nKey(resp.resultCode)),
          severity: 'error',
        })
      );
      setError(resp.resultMessage);
    } else {
      add(
        createAlertOptions({ description: t('success'), severity: 'success' })
      );
      onLogin(patchedUser || newUser, needsMissingData.token);
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      className={cx('memori--login-drawer', {
        'memori--login-drawer--logged': isUserLoggedIn,
        'memori--login-drawer--signup': showSignup,
      })}
      size="lg"
      title={t('login.title')}
    >
      {needsMissingData?.token?.length ? (
        <>
          <h3>{t('login.missingData')}</h3>
          <p>{t('login.missingDataHelper')}</p>

          <Form
            name="updateMissingData"
            className="memori--login-drawer--form"
            onSubmit={updateMissingData}
          >
            {needsMissingData.birthDate && (
              <>
                <label htmlFor="#birthDate">
                  {t('login.birthDate')}
                  <Input
                    id="birthDate"
                    name="birthDate"
                    type={
                      isMobileViewport && !birthDate && !isBirthDateFocused
                        ? 'text'
                        : 'date'
                    }
                    required
                    onChange={e => setBirthDate(e.target.value)}
                    value={birthDate}
                    placeholder={
                      isMobileViewport ? t('login.birthDatePlaceholder') || 'DD/MM/YYYY' : undefined
                    }
                    onFocus={() => setIsBirthDateFocused(true)}
                    onBlur={() => setIsBirthDateFocused(false)}
                    autoComplete="bday"
                  />
                </label>
                <p>
                  <small>{t('login.birthDateHelper')}</small>
                </p>
              </>
            )}

            {needsMissingData?.tnCAndPPAccepted && (
              <>
                <label className="memori-checkbox">
                  <span className="memori-checkbox--input-wrapper">
                    <Checkbox
                      name="tnCAndPPAccepted"
                      checked={tnCAndPPAccepted}
                      onChange={checked => setTnCAndPPAccepted(checked)}
                    />
                  </span>
                  <span className="memori-checkbox--text">
                    {t('login.privacyLabel')}{' '}
                    <a
                      href={`https://memori.ai/${lang}/privacy_and_cookie`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('login.privacyAndCookiePolicy')}
                    </a>{' '}
                    {t('login.and')}{' '}
                    <a
                      href={`https://memori.ai/${lang}/tos`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('login.termsOfService')}
                    </a>
                  </span>
                </label>

                <label className="memori-checkbox">
                  <span className="memori-checkbox--input-wrapper">
                    <Checkbox
                      name="pAndCUAccepted"
                      checked={pAndCUAccepted}
                      onChange={checked => setPAndCUAccepted(checked)}
                    />
                  </span>
                  <span className="memori-checkbox--text">
                    {t('login.pAndCUAccepted')}{' '}
                    <small>
                      <em>({t('login.optional')})</em>
                    </small>
                  </span>
                </label>
                <p>
                  <small>{t('login.goToAccountToChangeYourPreferences')}</small>
                </p>
                <p>
                  <small>{t('login.deepThoughtExplaination')}</small>
                </p>
              </>
            )}

            {error && (
              <p className="memori--login-drawer--inline-error">{error}</p>
            )}

            <Button type="submit" variant="primary" loading={loading}>
              {t('login.save')}
            </Button>
          </Form>
        </>
      ) : showOtpCodeForm ? (
        <>
          <Card
            className="memori--login-drawer--otp-card memori--login-drawer--otp-card--code"
            variant="flat"
            padding="md"
            title={
              otpSuccess ? (
                <span className="memori--login-drawer--otp-card-title">
                  <span
                    className="memori--login-drawer--otp-icon"
                    aria-hidden="true"
                  >
                    <Check className="icon" />
                  </span>
                  {t('login.otpTitle')}
                </span>
              ) : (
                t('login.otpTitle')
              )
            }
            description={
              otpSuccess
                ? t('login.otpSuccessMessage')
                : t('login.otpCodeDescription', { email: otpEmail })
            }
          >
            {!otpSuccess && (
              <div
                className={cx(
                  'memori--login-drawer--otp-form memori--login-drawer--otp-form--code',
                  { loading }
                )}
              >
                <label
                  htmlFor="otp-code"
                  className="memori--login-drawer--otp-label"
                >
                  <span
                    className="memori--login-drawer--otp-label-text"
                    style={{ textAlign: 'center' }}
                  >
                    {t('login.otpCode')}
                  </span>
                  <div className="memori--login-drawer--otp-segmented-inputs">
                    {[0, 1, 2, 3].map(index => (
                      <Input
                        key={index}
                        id={index === 0 ? 'otp-code' : `otp-code-${index}`}
                        name={`otp-code-${index}`}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        enterKeyHint={index === 3 ? 'done' : 'next'}
                        autoComplete={index === 0 ? 'one-time-code' : 'off'}
                        spellCheck={false}
                        className={cx('memori--login-drawer--otp-digit-input', {
                          active: otpFocusedIndex === index,
                          success: otpCode.length === 4 && !otpError,
                          error: otpError,
                          loading: loading,
                        })}
                        value={otpCode[index] || ''}
                        onChange={e =>
                          handleOtpDigitChange(index, e.target.value)
                        }
                        onFocus={() => setOtpFocusedIndex(index)}
                        onKeyDown={e => handleOtpDigitKeyDown(index, e)}
                        maxLength={1}
                        required
                        disabled={loading}
                        aria-describedby="otp-help"
                        ref={el => {
                          otpInputRefs.current[index] = el;
                        }}
                      />
                    ))}
                  </div>
                </label>
              </div>
            )}

            {otpTimer && otpTimer > 0 && !otpSuccess && (
              <div className="memori--login-drawer--otp-timer">
                {/* <span className="memori--login-drawer--otp-timer-icon">⏱️</span> */}
                <span>{t('login.otpTimer', { seconds: otpTimer })}</span>
              </div>
            )}

            {!otpSuccess && (
              <div className="memori--login-drawer--otp-actions">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowOtpCodeForm(false);
                    setOtpCode('');
                    setOtpError(null);
                  }}
                  disabled={loading}
                  icon={<ArrowLeftIcon className="icon" />}
                >
                  {t('login.backToEmail')}
                </Button>

                <Button
                  variant="ghost"
                  onClick={handleResendOtp}
                  disabled={
                    loading ||
                    isResending ||
                    (otpTimer && otpTimer > 0) ||
                    !otpEmail
                  }
                  loading={isResending}
                  icon={<RefreshCcwIcon className="icon" />}
                >
                  {isResending ? t('login.resending') : t('login.resendOtp')}
                </Button>
              </div>
            )}
            {otpError && (
              <div role="alert" className="memori--login-drawer--otp-error">
                <span
                  className="memori--login-drawer--otp-error-icon"
                  aria-hidden="true"
                >
                  <AlertTriangle className="icon" />
                </span>
                <span>{otpError}</span>
              </div>
            )}
          </Card>
        </>
      ) : showOtpForm ? (
        <>
          <Card
            className="memori--login-drawer--otp-card"
            variant="flat"
            padding="md"
            title={
              <h3 className="memori--login-drawer--otp-card-heading">
                {t('login.otpEmailTitle')}
              </h3>
            }
            description={t('login.otpEmailDescription')}
          >
            <div className={cx('memori--login-drawer--otp-form', { loading })}>
              <label
                htmlFor="otp-email"
                className="memori--login-drawer--otp-label"
              >
                <span className="memori--login-drawer--otp-label-text">
                  {t('login.email')}
                </span>
                <div className="memori--login-drawer--otp-input-container">
                  <Input
                    id="otp-email"
                    name="email"
                    type="email"
                    className={cx('memori--login-drawer--otp-email-input', {
                      error: otpError && !mailRegEx.test(otpEmail),
                      valid: emailValid && !otpError,
                      loading: loading,
                    })}
                    value={otpEmail}
                    onChange={e => handleEmailChange(e.target.value)}
                    placeholder={
                      t('login.emailPlaceholder') || 'Enter your email…'
                    }
                    autoComplete="email"
                    spellCheck={false}
                    required
                    disabled={loading}
                    aria-describedby="email-help"
                  />
                  {emailValid && !loading && (
                    <div
                      className="memori--login-drawer--otp-valid-icon"
                      aria-hidden="true"
                    >
                      <Check className="icon" />
                    </div>
                  )}
                </div>
              </label>
            </div>

            <div className="memori--login-drawer--otp-actions memori--login-drawer--otp-actions-primary">
              <Button
                variant="primary"
                onClick={() => {
                  sendOtpToEmail(otpEmail);
                }}
                disabled={loading || !emailValid}
                loading={loading}
                size="lg"
              >
                {t('login.sendOtp')}
              </Button>
            </div>

            {otpError && (
              <div role="alert" className="memori--login-drawer--otp-error">
                <span
                  className="memori--login-drawer--otp-error-icon"
                  aria-hidden="true"
                >
                  <AlertTriangle className="icon" size={24} />
                </span>
                <span>{otpError}</span>
              </div>
            )}
          </Card>
        </>
      ) : null}
    </Drawer>
  );
};

export default LoginDrawer;
