import { User, Tenant } from '@memori.ai/memori-api-client/dist/types';
import React, { useEffect, useState } from 'react';
import Button from '../ui/Button';
import Drawer from '../ui/Drawer';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import memoriApiClient from '@memori.ai/memori-api-client';
import { getErrori18nKey } from '../../helpers/error';
import { mailRegEx, pwdRegEx } from '../../helpers/utils';
import SignupForm from '../SignupForm/SignupForm';

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
  __TEST__waitingForOtp?: boolean;
  setUser: (user: User) => void;
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
  __TEST__waitingForOtp = false,
}: Props) => {
  const { t, i18n } = useTranslation();
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
  const [birthDate, setBirthDate] = useState<string>('');
  const [tnCAndPPAccepted, setTnCAndPPAccepted] = useState(false);
  const [pAndCUAccepted, setPAndCUAccepted] = useState(false);

  const [showSignup, setShowSignup] = useState(__TEST__signup);
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
        toast.success(isResend ? t('login.otpResent') : t('login.otpSent'));
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
        toast.success(t('login.otpSuccess'));

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
            toast.error(t('login.userFetchError'));
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

  // Handle OTP input change
  const handleOtpChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 4);
    setOtpCode(numericValue);
    setOtpError(null);

    if (numericValue.length === 4 && otpEmail.trim().length > 0) {
      validateOtp(numericValue);
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
      toast.error(t(getErrori18nKey(resp.resultCode)));
      setError(resp.resultMessage);
    } else {
      toast.success(t('success'));
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
    >
      {needsMissingData?.token?.length ? (
        <>
          <h3>{t('login.missingData')}</h3>
          <p>{t('login.missingDataHelper')}</p>

          <form
            className="memori--login-drawer--form"
            onSubmit={updateMissingData}
          >
            {needsMissingData.birthDate && (
              <>
                <label htmlFor="#birthDate">
                  {t('login.birthDate')}
                  <input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    required
                    onChange={e => setBirthDate(e.target.value)}
                    value={birthDate}
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
                    <input
                      type="checkbox"
                      name="tnCAndPPAccepted"
                      className="memori-checkbox--input"
                      onChange={e => setTnCAndPPAccepted(e.target.checked)}
                      checked={tnCAndPPAccepted}
                    />
                    <span className="memori-checkbox--inner" />
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
                    <input
                      type="checkbox"
                      name="pAndCUAccepted"
                      onChange={e => setPAndCUAccepted(e.target.checked)}
                      checked={pAndCUAccepted}
                      className="memori-checkbox--input"
                    />
                    <span className="memori-checkbox--inner" />
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

            <Button htmlType="submit" primary loading={loading}>
              {t('login.save')}
            </Button>
          </form>
        </>
      ) : showSignup ? (
        <SignupForm
          tenant={tenant}
          apiClient={apiClient}
          onLogin={(_user: User, token: string) => {
            // Force all signup users to go through missing data flow
            // This ensures consistent user experience and data collection
            setNeedsMissingData({
              token: token,
              birthDate: true, // Always require birth date for new users
              tnCAndPPAccepted: true, // Always require terms acceptance for new users
            });
          }}
          goToLogin={() => setShowSignup(false)}
          __TEST__waitingForOtp={__TEST__waitingForOtp}
        />
      ) : showOtpCodeForm ? (
        <>
          <div className="memori--login-drawer--otp-container">
            <div className="memori--login-drawer--otp-header">
              {otpSuccess && (
                <div className="memori--login-drawer--otp-icon">✅</div>
              )}
              <h3>{t('login.otpTitle')}</h3>
              <p className="memori--login-drawer--otp-description">
                {otpSuccess
                  ? t('login.otpSuccessMessage')
                  : t('login.otpCodeDescription', { email: otpEmail })}
              </p>
            </div>

            {!otpSuccess && (
              <div
                className={cx('memori--login-drawer--otp-form', { loading })}
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
                  <div className="memori--login-drawer--otp-input-container">
                    <input
                      id="otp-code"
                      type="text"
                      className={cx('memori--login-drawer--otp-input', {
                        success: otpCode.length === 4 && !otpError,
                        error: otpError,
                        loading: loading,
                      })}
                      value={otpCode}
                      onChange={e => handleOtpChange(e.target.value)}
                      placeholder="0000"
                      maxLength={4}
                      autoComplete="one-time-code"
                      required
                      disabled={loading}
                      aria-describedby="otp-help"
                    />
                    {loading && (
                      <div className="memori--login-drawer--otp-loading">
                        <div className="memori--login-drawer--otp-spinner"></div>
                      </div>
                    )}
                  </div>
                  <small
                    id="otp-help"
                    className="memori--login-drawer--otp-help"
                  >
                    {t('login.otpHelp')}
                  </small>
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
                  outlined
                  onClick={() => {
                    setShowOtpCodeForm(false);
                    setOtpCode('');
                    setOtpError(null);
                  }}
                  disabled={loading}
                >
                  {t('login.backToEmail')}
                </Button>

                <Button
                  outlined
                  onClick={handleResendOtp}
                  disabled={
                    loading ||
                    isResending ||
                    (otpTimer && otpTimer > 0) ||
                    !otpEmail
                  }
                  loading={isResending}
                >
                  {isResending ? t('login.resending') : t('login.resendOtp')}
                </Button>
              </div>
            )}

            {otpError && (
              <div role="alert" className="memori--login-drawer--otp-error">
                <span className="memori--login-drawer--otp-error-icon">⚠️</span>
                <span>{otpError}</span>
              </div>
            )}
          </div>
        </>
      ) : showOtpForm ? (
        <>
          <div className="memori--login-drawer--otp-container">
            <div className="memori--login-drawer--otp-header">
              {/* <div className="memori--login-drawer--otp-icon">📧</div> */}
              <h3>{t('login.otpEmailTitle')}</h3>
              <p className="memori--login-drawer--otp-description">
                {t('login.otpEmailDescription')}
              </p>
            </div>

            <div className={cx('memori--login-drawer--otp-form', { loading })}>
              <label
                htmlFor="otp-email"
                className="memori--login-drawer--otp-label"
              >
                <span className="memori--login-drawer--otp-label-text">
                  {t('login.email')}
                </span>
                <div className="memori--login-drawer--otp-input-container">
                  <input
                    id="otp-email"
                    type="email"
                    className={cx('memori--login-drawer--otp-email-input', {
                      error: otpError && !mailRegEx.test(otpEmail),
                      valid: emailValid && !otpError,
                      loading: loading,
                    })}
                    value={otpEmail}
                    onChange={e => handleEmailChange(e.target.value)}
                    placeholder={
                      t('login.emailPlaceholder') || 'Enter your email'
                    }
                    autoComplete="email"
                    required
                    disabled={loading}
                    aria-describedby="email-help"
                  />
                  {emailValid && !loading && (
                    <div className="memori--login-drawer--otp-valid-icon">
                      ✓
                    </div>
                  )}
                  {loading && (
                    <div className="memori--login-drawer--otp-loading">
                      <div className="memori--login-drawer--otp-spinner"></div>
                    </div>
                  )}
                </div>
              </label>
            </div>

            <div className="memori--login-drawer--otp-actions">
             {showOtpCodeForm && <Button
                outlined
                onClick={() => {
                  setShowOtpForm(false);
                  setOtpEmail('');
                  setOtpError(null);
                  setEmailValid(false);
                }}
                disabled={loading}
              >
                {t('login.backToLogin')}
              </Button>}

              <Button
                primary
                onClick={() => {
                  sendOtpToEmail(otpEmail);
                }}
                disabled={loading || !emailValid}
                loading={loading}
              >
                {t('login.sendOtp')}
              </Button>
            </div>

            {otpError && (
              <div role="alert" className="memori--login-drawer--otp-error">
                <span className="memori--login-drawer--otp-error-icon">⚠️</span>
                <span>{otpError}</span>
              </div>
            )}
          </div>
        </>
      ) : null}
    </Drawer>
  );
};

export default LoginDrawer;
