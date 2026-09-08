"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeLocalConfig = exports.setLocalConfig = exports.getLocalConfig = exports.keys = void 0;
exports.keys = {
    muteSpeaker: '@memori:muteSpeaker',
    microphoneMode: '@memori:microphoneMode',
    continuousSpeechTimeout: '@memori:continuousSpeechTimeout',
    birthDate: '@memori:birthDate',
    controlsPosition: '@memori:controlsPosition',
    hideEmissions: '@memori:hideEmissions',
    loginToken: '@memori:loginToken',
    location: '@memori:location',
};
const getLocalConfig = (key, defaultValue) => {
    var _a;
    try {
        const value = window.localStorage.getItem((_a = exports.keys[key]) !== null && _a !== void 0 ? _a : key);
        if (!value)
            return defaultValue;
        try {
            return JSON.parse(value);
        }
        catch (_b) {
            return value;
        }
    }
    catch (error) {
        console.error('error', error);
        return defaultValue;
    }
};
exports.getLocalConfig = getLocalConfig;
const setLocalConfig = (key, value) => {
    var _a;
    try {
        window.localStorage.setItem((_a = exports.keys[key]) !== null && _a !== void 0 ? _a : key, value.toString());
    }
    catch (error) {
        console.error('error', error);
    }
};
exports.setLocalConfig = setLocalConfig;
const removeLocalConfig = (key) => {
    var _a;
    try {
        window.localStorage.removeItem((_a = exports.keys[key]) !== null && _a !== void 0 ? _a : key);
    }
    catch (error) {
        console.error('error', error);
    }
};
exports.removeLocalConfig = removeLocalConfig;
//# sourceMappingURL=configuration.js.map