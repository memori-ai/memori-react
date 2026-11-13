import { attachInPageAnchorNavigation } from './inPageAnchors';

const buildDocument = (body: string) => {
  const doc = document.implementation.createHTMLDocument('artifact');
  doc.body.innerHTML = body;
  return doc;
};

const click = (element: Element) => {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true });
  element.dispatchEvent(event);
  return event;
};

describe('attachInPageAnchorNavigation', () => {
  let scrollIntoView: jest.Mock;

  beforeEach(() => {
    scrollIntoView = jest.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
  });

  it('scrolls to the target section instead of navigating', () => {
    const doc = buildDocument(
      '<nav><a href="#piano">Piano</a></nav><section id="piano"></section>'
    );
    attachInPageAnchorNavigation(doc);

    const event = click(doc.querySelector('a')!);

    expect(event.defaultPrevented).toBe(true);
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    expect(scrollIntoView.mock.instances[0]).toBe(doc.getElementById('piano'));
  });

  it('handles clicks on elements nested inside the anchor', () => {
    const doc = buildDocument(
      '<a href="#finale"><span>Forma finale</span></a><section id="finale"></section>'
    );
    attachInPageAnchorNavigation(doc);

    const event = click(doc.querySelector('span')!);

    expect(event.defaultPrevented).toBe(true);
    expect(scrollIntoView.mock.instances[0]).toBe(doc.getElementById('finale'));
  });

  it('resolves encoded ids and named anchors', () => {
    const doc = buildDocument(
      '<a id="encoded" href="#forma%20finale">A</a><section id="forma finale"></section>' +
        '<a id="named" href="#vecchia">B</a><a name="vecchia"></a>'
    );
    attachInPageAnchorNavigation(doc);

    click(doc.getElementById('encoded')!);
    click(doc.getElementById('named')!);

    expect(scrollIntoView.mock.instances[0]).toBe(
      doc.getElementById('forma finale')
    );
    expect(scrollIntoView.mock.instances[1]).toBe(
      doc.querySelector('[name="vecchia"]')
    );
  });

  it('scrolls to the top for an empty fragment', () => {
    const doc = buildDocument('<a href="#">Torna su</a>');
    const scrollTo = jest.fn();
    Object.defineProperty(doc, 'defaultView', { value: { scrollTo } });
    attachInPageAnchorNavigation(doc);

    const event = click(doc.querySelector('a')!);

    expect(event.defaultPrevented).toBe(true);
    expect(scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('keeps the preview in place when the target does not exist', () => {
    const doc = buildDocument('<a href="#mancante">Mancante</a>');
    attachInPageAnchorNavigation(doc);

    const event = click(doc.querySelector('a')!);

    expect(event.defaultPrevented).toBe(true);
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it('leaves external and non-hash links alone', () => {
    const doc = buildDocument(
      '<a id="ext" href="https://memori.ai">Memori</a>' +
        '<a id="rel" href="pagina.html">Pagina</a>' +
        '<a id="blank" href="#piano" target="_blank">Nuova</a>' +
        '<section id="piano"></section>'
    );
    attachInPageAnchorNavigation(doc);

    expect(click(doc.getElementById('ext')!).defaultPrevented).toBe(false);
    expect(click(doc.getElementById('rel')!).defaultPrevented).toBe(false);
    expect(click(doc.getElementById('blank')!).defaultPrevented).toBe(false);
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it('stops intercepting once detached', () => {
    const doc = buildDocument(
      '<a href="#piano">Piano</a><section id="piano"></section>'
    );
    const detach = attachInPageAnchorNavigation(doc);
    detach();

    const event = click(doc.querySelector('a')!);

    expect(event.defaultPrevented).toBe(false);
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  describe('in a document with its own window', () => {
    let detach: () => void;

    beforeEach(() => {
      window.location.hash = '';
      document.body.innerHTML =
        '<a id="to-piano" href="#piano">Piano</a>' +
        '<a id="to-route" href="#/deal/42">Deal</a>' +
        '<a id="to-spaced" href="#forma finale">Forma finale</a>' +
        '<section id="piano"></section>' +
        '<section id="forma finale"></section>';
      detach = attachInPageAnchorNavigation(document);
    });

    afterEach(() => {
      detach();
      document.body.innerHTML = '';
    });

    it('updates the hash so :target and hashchange keep working', async () => {
      const hashChanged = new Promise(resolve =>
        window.addEventListener('hashchange', resolve, { once: true })
      );

      const event = click(document.getElementById('to-piano')!);

      expect(event.defaultPrevented).toBe(true);
      expect(window.location.hash).toBe('#piano');
      await expect(hashChanged).resolves.toBeDefined();
    });

    it('passes hash routes through even without a matching id', () => {
      click(document.getElementById('to-route')!);

      expect(window.location.hash).toBe('#/deal/42');
    });

    it('scrolls again when the hash is already current', () => {
      click(document.getElementById('to-piano')!);
      scrollIntoView.mockClear();

      click(document.getElementById('to-piano')!);

      expect(scrollIntoView).toHaveBeenCalledTimes(1);
      expect(scrollIntoView.mock.instances[0]).toBe(
        document.getElementById('piano')
      );
    });

    it('scrolls again for an unencoded hash that is already current', () => {
      click(document.getElementById('to-spaced')!);
      expect(window.location.hash).toBe('#forma%20finale');
      scrollIntoView.mockClear();

      click(document.getElementById('to-spaced')!);

      expect(scrollIntoView.mock.instances[0]).toBe(
        document.getElementById('forma finale')
      );
    });
  });
});
