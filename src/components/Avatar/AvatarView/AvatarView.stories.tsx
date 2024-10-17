import React from 'react';
import { Meta, Story } from '@storybook/react';
import I18nWrapper from '../../../I18nWrapper';
import AvatarView, { Props } from './index';
import { VisemeProvider } from '../../../context/visemeContext';

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
    halfBody: {
      control: {
        type: 'boolean',
      },
    },
    showControls: {
      control: {
        type: 'boolean',
      },
    },
    animation: {
      control: {
        type: 'select',
        options: [
          'Idle',
          'Idle 1',
          'Idle 2',
          'Idle 3',
          'Loading',
          'Sad',
          'Talk 1',
          'Talk 2',
          'Talk 3',
        ],
      },
    },
  },
  parameters: {
    controls: { expanded: false },
  },
};

export default meta;

const Template: Story<Props> = args => {
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated ? (
    <I18nWrapper>
      <VisemeProvider>
        <AvatarView
          {...args}
          url={args.url + `#${new Date(Date.now()).toISOString()}`}
          key={Date.now()}
        />
      </VisemeProvider>
    </I18nWrapper>
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
  updateCurrentViseme: () => {},
  url: 'https://assets.memori.ai/api/v2/asset/b791f77c-1a94-4272-829e-eca82fcc62b7.glb',
  fallbackImg:
    'https://assets.memori.ai/api/v2/asset/d8035229-08cf-42a7-a532-ab051df2603d.png',
};

export const EyeBlink = Template.bind({});
EyeBlink.args = {
  updateCurrentViseme: () => {},
  eyeBlink: true,
  headMovement: false,
  rotateAvatar: false,
  speaking: false,
  url: 'https://assets.memori.ai/api/v2/asset/b791f77c-1a94-4272-829e-eca82fcc62b7.glb',
  fallbackImg:
    'https://assets.memori.ai/api/v2/asset/d8035229-08cf-42a7-a532-ab051df2603d.png',
};

export const HeadMovement = Template.bind({});
HeadMovement.args = {
  updateCurrentViseme: () => {},
  eyeBlink: false,
  headMovement: true,
  rotateAvatar: false,
  speaking: false,
  url: 'https://assets.memori.ai/api/v2/asset/b791f77c-1a94-4272-829e-eca82fcc62b7.glb',
  fallbackImg:
    'https://assets.memori.ai/api/v2/asset/d8035229-08cf-42a7-a532-ab051df2603d.png',
};

export const RotateAvatar = Template.bind({});
RotateAvatar.args = {
  updateCurrentViseme: () => {},
  eyeBlink: false,
  headMovement: false,
  rotateAvatar: true,
  speaking: false,
  url: 'https://assets.memori.ai/api/v2/asset/b791f77c-1a94-4272-829e-eca82fcc62b7.glb',
  fallbackImg:
    'https://assets.memori.ai/api/v2/asset/d8035229-08cf-42a7-a532-ab051df2603d.png',
};

export const Speaking = Template.bind({});
Speaking.args = {
  updateCurrentViseme: () => {},
  eyeBlink: false,
  headMovement: false,
  rotateAvatar: false,
  speaking: true,
  url: 'https://assets.memori.ai/api/v2/asset/b791f77c-1a94-4272-829e-eca82fcc62b7.glb',
  fallbackImg:
    'https://assets.memori.ai/api/v2/asset/d8035229-08cf-42a7-a532-ab051df2603d.png',
};

export const Fullbody = Template.bind({});
Fullbody.args = {
  sex: 'MALE',
  eyeBlink: true,
  headMovement: true,
  rotateAvatar: true,
  speaking: false,
  updateCurrentViseme: () => {},
  url: 'https://models.readyplayer.me/63b55751f17e295642bf07a2.glb',
  fallbackImg:
    'https://assets.memori.ai/api/v2/asset/3049582f-db5f-452c-913d-e4340d4afd0a.png',
  halfBody: false,
};

export const FullbodyZoomed = Template.bind({});
FullbodyZoomed.args = {
  sex: 'FEMALE',
  eyeBlink: true,
  headMovement: true,
  rotateAvatar: true,
  speaking: false,
  isZoomed: true,
  updateCurrentViseme: () => {},
  url: 'https://assets.memori.ai/api/v2/asset/3f5ef41c-6c4c-449c-888d-cf9c89782528.glb',
  fallbackImg:
    'https://assets.memori.ai/api/v2/asset/3049582f-db5f-452c-913d-e4340d4afd0a.png',
  halfBody: false,
};

export const FullbodyAnimatedIdle = Template.bind({});
FullbodyAnimatedIdle.args = {
  sex: 'MALE',
  eyeBlink: true,
  headMovement: true,
  rotateAvatar: true,
  speaking: false,
  updateCurrentViseme: () => {},
  url: 'https://models.readyplayer.me/63b55751f17e295642bf07a2.glb',
  fallbackImg:
    'https://assets.memori.ai/api/v2/asset/3049582f-db5f-452c-913d-e4340d4afd0a.png',
  animation: 'Idle',
  halfBody: false,
};

export const FullbodyAnimatedLoading = Template.bind({});
FullbodyAnimatedLoading.args = {
  sex: 'MALE',
  eyeBlink: true,
  headMovement: true,
  rotateAvatar: true,
  speaking: false,
  updateCurrentViseme: () => {},
  url: 'https://models.readyplayer.me/63b55751f17e295642bf07a2.glb',
  fallbackImg:
    'https://assets.memori.ai/api/v2/asset/3049582f-db5f-452c-913d-e4340d4afd0a.png',
  animation: 'Loading',
  halfBody: false,
};

export const FullbodyAnimatedSpeaking = Template.bind({});
FullbodyAnimatedSpeaking.args = {
  sex: 'MALE',
  eyeBlink: true,
  headMovement: true,
  rotateAvatar: true,
  speaking: true,
  updateCurrentViseme: () => {},
  url: 'https://models.readyplayer.me/63b55751f17e295642bf07a2.glb',
  fallbackImg:
    'https://assets.memori.ai/api/v2/asset/3049582f-db5f-452c-913d-e4340d4afd0a.png',
  animation: 'Talk 1',
  halfBody: false,
};

export const FullbodyFemale = Template.bind({});
FullbodyFemale.args = {
  sex: 'FEMALE',
  eyeBlink: true,
  headMovement: true,
  rotateAvatar: true,
  speaking: false,
  updateCurrentViseme: () => {},
  url: 'https://models.readyplayer.me/650d50c2663b19e0d2831b2b.glb',
  fallbackImg:
    'https://assets.memori.ai/api/v2/asset/3049582f-db5f-452c-913d-e4340d4afd0a.png',
  halfBody: false,
};

export const FullbodyAnimatedFemale = Template.bind({});
FullbodyAnimatedFemale.args = {
  sex: 'FEMALE',
  eyeBlink: true,
  headMovement: true,
  rotateAvatar: true,
  speaking: true,
  updateCurrentViseme: () => {},
  url: 'https://models.readyplayer.me/650d50c2663b19e0d2831b2b.glb',
  fallbackImg:
    'https://assets.memori.ai/api/v2/asset/3049582f-db5f-452c-913d-e4340d4afd0a.png',
  animation: 'Idle',
  halfBody: false,
};
