import { useState, useEffect } from 'react';

export const hasTouchscreen = (): boolean => {
  let hasTouchScreen = false;
  if ('maxTouchPoints' in navigator) {
    hasTouchScreen = navigator.maxTouchPoints > 0;
  } else if ('msMaxTouchPoints' in navigator) {
    hasTouchScreen = (navigator as any).msMaxTouchPoints > 0;
  } else {
    const mQ =
      window && 'matchMedia' in window && matchMedia('(pointer:coarse)');
    if (mQ && mQ.media === '(pointer:coarse)') {
      hasTouchScreen = !!mQ.matches;
    } else if ('orientation' in window) {
      hasTouchScreen = true; // deprecated, but good fallback
    } else {
      // Only as a last resort, fall back to user agent sniffing
      var UA = (navigator as any)?.userAgent;
      hasTouchScreen =
        /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
        /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA);
    }
  }

  //console.log('Has touch screen: ' + hasTouchScreen);
  return hasTouchScreen;
};

export const isiOS = (): boolean => {
  let platform =
    (navigator as any)?.userAgentData?.platform ||
    navigator?.platform ||
    'unknown';
  let userAgent = (navigator as any)?.userAgent || 'unknown';

  let isIOS =
    [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod',
    ].includes(platform) ||
    // iPad on iOS 13 detection
    (userAgent.includes('Mac') && 'ontouchend' in document);

  return isIOS;
};
export const isAndroid = (): boolean => {
  let platform =
    (navigator as any)?.userAgentData?.platform ||
    navigator?.platform ||
    'unknown';

  let isAndroid =
    platform.toLowerCase() === 'android' ||
    navigator.userAgent.includes('Android');

  //console.log('Is Android: ' + isAndroid);
  return isAndroid;
};

export const pwdRegEx =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$_:;|,~+={}[]%^&*-]).{8,}$/;
export const mailRegEx = /^\w+([.-]?[+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,4})+$/;
export const usernameRegEx = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.+-]{3,32}$/;
export const validURLRegEx = /^(ftp|http|https):\/\/[^ "]+$/;

export const isValidUrl = (url: string) => {
  try {
    return Boolean(new URL(url));
  } catch (e) {
    return false;
  }
};

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const stripDuplicates = (text: string) => {
  if (
    text
      .slice(0, text.length / 2)
      .trim()
      .toLowerCase() ===
    text
      .slice(text.length / 2 + 1)
      .trim()
      .toLowerCase()
  )
    return text.slice(0, text.length / 2);
  return text;
};

export const stripEmojis = (text: string) => {
  return text.replaceAll(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '').trim();
};

export const getFieldFromCustomData = (
  fieldName: string,
  data: string | undefined
) => {
  try {
    if (data) {
      const jsonData = JSON.parse(data);
      return jsonData[fieldName];
    }
    return '';
  } catch (error) {
    return '';
  }
};

export const stripObjNulls = (obj: { [key: string]: any }) => {
  const newObj = { ...obj };
  Object.keys(newObj).forEach(key => {
    if (newObj[key] === null) {
      delete newObj[key];
    }
  });
  return newObj;
};

/**
 * Find difference between two objects
 * @param  {object} origObj - Source object to compare newObj against
 * @param  {object} newObj  - New object with potential changes
 * @return {object} differences
 */
export const difference = (
  origObj: { [key: string]: any },
  newObj: { [key: string]: any }
): { [key: string]: any } =>
  Object.keys(newObj).reduce((diffs, key) => {
    let diff: { [key: string]: any } = { ...diffs };

    if (origObj[key] !== newObj[key]) {
      diff[key] = newObj[key];
    }

    return diff;
  }, {});
