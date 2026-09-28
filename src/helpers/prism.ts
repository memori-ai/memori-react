const PRISM_SCRIPT_ID = 'memori-prism-script';
const PRISM_AUTOLOADER_ID = 'memori-prism-autoloader-script';
const PRISM_CSS_ID = 'memori-prism-css';

declare global {
  interface Window {
    Prism?: {
      highlightAll?: () => void;
      highlightAllUnder?: (element: HTMLElement) => void;
      highlightElement?: (element: Element) => void;
      plugins?: {
        autoloader?: {
          languages_path?: string;
        };
      };
    };
  }
}

let prismLoadPromise: Promise<void> | null = null;

/**
 * Lazily loads Prism (+ autoloader + tomorrow theme) once for the page.
 * Shared by Snippet and chat-bubble markdown code blocks.
 */
export function loadPrism(): Promise<void> {
  if (typeof document === 'undefined') {
    return Promise.resolve();
  }

  if (window.Prism?.highlightAll) {
    return Promise.resolve();
  }

  if (prismLoadPromise) {
    return prismLoadPromise;
  }

  prismLoadPromise = new Promise(resolve => {
    const existingScript = document.getElementById(PRISM_SCRIPT_ID);
    if (existingScript) {
      const finish = () => resolve();
      if (window.Prism?.highlightAll) {
        finish();
        return;
      }
      existingScript.addEventListener('load', finish);
      // Already loaded but Prism missing — resolve anyway to avoid hanging.
      setTimeout(finish, 2000);
      return;
    }

    if (!document.getElementById(PRISM_CSS_ID)) {
      const prismCss = document.createElement('link');
      prismCss.id = PRISM_CSS_ID;
      prismCss.rel = 'stylesheet';
      prismCss.href =
        'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css';
      document.head.appendChild(prismCss);
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js';
    script.async = true;
    script.id = PRISM_SCRIPT_ID;
    script.onload = () => {
      const autoloaderScript = document.createElement('script');
      autoloaderScript.src =
        'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js';
      autoloaderScript.async = true;
      autoloaderScript.id = PRISM_AUTOLOADER_ID;
      autoloaderScript.onload = () => {
        if (window.Prism?.plugins?.autoloader) {
          window.Prism.plugins.autoloader.languages_path =
            'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/';
        }
        resolve();
      };
      autoloaderScript.onerror = () => resolve();
      document.head.appendChild(autoloaderScript);
    };
    script.onerror = () => resolve();
    document.head.appendChild(script);
  });

  return prismLoadPromise;
}

export function highlightUnder(root: HTMLElement): void {
  if (!window.Prism) return;
  if (window.Prism.highlightAllUnder) {
    window.Prism.highlightAllUnder(root);
    return;
  }
  if (window.Prism.highlightAll) {
    window.Prism.highlightAll();
  }
}
