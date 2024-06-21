import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

export interface Props {
  children: React.ReactNode;
}

const I18nWrapper = ({ children }: Props) => (
  <I18nextProvider i18n={i18n}>
    {children}

    <script
      dangerouslySetInnerHTML={{
        __html: `
          window.MathJax = {
            startup: {
              elements: ['.memori-chat--bubble-content'],
            },
            options: {
              processHtmlClass: 'memori-chat--bubble-content',
            },
            tex: {
              inlineMath: [
                ['$', '$'],
                ['\\$', '\\$'],
                ['(', '\\)'],
                ['\\(', ')'],
                ['(', ')'],
                ['[', '\\]'],
                ['[', ']'],
                ['\\(', '\\)'],
                ['\\[', '\\]'],
                ['\\\\[', '\\\\]'],
                ['\\\\\\[', '\\\\\\]'],
                ['((', '))'],
              ],
              displayMath: [
                ['$$', '$$'],
                ['\\[[', '\\]]'],
                ['\\\\[[', '\\\\]]'],
                ['\\\\\\[[', '\\\\\\]]'],
              ],
              processEscapes: true,
            },
            asciimath: {
              fixphi: true,
              displaystyle: true,
              decimalsign: '.'
            },
            skipStartupTypeset: true,
            chtml: {
              displayAlign: 'left',
            },
            svg: {
              fontCache: 'global'
            }
          };
        `,
      }}
    />
    <script
      id="MathJax-script"
      async
      src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
    ></script>
  </I18nextProvider>
);

export default I18nWrapper;
