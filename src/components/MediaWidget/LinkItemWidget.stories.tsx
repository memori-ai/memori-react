import React from 'react';
import { Meta, Story } from '@storybook/react';
import LinkItemWidget, { Props } from './LinkItemWidget';

import './LinkItemWidget.css';

const meta: Meta = {
  title: 'Media Widget/Link',
  component: LinkItemWidget,
  argTypes: {},
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<Props> = args => <LinkItemWidget {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  items: [
    {
      mediumID: '95226d7e-7bae-465e-8b80-995587bb5971',
      mimeType: 'text/html',
      title: 'Memori Srl',
      url: 'https://memori.ai/en',
    },
    {
      mediumID: '95226d7e-7bae-465e-8b80-995587bb5971',
      mimeType: 'text/html',
      title: 'TwinCreator',
      url: 'https://twincreator.com/en',
    },
    {
      mediumID: '95226d7e-7bae-465e-8b80-995587bb5971',
      mimeType: 'text/html',
      title: 'MemoryTwin',
      url: 'https://memorytwin.com/en',
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
  ],
};
