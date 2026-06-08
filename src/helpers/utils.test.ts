import {
  difference,
  stripEmojis,
  stripMarkdown,
  stripOutputTags,
  escapeHTML,
  extractAttachmentLinks,
  extractAttachmentLink,
  isAssetOnlyDocumentAttachment,
  isOfficeNativeFilename,
  parseDocumentAttachmentsFromMessage,
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

describe('utils/attachment helpers', () => {
  it('extracts multiple attachment links in order', () => {
    const input = [
      '<document_attachment filename="a.docx" type="application/vnd.openxmlformats-officedocument.wordprocessingml.document">',
      '</document_attachment>',
      '<attachment_link>',
      'https://assets.example.com/a.docx',
      '</attachment_link>',
      '<document_attachment filename="b.pdf" type="application/pdf">',
      'pdf text',
      '</document_attachment>',
      '<attachment_link>https://assets.example.com/b.txt</attachment_link>',
    ].join('\n');

    expect(extractAttachmentLinks(input)).toEqual([
      'https://assets.example.com/a.docx',
      'https://assets.example.com/b.txt',
    ]);
  });

  it('extracts a single attachment link', () => {
    const input =
      '<attachment_link>\nhttps://assets.example.com/file.docx\n</attachment_link>';
    expect(extractAttachmentLink(input)).toBe(
      'https://assets.example.com/file.docx'
    );
  });

  it('detects office native filenames', () => {
    expect(isOfficeNativeFilename('report.doc')).toBe(true);
    expect(isOfficeNativeFilename('report.docx')).toBe(true);
    expect(isOfficeNativeFilename('budget.xls')).toBe(true);
    expect(isOfficeNativeFilename('template.XLTX')).toBe(true);
    expect(isOfficeNativeFilename('slides.potx')).toBe(true);
    expect(isOfficeNativeFilename('notes.pdf')).toBe(false);
    expect(isOfficeNativeFilename('data.xlsx')).toBe(false);
  });

  it('detects asset-only document attachments', () => {
    expect(
      isAssetOnlyDocumentAttachment({
        content: '',
        url: 'https://assets.example.com/file.docx',
      })
    ).toBe(true);
    expect(
      isAssetOnlyDocumentAttachment({
        content: 'extracted text',
        url: 'https://assets.example.com/file.txt',
      })
    ).toBe(false);
  });

  it('pairs each document attachment with its adjacent link', () => {
    const input = [
      '<attachment_link>https://assets.example.com/orphan.txt</attachment_link>',
      '<document_attachment filename="a.docx" type="application/vnd.openxmlformats-officedocument.wordprocessingml.document">',
      '</document_attachment>',
      '<attachment_link>https://assets.example.com/a.docx</attachment_link>',
      '<document_attachment filename="b.pdf" type="application/pdf">',
      'pdf text',
      '</document_attachment>',
      '<attachment_link>https://assets.example.com/b.txt</attachment_link>',
    ].join('\n');

    expect(parseDocumentAttachmentsFromMessage(input)).toEqual([
      {
        filename: 'a.docx',
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        content: '',
        url: 'https://assets.example.com/a.docx',
      },
      {
        filename: 'b.pdf',
        type: 'application/pdf',
        content: 'pdf text',
        url: 'https://assets.example.com/b.txt',
      },
    ]);
  });

  it('returns an empty url when no adjacent attachment link exists', () => {
    const input =
      '<document_attachment filename="a.docx" type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"></document_attachment>';

    expect(parseDocumentAttachmentsFromMessage(input)).toEqual([
      {
        filename: 'a.docx',
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        content: '',
        url: '',
      },
    ]);
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
