import React, { useEffect, useState } from 'react';
import { Medium } from '@memori.ai/memori-api-client/dist/types';
import { Button } from '@memori.ai/ui';
import { Check, Copy } from 'lucide-react';
import { prismSyntaxLangs } from '../../helpers/constants';
import { highlightUnder, loadPrism } from '../../helpers/prism';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { stripDocumentAttachmentTags } from '../../helpers/utils';

export interface Props {
  medium: Medium;
  className?: string;
  preview?: boolean;
  showCopyButton?: boolean;
}

const Snippet = ({
  medium,
  className,
  preview = false,
  showCopyButton = true,
}: Props) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const highlightCode = () => {
    if (contentRef.current) {
      highlightUnder(contentRef.current);
    }
  };

  useEffect(() => {
    loadPrism().then(() => {
      highlightCode();
    });
  }, []);

  useEffect(() => {
    highlightCode();
  }, [medium.content, medium.mimeType]);

  const handleCopy = async () => {
    const contentToCopy = stripDocumentAttachmentTags(medium.content ?? '');
    try {
      await navigator.clipboard.writeText(contentToCopy);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  return (
    <div className={cx('memori-snippet', { 'memori-snippet--preview': preview })}>
      <div className="memori-snippet--content" ref={contentRef}>
        <pre
          className={cx('line-numbers', className)}
          aria-labelledby={
            !!medium.title?.length ? `#snippet-${medium.mediumID}` : undefined
          }
        >
          <code
            className={`language-${
              prismSyntaxLangs.find(l => medium.mimeType === l.mimeType)
                ?.lang ?? 'text'
            }`}
            data-language={
              prismSyntaxLangs.find(l => medium.mimeType === l.mimeType)
                ?.lang ?? 'text'
            }
          >
            {stripDocumentAttachmentTags(medium.content ?? '')}
          </code>
        </pre>

        {showCopyButton && (
          <div className="memori-snippet--copy-wrapper">
            <Button
              variant="ghost"
              shape="circle"
              className={cx('memori-snippet--copy-button', {
                'memori-snippet--copy-button--copied': copied,
              })}
              title={copied ? t('copied') || 'Copied' : t('copy') || 'Copy'}
              icon={copied ? <Check /> : <Copy />}
              onMouseDown={handleCopy}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Snippet;
