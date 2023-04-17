import { useTranslation } from 'react-i18next';
import message from '../ui/Message';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import moment from 'moment';
import DateSelector from '../DateSelector/DateSelector';
import { useCallback, useState } from 'react';

export interface Props {
  visible?: boolean;
  onClose: (birthDate?: string) => void;
  minAge: number;
}

const AgeVerificationModal = ({ visible = false, onClose, minAge }: Props) => {
  const { t } = useTranslation();

  const [birthDate, setBirthDate] = useState<moment.Moment>();
  const [error, setError] = useState<string>();

  const onSubmit = useCallback(() => {
    if (!birthDate) {
      message.error(t('requiredField'));
      setError(t('requiredField') || 'Required field');
      return;
    }

    let age = moment().diff(birthDate, 'years');
    if (age < minAge) {
      message.error(t('underageTwinSession', { age: minAge }));
      setError(
        t('underageTwinSession', { age: minAge }) ||
          `You must be at least ${minAge} years old to interact with this Twin`
      );
      return;
    }

    onClose(birthDate.toISOString());
  }, [birthDate, minAge, onClose, t]);

  return (
    <Modal
      open={visible}
      title={t('ageVerification')}
      className="age-verification-modal"
      closable
      onClose={() => onClose()}
    >
      <p>{t('ageVerificationText', { minAge })}</p>

      <form
        className="age-verification-form"
        onSubmit={e => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className="form-item">
          <fieldset name="birthDate">
            <legend className="sr-only">{t('birthDate')}</legend>

            <DateSelector
              defaultDate={new Date(Date.now())}
              onChange={date => {
                setBirthDate(date);
              }}
            />

            <p className="form-item-help">{t('birthDateHelper')}</p>

            {error && <p className="form-item-error">{error}</p>}
          </fieldset>
        </div>
        <div className="form-item form-submit">
          <Button
            primary
            htmlType="submit"
            className="age-verification-submit"
            disabled={!birthDate}
          >
            {t('confirm')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AgeVerificationModal;
