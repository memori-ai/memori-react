import { User, Tenant } from '@memori.ai/memori-api-client/dist/types';
import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Checkbox,
  Modal,
  Input,
  useAlertManager,
  createAlertOptions,
  Form,
  Field,
} from '@memori.ai/ui';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import memoriApiClient from '@memori.ai/memori-api-client';
import { getErrori18nKey } from '../../helpers/error';
import { mailRegEx } from '../../helpers/utils';

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
  /** Optional class for the modal root (e.g. for z-index when layout is WEBSITE_ASSISTANT). */
  modalClassName?: string;
  /** Agent name used in the login benefit line. */
  memoriName?: string;
}

const LoginModal = ({
  open = false,
  onClose,
  onLogin,
  user,
  loginToken: _loginToken,
  setUser,
  tenant,
  apiClient,
  __TEST__signup: _signup = false,
  __TEST__needMissingData = false,
  modalClassName,
  memoriName,
  onLogout: _onLogout,
}: Props) => {
  const { t, i18n } = useTranslation();
  const { add } = useAlertManager();
  const lang = i18n.language === 'it' ? 'it' : 'en';

  const { pwlUpdateUser, loginWithOTP, validateOTPCode, pwlGetCurrentUser } =
    apiClient.backend;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [otpCode, setOtpCode] = useState<string>('');
  const [otpEmail, setOtpEmail] = useState<string>('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [showOtpCodeForm, setShowOtpCodeForm] = useState(false);
  const [otpResendCooldown, setOtpResendCooldown] = useState<number | null>(
    null
  );
  const [isResending, setIsResending] = useState(false);
  const [otpFocusedIndex, setOtpFocusedIndex] = useState(0);
  const [birthDate, setBirthDate] = useState<string>('');
  const [isBirthDateFocused, setIsBirthDateFocused] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [tnCAndPPAccepted, setTnCAndPPAccepted] = useState(false);
  const [pAndCUAccepted, setPAndCUAccepted] = useState(false);
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const validatingRef = useRef(false);
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

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpResendCooldown != null && otpResendCooldown > 0) {
      interval = setInterval(() => {
        setOtpResendCooldown(prev => (prev != null && prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpResendCooldown]);

  useEffect(() => {
    if (otpResendCooldown === 0) {
      setOtpResendCooldown(null);
    }
  }, [otpResendCooldown]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const onChange = () => setIsMobileViewport(mediaQuery.matches);
    onChange();
    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  const sendOtpToEmail = async (email: string, isResend = false) => {
    const trimmed = email.trim();
    if (!trimmed) {
      setOtpError(t('login.emailRequired'));
      return;
    }
    if (!mailRegEx.test(trimmed)) {
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
        eMail: trimmed,
      });

      if (response.resultCode === 0) {
        setOtpEmail(trimmed);
        setShowOtpCodeForm(true);
        setOtpResendCooldown(60);
        setOtpCode('');
        setOtpFocusedIndex(0);
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

  const validateOtp = async (otp: string) => {
    if (validatingRef.current) return;

    if (!otp || otp.length !== 4) {
      setOtpError(t('login.otpInvalidFormat'));
      return;
    }

    if (!otpEmail || otpEmail.trim().length === 0) {
      setOtpError(t('login.emailRequired'));
      return;
    }

    validatingRef.current = true;
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
        try {
          const { user: fetchedUser } = await pwlGetCurrentUser(
            response.newSessionToken
          );

          if (!fetchedUser.age || !fetchedUser.tnCAndPPAccepted) {
            setUser(fetchedUser);
            setBirthDate(fetchedUser?.birthDate ?? '');
            setTnCAndPPAccepted(fetchedUser?.tnCAndPPAccepted ?? false);
            setPAndCUAccepted(fetchedUser?.pAndCUAccepted ?? false);
            setNeedsMissingData({
              token: response.newSessionToken,
              birthDate: !fetchedUser.age,
              tnCAndPPAccepted: !fetchedUser.tnCAndPPAccepted,
            });
            setShowOtpCodeForm(false);
            setOtpCode('');
          } else {
            setShowOtpCodeForm(false);
            setOtpCode('');
            setOtpEmail('');
            onLogin(fetchedUser, response.newSessionToken);
          }
        } catch (err) {
          console.error('[GET USER]', err);
          setOtpError(t('login.userFetchError'));
        }
      } else if (response.resultCode === -107) {
        setOtpError(t('login.otpNotFound'));
      } else if (response.resultCode === -108) {
        setOtpError(t('login.otpExpired'));
        setOtpResendCooldown(null);
      } else if (response.resultCode === -109) {
        setOtpError(t('login.otpInvalid'));
        setOtpCode('');
        setOtpFocusedIndex(0);
        window.setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 50);
      } else if (response.resultCode === -110) {
        setOtpError(t('login.otpAttemptsExceeded'));
        setOtpCode('');
        setOtpResendCooldown(null);
        setShowOtpCodeForm(false);
      } else {
        setOtpError(response.resultMessage || t('login.otpInvalid'));
      }
    } catch (err) {
      console.error('[OTP VALIDATION]', err);
      setOtpError(t('login.otpError'));
    } finally {
      setLoading(false);
      validatingRef.current = false;
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

  const handleOtpDigitPaste = (
    index: number,
    event: React.ClipboardEvent<HTMLInputElement>
  ) => {
    const pasted = event.clipboardData.getData('text');
    const digits = pasted.replace(/\D/g, '').slice(0, 4);

    if (!digits.length) return;

    event.preventDefault();

    const current = otpCode.padEnd(4, ' ').split('');
    digits.split('').forEach((digit, i) => {
      if (index + i < 4) {
        current[index + i] = digit;
      }
    });

    const nextCode = current.join('').replace(/\s/g, '').slice(0, 4);
    setOtpCode(nextCode);
    setOtpError(null);

    const nextFocus = Math.min(index + digits.length, 3);
    otpInputRefs.current[nextFocus]?.focus();
    setOtpFocusedIndex(nextFocus);

    if (nextCode.length === 4 && otpEmail.trim().length > 0) {
      validateOtp(nextCode);
    }
  };

  const handleEmailChange = (value: string) => {
    setOtpEmail(value);
    setOtpError(null);
  };

  const handleResendOtp = () => {
    if (otpEmail && mailRegEx.test(otpEmail)) {
      sendOtpToEmail(otpEmail, true);
    }
  };

  const goBackToEmail = () => {
    setShowOtpCodeForm(false);
    setOtpCode('');
    setOtpError(null);
    setOtpResendCooldown(null);
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
      onLogin(patchedUser || newUser, needsMissingData.token);
    }
  };

  const agentName = memoriName?.trim() || t('login.defaultAgentName') || 'AI';
  const loginTitle = t('login.login') || 'Login';
  const codeComplete = otpCode.length === 4;
  const isMissingDataStep = !!needsMissingData?.token?.length;

  const emailStep = (
    <div className="memori--login-modal--step">
      <p className="memori--login-modal--benefit">
        {t('login.loginBenefitLine1', { memoriName: agentName })}
      </p>

      <Field.Root className="memori--login-modal--field">
        <Field.Label htmlFor="otp-email">{t('login.email')}</Field.Label>
        <Input
          id="otp-email"
          name="email"
          type="email"
          size="lg"
          className={cx('memori--login-modal--email-input', {
            error: !!otpError,
          })}
          value={otpEmail}
          onChange={e => handleEmailChange(e.target.value)}
          placeholder={t('login.emailPlaceholder') || 'Enter your email…'}
          autoComplete="email"
          spellCheck={false}
          required
          disabled={loading}
          aria-invalid={!!otpError}
          aria-describedby={otpError ? 'otp-email-error' : 'email-help'}
        />
        {otpError ? (
          <Field.Error id="otp-email-error">{otpError}</Field.Error>
        ) : (
          <p id="email-help" className="sr-only">
            {t('login.otpEmailDescription')}
          </p>
        )}
      </Field.Root>

      <Button
        variant="primary"
        className="memori--login-modal--primary"
        onClick={() => sendOtpToEmail(otpEmail)}
        disabled={loading}
        loading={loading}
        size="lg"
      >
        {t('login.sendOtp')}
      </Button>

      <p className="memori--login-modal--footnote">
        {t('login.passwordlessHint')}
      </p>
    </div>
  );

  const codeStep = (
    <div className="memori--login-modal--step">
      <p className="memori--login-modal--sent-copy">
        {t('login.otpSentToPrefix')}
      </p>
      <p className="memori--login-modal--email-row">
        <strong className="memori--login-modal--email-value">{otpEmail}</strong>{' '}
        <button
          type="button"
          className="memori--login-modal--edit-link"
          onClick={goBackToEmail}
          disabled={loading}
        >
          {t('login.editEmail')}
        </button>
      </p>

      <fieldset
        className="memori--login-modal--otp-fieldset"
        aria-describedby="otp-help"
      >
        <legend className="memori--login-modal--otp-label">
          {t('login.otpCodeShort')}
        </legend>
        <div className="memori--login-modal--otp-digits">
          {[0, 1, 2, 3].map(index => (
            <Input
              key={index}
              id={index === 0 ? 'otp-code' : `otp-code-${index}`}
              name={`otp-code-${index}`}
              aria-label={`${t('login.otpCode')} ${index + 1} / 4`}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              enterKeyHint={index === 3 ? 'done' : 'next'}
              autoComplete={index === 0 ? 'one-time-code' : 'off'}
              spellCheck={false}
              className={cx('memori--login-modal--otp-digit', {
                active: otpFocusedIndex === index,
                error: !!otpError,
              })}
              value={otpCode[index] || ''}
              onChange={e => handleOtpDigitChange(index, e.target.value)}
              onFocus={() => setOtpFocusedIndex(index)}
              onKeyDown={e => handleOtpDigitKeyDown(index, e)}
              onPaste={e => handleOtpDigitPaste(index, e)}
              maxLength={1}
              required
              disabled={loading}
              ref={el => {
                otpInputRefs.current[index] = el;
              }}
            />
          ))}
        </div>
        <p id="otp-help" className="sr-only">
          {t('login.otpCodeDescription', { email: otpEmail })}
        </p>
      </fieldset>

      {otpError && (
        <p role="alert" className="memori--login-modal--inline-error">
          {otpError}
        </p>
      )}

      <Button
        variant="primary"
        className="memori--login-modal--primary"
        onClick={() => validateOtp(otpCode)}
        disabled={loading || !codeComplete}
        loading={loading}
        size="lg"
      >
        {loginTitle}
      </Button>

      <p className="memori--login-modal--resend">
        {otpResendCooldown != null && otpResendCooldown > 0 ? (
          t('login.resendOtpPrompt', { seconds: otpResendCooldown })
        ) : (
          <>
            {t('login.resendOtpQuestion')}{' '}
            <button
              type="button"
              className="memori--login-modal--edit-link"
              onClick={handleResendOtp}
              disabled={loading || isResending || !otpEmail}
            >
              {isResending ? t('login.resending') : t('login.resendOtp')}
            </button>
          </>
        )}
      </p>
    </div>
  );

  const missingDataStep = (
    <div className="memori--login-modal--missing-data">
      <h3 className="memori--login-modal--missing-title">
        {t('login.missingData')}
      </h3>
      <p className="memori--login-modal--missing-helper">
        {t('login.missingDataHelper')}
      </p>

      <Form
        name="updateMissingData"
        className="memori--login-modal--form"
        onSubmit={updateMissingData}
      >
        {needsMissingData.birthDate && (
          <Field.Root className="memori--login-modal--field">
            <Field.Label htmlFor="birthDate">
              {t('login.birthDate')}
            </Field.Label>
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
                isMobileViewport
                  ? t('login.birthDatePlaceholder') || 'DD/MM/YYYY'
                  : undefined
              }
              onFocus={() => setIsBirthDateFocused(true)}
              onBlur={() => setIsBirthDateFocused(false)}
              autoComplete="bday"
            />
            <Field.Description>{t('login.birthDateHelper')}</Field.Description>
          </Field.Root>
        )}

        {needsMissingData?.tnCAndPPAccepted && (
          <>
            <Checkbox
              name="tnCAndPPAccepted"
              className="memori-login-modal--consent"
              checked={tnCAndPPAccepted}
              onChange={checked => setTnCAndPPAccepted(checked)}
              label={
                <>
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
                </>
              }
            />

            <Checkbox
              name="pAndCUAccepted"
              className="memori-login-modal--consent"
              checked={pAndCUAccepted}
              onChange={checked => setPAndCUAccepted(checked)}
              label={
                <>
                  {t('login.pAndCUAccepted')}{' '}
                  <small>
                    <em>({t('login.optional')})</em>
                  </small>
                </>
              }
            />
            <p>
              <small>{t('login.goToAccountToChangeYourPreferences')}</small>
            </p>
            <p>
              <small>{t('login.deepThoughtExplaination')}</small>
            </p>
          </>
        )}

        {error && <p className="memori--login-modal--inline-error">{error}</p>}

        <Button type="submit" variant="primary" loading={loading}>
          {t('login.save')}
        </Button>
      </Form>
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      onOpenChange={nextOpen => {
        if (!nextOpen) onClose();
      }}
      className={cx('memori--login-modal', modalClassName)}
      contentClassName="memori--login-modal--content"
      titleClassName="memori--login-modal--title"
      title={loginTitle}
      size="sm"
      width="420px"
      widthMd="420px"
      centered
      closable
    >
      {isMissingDataStep
        ? missingDataStep
        : showOtpCodeForm
        ? codeStep
        : emailStep}
    </Modal>
  );
};

export default LoginModal;
