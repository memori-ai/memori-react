import React from 'react';
import { Meta, Story } from '@storybook/react';
import I18nWrapper from '../../I18nWrapper';
import MicrophoneButton, { Props } from './MicrophoneButton';

import './MicrophoneButton.css';

const meta: Meta = {
  title: 'Widget/Microphone Button',
  component: MicrophoneButton,
  argTypes: {
    disabled: {
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
  const [listening, setListening] = React.useState(args.listening);
  const startListening = () => setListening(true);
  const stopListening = () => setListening(false);

  return (
    <I18nWrapper>
      <div style={{ paddingTop: '10rem', textAlign: 'right' }}>
        <MicrophoneButton
          {...args}
          listening={listening}
          startListening={startListening}
          stopListening={stopListening}
        />
      </div>
    </I18nWrapper>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  listening: false,
  stopAudio: () => {},
  startListening: () => {},
  stopListening: () => {},
};
