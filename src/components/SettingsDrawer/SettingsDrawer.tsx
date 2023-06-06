import Drawer from '../ui/Drawer';
import { useTranslation } from 'react-i18next';
import Checkbox from '../ui/Checkbox';
import Select from '../ui/Select';
import { setLocalConfig } from '../../helpers/configuration';
import { RadioGroup } from '@headlessui/react';
import Button from '../ui/Button';
import { Props as WidgetProps } from '../MemoriWidget/MemoriWidget';

export interface Props {
  open: boolean;
  layout?: WidgetProps['layout'];
  onClose: () => void;
  microphoneMode?: 'HOLD_TO_TALK' | 'CONTINUOUS';
  continuousSpeechTimeout?: number;
  setMicrophoneMode: (value: 'HOLD_TO_TALK' | 'CONTINUOUS') => void;
  setContinuousSpeechTimeout: (value: number) => void;
  controlsPosition?: 'center' | 'bottom';
  setControlsPosition: (value: 'center' | 'bottom') => void;
  hideEmissions?: boolean;
  setHideEmissions: (value: boolean) => void;
}

const silenceSeconds = [2, 3, 5, 10, 15, 20, 30, 60];

const SettingsDrawer = ({
  open,
  layout = 'DEFAULT',
  onClose,
  microphoneMode = 'HOLD_TO_TALK',
  continuousSpeechTimeout,
  setMicrophoneMode,
  setContinuousSpeechTimeout,
  controlsPosition,
  setControlsPosition,
  hideEmissions,
  setHideEmissions,
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
      <div className="memori-settings-drawer--field controls">
        <label htmlFor="#microphoneMode">
          {t('write_and_speak.microphoneMode') || 'Microphone mode'}:
        </label>
        <RadioGroup
          id="microphoneMode"
          name="microphoneMode"
          value={microphoneMode}
          defaultValue={microphoneMode}
          className="memori-settings-drawer--microphoneMode-radio"
          onChange={value => {
            let micMode =
              value === 'CONTINUOUS' ? 'CONTINUOUS' : 'HOLD_TO_TALK';

            setMicrophoneMode(micMode as 'CONTINUOUS' | 'HOLD_TO_TALK');
            setLocalConfig('microphoneMode', micMode);
          }}
        >
          <RadioGroup.Option
            value="HOLD_TO_TALK"
            className="memori-settings-drawer--microphoneMode-radio-button"
          >
            {({ checked }) => (
              <Button primary={checked}>
                {t('write_and_speak.holdToSpeak') || 'Hold to speak'}
              </Button>
            )}
          </RadioGroup.Option>
          <RadioGroup.Option
            value="CONTINUOUS"
            className="memori-settings-drawer--microphoneMode-radio-button"
          >
            {({ checked }) => (
              <Button primary={checked}>
                {t('write_and_speak.continuousSpeechLabel') ||
                  'Continuous speech'}
              </Button>
            )}
          </RadioGroup.Option>
        </RadioGroup>
      </div>

      {microphoneMode === 'CONTINUOUS' && (
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
      )}

      {layout === 'TOTEM' && (
        <>
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
            </RadioGroup>
          </div>
          <div className="memori-settings-drawer--field">
            <Checkbox
              label={t('write_and_speak.hideEmissionsLabel')}
              name="hideControls"
              checked={hideEmissions}
              onChange={e => {
                setHideEmissions(e.target.checked);
                setLocalConfig('hideEmissions', e.target.checked);
              }}
            />
          </div>
        </>
      )}
    </Drawer>
  );
};

export default SettingsDrawer;
