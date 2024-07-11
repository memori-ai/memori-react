import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { mathJaxConfig } from './helpers/utils';

export interface Props {
  children: React.ReactNode;
}

const I18nWrapper = ({ children }: Props) => {
  return (
    <I18nextProvider i18n={i18n}>
      {children}

      <script
        dangerouslySetInnerHTML={{
          __html: `
          window.MathJax = ${JSON.stringify(mathJaxConfig)};
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
};

export default I18nWrapper;
