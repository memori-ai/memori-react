import React from 'react';
import { Meta, Story } from '@storybook/react';
import I18nWrapper from '../../I18nWrapper';
import MediaItemWidget, { Props } from './MediaItemWidget';

import './MediaItemWidget.css';

const meta: Meta = {
  title: 'Media Widget/Media',
  component: MediaItemWidget,
  argTypes: {
    translateTo: {
      control: {
        type: 'select',
        items: ['IT', 'EN', 'DE', 'FR', 'ES', 'PT', 'RU', 'ZH'],
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<Props> = args => (
  <I18nWrapper>
    <MediaItemWidget {...args} />
  </I18nWrapper>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  items: [
    {
      mediumID: '95226d7e-7bae-465e-8b80-995587bb5971',
      mimeType: 'text/javascript',
      title: 'Snippet',
      content: "console.log('Hello World!');",
    },
    {
      mediumID: '95226d7e-7bae-465e-8b80-995587bb5972',
      mimeType: 'image/png',
      title: 'Image',
      url: 'https://picsum.photos/200/300',
      content: 'https://picsum.photos/200/300',
    },
    {
      mediumID: '95226d7e-7bae-465e-8b80-995587bb5973',
      mimeType: 'application/pdf',
      title: 'PDF',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      content:
        'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
    {
      mediumID: '95226d7e-7bae-465e-8b80-995587bb5974',
      mimeType: 'video/mp4',
      title: 'Video',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      content: 'https://www.w3schools.com/html/mov_bbb.mp4',
    },
    {
      mediumID: '95226d7e-7bae-465e-8b80-995587bb5975',
      mimeType: 'audio/mpeg',
      title: 'Audio',
      url: 'https://www.w3schools.com/html/horse.mp3',
      content: 'https://www.w3schools.com/html/horse.mp3',
    },
    {
      mediumID: '95226d7e-7bae-465e-8b80-995587bb5976',
      mimeType: 'application/msword',
      title: 'Word',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      content:
        'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
    {
      mediumID: '95226d7e-7bae-465e-8b80-995587bb5977',
      mimeType: 'application/vnd.ms-excel',
      title: 'Excel',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      content:
        'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
    {
      mediumID: '65ca4a6d-f20b-402e-9d79-5e470f247928',
      mimeType: 'image/png',
      title: 'Verde',
      url: 'rgb(0, 255, 0)',
    },
  ],
};

export const ImagesGrid = Template.bind({});
ImagesGrid.args = {
  items: Array.from({ length: 9 }, (_, i) => ({
    mediumID: `95226d7e-7bae-465e-8b80-995587bb597${i}`,
    mimeType: 'image/png',
    title: `Image ${i}`,
    url: `https://picsum.photos/${i % 2 ? '200' : '300'}/${
      i % 3 ? '300' : '200'
    }?random=${i}`,
  })),
};

export const WithCustomMediaRenderer = Template.bind({});
WithCustomMediaRenderer.args = {
  items: [
    {
      mediumID: '95226d7e-7bae-465e-8b80-995587bb5971',
      mimeType: 'image/png',
      title: 'Image',
      url: 'https://picsum.photos/200/300',
    },
    {
      mediumID: '95226d7e-7bae-465e-8b80-995587bb5973',
      mimeType: 'application/pdf',
      title: 'PDF',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      content:
        'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
  ],
  customMediaRenderer: (mimeType: string) => {
    if (mimeType === 'image/png') {
      return <div>Custom Image Renderer</div>;
    }
  },
};

export const WithRGBColors = Template.bind({});
WithRGBColors.args = {
  items: [
    {
      mediumID: '65ca4a6d-f20b-402e-9d79-5e470f247927',
      mimeType: 'image/png',
      title: 'Rosso',
      url: 'rgb(255, 0, 0)',
    },
    {
      mediumID: '65ca4a6d-f20b-402e-9d79-5e470f247928',
      mimeType: 'image/png',
      title: 'Verde',
      url: 'rgb(0, 255, 0)',
    },
    {
      mediumID: '65ca4a6d-f20b-402e-9d79-5e470f247929',
      mimeType: 'image/png',
      title: 'Blu',
      url: 'rgb(0, 0, 255)',
    },
  ],
};
