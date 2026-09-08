import React from 'react';
import { ReactNode } from 'react';
import { WithTranslation } from 'react-i18next';
interface Props extends WithTranslation {
    fallback?: ReactNode;
    children: ReactNode;
}
declare const _default: React.ComponentType<Omit<import("react-i18next").Subtract<Props, import("react-i18next").WithTranslationProps>, keyof WithTranslation<N, undefined>> & import("react-i18next").WithTranslationProps>;
export default _default;
