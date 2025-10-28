import React, { useEffect } from 'react';
import { Medium } from '@memori.ai/memori-api-client/dist/types';
import Button from '../ui/Button';
import Copy from '../icons/Copy';
import { prismSyntaxLangs } from '../../helpers/constants';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { stripDocumentAttachmentTags, stripOutputTags } from '../../helpers/utils';

export interface Props {
  medium: Medium;
  className?: string;
  preview?: boolean;
  showCopyButton?: boolean;
}

const loadPrismScripts = (): Promise<void> => {
  return new Promise((resolve) => {
    const existingScript = document.getElementById('memori-prism-script');
    if (existingScript) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js';
    script.async = true;
    script.id = 'memori-prism-script';
    script.onload = () => {
      // Load autoloader after main Prism script is loaded
      const autoloaderScript = document.createElement('script');
      autoloaderScript.src =
        'https://cdn.jsdelivr.net/npm/prismjs@v1.29.0/plugins/autoloader/prism-autoloader.min.js';
      autoloaderScript.async = true;
      autoloaderScript.id = 'memori-prism-autoloader-script';
      autoloaderScript.onload = () => {
        // Configure autoloader to use the same CDN
        // @ts-ignore
        // eslint-disable-next-line no-undef
        if (window.Prism && window.Prism.plugins && window.Prism.plugins.autoloader) {
          // @ts-ignore
          // eslint-disable-next-line no-undef
          window.Prism.plugins.autoloader.languages_path = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/';
        }
        resolve();
      };
      document.head.appendChild(autoloaderScript);
    };

    const prismCss = document.createElement('link');
    prismCss.rel = 'stylesheet';
    prismCss.href =
      'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css';

    document.head.appendChild(prismCss);
    document.head.appendChild(script);
  });
};

const Snippet = ({
  medium,
  className,
  preview = false,
  showCopyButton = true,
}: Props) => {
  const { t } = useTranslation();

  const highlightCode = () => {
    // @ts-ignore
    // eslint-disable-next-line no-undef
    if ('Prism' in window && window.Prism.highlightAll) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        // @ts-ignore
        // eslint-disable-next-line no-undef
        Prism.highlightAll();
      }, 100);
    }
  };

  useEffect(() => {
    loadPrismScripts().then(() => {
      highlightCode();
    });
  }, []);

  useEffect(() => {
    highlightCode();
  }, [medium.content, medium.mimeType]);

  return (
    <div className="memori-snippet">
      <div className="memori-snippet--content">
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
            {medium.content?.length && medium.content.length > 200 && preview
              ? `${stripDocumentAttachmentTags(medium.content)?.slice(0, 200)}\n...`
              : stripDocumentAttachmentTags(medium.content ?? '')}
          </code>
        </pre>

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
