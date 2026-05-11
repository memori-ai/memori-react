import { renderMsg, stripAttachmentTags, stripAllInternalTags } from './message';

describe('renderMsg', () => {
  it('should render message with reasoning and output tag adjacent correctly', () => {
    const problematicText =
      '<think>L\'utente vuole che io elenchi i parametri dell\'ALBERO ESISTENTE.</think>\n\n<output class="rails-query" style="display:none">\nproject = Project.find("68d99b05783713e16737d32b")\n</output>\n\nRecupero tutti i 7 parametri dell\'ALBERO ESISTENTE...';

    const result = renderMsg(problematicText, false, 'Reasoning...', true);

    expect(result.text).toBe(
      '<details class="memori-think"><summary>Reasoning...</summary>L\'utente vuole che io elenchi i parametri dell\'ALBERO ESISTENTE.</details>\n\n<output class="rails-query" style="display:none">\nproject = Project.find("68d99b05783713e16737d32b")\n</output>\n\n<p>Recupero tutti i 7 parametri dell\'ALBERO ESISTENTE...</p>'
    );
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
