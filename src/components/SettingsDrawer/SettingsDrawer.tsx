import React from 'react';
import Drawer from '../ui/Drawer';
import { useTranslation } from 'react-i18next';
import Checkbox from '../ui/Checkbox';
import Select from '../ui/Select';
import { setLocalConfig } from '../../helpers/configuration';

export interface Props {
  open: boolean;
  onClose: () => void;
  continuousSpeech?: boolean;
  continuousSpeechTimeout?: number;
  setContinuousSpeech: (value: boolean) => void;
  setContinuousSpeechTimeout: (value: number) => void;
}

const silenceSeconds = [2, 3, 5, 10, 15, 20, 30, 60];

const SettingsDrawer = ({
  open,
  onClose,
  continuousSpeech,
  continuousSpeechTimeout,
  setContinuousSpeech,
  setContinuousSpeechTimeout,
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
    </Drawer>
  );
};

export default SettingsDrawer;
