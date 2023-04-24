import { Memori } from '@memori.ai/memori-api-client/dist/types';
import Drawer from '../ui/Drawer';
import { useTranslation } from 'react-i18next';
import Checkbox from '../ui/Checkbox';
import Select from '../ui/Select';
import { setLocalConfig } from '../../helpers/configuration';
import { RadioGroup } from '@headlessui/react';
import Button from '../ui/Button';

export interface Props {
  open: boolean;
  layout?: 'FULLPAGE' | 'TOTEM' | 'DEFAULT';
  onClose: () => void;
  continuousSpeech?: boolean;
  continuousSpeechTimeout?: number;
  setContinuousSpeech: (value: boolean) => void;
  setContinuousSpeechTimeout: (value: number) => void;
  controlsPosition?: 'center' | 'bottom' | 'hidden';
  setControlsPosition: (value: 'center' | 'bottom' | 'hidden') => void;
}

const silenceSeconds = [2, 3, 5, 10, 15, 20, 30, 60];

const SettingsDrawer = ({
  open,
  layout = 'DEFAULT',
  onClose,
  continuousSpeech,
  continuousSpeechTimeout,
  setContinuousSpeech,
  setContinuousSpeechTimeout,
  controlsPosition,
  setControlsPosition,
}: Props) => {
  const { t } = useTranslation();

  return (
    <Drawer
      className="memori-settings-drawer"
      open={open}
      onClose={onClose}
      title={t('widget.settings') || 'Settings'}
      description={t('write_and_speak.settingsHeaderLabel')}
    >
      <div className="memori-settings-drawer--field">
        <Checkbox
          label={t('write_and_speak.continuousSpeechLabel')}
          checked={continuousSpeech}
          onChange={e => {
            setContinuousSpeech(e.target.checked);
            setLocalConfig('continuousSpeech', e.target.checked);

            if (!e.target.checked && controlsPosition === 'hidden') {
              setControlsPosition('bottom');
              setLocalConfig('controlsPosition', 'bottom');
            }
          }}
        />
      </div>

      <div className="memori-settings-drawer--field">
        <Select
          label={t('write_and_speak.secondsLabel') || 'Seconds'}
          placeholder={t('write_and_speak.secondsLabel') || 'Seconds'}
          options={silenceSeconds.map(s => ({ value: s, label: s }))}
          value={continuousSpeechTimeout}
          onChange={value => {
            setContinuousSpeechTimeout(value);
            setLocalConfig('continuousSpeechTimeout', value);
          }}
        />
      </div>

      {layout === 'TOTEM' && (
        <div className="memori-settings-drawer--field controls">
          <label htmlFor="#controlsPosition">
            {t('write_and_speak.controlsPosition') || 'Controls'}:
          </label>
          <RadioGroup
            id="controlsPosition"
            name="controlsPosition"
            value={controlsPosition}
            defaultValue={controlsPosition}
            className="memori-settings-drawer--controlsposition-radio"
            onChange={value => {
              setControlsPosition(value);
              setLocalConfig('controlsPosition', value);
            }}
          >
            <RadioGroup.Option
              value="center"
              className="memori-settings-drawer--controlsposition-radio-button"
            >
              {({ checked }) => (
                <Button primary={checked}>{t('center') || 'Center'}</Button>
              )}
            </RadioGroup.Option>
            <RadioGroup.Option
              value="bottom"
              className="memori-settings-drawer--controlsposition-radio-button"
            >
              {({ checked }) => (
                <Button primary={checked}>{t('bottom') || 'Bottom'}</Button>
              )}
            </RadioGroup.Option>
            {!!continuousSpeech && (
              <RadioGroup.Option
                value="hidden"
                className="memori-settings-drawer--controlsposition-radio-button"
              >
                {({ checked }) => (
                  <Button primary={checked}>{t('hidden') || 'Hidden'}</Button>
                )}
              </RadioGroup.Option>
            )}
          </RadioGroup>
        </div>
      )}
    </Drawer>
  );
};

export default SettingsDrawer;
