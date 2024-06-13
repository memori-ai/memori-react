import React from 'react';
import { Meta, Story } from '@storybook/react';
import I18nWrapper from '../../I18nWrapper';
import MediaWidget, { Props } from './MediaWidget';
import {
  Medium,
  TranslatedHint,
} from '@memori.ai/memori-api-client/dist/types';

import './MediaWidget.css';

const meta: Meta = {
  title: 'Media Widget/Wrapper',
  component: MediaWidget,
  argTypes: {
    hints: {
      control: {
        type: 'array',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const links: Medium[] = [
  {
    mediumID: '95226d7e-7bae-465e-8b80-995587bb5971',
    mimeType: 'text/html',
    title: 'Memori Srl',
    url: 'https://memori.ai/en',
  },
  {
    mediumID: '95226d7e-7bae-465e-8b80-995587bb5971',
    mimeType: 'text/html',
    title: 'AIsuru',
    url: 'https://www.aisuru.com/en',
  },
  {
    mediumID: '95226d7e-7bae-465e-8b80-995587bb5971',
    mimeType: 'text/html',
    title: 'Introducing Plone Remix | Vimeo',
    url: 'https://vimeo.com/766468314',
  },
  {
    mediumID: '95226d7e-7bae-465e-8b80-995587bb5971',
    mimeType: 'text/html',
    title: 'A sustainable web: is it possible? - Nicola Zambello | YouTube',
    url: 'https://www.youtube.com/watch?v=feH26j3rBz8',
  },
  {
    mediumID: '95226d7e-7bae-465e-8b80-995587bb5971',
    mimeType: 'text/html',
    title: 'Memori backend API',
    url: 'https://backend.memori.ai',
  },
];

const media: Medium[] = [
  {
    mediumID: '95226d7e-7bae-465e-8b80-995587bb5971',
    mimeType: 'text/javascript',
    title: 'Snippet',
    content: "console.log('Hello World!');",
  },
  ...Array.from({ length: 3 }, (_, i) => ({
    mediumID: `95226d7e-7bae-465e-8b80-995587bb597${i}`,
    mimeType: 'image/png',
    title: `Image ${i}`,
    url: `https://picsum.photos/${i % 2 ? '200' : '300'}/${
      i % 3 ? '300' : '200'
    }?random=${i}`,
  })),
];

const hints: TranslatedHint[] = [
  {
    text: 'All right',
    originalText: 'Va bene',
  },
  {
    text: 'No',
    originalText: 'No',
  },
];

const Template: Story<Props> = args => (
  <I18nWrapper>
    <MediaWidget {...args} />
  </I18nWrapper>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Media = Template.bind({});
Media.args = {
  media,
};

export const Links = Template.bind({});
Links.args = {
  links,
};

export const Hints = Template.bind({});
Hints.args = {
  hints,
};

export const LongListHints = Template.bind({});
LongListHints.args = {
  hints: Array.from({ length: 12 }, (_, i) => ({
    text: `Hint ${i + 1}`,
    originalText: `Hint ${i + 1}`,
  })),
};

export const Combined = Template.bind({});
Combined.args = {
  media,
  links,
  hints,
};
