import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { useForm, SubmitHandler } from 'react-hook-form';
import Plus from '../icons/Plus';

export interface Props {
  pwdOrTokens: null | 'password' | 'tokens';
  setPwdOrTokens: (state: null | 'password' | 'tokens') => void;
  onFinish?: (values: AuthInputs) => Promise<void>;
  minimumNumberOfRecoveryTokens?: number;
  showTokens?: boolean;
  withModal?: boolean;
  openModal?: boolean;
}

type AuthInputs = {
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
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<AuthInputs>();
  const [numTokens, setNumTokens] = useState(1);

  const [showModal, setShowModal] = useState(!!pwdOrTokens);

  const onSubmit: SubmitHandler<AuthInputs> = data => {
    if (
      (pwdOrTokens === 'password' && !data.password?.length) ||
      (pwdOrTokens === 'tokens' &&
        ((data?.tokens?.length || 0) < minimumNumberOfRecoveryTokens ||
          !data?.tokens?.every(t => t.length)))
    ) {
      setError('tokens', {
        type: 'minLength',
        message: 'Tokens',
      });
      return;
    }

    if (onFinish) {
      onFinish(data).then(() => {
        setShowModal(false);
      });
    }
  };

  const form = (
    <form
      name="memoriAuth"
      onSubmit={handleSubmit(onSubmit)}
      className="memori-auth-widget--form"
    >
      {(pwdOrTokens === 'password' || !showTokens) && (
        <fieldset className="memori-auth-widget--password-fieldset">
          <label>
            Password:{' '}
            <input
              className="memori-auth-widget--input"
              required
              type="password"
              placeholder="Password"
              {...register('password', { required: true })}
            />
          </label>
          {showTokens && (
            <>
              <hr />
              <Button outlined onClick={() => setPwdOrTokens('tokens')}>
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
                <input
                  type="password"
                  className="memori-auth-widget--input"
                  placeholder="Recovery token"
                  required
                  autoComplete="off"
                  {...register(`tokens.${idx}`, {
                    required: true,
                  })}
                />
              </label>
            );
          })}

          <Button
            onClick={() => setNumTokens(t => t + 1)}
            className="memori-auth-widget--token-add"
            icon={<Plus />}
          >
            {t('auth.addToken') || 'Add token'}
          </Button>

          <hr />
          <Button outlined onClick={() => setPwdOrTokens('password')}>
            {t('auth.usePassword') || 'Password'}
          </Button>
        </fieldset>
      )}

      {errors.tokens?.type === 'minLength' && (
        <div className="memori-auth-widget--error">
          {t('auth.atLeast') || 'At least'} {minimumNumberOfRecoveryTokens}
        </div>
      )}

      <Button htmlType="submit" primary className="memori-auth-widget--submit">
        {t('confirm') || 'Submit'}
      </Button>
    </form>
  );

  return withModal ? (
    <Modal
      open={openModal || showModal}
      title={t('auth.title') || 'Authentication'}
      onClose={() => setPwdOrTokens(null)}
      closable={false}
    >
      {form}
    </Modal>
  ) : (
    form
  );
};

export default AuthWidget;
