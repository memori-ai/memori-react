"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_i18next_1 = require("react-i18next");
const i18n_1 = tslib_1.__importDefault(require("./i18n"));
const I18nWrapper = ({ children }) => {
    return (0, jsx_runtime_1.jsx)(react_i18next_1.I18nextProvider, { i18n: i18n_1.default, children: children });
};
exports.default = I18nWrapper;
//# sourceMappingURL=I18nWrapper.js.map