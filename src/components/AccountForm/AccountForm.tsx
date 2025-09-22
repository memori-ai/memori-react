import { User, Tenant } from '@memori.ai/memori-api-client/dist/types';
import React, { useEffect, useState } from 'react';
import Button from '../ui/Button';
import { useTranslation } from 'react-i18next';
import memoriApiClient from '@memori.ai/memori-api-client';
import toast from 'react-hot-toast';
import { mailRegEx, pwdRegEx, usernameRegEx } from '../../helpers/utils';
import { getErrori18nKey } from '../../helpers/error';
import Tooltip from '../ui/Tooltip';

export interface Props {
  user: User;
  loginToken: string;
  apiClient: ReturnType<typeof memoriApiClient>;
  onUserUpdate: (user: User) => void;
}

const imgMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];

const AccountForm = ({ user, loginToken, apiClient, onUserUpdate }: Props) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'it' ? 'it' : 'en';

  const { updateUser, uploadAsset } = apiClient.backend;

  const [email, setEmail] = useState<string>();
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
  const [error, setError] = useState<string | null>(null);

  const sendUserUpdate = async (userID: string, user: Partial<User>) => {
    try {
      const { user: updatedUser, ...resp } = await updateUser(
        loginToken,
        userID,
        user
      );

      if (resp.resultCode !== 0) {
        console.error(resp);
        toast.error(t(getErrori18nKey(resp.resultCode)));
      } else if (updatedUser) {
        toast.success(t('success'));
        onUserUpdate(updatedUser);
      }
    } catch (e) {
      let err = e as Error;
      console.error('[signup]', err);
      if (err?.message) toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitUserUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user.userID) return;
    const userID = user.userID;

    const form = e.currentTarget as HTMLFormElement;

    const eMail = form.eMail.value ?? email;
    const newPassword = form.newPassword.value ?? password;
    const currentPassword = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    const pAndCUAccepted = (form.pAndCUAccepted as HTMLInputElement | null)
      ?.checked;
    const avatar = (form.avatar as HTMLInputElement | null)?.files?.[0];

    setLoading(true);
    setError(null);

    if (newPassword?.length && newPassword !== confirmPassword) {
      setError(t('login.passwordMatchingError'));
      setLoading(false);
      return;
    }

    let patchedUser: User = {
      ...(eMail?.length && eMail !== user.eMail ? { eMail } : {}),
      ...(newPassword ? { password: currentPassword, newPassword } : {}),
      ...(pAndCUAccepted !== undefined && pAndCUAccepted !== user.pAndCUAccepted
        ? { pAndCUAccepted, pAndCUAcceptanceDate: new Date().toISOString() }
        : {}),
    };

    if (Object.values(patchedUser).length === 0 && !avatar) {
      console.debug('No changes to submit');
      setLoading(false);
      return;
    }

    if (avatar) {
      const reader = new FileReader();
      reader.onload = async e => {
        try {
          const { asset: avatarAsset, ...resp } = await uploadAsset(
            avatar.name ?? 'avatar',
            e.target?.result as string,
            loginToken
          );

          if (resp.resultCode !== 0) {
            console.error(resp);
            toast.error(t(getErrori18nKey(resp.resultCode)));
          } else if (avatarAsset) {
            patchedUser.avatarURL = avatarAsset.assetURL;

            await sendUserUpdate(userID, patchedUser);
          }
        } catch (e) {
          let err = e as Error;
          console.error('[avatar upload]', err);

          if (err?.message) toast.error(err.message);
        }
      };
      reader.readAsDataURL(avatar);
    } else {
      await sendUserUpdate(userID, patchedUser);
    }
  };

  return (
    <>
      <h3 className="memori--login-drawer--edit-account-title">
        {t('login.editAccount')}
      </h3>

      <form
        className="memori--login-drawer--form memori--login-drawer--account-form"
        onSubmit={submitUserUpdate}
      >
        <details className="memori--details">
          <summary>{t('login.emailChange')}</summary>

          <label htmlFor="#eMail">
            {t('login.email')}
            <input
              type="email"
              name="eMail"
              id="eMail"
              autoComplete="email"
              placeholder={user.eMail}
              onChange={e => setEmail(e.target.value)}
              aria-invalid={!!email?.length && !mailRegEx.test(email)}
            />
          </label>
          {!!email?.length && !mailRegEx.test(email) && (
            <p className="memori--login-drawer--inline-error">
              {t('login.emailFormatError')}
            </p>
          )}
        </details>

        <details className="memori--details">
          <summary>{t('login.passwordChange')}</summary>

          <label htmlFor="#password">
            {t('login.currentPassword')}
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="password"
              placeholder={t('login.currentPassword') || 'Password'}
            />
          </label>

          <label htmlFor="#newPassword">
            {t('login.newPassword')}
            <input
              id="newPassword"
              name="newPassword"
              type="password"
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
        </details>

        <details className="memori--details">
          <summary>{t('login.avatarChange')}</summary>

          <label htmlFor="#avatar">
            Avatar
            <input
              type="file"
              name="avatar"
              id="avatar"
              accept={imgMimeTypes.join(', ')}
              placeholder={user.avatarURL}
            />
          </label>
        </details>

        <label className="memori-checkbox memori-checkbox--disabled">
          <span className="memori-checkbox--input-wrapper">
            <input
              type="checkbox"
              name="tnCAndPPAccepted"
              disabled
              defaultChecked={user.tnCAndPPAccepted}
              checked={user.tnCAndPPAccepted}
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
              defaultChecked={user.pAndCUAccepted}
            />
            <span className="memori-checkbox--inner" />
          </span>
          <Tooltip align="left" content={t('login.deepThoughtExplaination')}>
            <span className="memori-checkbox--text">
              {t('login.pAndCUAccepted')}{' '}
              <small>
                <em>({t('login.optional')})</em>
              </small>
            </span>
          </Tooltip>
        </label>

        <Button htmlType="submit" primary loading={loading}>
          {t('login.save')}
        </Button>
      </form>
      {error && (
        <p role="alert" className="memori--login-drawer--error">
          {error}
        </p>
      )}
    </>
  );
};

export default AccountForm;
