import { extractReasoning } from './reasoning';

describe('extractReasoning', () => {
  it('returns the original text when there are no think tags', () => {
    expect(extractReasoning('Hello there')).toEqual({
      content: '',
      complete: true,
      remaining: 'Hello there',
      hasReasoning: false,
    });
  });

  it('extracts a complete think block and leaves the answer', () => {
    const result = extractReasoning(
      '<think>The user said hi.</think>\n\nHello! How can I help?'
    );

    expect(result.hasReasoning).toBe(true);
    expect(result.complete).toBe(true);
    expect(result.content).toBe('The user said hi.');
    expect(result.remaining).toBe('\n\nHello! How can I help?');
  });

  it('treats an unclosed think tag as streaming', () => {
    const result = extractReasoning(
      '<think>The user asked whether I am available.'
    );

    expect(result.hasReasoning).toBe(true);
    expect(result.complete).toBe(false);
    expect(result.content).toBe('The user asked whether I am available.');
    expect(result.remaining).toBe('');
  });

  it('does not leak an unclosed think block into the remaining answer', () => {
    const result = extractReasoning('<think>Still thinking about the request');

    expect(result.remaining).not.toContain('Still thinking');
    expect(result.remaining).not.toContain('<think');
  });

  it('joins multiple think blocks', () => {
    const result = extractReasoning(
      '<think>first</think>\nHello\n<think>second</think>\nWorld'
    );

    expect(result.complete).toBe(true);
    expect(result.content).toBe('first\n\nsecond');
    expect(result.remaining).toBe('\nHello\n\nWorld');
  });

  it('keeps an empty think tag as reasoning without content', () => {
    const result = extractReasoning('<think></think>\nDone.');

    expect(result.hasReasoning).toBe(true);
    expect(result.complete).toBe(true);
    expect(result.content).toBe('');
    expect(result.remaining).toBe('\nDone.');
  });

  it('handles think tags with attributes', () => {
    const result = extractReasoning('<think hidden>secret</think>Visible');

    expect(result.content).toBe('secret');
    expect(result.remaining).toBe('Visible');
  });
});
