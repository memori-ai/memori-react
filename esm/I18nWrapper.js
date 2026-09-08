import { jsx as _jsx } from "react/jsx-runtime";
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
const I18nWrapper = ({ children }) => {
    return _jsx(I18nextProvider, { i18n: i18n, children: children });
};
export default I18nWrapper;
//# sourceMappingURL=I18nWrapper.js.map