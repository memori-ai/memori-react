import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Input, Modal } from '@memori.ai/ui';
import { Plus } from 'lucide-react';
import { useWidgetSurfaceEl } from '../../context/widgetSurfaceContext';

export interface Props {
  pwdOrTokens: null | 'password' | 'tokens';
  setPwdOrTokens: (state: null | 'password' | 'tokens') => void;
  onFinish?: (values: AuthInputs) => Promise<void>;
  minimumNumberOfRecoveryTokens?: number;
  showTokens?: boolean;
  withModal?: boolean;
  openModal?: boolean;
}

export type AuthInputs = {
  password?: string;
  tokens?: string[];
};

function createArrayWithNumbers(length: number) {
  return Array.from({ length }, (_, i) => i);
}

export const AuthWidget = ({
  pwdOrTokens,
  setPwdOrTokens,
  onFinish,
  minimumNumberOfRecoveryTokens = 1,
  showTokens = true,
  openModal = false,
  withModal = false,
}: Props) => {
  const surfaceEl = useWidgetSurfaceEl();
  const { t } = useTranslation();
  const [numTokens, setNumTokens] = useState(1);
  const [passwordValue, setPasswordValue] = useState('');
  const [tokenValues, setTokenValues] = useState<string[]>(['']);
  const [showModal, setShowModal] = useState(!!pwdOrTokens);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [tokensError, setTokensError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const missingPassword = pwdOrTokens === 'password' && !passwordValue.length;
    const filledTokens = tokenValues.slice(0, numTokens);
    const invalidTokens =
      pwdOrTokens === 'tokens' &&
      (filledTokens.length < minimumNumberOfRecoveryTokens ||
        !filledTokens.every(tok => tok.length));

    if (missingPassword) {
      setPasswordError(t('auth.passwordRequired') || 'Password required');
      return;
    }

    if (invalidTokens) {
      setTokensError(
        `${t('auth.atLeast') || 'At least'} ${minimumNumberOfRecoveryTokens}`
      );
      return;
    }

    if (onFinish) {
      setIsSubmitting(true);
      setPasswordError(null);
      setTokensError(null);
      onFinish({
        password: passwordValue,
        tokens: pwdOrTokens === 'tokens' ? filledTokens : undefined,
      })
        .then(() => {
          setShowModal(false);
        })
        .catch(() => {
          const message = t('auth.invalidCredentials') || 'Invalid credentials';
          if (pwdOrTokens === 'password') {
            setPasswordError(message);
          } else if (pwdOrTokens === 'tokens') {
            setTokensError(message);
          }
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };

  const form = (
    <form
      name="auth"
      onSubmit={onSubmit}
      className="memori-auth-widget--form"
      noValidate
    >
      {(pwdOrTokens === 'password' || !showTokens) && (
        <fieldset className="memori-auth-widget--password-fieldset">
          <label htmlFor="auth-password">
            Password:{' '}
            <Input
              id="auth-password"
              name="password"
              className="memori-auth-widget--input"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              value={passwordValue}
              onChange={e => {
                setPasswordValue(e.target.value);
                if (passwordError) setPasswordError(null);
              }}
            />
          </label>
          {showTokens && (
            <>
              <hr />
              <Button
                type="button"
                variant="outline"
                onClick={() => setPwdOrTokens('tokens')}
              >
                {t('auth.useRecoveryTokens') || 'Recovery tokens'}
              </Button>
            </>
          )}
        </fieldset>
      )}
      {pwdOrTokens === 'tokens' && showTokens && (
        <fieldset className="memori-auth-widget--tokens-fieldset" name="tokens">
          <legend>{t('auth.tokens')}: </legend>
          {createArrayWithNumbers(numTokens).map(idx => {
            return (
              <label className="memori-auth-widget--token" key={idx}>
                <span className="sr-only">
                  {t('auth.tokenNumber', {
                    defaultValue: 'Recovery token {{number}}',
                    number: idx + 1,
                  })}
                </span>
                <Input
                  type="password"
                  className="memori-auth-widget--input"
                  placeholder="Recovery token"
                  autoComplete="off"
                  name={`tokens.${idx}`}
                  aria-label={String(
                    t('auth.tokenNumber', {
                      defaultValue: 'Recovery token {{number}}',
                      number: idx + 1,
                    })
                  )}
                  value={tokenValues[idx] ?? ''}
                  onChange={e => {
                    const value = e.target.value;
                    setTokenValues(prev => {
                      const next = [...prev];
                      next[idx] = value;
                      return next;
                    });
                    if (tokensError) setTokensError(null);
                  }}
                />
              </label>
            );
          })}

          <Button
            type="button"
            onClick={() => {
              setNumTokens(n => n + 1);
              setTokenValues(prev => [...prev, '']);
            }}
            className="memori-auth-widget--token-add"
            icon={<Plus />}
          >
            {t('auth.addToken') || 'Add token'}
          </Button>

          <hr />
          <Button
            type="button"
            variant="outline"
            onClick={() => setPwdOrTokens('password')}
          >
            {t('auth.usePassword') || 'Password'}
          </Button>
        </fieldset>
      )}

      {passwordError && (
        <div role="alert" className="memori-auth-widget--error">
          {passwordError}
        </div>
      )}
      {tokensError && (
        <div role="alert" className="memori-auth-widget--error">
          {tokensError}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        className="memori-auth-widget--submit"
        loading={isSubmitting}
      >
        {t('confirm') || 'Submit'}
      </Button>
    </form>
  );

  return withModal ? (
    <Modal
      container={surfaceEl ?? undefined}
      open={openModal || showModal}
      title={t('auth.title') || 'Authentication'}
      closable={true}
      onOpenChange={open => {
        if (!open) setPwdOrTokens(null);
      }}
    >
      {form}
    </Modal>
  ) : (
    form
  );
};

export default AuthWidget;
