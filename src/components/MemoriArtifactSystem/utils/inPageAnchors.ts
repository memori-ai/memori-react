/**
 * A `srcdoc` iframe resolves relative URLs against the host page, so
 * `href="#section"` would load the host app inside the preview instead of
 * navigating within the artifact. Fragment-only links are handled here.
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

    // Assigning `location.hash` stays relative to `about:srcdoc`, so the
    // browser scrolls, applies `:target` and fires `hashchange` natively.
    // It does nothing when the hash is unchanged, hence the manual scroll.
    const view = doc.defaultView;
    if (view?.location) {
      const previousHash = view.location.hash;
      view.location.hash = href;
      if (view.location.hash !== previousHash) return;
    }

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
