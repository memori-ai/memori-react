export type ReasoningExtract = {
  content: string;
  complete: boolean;
  remaining: string;
  hasReasoning: boolean;
};

const THINK_BLOCK_RE = /<think\b[^>]*>([\s\S]*?)(<\/think>|$)/gi;

export const extractReasoning = (text: string): ReasoningExtract => {
  if (!text || !/<think\b/i.test(text)) {
    return {
      content: '',
      complete: true,
      remaining: text ?? '',
      hasReasoning: false,
    };
  }

  const pieces: string[] = [];
  let complete = true;
  let remaining = '';
  let lastIndex = 0;

  const re = new RegExp(THINK_BLOCK_RE.source, 'gi');
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    remaining += text.slice(lastIndex, match.index);
    pieces.push(match[1] ?? '');
    if (match[2] !== '</think>') {
      complete = false;
      lastIndex = text.length;
      break;
    }
    lastIndex = match.index + match[0].length;
  }

  remaining += text.slice(lastIndex);

  return {
    content: pieces
      .map(piece => piece.trim())
      .filter(Boolean)
      .join('\n\n'),
    complete,
    remaining,
    hasReasoning: true,
  };
};
