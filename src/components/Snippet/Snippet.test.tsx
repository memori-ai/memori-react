import React from 'react';
import { render } from '@testing-library/react';
import Snippet from './Snippet';

const SnippetCode = `
import type { Medium } from 'types';
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
        ? \`\${medium.content.slice(0, 200)}\n...\`
        : \`\${medium.content}\`}
    </SyntaxHighlighter>
  );
};

export default Snippet;
`;

it('renders SnippetUpload with js code', () => {
  const { container } = render(
    <Snippet
      medium={{
        mediumID: '95226d7e-7bae-465e-8b80-995587bb5971',
        mimeType: 'text/javascript',
        title: 'Snippet',
        content: 'console.log("Hello World!");',
      }}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders SnippetUpload with js code without line numbers', () => {
  const { container } = render(
    <Snippet
      medium={{
        mediumID: '95226d7e-7bae-465e-8b80-995587bb5971',
        mimeType: 'text/javascript',
        title: 'Snippet',
        content: 'console.log("Hello World!");',
      }}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders SnippetUpload with js code without copy button', () => {
  const { container } = render(
    <Snippet
      showCopyButton={false}
      medium={{
        mediumID: '95226d7e-7bae-465e-8b80-995587bb5971',
        mimeType: 'text/javascript',
        title: 'Snippet',
        content: 'console.log("Hello World!");',
      }}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders SnippetUpload with react/tsx code', () => {
  const { container } = render(
    <Snippet
      medium={{
        mediumID: '4946dca4-7103-4400-b80d-94b77f9a4f0a',
        mimeType: 'text/javascript',
        title: 'Snippet',
        content: SnippetCode,
      }}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders SnippetUpload with preview mode (clamping)', () => {
  const { container } = render(
    <Snippet
      medium={{
        mediumID: '38dd29a5-cdf6-40f6-963a-8e42a7caaac1',
        mimeType: 'text/javascript',
        title: 'Snippet',
        content: SnippetCode,
      }}
      preview
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders SnippetUpload with css code', () => {
  const { container } = render(
    <Snippet
      medium={{
        mediumID: 'a669fadb-12c0-469b-9b6c-34db22d371ca',
        mimeType: 'text/css',
        title: 'Snippet',
        content: 'body {\n  background-color: #f00;\n}',
      }}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders SnippetUpload with html code', () => {
  const { container } = render(
    <Snippet
      medium={{
        mediumID: '65ca4a6d-f20b-402e-9d79-5e470f247927',
        mimeType: 'application/xml',
        title: 'Snippet',
        content: '<p>ciao</p>',
      }}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders SnippetUpload with text', () => {
  const { container } = render(
    <Snippet
      medium={{
        mediumID: '43ac43b8-e220-4111-b89d-c5bfe8b031e2',
        mimeType: 'text/plain',
        title: 'Snippet',
        content: '<p>ciao</p>',
      }}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders SnippetUpload with text as fallback', () => {
  const { container } = render(
    <Snippet
      medium={{
        mediumID: 'cc8882fa-d7d5-435a-90a1-5c9f2a1bc918',
        mimeType: 'text/awanagana',
        title: 'Snippet',
        content: '<p>ciao</p>',
      }}
    />
  );
  expect(container).toMatchSnapshot();
});
