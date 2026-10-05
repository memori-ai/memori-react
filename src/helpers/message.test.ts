import {
  renderMsg,
  sanitizeMsg,
  stripAttachmentTags,
  stripAllInternalTags,
} from './message';

describe('sanitizeMsg', () => {
  it('strips onerror from partner XSS img payload', () => {
    const payload =
      '<img src="immagine-inesistente.jpg" onerror="alert(\'XSS Eseguito!\')">';
    const result = sanitizeMsg(payload);
    expect(result).toBe('<img src="immagine-inesistente.jpg">');
    expect(result).not.toMatch(/onerror/i);
  });

  it('strips svg onload handlers', () => {
    const result = sanitizeMsg('<svg onload="alert(1)"></svg>');
    expect(result).not.toMatch(/onload/i);
  });
});

describe('renderMsg', () => {
  it('should render message with reasoning and output tag adjacent correctly', () => {
    const problematicText =
      '<think>L\'utente vuole che io elenchi i parametri dell\'ALBERO ESISTENTE.</think>\n\n<output class="rails-query" style="display:none">\nproject = Project.find("68d99b05783713e16737d32b")\n</output>\n\nRecupero tutti i 7 parametri dell\'ALBERO ESISTENTE...';

    const result = renderMsg(problematicText, false, 'Reasoning...', true);

    expect(result.text).toBe(
      '<details class="memori-think"><summary>Reasoning...</summary>L\'utente vuole che io elenchi i parametri dell\'ALBERO ESISTENTE.</details>\n\n<output class="rails-query" style="display:none">\nproject = Project.find("68d99b05783713e16737d32b")\n</output>\n\n<p>Recupero tutti i 7 parametri dell\'ALBERO ESISTENTE...</p>'
    );
  });

  it('strips onerror from XSS img payload in rendered output', () => {
    const payload =
      '<img src="immagine-inesistente.jpg" onerror="alert(\'XSS Eseguito!\')">';
    const result = renderMsg(payload, false, 'Reasoning...', false);
    expect(result.text).not.toMatch(/onerror/i);
  });

  it('renders bold, italic, lists, links and code blocks', () => {
    const text = [
      '**bold** and *italic*',
      '',
      '- first',
      '- second',
      '',
      '[docs](https://example.com)',
      '',
      '`inline`',
      '',
      '```js',
      'const x = 1;',
      '```',
    ].join('\n');

    const result = renderMsg(text, false, 'Reasoning...', false);

    expect(result.text).toContain('<strong>bold</strong>');
    expect(result.text).toContain('<em>italic</em>');
    expect(result.text).toContain('<li>first</li>');
    expect(result.text).toContain('<li>second</li>');
    expect(result.text).toContain(
      '<a href="https://example.com" target="_blank" rel="noopener noreferrer">docs</a>'
    );
    expect(result.text).toContain('<code>inline</code>');
    expect(result.text).toContain('<pre><code class="language-js">');
    expect(result.text).not.toContain('**bold**');
  });

  it('keeps single newlines as line breaks', () => {
    const result = renderMsg(
      '**12/10** — Qualità\n**13/10** — Logistica',
      false,
      'Reasoning...',
      false
    );

    expect(result.text).toContain('<strong>12/10</strong>');
    expect(result.text).toContain('<strong>13/10</strong>');
    expect(result.text).toContain('<br>');
    expect(result.text).not.toContain('**');
  });

  it('renders markdown that was wrapped in HTML blocks', () => {
    const result = renderMsg(
      '<p>**12/10** — Qualità</p><p>*italic* item</p><ul><li>**bold item**</li></ul>',
      false,
      'Reasoning...',
      false
    );

    expect(result.text).toContain('<strong>12/10</strong>');
    expect(result.text).toContain('<em>italic</em>');
    expect(result.text).toContain('<strong>bold item</strong>');
    expect(result.text).not.toContain('**');
  });

  it('keeps styled HTML layout intact', () => {
    const html =
      '<div style="width: 30%"><h3>Lenovo</h3><p>Prezzo: €194</p></div>';
    const result = renderMsg(html, false, 'Reasoning...', false);

    expect(result.text).toContain('style="width: 30%"');
    expect(result.text).toContain('<h3>Lenovo</h3>');
    expect(result.text).toContain('Prezzo: €194');
  });

  it('keeps HTML structure when rendering markdown inside it', () => {
    const result = renderMsg(
      '<ol><li>**uno**<ul><li>a</li></ul></li><li>due</li></ol>',
      false,
      'Reasoning...',
      false
    );

    expect(result.text).toBe(
      '<ol><li><strong>uno</strong><ul><li>a</li></ul></li><li>due</li></ol>'
    );
  });

  it('leaves tables, code and links untouched', () => {
    const table = renderMsg(
      '| A | B |\n|---|---|\n| riga1<br>riga2 | x |',
      false,
      'Reasoning...',
      false
    );
    expect(table.text).toContain('<td>riga1<br>riga2</td>');
    expect(table.text).toContain('<td>x</td>');

    const inlineCode = renderMsg(
      'Usa `<p>Ciao</p>` e `a＊b＊c`',
      false,
      'Reasoning...',
      false
    );
    expect(inlineCode.text).toContain('<code>&lt;p&gt;Ciao&lt;/p&gt;</code>');
    expect(inlineCode.text).toContain('<code>a＊b＊c</code>');

    const tildeFence = renderMsg(
      '~~~html\n<p>ciao</p>\n~~~',
      false,
      'Reasoning...',
      false
    );
    expect(tildeFence.text).toContain('&lt;p&gt;ciao&lt;/p&gt;');

    const anchor = renderMsg(
      '<p><a href="https://x.com/a_b_c">https://x.com/a_b_c</a> **ok**</p>',
      false,
      'Reasoning...',
      false
    );
    expect(anchor.text).toContain('>https://x.com/a_b_c</a> <strong>ok</strong>');
  });

  it('does not turn math operators into emphasis', () => {
    const result = renderMsg('f∗g∗h e 5 * 3 * 2', false, 'Reasoning...', false);

    expect(result.text).toContain('f∗g∗h');
    expect(result.text).toContain('5 * 3 * 2');
    expect(result.text).not.toContain('<em>');
  });

  it('renders fullwidth emphasis markers', () => {
    const result = renderMsg(
      '＊＊bold＊＊ and ＿italic＿',
      false,
      'Reasoning...',
      false
    );

    expect(result.text).toContain('<strong>bold</strong>');
    expect(result.text).toContain('<em>italic</em>');
  });
});

