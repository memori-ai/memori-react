import React from 'react';
import { Meta, Story } from '@storybook/react';
import ModelViewer, { Props } from './ModelViewer';
import './ModelViewer.css';

const meta: Meta = {
  title: 'Custom GLB Avatar',
  component: ModelViewer,
  argTypes: {
    src: {
      control: {
        type: 'text',
      },
    },
    poster: {
      control: {
        type: 'text',
      },
    },
    alt: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<Props> = args => {
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated ? (
    <ModelViewer
      {...args}
      src={args.src + `#${new Date(Date.now()).toISOString()}`}
      key={Date.now()}
    />
  ) : (
    <></>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  alt: '',
  src: 'https://assets.memori.ai/api/v2/asset/7383f05a-0788-49b0-b9b9-3bfc402c7ddf.glb#1669136149862',
  poster:
    'https://assets.memori.ai/api/v2/asset/596382ce-381a-4a66-9740-c7adc3bfa4a8.png',
};
