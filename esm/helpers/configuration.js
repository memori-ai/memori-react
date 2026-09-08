export const keys = {
    muteSpeaker: '@memori:muteSpeaker',
    microphoneMode: '@memori:microphoneMode',
    continuousSpeechTimeout: '@memori:continuousSpeechTimeout',
    birthDate: '@memori:birthDate',
    controlsPosition: '@memori:controlsPosition',
    hideEmissions: '@memori:hideEmissions',
    loginToken: '@memori:loginToken',
    location: '@memori:location',
};
export const getLocalConfig = (key, defaultValue) => {
    var _a;
    try {
        const value = window.localStorage.getItem((_a = keys[key]) !== null && _a !== void 0 ? _a : key);
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
export const setLocalConfig = (key, value) => {
    var _a;
    try {
        window.localStorage.setItem((_a = keys[key]) !== null && _a !== void 0 ? _a : key, value.toString());
    }
    catch (error) {
        console.error('error', error);
    }
};
export const removeLocalConfig = (key) => {
    var _a;
    try {
        window.localStorage.removeItem((_a = keys[key]) !== null && _a !== void 0 ? _a : key);
    }
    catch (error) {
        console.error('error', error);
    }
};
//# sourceMappingURL=configuration.js.map