describe('stripAttachmentTags', () => {
  it('strips <document_attachment> tags', () => {
    const input = 'hello <document_attachment filename="note.md" type="text/markdown">some content</document_attachment> world';
    expect(stripAttachmentTags(input)).toBe('hello  world');
  });

  it('strips <attachment_source> tags', () => {
    const input = 'before <attachment_source>\nhttps://example.com/file.txt\n</attachment_source> after';
    expect(stripAttachmentTags(input)).toBe('before  after');
  });

  it('strips <attachment_link> tags', () => {
    const input = 'before <attachment_link>\nhttps://example.com/file.txt\n</attachment_link> after';
    expect(stripAttachmentTags(input)).toBe('before  after');
  });

  it('returns the same string when no tags are present', () => {
    expect(stripAttachmentTags('plain text')).toBe('plain text');
  });
});

describe('stripAllInternalTags', () => {
  it('strips <document> wrapper tags', () => {
    expect(stripAllInternalTags('<document name="a.pdf">inner</document>'))
      .toBe('inner');
  });

  it('strips <documents> wrapper tags', () => {
    expect(stripAllInternalTags('<documents>inner</documents>'))
      .toBe('inner');
  });

  it('strips <attachment> wrapper tags', () => {
    expect(stripAllInternalTags('<attachment name="file.txt">inner</attachment>'))
      .toBe('inner');
  });

  it('strips <attachments> wrapper tags', () => {
    expect(stripAllInternalTags('<attachments>inner</attachments>'))
      .toBe('inner');
  });

  it('strips self-closing document tags', () => {
    expect(stripAllInternalTags('before <document src="x" /> after'))
      .toBe('before  after');
  });

  it('strips asset URLs', () => {
    const input = 'hello\n\nhttps://assets-staging.memori.ai/api/v2/asset/abc-123.md\n\nworld';
    expect(stripAllInternalTags(input)).toBe('hello\n\nworld');
  });

  it('strips multiple asset URLs on separate lines', () => {
    const input = 'content\n\nhttps://assets-staging.memori.ai/api/v2/asset/abc.md\n\nhttps://assets-staging.memori.ai/api/v2/asset/def.txt';
    expect(stripAllInternalTags(input)).toBe('content');
  });

  it('strips all tag types and asset URLs combined', () => {
    const input = [
      '<documents>',
      '<document name="note.md">',
      'User question here',
      '</document>',
      '</documents>',
      '<attachment_source>https://example.com/source</attachment_source>',
      '<attachment_link>https://example.com/link</attachment_link>',
      'https://assets-staging.memori.ai/api/v2/asset/file.md',
    ].join('\n');
    expect(stripAllInternalTags(input)).toBe('User question here');
  });

  it('collapses excessive blank lines after stripping', () => {
    const input = 'hello\n\n\n\n\nworld';
    expect(stripAllInternalTags(input)).toBe('hello\n\nworld');
  });

  it('returns empty string for input that is only tags', () => {
    expect(stripAllInternalTags('<documents></documents>')).toBe('');
  });

  it('handles empty string', () => {
    expect(stripAllInternalTags('')).toBe('');
  });
});
