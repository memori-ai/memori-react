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

export const JavaScript = Template.bind({});
JavaScript.args = {
  items: [
    {
      mediumID: '65ca4a6d-f20b-402e-9d79-5e470f247928',
      mimeType: 'text/javascript',
      title: 'JavaScript',
      content: `{
        "name": "John Doe",
        "age": 43,
        "city": "New York",
        "items": [
          {
            "name": "Item 1",
            "price": 10
          },
          {
            "name": "Item 2",
            "price": 20
          }
        ]
      }
        `,
    },
  ],
};

export const ShortCodeSnippets = Template.bind({});
ShortCodeSnippets.args = {
  items: [
    {
      mediumID: 'short-js-1',
      mimeType: 'text/javascript',
      title: 'Short JS Function',
      content: 'function greet() {\n  return "Hello World!";\n}',
    },
    {
      mediumID: 'short-python-1',
      mimeType: 'text/python',
      title: 'Python Print',
      content: 'print("Hello, World!")',
    },
    {
      mediumID: 'short-css-1',
      mimeType: 'text/css',
      title: 'CSS Rule',
      content: 'body {\n  background: #f0f0f0;\n  color: #333;\n}',
    },
  ],
};

export const LongCodeSnippets = Template.bind({});
LongCodeSnippets.args = {
  items: [
    {
      mediumID: 'long-js-1',
      mimeType: 'text/javascript',
      title: 'Long JavaScript Function',
      content: `function processData(data) {
  // Validate input
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid data provided');
  }
  
  // Process each item
  return data.map(item => {
    const processed = {
      id: item.id,
      name: item.name.toUpperCase(),
      value: item.value * 2,
      timestamp: new Date().toISOString()
    };
    
    return processed;
  });
}`,
    },
    {
      mediumID: 'long-python-1',
      mimeType: 'text/python',
      title: 'Python Class',
      content: `class DataProcessor:
    def __init__(self, config):
        self.config = config
        self.cache = {}
    
    def process(self, data):
        if data in self.cache:
            return self.cache[data]
        
        result = self._transform(data)
        self.cache[data] = result
        return result
    
    def _transform(self, data):
        # Complex transformation logic
        return data.upper()`,
    },
  ],
};

export const MixedSnippets = Template.bind({});
MixedSnippets.args = {
  items: [
    {
      mediumID: 'short-1',
      mimeType: 'text/javascript',
      title: 'Quick Function',
      content: 'const add = (a, b) => a + b;',
    },
    {
      mediumID: 'long-2',
      mimeType: 'text/javascript',
      title: 'Long JSON',
      content: `{
  "id": 1,
  "title": "Ciao",
  "description": "I'm a test!",
  "refs": [
    {
      "id": 1,
      "tag": "TEST"
    }
  ]
}
`,
    },
    {
      mediumID: 'long-3',
      mimeType: 'text/plain',
      title: 'Long Text',
      content: `{
  "id": 1,
  "title": "Ciao",
  "description": "I'm a test!",
  "refs": [
    {
      "id": 1,
      "tag": "TEST"
    }
  ]
}`,
    },
    {
      mediumID: 'long-1',
      mimeType: 'text/javascript',
      title: 'Complex Component',
      content: `import React, { useState, useEffect } from 'react';

const MyComponent = ({ data, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (data) {
      setLoading(true);
      processData(data)
        .then(result => {
          onUpdate(result);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [data, onUpdate]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>Data processed successfully</div>;
};

export default MyComponent;`,
    },
    {
      mediumID: 'short-2',
      mimeType: 'text/css',
      title: 'Simple Style',
      content: '.button {\n  padding: 10px;\n  background: blue;\n}',
    },
  ],
};

export const LongTXT = Template.bind({});
LongTXT.args = {
  items: [
    {
      mediumID: '65ca4a6d-f20b-402e-9d79-5e470f247928',
      mimeType: 'text/plain',
      title: 'Long Text',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.',
    },
  ],
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

export const AllImageTypes = Template.bind({});
AllImageTypes.args = {
  items: [
    {
      mediumID: 'img-png-1',
      mimeType: 'image/png',
      title: 'PNG Image',
      url: 'https://picsum.photos/300/200?random=1',
      content: 'https://picsum.photos/300/200?random=1',
    },
    {
      mediumID: 'img-jpeg-1',
      mimeType: 'image/jpeg',
      title: 'JPEG Image',
      url: 'https://picsum.photos/300/200?random=2',
      content: 'https://picsum.photos/300/200?random=2',
    },
    {
      mediumID: 'img-jpg-1',
      mimeType: 'image/jpg',
      title: 'JPG Image',
      url: 'https://picsum.photos/300/200?random=3',
      content: 'https://picsum.photos/300/200?random=3',
    },
    {
      mediumID: 'img-gif-1',
      mimeType: 'image/gif',
      title: 'GIF Image',
      url: 'https://picsum.photos/300/200?random=4',
      content: 'https://picsum.photos/300/200?random=4',
    },
    {
      mediumID: 'img-webp-1',
      mimeType: 'image/webp',
      title: 'WebP Image',
      url: 'https://picsum.photos/300/200?random=5',
      content: 'https://picsum.photos/300/200?random=5',
    },
    {
      mediumID: 'img-svg-1',
      mimeType: 'image/svg+xml',
      title: 'SVG Image',
      url: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect width="300" height="200" fill="%234CAF50"/%3E%3Ctext x="150" y="100" font-family="Arial" font-size="24" fill="white" text-anchor="middle"%3ESVG Image%3C/text%3E%3C/svg%3E',
      content: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect width="300" height="200" fill="%234CAF50"/%3E%3Ctext x="150" y="100" font-family="Arial" font-size="24" fill="white" text-anchor="middle"%3ESVG Image%3C/text%3E%3C/svg%3E',
    },
    {
      mediumID: 'img-bmp-1',
      mimeType: 'image/bmp',
      title: 'BMP Image',
      url: 'https://picsum.photos/300/200?random=6',
      content: 'https://picsum.photos/300/200?random=6',
    },
    {
      mediumID: 'img-tiff-1',
      mimeType: 'image/tiff',
      title: 'TIFF Image',
      url: 'https://picsum.photos/300/200?random=7',
      content: 'https://picsum.photos/300/200?random=7',
    },
    {
      mediumID: 'img-ico-1',
      mimeType: 'image/x-icon',
      title: 'ICO Image',
      url: 'https://picsum.photos/300/200?random=8',
      content: 'https://picsum.photos/300/200?random=8',
    },
  ],
};
