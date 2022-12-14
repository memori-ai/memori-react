import React from 'react';
import { Meta, Story } from '@storybook/react';
import AvatarView, { Props } from './index';

const meta: Meta = {
  title: 'RPM 3D Avatar',
  component: AvatarView,
  argTypes: {
    url: {
      control: {
        type: 'text',
      },
    },
    rotateAvatar: {
      control: {
        type: 'boolean',
      },
    },
    eyeBlink: {
      control: {
        type: 'boolean',
      },
    },
    headMovement: {
      control: {
        type: 'boolean',
      },
    },
    speaking: {
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
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated ? (
    <AvatarView
      {...args}
      url={args.url + `#${new Date(Date.now()).toISOString()}`}
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
  eyeBlink: false,
  headMovement: false,
  rotateAvatar: false,
  speaking: false,
  url:
    'https://assets.memori.ai/api/v2/asset/b791f77c-1a94-4272-829e-eca82fcc62b7.glb',
  fallbackImg:
    'https://assets.memori.ai/api/v2/asset/d8035229-08cf-42a7-a532-ab051df2603d.png',
};

export const EyeBlink = Template.bind({});
EyeBlink.args = {
  eyeBlink: true,
  headMovement: false,
  rotateAvatar: false,
  speaking: false,
  url:
    'https://assets.memori.ai/api/v2/asset/b791f77c-1a94-4272-829e-eca82fcc62b7.glb',
  fallbackImg:
    'https://assets.memori.ai/api/v2/asset/d8035229-08cf-42a7-a532-ab051df2603d.png',
};

export const HeadMovement = Template.bind({});
HeadMovement.args = {
  eyeBlink: false,
  headMovement: true,
  rotateAvatar: false,
  speaking: false,
  url:
    'https://assets.memori.ai/api/v2/asset/b791f77c-1a94-4272-829e-eca82fcc62b7.glb',
  fallbackImg:
    'https://assets.memori.ai/api/v2/asset/d8035229-08cf-42a7-a532-ab051df2603d.png',
};

export const RotateAvatar = Template.bind({});
RotateAvatar.args = {
  eyeBlink: false,
  headMovement: false,
  rotateAvatar: true,
  speaking: false,
  url:
    'https://assets.memori.ai/api/v2/asset/b791f77c-1a94-4272-829e-eca82fcc62b7.glb',
  fallbackImg:
    'https://assets.memori.ai/api/v2/asset/d8035229-08cf-42a7-a532-ab051df2603d.png',
};

export const Speaking = Template.bind({});
Speaking.args = {
  eyeBlink: false,
  headMovement: false,
  rotateAvatar: false,
  speaking: true,
  url:
    'https://assets.memori.ai/api/v2/asset/b791f77c-1a94-4272-829e-eca82fcc62b7.glb',
  fallbackImg:
    'https://assets.memori.ai/api/v2/asset/d8035229-08cf-42a7-a532-ab051df2603d.png',
};
