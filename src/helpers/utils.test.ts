import {
  difference,
  stripEmojis,
  stripMarkdown,
  stripOutputTags,
  escapeHTML,
} from './utils';

describe('Utils/difference', () => {
  it('should return the difference between two objects with numeric values', () => {
    const obj1 = { a: 1, b: 2, c: 3 };
    const obj2 = { a: 1, b: 2, c: 4 };
    const result = difference(obj1, obj2);
    expect(result).toEqual({ c: 4 });
  });

  it('should return the difference between two objects with new properties and strings', () => {
    const obj1 = { a: 1, c: '' };
    const obj2 = { a: 1, b: '', c: 'ciao' };
    const result = difference(obj1, obj2);
    expect(result).toEqual({ b: '', c: 'ciao' });
  });

  it('should return the difference between two objects from null or undefined', () => {
    const obj1 = { a: 1, c: null };
    const obj2 = { a: 1, b: '', c: 'ciao' };
    const result = difference(obj1, obj2);
    expect(result).toEqual({ b: '', c: 'ciao' });
  });

  it('should return the difference between two objects with lists', () => {
    const obj1 = { a: [], b: 'thesame' };
    const obj2 = { a: ['alpha', 'beta', 'gamma'], b: 'thesame' };
    const result = difference(obj1, obj2);
    expect(result).toEqual({ a: ['alpha', 'beta', 'gamma'] });
  });
});

describe('utils/stripEmojis', () => {
  it('should strip emojis from a string', () => {
    const text = 'Hello 👋🏻';
    const result = stripEmojis(text);
    expect(result).toEqual('Hello');
  });

  it('should strip emojis from a string with multiple emojis', () => {
    const text = '😊 Hello 😉🤪♥️';
    const result = stripEmojis(text);
    expect(result).toEqual('Hello');
  });
});

describe('utils/stripMarkdown', () => {
  it('should strip markdown headings from a string', () => {
    const result = stripMarkdown('# Hello');
    expect(result).toEqual('Hello');
  });

  it('should strip markdown bold and italic from a string', () => {
    const result = stripMarkdown('**Hello** _world_');
    expect(result).toEqual('Hello world');
  });

  it('should strip markdown links from a string', () => {
    const result = stripMarkdown('[example.com](https://example.com)');
    expect(result).toEqual('example.com');
  });

  it('should strip markdown images from a string', () => {
    const result = stripMarkdown('![example.com](https://example.com)');
    expect(result).toEqual('');
  });

  it('should strip markdown blockquotes from a string', () => {
    const result = stripMarkdown('> Hello');
    expect(result).toEqual('Hello');
  });

  it('should strip markdown horizontal rules from a string', () => {
    const result = stripMarkdown('---');
    expect(result).toEqual('');
  });

  it('should strip markdown strikethrough from a string', () => {
    const result = stripMarkdown('~~Hello~~');
    expect(result).toEqual('Hello');
  });

  it('should strip markdown code blocks from a string', () => {
    const result = stripMarkdown('```Hello```');
    expect(result).toEqual('');
  });

  it('should strip markdown multiline code blocks from a string', () => {
    const result = stripMarkdown('```\nHello\n```');
    expect(result).toEqual('');
  });

  it('should strip markdown inline code from a string', () => {
    const result = stripMarkdown('`Hello`');
    expect(result).toEqual('');
  });

  it('should strip markdown lists from a string', () => {
    const result = stripMarkdown('- Hello');
    expect(result).toEqual('Hello');
  });

  it('should strip markdown tables from a string', () => {
    const result = stripMarkdown('| Hello |');
    expect(result).toEqual('');
  });

  it('should strip block mathjax from a string', () => {
    const result = stripMarkdown('\\[ c = \\sqrt{a^2 + b^2} \\]');
    expect(result).toEqual('');
  });

  it('should strip block mathjax from a string with multiple lines', () => {
    const result = stripMarkdown('$$\nHello\n$$');
    expect(result).toEqual('');
  });

  it('should strip inline mathjax from a string', () => {
    const result = stripMarkdown('\\( f_m \\)');
    expect(result).toEqual('');
  });
});

describe('utils/stripOutputTags', () => {
  it('should remove output tag', () => {
    const result = stripOutputTags('test\n<output>pippo</output>');
    expect(result).toEqual('test\n');
  });

  it('should remove output tag with class', () => {
    const result = stripOutputTags(
      'test\n<output class="memori-output">pippo</output>'
    );
    expect(result).toEqual('test\n');
  });
});

describe('utils/parsing combined', () => {
  it('should remove output tag from real message', () => {
    const result = escapeHTML(
      stripMarkdown(
        stripEmojis(
          stripOutputTags(`Beh... grazie, davvero. Non so cosa dire, sono lusingata. Ma... mi scusi se glielo chiedo, è sicuro che non ci sia stato un errore? Di solito ricevo più critiche che complimenti per il mio lavoro. So di impegnarmi molto, faccio spesso straordinari e salto persino la pausa pranzo per finire le pratiche. Però mi rendo conto che a volte ci sono imprecisioni e ritardi nelle consegne... Forse c'è qualcosa che non sto capendo?

    <output class="memori-emotion">["timore"]</output>`)
        )
      )
    );
    expect(result).toEqual(
      `Beh... grazie, davvero. Non so cosa dire, sono lusingata. Ma... mi scusi se glielo chiedo, è sicuro che non ci sia stato un errore? Di solito ricevo più critiche che complimenti per il mio lavoro. So di impegnarmi molto, faccio spesso straordinari e salto persino la pausa pranzo per finire le pratiche. Però mi rendo conto che a volte ci sono imprecisioni e ritardi nelle consegne... Forse c'è qualcosa che non sto capendo?`
    );
  });
});
