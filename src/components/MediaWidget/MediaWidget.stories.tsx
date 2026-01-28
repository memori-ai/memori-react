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

export const AllMediaTypes = Template.bind({});
AllMediaTypes.args = {
  media: [
    // Images
    {
      mediumID: 'img-jpeg-1',
      mimeType: 'image/jpeg',
      title: 'JPEG Image',
      url: 'https://picsum.photos/300/200?random=1',
    },
    {
      mediumID: 'img-png-1',
      mimeType: 'image/png',
      title: 'PNG Image',
      url: 'https://picsum.photos/300/200?random=2',
    },
    {
      mediumID: 'img-jpg-1',
      mimeType: 'image/jpg',
      title: 'JPG Image',
      url: 'https://picsum.photos/300/200?random=3',
    },
    {
      mediumID: 'img-gif-1',
      mimeType: 'image/gif',
      title: 'GIF Image',
      url: 'https://picsum.photos/300/200?random=4',
    },
    // Videos
    {
      mediumID: 'video-mp4-1',
      mimeType: 'video/mp4',
      title: 'MP4 Video',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    },
    {
      mediumID: 'video-quicktime-1',
      mimeType: 'video/quicktime',
      title: 'QuickTime Video',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    },
    {
      mediumID: 'video-avi-1',
      mimeType: 'video/avi',
      title: 'AVI Video',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    },
    {
      mediumID: 'video-mpeg-1',
      mimeType: 'video/mpeg',
      title: 'MPEG Video',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    },
    // Audio
    {
      mediumID: 'audio-mpeg-1',
      mimeType: 'audio/mpeg',
      title: 'MPEG Audio',
      url: 'https://www.w3schools.com/html/horse.mp3',
    },
    {
      mediumID: 'audio-mpeg3-1',
      mimeType: 'audio/mpeg3',
      title: 'MPEG3 Audio',
      url: 'https://www.w3schools.com/html/horse.mp3',
    },
    {
      mediumID: 'audio-wav-1',
      mimeType: 'audio/wav',
      title: 'WAV Audio',
      url: 'https://www.w3schools.com/html/horse.mp3',
    },
    // Documents
    {
      mediumID: 'doc-pdf-1',
      mimeType: 'application/pdf',
      title: 'PDF Document',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
    {
      mediumID: 'doc-word-1',
      mimeType: 'application/msword',
      title: 'Word Document (.doc)',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
    {
      mediumID: 'doc-wordx-1',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      title: 'Word Document (.docx)',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
    {
      mediumID: 'doc-excel-1',
      mimeType: 'application/vnd.ms-excel',
      title: 'Excel Document (.xls)',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
    {
      mediumID: 'doc-excelx-1',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      title: 'Excel Document (.xlsx)',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
    // Code Snippets
    {
      mediumID: 'code-js-1',
      mimeType: 'text/javascript',
      title: 'JavaScript Code',
      content: "function greet() {\n  return 'Hello World!';\n}\n\nconsole.log(greet());",
    },
    {
      mediumID: 'code-ts-1',
      mimeType: 'text/ecmascript',
      title: 'TypeScript Code',
      content: "interface User {\n  name: string;\n  age: number;\n}\n\nconst user: User = { name: 'John', age: 30 };",
    },
    {
      mediumID: 'code-json-1',
      mimeType: 'application/json',
      title: 'JSON Data',
      content: '{\n  "name": "John Doe",\n  "age": 43,\n  "city": "New York"\n}',
    },
    {
      mediumID: 'code-css-1',
      mimeType: 'text/css',
      title: 'CSS Styles',
      content: 'body {\n  background: #f0f0f0;\n  color: #333;\n  font-family: Arial, sans-serif;\n}',
    },
    {
      mediumID: 'code-xml-1',
      mimeType: 'application/xml',
      title: 'XML Document',
      content: '<?xml version="1.0"?>\n<root>\n  <item>Value</item>\n</root>',
    },
    {
      mediumID: 'code-bash-1',
      mimeType: 'application/x-sh',
      title: 'Bash Script',
      content: '#!/bin/bash\n\necho "Hello World"\nls -la',
    },
    {
      mediumID: 'code-python-1',
      mimeType: 'text/x-python',
      title: 'Python Code',
      content: 'def greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("World"))',
    },
    {
      mediumID: 'code-cpp-1',
      mimeType: 'text/x-c++src',
      title: 'C++ Code',
      content: '#include <iostream>\n\nint main() {\n    std::cout << "Hello World" << std::endl;\n    return 0;\n}',
    },
    {
      mediumID: 'code-php-1',
      mimeType: 'application/x-php',
      title: 'PHP Code',
      content: '<?php\nfunction greet($name) {\n    return "Hello, " . $name . "!";\n}\n\necho greet("World");\n?>',
    },
    {
      mediumID: 'code-ruby-1',
      mimeType: 'text/x-ruby',
      title: 'Ruby Code',
      content: 'def greet(name)\n  "Hello, #{name}!"\nend\n\nputs greet("World")',
    },
    {
      mediumID: 'code-sql-1',
      mimeType: 'text/x-sql',
      title: 'SQL Query',
      content: 'SELECT * FROM users\nWHERE age > 18\nORDER BY name ASC;',
    },
    {
      mediumID: 'code-text-1',
      mimeType: 'text/plain',
      title: 'Plain Text',
      content: 'This is a plain text file.\nIt can contain multiple lines.\nAnd various content.',
    },
    // HTML
    {
      mediumID: 'html-1',
      mimeType: 'text/html',
      title: 'HTML Content',
      content: '<div><h1>HTML Preview</h1><p>This is HTML content.</p></div>',
    },
    // 3D Model
    {
      mediumID: 'model-1',
      mimeType: 'model/gltf-binary',
      title: '3D Model (GLTF)',
      url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
    },
  ],
};
