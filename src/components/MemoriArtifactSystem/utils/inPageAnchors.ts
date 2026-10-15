/**
 * A `srcdoc` iframe resolves relative URLs against the host page, so
 * `href="#section"` would load the host app inside the preview instead of
 * scrolling. Fragment-only links are handled here within the artifact document.
 */
const findFragmentTarget = (doc: Document, fragment: string) => {
  let id = fragment;
  try {
    id = decodeURIComponent(fragment);
  } catch {
    // Malformed escapes: fall back to the raw fragment.
  }
  return (
    doc.getElementById(id) ??
    doc.getElementsByName(id)[0] ??
    null
  );
};

export const attachInPageAnchorNavigation = (doc: Document): (() => void) => {
  const handleClick = (event: MouseEvent) => {
    if (event.defaultPrevented) return;

    // Elements live in the iframe realm, so `instanceof Element` is unreliable.
    const target = event.target as Element | null;
    const anchor = target?.closest?.('a[href]') as HTMLAnchorElement | null;
    if (!anchor) return;

    const href = anchor.getAttribute('href') ?? '';
    if (!href.startsWith('#')) return;

    const linkTarget = anchor.getAttribute('target');
    if (linkTarget && linkTarget !== '_self') return;

    event.preventDefault();

    const fragment = href.slice(1);
    if (!fragment || fragment.toLowerCase() === 'top') {
      doc.defaultView?.scrollTo(0, 0);
      return;
    }

    findFragmentTarget(doc, fragment)?.scrollIntoView({ block: 'start' });
  };

  doc.addEventListener('click', handleClick);
  return () => doc.removeEventListener('click', handleClick);
};
