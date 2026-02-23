import { useTranslation } from 'react-i18next';
import { Button, Modal, useAlertManager } from '@memori.ai/ui';
import { DateTime } from 'luxon';
import DateSelector from '../DateSelector/DateSelector';
import { useCallback, useState } from 'react';

export interface Props {
  visible?: boolean;
  onClose: (birthDate?: string) => void;
  minAge: number;
}

const AgeVerificationModal = ({ visible = false, onClose, minAge }: Props) => {
  const { t } = useTranslation();
  const alertManager = useAlertManager();
  const [birthDate, setBirthDate] = useState<DateTime>();
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const onSubmit = useCallback(() => {
    setSubmitting(true);

    if (!birthDate) {
      alertManager.add({
        id: `age-verification-error-${Date.now()}`,
        title: t('requiredField'),
        description: t('requiredField'),
        data: { severity: 'error', closable: true, style: { zIndex: 10002, top: 30, right: 30, position: 'fixed' } },
      });
      setError(t('requiredField') || 'Required field');
      setSubmitting(false);
      return;
    }

    let age = DateTime.now().diff(birthDate, 'years').years;
    if (age < minAge) {
      alertManager.add({
        id: `age-verification-error-${Date.now()}`,
        title: t('underageTwinSession', { age: minAge }),
        description: t('underageTwinSession', { age: minAge }),
        data: { severity: 'error', closable: true, style: { zIndex: 10002, top: 30, right: 30, position: 'fixed' } },
      });
      setError(
        t('underageTwinSession', { age: minAge }) ||
          `You must be at least ${minAge} years old to interact with this Agent`
      );
      setSubmitting(false);
      return;
    }

    onClose(birthDate.toJSDate().toISOString());
  }, [birthDate, minAge, onClose, t]);

  return (
    <Modal
      open={visible}
      width="600px"
      widthMd="600px"
      title={t('ageVerification')}
      className="age-verification-modal"
      closable={false}
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
              //defaultDate={new Date(Date.now())}
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
            variant="primary"
            type="submit"
            className="age-verification-submit"
            loading={submitting}
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
