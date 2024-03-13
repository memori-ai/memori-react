import { User, Tenant } from '@memori.ai/memori-api-client/dist/types';
import React, { useEffect, useState } from 'react';
import Button from '../ui/Button';
import Drawer from '../ui/Drawer';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import memoriApiClient from '@memori.ai/memori-api-client';
import { getErrori18nKey } from '../../helpers/error';

export const mailRegEx = /^\w+([.-]?[+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;

export interface Props {
  open?: boolean;
  onClose: () => void;
  user?: User;
  loginToken?: string;
  onLogin: (user: User, token: string) => void;
  onLogout: () => void;
  tenant: Tenant;
  apiUrl: string;
  __TEST__needMissingData?: boolean;
}

const LoginDrawer = ({
  open = false,
  onClose,
  onLogin,
  onLogout,
  user,
  loginToken,
  tenant,
  apiUrl,
  __TEST__needMissingData = false,
}: Props) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'it' ? 'it' : 'en';

  const client = memoriApiClient(apiUrl);
  const { userLogin, updateUser } = client.backend;

  const [loading, setLoading] = useState(false);
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
  const [error, setError] = useState<string | null>(null);

  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  useEffect(() => {
    setRedirectTo(window.location.href);
  }, []);

  const isUserLoggedIn = user && loginToken;

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
        if (data.resultCode !== 0) {
          console.error(data);
          toast.error(t(getErrori18nKey(data.resultCode), { ns: 'common' }));
          setError(data.resultMessage);
        } else if (data.user && data.token) {
          onLogin(data.user as User, data.token);

          if (!data.user?.tnCAndPPAccepted || !data.user?.birthDate) {
            setNeedsMissingData({
              token: data.token,
              birthDate: !data.user?.birthDate,
              tnCAndPPAccepted: !data.user?.tnCAndPPAccepted,
            });
          }
        }
      })
      .catch(err => {
        console.error('[LOGIN]', err);
        toast.error(err);

        if (err.message) setError(err.message);
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
      toast.error(t(getErrori18nKey(resp.resultCode), { ns: 'common' }));
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
      })}
      title={
        <h2 className="memori--login-drawer--title">
          {isUserLoggedIn
            ? t('login.loggedDrawerTitle', { name: user.userName })
            : t('login.loginDrawerTitle')}
        </h2>
      }
    >
      {isUserLoggedIn ? (
        <div className="memori--login-drawer--logged">
          <Button
            primary
            onClick={() => {
              onLogout();
            }}
          >
            {t('login.logout')}
          </Button>
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

            {!tenant?.disableRegistration && (
              <p className="memori--login-drawer--signup">
                {t('login.newUserSignUp')}{' '}
                <a
                  href={`https://${
                    tenant.name || 'www.aisuru.com'
                  }/${lang}/auth?signup=1&redirectTo=${redirectTo}`}
                >
                  {t('login.signUp')}
                </a>
              </p>
            )}
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
