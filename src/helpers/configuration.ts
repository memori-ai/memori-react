export const keys: { [key: string]: string } = {
  muteSpeaker: '@memori:muteSpeaker',
  microphoneMode: '@memori:microphoneMode',
  continuousSpeechTimeout: '@memori:continuousSpeechTimeout',
  birthDate: '@memori:birthDate',
  controlsPosition: '@memori:controlsPosition',
  hideEmissions: '@memori:hideEmissions',
  loginToken: '@memori:loginToken',
  location: '@memori:location',
};

export const getLocalConfig = <Type>(key: string, defaultValue: Type): Type => {
  try {
    const value = window.localStorage.getItem(keys[key] ?? key);
    if (!value) return defaultValue;

    try {
      return JSON.parse(value) as unknown as Type;
    } catch {
      return value as unknown as Type;
    }
  } catch (error) {
    console.error('error', error);
    return defaultValue;
  }
};

export const setLocalConfig = (key: string, value: any): void => {
  try {
    window.localStorage.setItem(keys[key] ?? key, value.toString());
  } catch (error) {
    console.error('error', error);
  }
};

export const removeLocalConfig = (key: string): void => {
  try {
    window.localStorage.removeItem(keys[key] ?? key);
  } catch (error) {
    console.error('error', error);
  }
};
