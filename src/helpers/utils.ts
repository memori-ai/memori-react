import { useState, useEffect, useRef, useMemo } from 'react';
import { Material, MeshStandardMaterial, SkinnedMesh } from 'three';
import * as THREE from 'three';

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
  // eslint-disable-next-line no-useless-escape
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$_:;|,~+=\{\}\[\]%^&*-]).{8,}$/;
export const mailRegEx = /^\w+([.-]?[+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
export const usernameRegEx = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.+-]{2,32}$/;
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

export function useDebounceFn<T extends (...args: any) => any>(
  fn: T,
  delay: number
): T {
  const timeoutId = useRef<number | undefined>();
  const originalFn = useRef<T | null>(null);

  useEffect(() => {
    originalFn.current = fn;
    return () => {
      originalFn.current = null;
    };
  }, [fn]);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutId.current);
    };
  }, []);

  return useMemo<T>(
    () =>
      ((...args: unknown[]) => {
        clearTimeout(timeoutId.current);

        timeoutId.current = window.setTimeout(() => {
          if (originalFn.current) {
            originalFn.current(...args);
          }
        }, delay);
      }) as unknown as T,
    [delay]
  );
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

export const stripMarkdown = (text: string) => {
  // Remove code blocks
  text = text.replaceAll(/```*?```/g, '');
  text = text.replaceAll(/```[\s\S]*?```/g, '');
  // Remove inline code
  text = text.replaceAll(/`[^`]*`/g, '');
  // Remove images
  text = text.replaceAll(/!\[[^\]]*\]\([^)]*\)/g, '');
  // Remove links but keep the text
  text = text.replaceAll(/\[([^\]]*)\]\([^)]*\)/g, '$1');
  // Remove blockquotes but keep the text
  text = text.replaceAll(/^> /gm, '');
  // Remove headings but keep the text
  text = text.replaceAll(/^#+ /gm, '');
  // Remove bold and italic symbols and keep the text
  text = text.replaceAll(/[*_]/g, '');
  // Remove horizontal rules
  text = text.replaceAll(/---/g, '');
  // Remove strikethrough and keep the text
  text = text.replaceAll(/~~/g, '');
  // Remove lists
  text = text.replaceAll(/^\s*[-*+] /gm, '');
  text = text.replaceAll(/^\s*\d+\.\s+/gm, '');
  // Remove tables
  text = text.replaceAll(/^\|.*\|$/gm, '');
  // Remove MathJax
  text = text.replaceAll(/\$\$[\s\S]*?\$\$/g, '');
  text = text.replaceAll(/\$[\s\S]*?\$/g, '');
  text = text.replaceAll(/\\\([\s\S]*?\\\)/g, '');
  text = text.replaceAll(/\\\[[\s\S]*?\\\]/g, '');
  // Remove extra spaces and newlines
  text = text.replaceAll(/\s+/g, ' ').trim();
  return text;
};

export const stripOutputTags = (text: string): string => {
  const outputTagRegex = /<output.*?<\/output>/gs;
  
  if (!outputTagRegex.test(text)) {
    return text;
  }

  const strippedText = text.replace(outputTagRegex, '');
  
  // Recursively strip nested output tags
  return stripOutputTags(strippedText);
};

export const stripHTML = (text: string) => {
  const el = document.createElement('div');
  el.innerHTML = text;
  return el.textContent || '';
};

export const escapeHTML = (text: string) => {
  const el = document.createElement('textarea');
  el.textContent = text;
  return el.innerHTML;
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

export function cleanUrl(href: string) {
  try {
    href = encodeURI(href).replace(/%25/g, '%');
  } catch (e) {
    return null;
  }
  return href;
}

export const mathJaxConfig = {
  startup: {
    elements: ['.memori-chat--bubble-content'],
  },
  options: {
    processHtmlClass: 'memori-chat--bubble-content',
  },
  tex: {
    inlineMath: [
      ['$', '$'],
      ['\\$', '\\$'],
      ['(', '\\)'],
      ['\\(', ')'],
      ['[', '\\]'],
      ['\\(', '\\)'],
      ['\\[', '\\]'],
      ['\\\\[', '\\\\]'],
      ['\\\\\\[', '\\\\\\]'],
      ['((', '))'],
    ],
    displayMath: [
      ['$$', '$$'],
      ['\\[[', '\\]]'],
      ['\\\\[[', '\\\\]]'],
      ['\\\\\\[[', '\\\\\\]]'],
    ],
    processEscapes: false,
  },
  asciimath: {
    fixphi: true,
    displaystyle: true,
    decimalsign: '.',
  },
  skipStartupTypeset: true,
  chtml: {
    displayAlign: 'left',
  },
  svg: {
    fontCache: 'global',
  },
};

export const installMathJaxScript = () => {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
  script.async = true;
  script.id = 'mathjax-script';
  document.head.appendChild(script);
};

export const installMathJax = () => {
  // @ts-ignore
  window.MathJax = mathJaxConfig;

  installMathJaxScript();
};
/**
 * Corrects materials by setting some specific properties.
 * This is often necessary when working with imported 3D models.
 *
 * @param materials - An object containing materials to be corrected.
 */
export function correctMaterials(materials: { [key: string]: Material }) {
  Object.values(materials).forEach(material => {
    if (material instanceof MeshStandardMaterial) {
      // Improve the material's appearance
      material.roughness = 0.8;
      material.metalness = 0.1;

      // Enable shadow casting and receiving
      material.shadowSide = 2; // FrontSide and BackSide

      // Improve texture rendering if the material uses textures
      if (material.map) {
        material.map.anisotropy = 16;
      }
    }
  });
}

/**
 * Type guard to check if an object is a SkinnedMesh.
 * This is useful when working with 3D models that may contain different types of meshes.
 *
 * @param object - The object to check.
 * @returns True if the object is a SkinnedMesh, false otherwise.
 */
export function isSkinnedMesh(object: any): object is SkinnedMesh {
  return object.isSkinnedMesh === true;
}

/**
 * Disposes of a Three.js object and its children recursively.
 * This is important for memory management, especially when removing objects from the scene.
 *
 * @param object - The Three.js object to dispose.
 */
export function disposeObject(object: any) {
  if ('geometry' in object && object.geometry instanceof THREE.BufferGeometry) {
    object.geometry.dispose();
  }

  if ('material' in object) {
    if (Array.isArray(object.material)) {
      if (Array.isArray(object.material)) {
        object.material.forEach((material: any) => {
          if (material instanceof THREE.Material) {
            material.dispose();
          }
        });
      } else if (object && object.material instanceof THREE.Material) {
        object.material.dispose();
      }
    }
  }

  if (object.children) {
    object.children.forEach(disposeObject);
  }
}
