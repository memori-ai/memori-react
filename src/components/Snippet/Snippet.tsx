import React from 'react';
import { Medium } from '@memori.ai/memori-api-client/dist/types';
import Button from '../ui/Button';
import Copy from '../icons/Copy';
import { prismSyntaxLangs } from '../../helpers/constants';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx';
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json';
import scss from 'react-syntax-highlighter/dist/cjs/languages/prism/scss';
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash';
import python from 'react-syntax-highlighter/dist/cjs/languages/prism/python';
import cpp from 'react-syntax-highlighter/dist/cjs/languages/prism/cpp';
import php from 'react-syntax-highlighter/dist/cjs/languages/prism/php';
import ruby from 'react-syntax-highlighter/dist/cjs/languages/prism/ruby';
import sql from 'react-syntax-highlighter/dist/cjs/languages/prism/sql';
import { useTranslation } from 'react-i18next';

export interface Props {
  medium: Medium;
  className?: string;
  preview?: boolean;
  showLineNumbers?: boolean;
  showCopyButton?: boolean;
}

// These have to match prismSyntaxLangs
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('scss', scss);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('cpp', cpp);
SyntaxHighlighter.registerLanguage('php', php);
SyntaxHighlighter.registerLanguage('ruby', ruby);
SyntaxHighlighter.registerLanguage('sql', sql);

const Snippet = ({
  medium,
  className,
  preview = false,
  showLineNumbers = true,
  showCopyButton = true,
}: Props) => {
  const { t } = useTranslation();

  return (
    <div className="memori-snippet">
      <div className="memori-snippet--content">
        <SyntaxHighlighter
          aria-labelledby={`#snippet-${medium.mediumID}`}
          className={className}
          style={atomDark}
          showLineNumbers={showLineNumbers}
          language={
            prismSyntaxLangs.find(l => medium.mimeType === l.mimeType)?.lang ??
            'text'
          }
        >
          {medium.content?.length && medium.content.length > 200 && preview
            ? `${medium.content.slice(0, 200)}\n...`
            : `${medium.content}`}
        </SyntaxHighlighter>
        {showCopyButton && (
          <Button
            padded={false}
            ghost
            className="memori-snippet--copy-button"
            title={t('copy') || 'Copy'}
            icon={<Copy />}
            onClick={() => navigator.clipboard.writeText(medium.content ?? '')}
          />
        )}
      </div>
      {!!medium.title?.length && (
        <p
          id={`snippet-${medium.mediumID}`}
          className="memori-snippet--caption"
        >
          {medium.title}
        </p>
      )}
    </div>
  );
};

export default Snippet;
