import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

export interface Props {
  children: React.ReactNode;
}

const I18nWrapper = ({ children }: Props) => {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default I18nWrapper;
