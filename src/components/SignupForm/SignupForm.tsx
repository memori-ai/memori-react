import { User, Tenant } from '@memori.ai/memori-api-client/dist/types';
import React, { useEffect, useState } from 'react';
import Button from '../ui/Button';
import { useTranslation } from 'react-i18next';
import memoriApiClient from '@memori.ai/memori-api-client';
import toast from 'react-hot-toast';
import { mailRegEx, pwdRegEx, usernameRegEx } from '../../helpers/utils';
import { getErrori18nKey } from '../../helpers/error';

const reservedUserNames = [
  'memori',
  'private',
  'public',
  'api',
  '404',
  '500',
  'it',
  'en',
  'account',
  'auth',
  'logout',
  'privacy_and_cookie',
  'unauthorized',
  'users',
  'virtual_spaces',
];

export interface Props {
  tenant: Tenant;
  apiClient: ReturnType<typeof memoriApiClient>;
  onLogin: (user: User, token: string) => void;
  goToLogin: () => void;
  __TEST__waitingForOtp?: boolean;
}

const SignupForm = ({
  tenant,
  apiClient,
  onLogin,
  goToLogin,
  __TEST__waitingForOtp = false,
}: Props) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'it' ? 'it' : 'en';

  const { userSignUp, userConfirmSignUp, resendVerificationCode } =
    apiClient.backend;

  const [email, setEmail] = useState<string>();
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [confirmPassword, setConfirmPassword] = useState<string>();

  const pwdAcceptable = !password || (password && pwdRegEx.test(password));
  const pwdGreen = pwdAcceptable && password && password.length >= 24;
  const pwdEmpty = !password || password.length === 0;
  const pwdMeterValue =
    !pwdAcceptable || pwdEmpty
      ? 0
      : password.length < 8
      ? 15
      : password.length >= 32
      ? 100
      : (password.length - 8) * (50 / 24) + 50;

  const [loading, setLoading] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [waitingForOtp, setWaitingForOtp] = useState(__TEST__waitingForOtp);
  const [error, setError] = useState<string | null>(null);

  const [referral, setReferral] = useState<string>();
  useEffect(() => {
    setReferral(window.location.href);
  }, []);

  const generateUsernameFromEmail = (email: string) =>
    email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');

  const signup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;

    const tenantID = form.tenant.value ?? tenant.id;

    const eMail = (form.eMail.value ?? email).toLowerCase();
    const userName = form.userName.value ?? username;
    const password = form.password.value;

    const birthDate = new Date(form.birthDate?.value).toISOString();
    const tnCAndPPAccepted = form.tnCAndPPAccepted?.checked;
    const pAndCUAccepted = form.pAndCUAccepted?.checked;

    const referral = form.referral?.value;

    if (!eMail || !userName || !password || !birthDate || !tnCAndPPAccepted) {
      setError(t('missingData'));
      return;
    }

    setLoading(true);
    setError(null);

    const age =
      (new Date().getTime() - new Date(birthDate).getTime()) /
      1000 /
      60 /
      60 /
      24 /
      365;

    if (age < 14) {
      toast.error(t('login.underage', { age: 14 }));
      setError(t('login.underage', { age: 14 }));
      return;
    }

    try {
      const { user, ...resp } = await userSignUp({
        tenant: tenantID,
        eMail,
        userName,
        password,
        birthDate,
        tnCAndPPAccepted,
        tnCAndPPAcceptanceDate: new Date().toISOString(),
        pAndCUAccepted,
        pAndCUAcceptanceDate: new Date().toISOString(),
        referral,
      });
      if (resp.resultCode !== 0) {
        console.error(resp);
        toast.error(t(getErrori18nKey(resp.resultCode)));
      } else if (user) {
        toast.success(t('success'));
        setWaitingForOtp(true);
      }
    } catch (e) {
      let err = e as Error;
      console.error('[signup]', err);
      if (err?.message) toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!username) return;

    setLoadingOtp(true);

    try {
      const resp = await resendVerificationCode({
        tenant: tenant?.id,
        userName: username,
      });

      if (resp.resultCode === 0) {
        toast.success(t('resentVerificationCode'));
      } else {
        console.error(resp);
        toast.error(t(getErrori18nKey(resp.resultCode)));
      }
    } catch (e) {
      let err = e as Error;
      console.error('[resend otp]', err);
      if (err?.message) toast.error(err.message);
    } finally {
      setLoadingOtp(false);
    }
  };

  const validateOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;

    const tenantID = form.tenant.value ?? tenant.id;
    const userName = form.userName.value ?? username;
    const pwd = form.password.value ?? password;

    const verificationCode = form.verificationCode.value;

    setLoading(true);
    setError(null);

    try {
      const { user, token, ...resp } = await userConfirmSignUp({
        tenant: tenantID,
        userName,
        password: pwd,
        verificationCode,
      });

      if (resp.resultCode !== 0) {
        console.error(resp);
        toast.error(t(getErrori18nKey(resp.resultCode)));
      } else if (user && token) {
        toast.success(t('success'));
        onLogin(user, token);
      }
    } catch (e) {
      let err = e as Error;
      console.error('[validate otp]', err);
      if (err?.message) toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return waitingForOtp ? (
    <>
      <form className="memori--login-drawer--form" onSubmit={validateOtp}>
        <input type="hidden" name="userName" value={username} />
        <input type="hidden" name="password" value={password} />
        <input type="hidden" name="tenant" value={tenant.id} />

        <label htmlFor="#verificationCode">
          {t('login.otpCode')}
          <input
            id="verificationCode"
            name="verificationCode"
            type="text"
            required
            autoComplete="one-time-code"
            placeholder={t('login.otpCode') || 'OTP'}
          />
        </label>
        <p>
          <Button outlined onClick={resendOtp} loading={loadingOtp}>
            {t('login.resendVerificationCode')}
          </Button>
        </p>

        <Button htmlType="submit" primary loading={loading}>
          {t('confirm')}
        </Button>
      </form>
      {error && (
        <p role="alert" className="memori--login-drawer--error">
          {error}
        </p>
      )}
    </>
  ) : (
    <>
      <form className="memori--login-drawer--form" onSubmit={signup}>
        <input type="hidden" name="tenant" value={tenant.id} />
        <input type="hidden" name="referral" value={referral} />

        <label htmlFor="#eMail">
          {t('login.email')}
          <input
            type="email"
            name="eMail"
            id="eMail"
            required
            autoComplete="email"
            placeholder={t('login.email') || 'Email'}
            onChange={e => setEmail(e.target.value)}
            aria-invalid={!!email?.length && !mailRegEx.test(email)}
          />
        </label>
        {!!email?.length && !mailRegEx.test(email) && (
          <p className="memori--login-drawer--inline-error">
            {t('login.emailFormatError')}
          </p>
        )}

        <label htmlFor="userName">
          {t('login.username')}
          <input
            type="text"
            name="userName"
            id="userName"
            required
            autoComplete="username"
            placeholder={t('login.username') || 'Username'}
            onFocus={() => {
              if (!username?.length && !!email?.length) {
                let username = generateUsernameFromEmail(email);
                const field = document.getElementById(
                  'userName'
                ) as HTMLInputElement | null;
                if (field) {
                  field.value = username;
                  setUsername(username);
                }
              }
            }}
            onChange={e => setUsername(e.target.value)}
            aria-invalid={
              !!username?.length &&
              (reservedUserNames.includes(username.toLowerCase()) ||
                !usernameRegEx.test(username))
            }
          />
        </label>
        {!!username?.length &&
          reservedUserNames.includes(username.toLowerCase()) && (
            <p className="memori--login-drawer--inline-error">
              {t('login.usernameContainsReservedWord')}
            </p>
          )}
        {!!username?.length && !usernameRegEx.test(username) && (
          <p className="memori--login-drawer--inline-error">
            {t('login.usernameFormatError')}
          </p>
        )}

        <label htmlFor="#birthDate">
          {t('login.birthDate')}
          <input
            id="birthDate"
            name="birthDate"
            type="date"
            required
            autoComplete="bday"
          />
        </label>
        <p>
          <small>{t('login.birthDateHelper')}</small>
        </p>

        <label htmlFor="#password">
          {t('login.password')}
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            placeholder={t('login.password') || 'Password'}
            onChange={e => setPassword(e.target.value)}
            aria-invalid={!pwdAcceptable}
          />
        </label>
        {!pwdAcceptable && (
          <p className="memori--login-drawer--inline-error">
            {t('login.passwordFormatError')}
          </p>
        )}

        <label htmlFor="#confirm-password">
          {t('login.confirmPassword')}
          <input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            placeholder={t('login.confirmPassword') || 'Password'}
            onChange={e => setConfirmPassword(e.target.value)}
            aria-invalid={
              !!password?.length &&
              !!confirmPassword?.length &&
              password !== confirmPassword
            }
          />
        </label>
        {!!password?.length &&
          !!confirmPassword?.length &&
          password !== confirmPassword && (
            <p className="memori--login-drawer--inline-error">
              {t('login.passwordMatchingError')}
            </p>
          )}

        <meter
          className="memori--login-drawer--password-meter"
          min={0}
          low={33}
          high={66}
          optimum={80}
          max={100}
          value={pwdMeterValue}
          id="password-strength-meter"
        />
        <small>
          {t(
            `login.pwd${
              pwdGreen ? 'Strong' : pwdAcceptable ? 'Acceptable' : 'Weak'
            }`
          )}
        </small>

        <label className="memori-checkbox">
          <span className="memori-checkbox--input-wrapper">
            <input
              type="checkbox"
              name="tnCAndPPAccepted"
              required
              className="memori-checkbox--input"
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
          <small>{t('login.deepThoughtExplaination')}</small>
        </p>

        <Button htmlType="submit" primary loading={loading}>
          {t('login.signUp')}
        </Button>

        <p className="memori--login-drawer--signup">
          {t('login.alreadyHaveAnAccount')}{' '}
          <Button outlined onClick={goToLogin}>
            {t('login.backToLogin')}
          </Button>
        </p>
      </form>

      {error && (
        <p role="alert" className="memori--login-drawer--error">
          {error}
        </p>
      )}
    </>
  );
};

export default SignupForm;
