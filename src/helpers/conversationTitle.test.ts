import { getConversationTitle } from './conversationTitle';

const lines = (items: Array<{ inbound: boolean; text: string }>) => items;

describe('getConversationTitle', () => {
  it('uses a short backend title when one is provided', () => {
    expect(
      getConversationTitle({
        title: '  Checklist di produzione  ',
        lines: lines([
          {
            inbound: true,
            text: 'A very long first user message that should not be used',
          },
        ]),
      })
    ).toBe('Checklist di produzione');
  });

  it('falls back to the first user message, collapsed onto one line', () => {
    expect(
      getConversationTitle({
        lines: lines([
          { inbound: false, text: 'Ciao, come posso aiutarti?' },
          {
            inbound: true,
            text: 'Attrezzatura audio\nper le riprese in interni',
          },
        ]),
      })
    ).toBe('Attrezzatura audio per le riprese in interni');
  });

  it('truncates a long first user message instead of keeping the full text', () => {
    const firstUserMessage = 'Parola '.repeat(40).trim();
    const title = getConversationTitle({
      lines: lines([{ inbound: true, text: firstUserMessage }]),
    });

    expect(title.includes('\n')).toBe(false);
    expect(title.length).toBeLessThan(firstUserMessage.length);
    expect(title.endsWith('...')).toBe(true);
  });

  it('strips markup from the fallback title', () => {
    expect(
      getConversationTitle({
        lines: lines([
          {
            inbound: true,
            text: '<p>Ciao, <strong>come va</strong>?</p>',
          },
        ]),
      })
    ).toBe('Ciao, come va?');
  });

  it('returns an empty string when there is no title and no user message', () => {
    expect(
      getConversationTitle({
        lines: lines([{ inbound: false, text: 'Solo la risposta del bot' }]),
      })
    ).toBe('');
  });
});
