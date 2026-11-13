import { getConversationTitle } from './conversationTitle';

const lines = (items: Array<{ inbound: boolean; text: string }>) => items;

describe('getConversationTitle', () => {
  it('ignores a backend title and scores the user messages', () => {
    expect(
      getConversationTitle({
        title: 'Checklist di produzione',
        lines: lines([
          {
            inbound: true,
            text: 'Quali microfoni usare per le riprese in interni?',
          },
        ]),
      })
    ).toBe('Quali microfoni usare per le riprese in interni?');
  });

  it('skips greetings and uses a later significant user message', () => {
    expect(
      getConversationTitle({
        lines: lines([
          { inbound: true, text: 'Ciao' },
          { inbound: false, text: 'Ciao, come posso aiutarti?' },
          {
            inbound: true,
            text: 'Quali microfoni usare per le riprese in interni?',
          },
        ]),
      })
    ).toBe('Quali microfoni usare per le riprese in interni?');
  });

  it('prefers the earlier user message when significance scores are close', () => {
    expect(
      getConversationTitle({
        lines: lines([
          { inbound: true, text: 'Come scegliere i microfoni giusti?' },
          { inbound: true, text: 'Come regolare le luci giuste?' },
        ]),
      })
    ).toBe('Come scegliere i microfoni giusti?');
  });

  it('truncates a long user message at 100 characters on a word boundary', () => {
    const firstUserMessage = 'word '.repeat(30).trim();
    expect(
      getConversationTitle({
        lines: lines([{ inbound: true, text: firstUserMessage }]),
      })
    ).toBe(`${'word '.repeat(19)}word...`);
  });

  it('keeps line breaks from the chosen user message', () => {
    expect(
      getConversationTitle({
        lines: lines([
          {
            inbound: true,
            text: 'Attrezzatura audio\nper le riprese in interni',
          },
        ]),
      })
    ).toBe('Attrezzatura audio\nper le riprese in interni');
  });

  it('strips markup from the chosen user message', () => {
    expect(
      getConversationTitle({
        lines: lines([
          {
            inbound: true,
            text: '<p>Quali microfoni <strong>usare</strong> in studio?</p>',
          },
        ]),
      })
    ).toBe('Quali microfoni usare in studio?');
  });

  it('returns an empty string when there is no user message', () => {
    expect(
      getConversationTitle({
        lines: lines([{ inbound: false, text: 'Solo la risposta del bot' }]),
      })
    ).toBe('');
  });
});
