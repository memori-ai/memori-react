import { useTranslation } from 'react-i18next';
import {
  Button,
  FieldGroup,
  Form,
  Modal,
  useAlertManager,
  createAlertOptions,
} from '@memori.ai/ui';
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
  const { add } = useAlertManager();
  const [birthDate, setBirthDate] = useState<DateTime>();
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const onSubmit = useCallback(() => {
    setSubmitting(true);

    if (!birthDate) {
      add(
        createAlertOptions({
          description: t('requiredField'),
          severity: 'error',
        })
      );
      setError(t('requiredField') || 'Required field');
      setSubmitting(false);
      return;
    }

    let age = DateTime.now().diff(birthDate, 'years').years;
    if (age < minAge) {
      add(
        createAlertOptions({
          description: t('underageTwinSession', { age: minAge }),
          severity: 'error',
        })
      );
      setError(
        t('underageTwinSession', { age: minAge }) ||
          `You must be at least ${minAge} years old to interact with this Agent`
      );
      setSubmitting(false);
      return;
    }

    setError(undefined);
    add(
      createAlertOptions({
        description: t('ageVerificationSuccess'),
        severity: 'success',
      })
    );
    onClose(birthDate.toJSDate().toISOString());
    setSubmitting(false);
  }, [add, birthDate, minAge, onClose, t]);

  return (
    <Modal
      open={visible}
      width="600px"
      widthMd="600px"
      title={t('ageVerification')}
      className="age-verification-modal"
      closable={false}
    >
      <p className="age-verification-text">{t('ageVerificationText', { minAge })}</p>

      <Form
        name="ageVerification"
        className="age-verification-form"
        onSubmit={e => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <FieldGroup
          className="age-verification-birth-field"

          helperText={t('birthDateHelper')}
          error={error}
          invalid={!!error}
          required
        >
          <DateSelector
            onChange={date => {
              setBirthDate(date);
              setError(undefined);
            }}
          />
        </FieldGroup>
        <Button
          variant="primary"
          type="submit"
          size="lg"
          loading={submitting}
          disabled={!birthDate}
          style={{ marginBottom: '0.25rem' }}
        >
          {t('confirm')}
        </Button>
      </Form>
    </Modal>
  );
};

export default AgeVerificationModal;
