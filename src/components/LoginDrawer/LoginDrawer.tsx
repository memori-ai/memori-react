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
import AccountForm from '../AccountForm/AccountForm';

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
  __TEST__changePwd?: boolean;
}

const LoginDrawer = ({
  open = false,
  onClose,
  onLogin,
  onLogout,
  user,
  loginToken,
  tenant,
  apiClient,
  __TEST__signup = false,
  __TEST__needMissingData = false,
  __TEST__waitingForOtp = false,
  __TEST__changePwd = false,
}: Props) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'it' ? 'it' : 'en';

  const { userLogin, updateUser } = apiClient.backend;

  const isUserLoggedIn = user?.userID && loginToken;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showSignup, setShowSignup] = useState(__TEST__signup);
  const [userMustChangePwd, setUserMustChangePwd] = useState<User | undefined>(
    __TEST__changePwd
      ? {
          flowID: 'flowID',
          tenant: tenant.id,
          eMail: 'email',
          userName: 'username',
          password: 'password',
        }
      : undefined
  );
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

  const login = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const userNameOrEmail = form.userNameOrEmail.value;
    const password = form.password.value;

    const isEmail = mailRegEx.test(userNameOrEmail);
    const user: User = isEmail
      ? {
          tenant: tenant?.id,
          eMail: userNameOrEmail,
          password: password,
        }
      : {
          tenant: tenant?.id,
          userName: userNameOrEmail,
          password: password,
        };
    setLoading(true);
    setError(null);
    userLogin(user)
      .then(data => {
        if (data.resultCode === -14) {
          setUserMustChangePwd({
            tenant: tenant.id,
            eMail: isEmail ? userNameOrEmail : undefined,
            userName: isEmail ? undefined : userNameOrEmail,
            password: password,
            flowID: (data.flowID || data.user?.flowID) as string,
          });
        } else if (data.resultCode !== 0) {
          console.error(data);
          toast.error(t(getErrori18nKey(data.resultCode)));
          setError(data.resultMessage);
        } else if (data.user && data.token) {
          if (!data.user?.tnCAndPPAccepted || !data.user?.birthDate) {
            setNeedsMissingData({
              token: data.token,
              birthDate: !data.user?.birthDate,
              tnCAndPPAccepted: !data.user?.tnCAndPPAccepted,
            });
          } else {
            onLogin(data.user as User, data.token);
          }
        }
      })
      .catch(err => {
        console.error('[LOGIN]', err);

        if (err.message) {
          toast.error(err.message);
          setError(err.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const updateMissingData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;

    const birthDate = form.birthDate?.value;
    const tnCAndPPAccepted = form.tnCAndPPAccepted?.checked;
    const pAndCUAccepted = form.pAndCUAccepted?.checked;

    if (!user?.userID || !needsMissingData?.token) {
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

    const { user: patchedUser, ...resp } = await updateUser(
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

  const changePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;

    const tenantID = form.tenant.value ?? tenant.id;
    const flowID = form.flowID.value ?? userMustChangePwd?.flowID;
    const eMail = form.eMail.value ?? userMustChangePwd?.eMail;
    const userName = form.userName.value ?? userMustChangePwd?.userName;
    const password = form.password.value ?? userMustChangePwd?.password;
    const newPassword = form.newPassword.value;

    if (!newPassword?.length || !pwdAcceptable) {
      setError(t('login.passwordFormatError'));
      return;
    }

    setLoading(true);

    const user: User = {
      tenant: tenantID,
      flowID,
      eMail,
      userName,
      password,
      newPassword,
    };

    try {
      const { user: patchedUser, token, ...resp } = await userLogin(user);

      if (resp.resultCode !== 0) {
        console.error(resp);
        toast.error(t(getErrori18nKey(resp.resultCode)));
        setError(resp.resultMessage);
      } else if (patchedUser && token) {
        toast.success(t('success'));
        onLogin(patchedUser || user, token);
      }
    } catch (e) {
      let err = e as Error;
      console.error('[LOGIN/CHANGE PWD]', err);

      if (err.message) {
        toast.error(err.message);
        setError(err.message);
      }
    } finally {
      setLoading(false);
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
      title={
        <span className="memori--login-drawer--title">
          {isUserLoggedIn
            ? t('login.loggedDrawerTitle', { name: user.userName })
            : showSignup
            ? t('login.signupDrawerTitle')
            : t('login.loginDrawerTitle')}
        </span>
      }
    >
      {isUserLoggedIn ? (
        <div className="memori--login-drawer--logged">
          {user.avatarURL && (
            <figure className="memori--login-drawer--avatar">
              <img src={user.avatarURL} alt={user.userName} />
            </figure>
          )}

          <Button
            primary
            onClick={() => {
              onLogout();
            }}
          >
            {t('login.logout')}
          </Button>

          <AccountForm
            user={user}
            loginToken={loginToken}
            apiClient={apiClient}
            onUserUpdate={user => onLogin(user, loginToken)}
          />
        </div>
      ) : needsMissingData?.token?.length ? (
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
                      defaultChecked={user?.pAndCUAccepted}
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

            <Button htmlType="submit" primary loading={loading}>
              {t('login.save')}
            </Button>
          </form>
        </>
      ) : userMustChangePwd?.flowID ? (
        <>
          <p>{t('login.mustChangePassword')}</p>

          <form
            className="memori--login-drawer--form"
            onSubmit={changePassword}
          >
            <input
              type="hidden"
              name="tenant"
              value={userMustChangePwd.tenant ?? tenant?.id}
            />
            <input
              type="hidden"
              name="flowID"
              value={userMustChangePwd.flowID}
            />
            <input type="hidden" name="eMail" value={userMustChangePwd.eMail} />
            <input
              type="hidden"
              name="userName"
              value={userMustChangePwd.userName}
            />
            <input
              type="hidden"
              name="password"
              value={userMustChangePwd.password}
            />

            <label htmlFor="#newPassword">
              {t('login.password')}
              <input
                id="newPassword"
                name="newPassword"
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

            <Button htmlType="submit" primary loading={loading}>
              {t('confirm')}
            </Button>
          </form>
        </>
      ) : showSignup ? (
        <SignupForm
          tenant={tenant}
          apiClient={apiClient}
          onLogin={onLogin}
          goToLogin={() => setShowSignup(false)}
          __TEST__waitingForOtp={__TEST__waitingForOtp}
        />
      ) : (
        <>
          <form className="memori--login-drawer--form" onSubmit={login}>
            <label htmlFor="#userNameOrEmail">
              {t('login.userNameOrEmail')}
              <input
                id="userNameOrEmail"
                name="userNameOrEmail"
                required
                autoComplete="email"
                placeholder="Username/email"
              />
            </label>

            <label htmlFor="#password">
              Password
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="password"
                placeholder="Password"
              />
            </label>

            <Button htmlType="submit" primary loading={loading}>
              {t('login.login')}
            </Button>

            {!tenant?.disableRegistration ? (
              <p className="memori--login-drawer--signup">
                {t('login.newUserSignUp')}{' '}
                <Button outlined onClick={() => setShowSignup(true)}>
                  {t('login.signUp')}
                </Button>
              </p>
            ) : tenant.adminEmail ? (
              <div className="memori--login-drawer--signup">
                <p>{t('login.registrationDisabled')}</p>
                <p>
                  {t('login.contactAdmin')}:{' '}
                  <a href={`mailto:${tenant.adminEmail}`}>
                    {tenant.adminEmail}
                  </a>
                </p>
              </div>
            ) : null}
          </form>

          {error && (
            <p role="alert" className="memori--login-drawer--error">
              {error}
            </p>
          )}
        </>
      )}
    </Drawer>
  );
};

export default LoginDrawer;
