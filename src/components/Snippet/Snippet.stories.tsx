import React from 'react';
import { Meta, Story } from '@storybook/react';
import I18nWrapper from '../../I18nWrapper';
import Snippet from './Snippet';
import { prismSyntaxLangs } from '../../helpers/constants';

import './Snippet.css';

const SnippetCode = `import type { Medium } from 'types';
import { prismSyntaxLangs } from 'helpers/constants';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx';
import scss from 'react-syntax-highlighter/dist/cjs/languages/prism/scss';
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash';
import python from 'react-syntax-highlighter/dist/cjs/languages/prism/python';
import cpp from 'react-syntax-highlighter/dist/cjs/languages/prism/cpp';

interface Props {
  medium: Medium;
  preview?: boolean;
}

// These have to match prismSyntaxLangs
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('scss', scss);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('cpp', cpp);

const Snippet = ({ medium, preview = false }: Props) => {
  return (
    <SyntaxHighlighter
      style={atomDark}
      showLineNumbers
      language={
        prismSyntaxLangs.find(
          (l) =>
            medium.mimeType === l.mimeType,
        )?.lang ?? 'text'
      }
    >
      {medium.content?.length && medium.content.length > 200 && preview
        ? \`\${medium.content.slice(0, 200)}\\n...\`
        : \`\${medium.content}\`}
    </SyntaxHighlighter>
  );
};

export default Snippet;
`;

const meta: Meta = {
  title: 'Snippet',
  component: Snippet,
  argTypes: {
    mimeType: {
      control: {
        type: 'select',
        options: prismSyntaxLangs.map(l => l.mimeType),
      },
    },
    content: {
      control: {
        type: 'text',
      },
    },
    preview: {
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

const Template: Story<{
  mimeType: string;
  content: string;
  preview?: boolean;
}> = args => (
  <I18nWrapper>
    <Snippet
      {...args}
      medium={{
        mediumID: '95226d7e-7bae-465e-8b80-995587bb5971',
        mimeType: args.mimeType,
        title: 'Snippet',
        content: args.content,
      }}
    />
  </I18nWrapper>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  mimeType: 'text/plain',
  content: 'Some text',
  preview: false,
};

export const WithoutCopyButton = Template.bind({});
WithoutCopyButton.args = {
  mimeType: 'text/plain',
  content: 'Some text',
  preview: false,
  showCopyButton: false,
};

export const JavaScript = Template.bind({});
JavaScript.args = {
  mimeType: 'text/javascript',
  content: "console.log('Hello World!');",
  preview: false,
};

export const JSXReact = Template.bind({});
JSXReact.args = {
  mimeType: 'text/javascript',
  content: SnippetCode,
  preview: false,
};

export const Preview = Template.bind({});
Preview.args = {
  mimeType: 'text/javascript',
  content: SnippetCode,
  preview: true,
};

export const CSS = Template.bind({});
CSS.args = {
  mimeType: 'text/css',
  content: 'body {\n  background-color: #f00;\n}',
  preview: false,
};

export const HTML = Template.bind({});
HTML.args = {
  mimeType: 'application/xml',
  content:
    '<!DOCTYPE html>\n<html>\n  <head>\n    <title>Page Title</title>\n  </head>\n  <body>\n    <h1>This is a Heading</h1>\n    <p>This is a paragraph.</p>\n  </body>\n</html>',
  preview: false,
};

export const TypeScript = Template.bind({});
TypeScript.args = {
  mimeType: 'text/ecmascript',
  content: `import type { Medium } from 'types';

interface Props {
  medium: Medium;
  preview?: boolean;
}

const Snippet = ({ medium, preview = false }: Props) => (
  <div>
    <p>{medium.content}</p>
  </div>
);

export default Snippet;
  `,
  preview: false,
};

export const JSON = Template.bind({});
JSON.args = {
  mimeType: 'application/json',
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
  preview: false,
};

export const Python = Template.bind({});
Python.args = {
  mimeType: 'text/x-python',
  content: `from plone import api

def get_user():
    return api.user.get_current()

def get_homepage():
    return api.portal.get_navigation_root(get_user())
  `,
  preview: false,
};

export const Bash = Template.bind({});
Bash.args = {
  mimeType: 'application/x-sh',
  content: `#!/bin/bash

echo "Hello World!"

for i in {1..10}
do
  echo $i
done
  `,
  preview: false,
};

export const CSharp = Template.bind({});
CSharp.args = {
  mimeType: 'text/x-c++src',
  content: `using System;

namespace HelloWorld
{
    class Hello
    {
        static void Main()
        {
            Console.WriteLine("Hello World!");
            Console.WriteLine("Press any key to exit.");
            Console.ReadKey();
        }
    }
}
  `,
  preview: false,
};

export const PHP = Template.bind({});
PHP.args = {
  mimeType: 'application/x-php',
  content: `$name = 'David';
$limit = 1;
// Prepare query
$stmt = $mysqli->prepare('SELECT age, address FROM students WHERE name = ? LIMIT ?');
// data types: i = integer, s = string, d = double, b = blog
$stmt->bind_param('si', $name, $limit);
// Execute query
$stmt->execute();
// Bind the result
$stmt->bind_result($age, address);
`,
  preview: false,
};

export const SQL = Template.bind({});
SQL.args = {
  mimeType: 'text/x-sql',
  content: `SELECT * FROM table;

SELECT * FROM table WHERE id = 1;

SELECT * FROM table WHERE id = 1 AND name = 'John';
  `,
  preview: false,
};

export const Ruby = Template.bind({});
Ruby.args = {
  mimeType: 'text/x-ruby',
  content: `puts 'Hello World!'

for i in 1..10
  puts i
end

puts 'Bye!'
  `,
  preview: false,
};
