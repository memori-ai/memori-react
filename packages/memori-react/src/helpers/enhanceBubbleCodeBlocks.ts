import { highlightUnder, loadPrism } from './prism';

export type BubbleCodeBlockLabels = {
  copy: string;
  copied: string;
};

const COPY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;

const CHECK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>`;

function languageFromCode(code: Element | null): string {
  if (!code) return '';
  const match = Array.from(code.classList)
    .map(c => c.match(/^language-([\w+-]+)/)?.[1])
    .find(Boolean);
  return match && match !== 'plaintext' && match !== 'text' ? match : '';
}

/**
 * Wraps each bare <pre> in a chat bubble with toolbar (lang + copy) and
 * runs Prism highlighting. Safe to call repeatedly; skips already-enhanced nodes.
 */
export function enhanceBubbleCodeBlocks(
  root: HTMLElement,
  labels: BubbleCodeBlockLabels
): () => void {
  const cleanups: Array<() => void> = [];
  const timers: number[] = [];

  root.querySelectorAll('pre').forEach(pre => {
    if (pre.closest('.memori-chat--code-block')) return;

    const code = pre.querySelector('code');
    const lang = languageFromCode(code);

    const wrapper = document.createElement('div');
    wrapper.className = 'memori-chat--code-block';

    const toolbar = document.createElement('div');
    toolbar.className = 'memori-chat--code-block-toolbar';

    if (lang) {
      const langEl = document.createElement('span');
      langEl.className = 'memori-chat--code-block-lang';
      langEl.textContent = lang;
      toolbar.appendChild(langEl);
    } else {
      const spacer = document.createElement('span');
      spacer.className = 'memori-chat--code-block-lang memori-chat--code-block-lang--empty';
      toolbar.appendChild(spacer);
    }

    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'memori-chat--code-block-copy';
    copyBtn.setAttribute('aria-label', labels.copy);
    copyBtn.title = labels.copy;
    copyBtn.innerHTML = COPY_ICON;

    let resetTimer: number | undefined;
    const onCopy = async (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      const text = code?.textContent ?? pre.textContent ?? '';
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          return;
        }
        copyBtn.classList.add('memori-chat--code-block-copy--copied');
        copyBtn.setAttribute('aria-label', labels.copied);
        copyBtn.title = labels.copied;
        copyBtn.innerHTML = CHECK_ICON;
        if (resetTimer) window.clearTimeout(resetTimer);
        resetTimer = window.setTimeout(() => {
          copyBtn.classList.remove('memori-chat--code-block-copy--copied');
          copyBtn.setAttribute('aria-label', labels.copy);
          copyBtn.title = labels.copy;
          copyBtn.innerHTML = COPY_ICON;
        }, 2000);
        timers.push(resetTimer);
      } catch (err) {
        console.error('Failed to copy code block:', err);
      }
    };

    copyBtn.addEventListener('click', onCopy);
    cleanups.push(() => {
      copyBtn.removeEventListener('click', onCopy);
      if (resetTimer) window.clearTimeout(resetTimer);
    });

    toolbar.appendChild(copyBtn);

    const parent = pre.parentNode;
    if (!parent) return;
    parent.insertBefore(wrapper, pre);
    wrapper.appendChild(toolbar);
    wrapper.appendChild(pre);
  });

  void loadPrism().then(() => {
    highlightUnder(root);
  });

  return () => {
    cleanups.forEach(fn => fn());
    timers.forEach(id => window.clearTimeout(id));
  };
}
