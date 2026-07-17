import { applyEdits, parseEdits } from './applyEdits';

describe('applyEdits', () => {
  it('applies an exact string replacement', () => {
    const result = applyEdits('Hello 🌰 World', [{ old: '🌰', new: '🥜' }]);
    expect(result.content).toBe('Hello 🥜 World');
    expect(result.appliedCount).toBe(1);
    expect(result.failedEdits).toEqual([]);
  });

  it('replaces only the first occurrence', () => {
    const result = applyEdits('aa bb aa', [{ old: 'aa', new: 'XX' }]);
    expect(result.content).toBe('XX bb aa');
    expect(result.appliedCount).toBe(1);
  });

  it('applies multiple edits sequentially', () => {
    const result = applyEdits('<h1>Title</h1><p>Body</p>', [
      { old: 'Title', new: 'Heading' },
      { old: 'Body', new: 'Content' },
    ]);
    expect(result.content).toBe('<h1>Heading</h1><p>Content</p>');
    expect(result.appliedCount).toBe(2);
  });

  it('falls back to whitespace-tolerant matching', () => {
    const content = '<span class="x">\n  hello   world\n</span>';
    const result = applyEdits(content, [
      { old: 'hello world', new: 'hi there' },
    ]);
    expect(result.content).toContain('hi there');
    expect(result.appliedCount).toBe(1);
    expect(result.failedEdits).toEqual([]);
  });

  it('collects failed edits without blocking others', () => {
    const result = applyEdits('alpha beta', [
      { old: 'missing', new: 'nope' },
      { old: 'beta', new: 'gamma' },
    ]);
    expect(result.content).toBe('alpha gamma');
    expect(result.appliedCount).toBe(1);
    expect(result.failedEdits).toEqual([{ old: 'missing', new: 'nope' }]);
  });

  it('returns original content when all edits fail', () => {
    const result = applyEdits('unchanged', [
      { old: 'foo', new: 'bar' },
    ]);
    expect(result.content).toBe('unchanged');
    expect(result.appliedCount).toBe(0);
    expect(result.failedEdits).toHaveLength(1);
  });
});

describe('parseEdits', () => {
  it('parses a valid JSON edits array', () => {
    const edits = parseEdits('[{"old": "a", "new": "b"}]');
    expect(edits).toEqual([{ old: 'a', new: 'b' }]);
  });

  it('unescapes HTML entities before parsing', () => {
    const edits = parseEdits(
      '[{&quot;old&quot;: &quot;🌰&quot;, &quot;new&quot;: &quot;🥜&quot;}]'
    );
    expect(edits).toEqual([{ old: '🌰', new: '🥜' }]);
  });

  it('returns null for invalid JSON', () => {
    expect(parseEdits('not json')).toBeNull();
  });

  it('returns null for non-array JSON', () => {
    expect(parseEdits('{"old":"a","new":"b"}')).toBeNull();
  });

  it('returns null for array items missing old/new', () => {
    expect(parseEdits('[{"foo":"bar"}]')).toBeNull();
  });

  it('returns null for empty body', () => {
    expect(parseEdits('')).toBeNull();
    expect(parseEdits('   ')).toBeNull();
  });
});
