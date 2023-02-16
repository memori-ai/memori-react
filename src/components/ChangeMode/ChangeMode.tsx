import React from 'react';
import { RadioGroup } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';

export interface Props {
  instruct?: boolean;
  onChangeMode: (mode: 'test' | 'instruct') => void;
  canInstruct?: boolean;
}

const ChangeMode: React.FC<Props> = ({
  instruct,
  canInstruct,
  onChangeMode,
}) => {
  const { t } = useTranslation();

  return canInstruct ? (
    <div className="memori--changeMode-instruct">
      <RadioGroup
        name="instruct"
        value={instruct ? 'instruct' : 'test'}
        defaultValue={instruct ? 'instruct' : 'test'}
        className="memori--changeMode-instruct-radio"
        onChange={onChangeMode}
      >
        <RadioGroup.Option
          value="instruct"
          className="memori--changeMode-instruct-radio-button"
        >
          {({ checked }) => (
            <Button primary={checked}>
              {t('widget.instruct') || 'Instruct'}
            </Button>
          )}
        </RadioGroup.Option>
        <RadioGroup.Option
          value="test"
          className="memori--changeMode-instruct-radio-button"
        >
          {({ checked }) => (
            <Button primary={checked}>{t('widget.test') || 'Test'}</Button>
          )}
        </RadioGroup.Option>
      </RadioGroup>
    </div>
  ) : null;
};

export default ChangeMode;
