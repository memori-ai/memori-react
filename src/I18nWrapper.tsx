import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { mathJaxConfig } from './helpers/utils';

export interface Props {
  children: React.ReactNode;
}

const I18nWrapper = ({ children }: Props) => {
  useEffect(() => {
    // @ts-ignore
    if (!window.MathJax) window.MathJax = mathJaxConfig;
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      {children}

      <script
        id="MathJax-script"
        async
        src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
      ></script>
    </I18nextProvider>
  );
};

export default I18nWrapper;
