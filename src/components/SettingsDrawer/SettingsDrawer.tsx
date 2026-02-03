import { Drawer, Checkbox, Button, Slider, Tooltip } from '@memori.ai/ui';
import { useTranslation } from 'react-i18next';
import { setLocalConfig } from '../../helpers/configuration';
import { Props as WidgetProps } from '../MemoriWidget/MemoriWidget';
import { useState } from 'react';
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
  additionalSettings?: WidgetProps['additionalSettings'];
  avatarType?: 'blob' | 'avatar3d' | null;
  setAvatarType: (value: 'blob' | 'avatar3d' | null) => void;
  enablePositionControls?: boolean;
  setEnablePositionControls: (value: boolean) => void;
  isAvatar3d?: boolean;
  speakerMuted?: boolean;
}

const silenceSeconds = [2, 3, 5, 10, 15, 20, 30, 60];

const SettingsDrawer = ({
  open,
  layout = 'DEFAULT',
  onClose,
  // microphoneMode = 'HOLD_TO_TALK',
  // continuousSpeechTimeout,
  // setMicrophoneMode,
  // setContinuousSpeechTimeout,
  controlsPosition,
  setControlsPosition,
  hideEmissions,
  setHideEmissions,
  additionalSettings,
  avatarType,
  setAvatarType,
  enablePositionControls,
  setEnablePositionControls,
  isAvatar3d,
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
      {/* <div className="memori-settings-drawer--field controls">
        <label htmlFor="#microphoneMode">
          {t('write_and_speak.microphoneMode') || 'Microphone mode'}:
        </label>
        <RadioGroup
          id="microphoneMode"
          name="microphoneMode"
          value={microphoneMode}
          defaultValue={microphoneMode}
          className="memori-settings-drawer--microphoneMode-radio"
          onChange={(value: any) => {
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
              <Button variant={checked ? 'primary' : 'outline'}>
                {t('write_and_speak.holdToSpeak') || 'Hold to speak'}
              </Button>
            )}
          </RadioGroup.Option>

          <Tooltip
            content={t('write_and_speak.continuousSpeechDisabled') || 'Continuous speech is currently disabled'}
            disabled={false}
          >
            <RadioGroup.Option
              value="CONTINUOUS"
              className="memori-settings-drawer--microphoneMode-radio-button memori-settings-drawer--microphoneMode-radio-button-disabled"
            >
              {({ checked }) => (
                <Button
                  variant={checked ? 'primary' : 'outline'}
                  disabled={true}
                >
                  {t('write_and_speak.continuousSpeechLabel') ||
                    'Continuous speech'}
                </Button>
              )}
            </RadioGroup.Option>
          </Tooltip>
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
      )} */}

      {layout === 'TOTEM' && (
        <>
          <div className="memori-settings-drawer--field controls">
            <label htmlFor="#controlsPosition">
              {t('write_and_speak.controlsPosition') || 'Controls'}:
            </label>
            <div
              id="controlsPosition"
              className="memori-settings-drawer--controlsposition-radio"
              role="radiogroup"
            >
              <Button
                variant={controlsPosition === 'center' ? 'primary' : 'outline'}
                className="memori-settings-drawer--controlsposition-radio-button"
                onClick={() => {
                  setControlsPosition('center');
                  setLocalConfig('controlsPosition', 'center');
                }}
              >
                {t('center') || 'Center'}
              </Button>
              <Button
                variant={controlsPosition === 'bottom' ? 'primary' : 'outline'}
                className="memori-settings-drawer--controlsposition-radio-button"
                onClick={() => {
                  setControlsPosition('bottom');
                  setLocalConfig('controlsPosition', 'bottom');
                }}
              >
                {t('bottom') || 'Bottom'}
              </Button>
            </div>
          </div>

          {isAvatar3d && (
            <>
              <div className="memori-settings-drawer--field controls">
                <label
                  htmlFor="avatarType"
                  className="memori-settings-drawer-label"
                >
                  {t('write_and_speak.avatarType') || 'Avatar type'}:
                </label>
                <div
                  id="avatarType"
                  className="memori-settings-drawer--avatarType-radio"
                  role="radiogroup"
                >
                  <Button
                    variant={avatarType === 'blob' ? 'primary' : 'outline'}
                    className="memori-settings-drawer--avatarType-radio-button"
                    onClick={() => {
                      setAvatarType?.('blob');
                      setLocalConfig('avatarType', 'blob');
                    }}
                  >
                    {t('write_and_speak.blob') || 'Blob'}
                  </Button>
                  <Button
                    variant={avatarType === 'avatar3d' ? 'primary' : 'outline'}
                    className="memori-settings-drawer--avatarType-radio-button"
                    onClick={() => {
                      setAvatarType?.('avatar3d');
                      setLocalConfig('avatarType', 'avatar3d');
                    }}
                  >
                    {t('write_and_speak.avatar3d') || 'Avatar 3D'}
                  </Button>
                </div>
              </div>

              <div className="memori-settings-drawer--field">
                <Checkbox
                  label={
                    t('write_and_speak.enablePositionControls') ||
                    'Enable position controls'
                  }
                  name="enablePositionControls"
                  checked={enablePositionControls}
                  onChange={checked => {
                    setEnablePositionControls(checked);
                  }}
                />
              </div>
            </>
          )}

          <div className="memori-settings-drawer--field">
            <Checkbox
              label={
                t('write_and_speak.hideEmissionsLabel') || 'Hide emissions'
              }
              name="hideControls"
              checked={hideEmissions}
              onChange={checked => {
                setHideEmissions(checked);
                setLocalConfig('hideEmissions', checked);
              }}
            />
          </div>
        </>
      )}

      {additionalSettings && (
        <div className="memori-settings-drawer--field controls">
          {additionalSettings}
        </div>
      )}
    </Drawer>
  );
};

export default SettingsDrawer;
