import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@memori.ai/ui';
import cx from 'classnames';

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
  const value = instruct ? 'instruct' : 'test';

  return canInstruct ? (
    <div
      className="memori--changeMode-instruct"
      role="radiogroup"
      aria-label={t('widget.instruct') || 'Mode'}
    >
      <Button
        variant={value === 'instruct' ? 'primary' : 'outline'}
        className={cx('memori--changeMode-instruct-radio-button', {
          'memori--changeMode-instruct-radio-button--selected': value === 'instruct',
        })}
        onClick={() => onChangeMode('instruct')}
      >
        {t('widget.instruct') || 'Instruct'}
      </Button>
      <Button
        variant={value === 'test' ? 'primary' : 'outline'}
        className={cx('memori--changeMode-instruct-radio-button', {
          'memori--changeMode-instruct-radio-button--selected': value === 'test',
        })}
        onClick={() => onChangeMode('test')}
      >
        {t('widget.test') || 'Test'}
      </Button>
    </div>
  ) : null;
};

export default ChangeMode;
