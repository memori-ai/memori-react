export const keys: { [key: string]: string } = {
  muteSpeaker: '@memori:muteSpeaker',
  microphoneMode: '@memori:microphoneMode',
  continuousSpeechTimeout: '@memori:continuousSpeechTimeout',
  sendOnEnter: '@memori:sendOnEnter',
  birthDate: '@memori:birthDate',
  controlsPosition: '@memori:controlsPosition',
  hideEmissions: '@memori:hideEmissions',
};

export const getLocalConfig = <Type>(key: string, defaultValue: Type): Type => {
  const value = window.localStorage.getItem(keys[key] ?? key);
  if (!value) return defaultValue;

  try {
    return JSON.parse(value) as unknown as Type;
  } catch {
    return value as unknown as Type;
  }
};

export const setLocalConfig = (key: string, value: any): void => {
  window.localStorage.setItem(keys[key] ?? key, value.toString());
};
