import React from 'react';
import { Meta, Story } from '@storybook/react';
import I18nWrapper from '../../I18nWrapper';
import SettingsDrawer, { Props } from './SettingsDrawer';
import './SettingsDrawer.css';

const meta: Meta = {
  title: 'Widget/SettingsDrawer',
  component: SettingsDrawer,
  argTypes: {
    open: {
      control: {
        type: 'boolean',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<Props> = args => {
  const [microphoneMode, setMicrophoneMode] = React.useState<
    'HOLD_TO_TALK' | 'CONTINUOUS'
  >('HOLD_TO_TALK');
  const [controlsPosition, setControlsPosition] = React.useState<
    'bottom' | 'center'
  >('bottom');

  return (
    <I18nWrapper>
      <SettingsDrawer
        {...args}
        microphoneMode={microphoneMode}
        setMicrophoneMode={setMicrophoneMode}
        controlsPosition={controlsPosition}
        setControlsPosition={setControlsPosition}
      />
    </I18nWrapper>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  open: true,
  onClose: () => {},
  continuousSpeech: false,
  continuousSpeechTimeout: 2,
  setContinuousSpeech: () => {},
  setContinuousSpeechTimeout: () => {},
};

export const WithinTotemLayout = Template.bind({});
WithinTotemLayout.args = {
  layout: 'TOTEM',
  open: true,
  onClose: () => {},
  continuousSpeech: false,
  continuousSpeechTimeout: 2,
  setContinuousSpeech: () => {},
  setContinuousSpeechTimeout: () => {},
};

const AdditionalSettings = () => {
  const [hideEmissions, setHideEmissions] = React.useState(false);

  return (
    <div>
      <label htmlFor="#hideEmissions">Hide emissions:</label>
      <input
        id="hideEmissions"
        name="hideEmissions"
        type="checkbox"
        checked={hideEmissions}
        onChange={e => setHideEmissions(e.target.checked)}
      />
    </div>
  );
};

export const WithAdditionalSettings = Template.bind({});
WithAdditionalSettings.args = {
  open: true,
  onClose: () => {},
  continuousSpeech: false,
  continuousSpeechTimeout: 2,
  setContinuousSpeech: () => {},
  setContinuousSpeechTimeout: () => {},
  additionalSettings: <AdditionalSettings />,
};
