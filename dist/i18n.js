"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const i18next_1 = require("i18next");
const it_json_1 = tslib_1.__importDefault(require("./locales/it.json"));
const en_json_1 = tslib_1.__importDefault(require("./locales/en.json"));
const fr_json_1 = tslib_1.__importDefault(require("./locales/fr.json"));
const de_json_1 = tslib_1.__importDefault(require("./locales/de.json"));
const es_json_1 = tslib_1.__importDefault(require("./locales/es.json"));
const resources = {
    en: {
        translation: en_json_1.default,
    },
    it: {
        translation: it_json_1.default,
    },
    es: {
        translation: es_json_1.default,
    },
    fr: {
        translation: fr_json_1.default,
    },
    de: {
        translation: de_json_1.default,
    },
};
const i18n = (0, i18next_1.createInstance)({
    resources,
    lng: 'en',
    fallbackLng: 'it',
    supportedLngs: ['en', 'it', 'fr', 'es', 'de'],
    nonExplicitSupportedLngs: true,
    interpolation: {
        escapeValue: false,
    },
});
i18n.init();
exports.default = i18n;
//# sourceMappingURL=i18n.js.map