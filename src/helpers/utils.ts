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
    ],
    displayMath: [['$$', '$$']],
    processEscapes: true,
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

export const safeParseJSON = (jsonString: string, fallbackString = false) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return fallbackString ? jsonString : null;
  }
};

/**
 * Detects if a string looks like CSV data and formats it as an HTML table
 * More aggressive detection for different formats
 * @param text The input text to check and format
 * @returns The formatted HTML or the original text if not CSV
 */
// Add this function to your ChatBubble.tsx file directly above the ChatBubble component

/**
 * Special function to detect and format CSV data in the specific format from your screenshot
 */
export const detectAndFormatCSV = (text: string): string => {
  // Check for the specific CSV patterns we see in the screenshot
  if (
    (text.includes('Area di riferimento') && text.includes('Mese di riferimeno')) ||
    (text.includes('Regione,Vendite,Crescita,Obiettivo,Performance')) ||
    (text.includes('Prodotto;Quantità;Prezzo;Totale;Disponibilità'))
  ) {
    let separator = '|';
    
    // Detect separator
    if (text.includes('Regione,Vendite,Crescita')) {
      separator = ',';
    } else if (text.includes('Prodotto;Quantità;Prezzo')) {
      separator = ';';
    }
    
    // Split lines and filter empty ones
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    if (lines.length < 2) return text;
    
    // Extract headers and data rows
    const headers = lines[0].split(separator).map(header => header.trim());
    const dataRows = lines.slice(1);
    
    // Build HTML table
    let htmlTable = '<div class="csv-table-container">';
    htmlTable += '<table class="csv-table">';
    
    // Add header row
    htmlTable += '<thead><tr>';
    headers.forEach(header => {
      htmlTable += `<th>${header}</th>`;
    });
    htmlTable += '</tr></thead>';
    
    // Add data rows
    htmlTable += '<tbody>';
    dataRows.forEach(row => {
      if (!row.trim()) return;
      
      const cells = row.split(separator).map(cell => cell.trim());
      
      htmlTable += '<tr>';
      cells.forEach((cell, index) => {
        // Format numbers nicely
        if (/^-?\d+(\.\d+)?$/.test(cell) && cell.length > 10) {
          const num = parseFloat(cell);
          if (!isNaN(num)) {
            cell = num.toFixed(2); // Format long numbers to 2 decimal places
          }
        }
        
        // Only add cells if we have headers for them
        if (index < headers.length) {
          htmlTable += `<td>${cell}</td>`;
        }
      });
      
      htmlTable += '</tr>';
    });
    
    htmlTable += '</tbody></table></div>';
    
    // Inline CSS for styling the table
    const styles = `
      <style>
        .csv-table-container {
          overflow-x: auto;
          margin: 10px 0;
          width: 100%;
        }
        .csv-table {
          border-collapse: collapse;
          width: 100%;
          font-size: 14px;
        }
        .csv-table th {
          background-color: #673AB7;
          color: white;
          text-align: left;
          padding: 8px;
          border: 1px solid #5e35b1;
        }
        .csv-table td {
          padding: 6px 8px;
          border: 1px solid #d1c4e9;
        }
        .csv-table tr:nth-child(even) {
          background-color: #f3e5f5;
        }
        .csv-table tr:nth-child(odd) {
          background-color: #ede7f6;
        }
      </style>
    `;
    
    return styles + htmlTable;
  }
  
  // If not matching our CSV patterns, return original text
  return text;
};