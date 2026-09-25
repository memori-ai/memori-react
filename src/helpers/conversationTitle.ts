import { stripHTML } from './utils';
import { stripAllInternalTags } from './message';

const TITLE_MAX_LENGTH = 140;

export type ConversationTitleLine = {
  inbound?: boolean;
  text?: string;
};

const toSingleLine = (value: string): string =>
  value.replace(/\s+/g, ' ').trim();

const truncateTitle = (value: string, maxLength = TITLE_MAX_LENGTH): string => {
  if (value.length <= maxLength) return value;
  const sliced = value.slice(0, maxLength).trimEnd();
  const lastSpace = sliced.lastIndexOf(' ');
  const cut = lastSpace > maxLength * 0.7 ? sliced.slice(0, lastSpace) : sliced;
  return `${cut}...`;
};

const cleanText = (value: string): string =>
  toSingleLine(stripHTML(stripAllInternalTags(value)));

/**
 * Short label for a past conversation.
 * Prefer a backend title when present; otherwise the first user message,
 * always as a single truncated line — never the full multiline text.
 */
export const getConversationTitle = ({
  title,
  lines,
}: {
  title?: string | null;
  lines: ConversationTitleLine[];
}): string => {
  const backendTitle = title ? cleanText(title) : '';
  if (backendTitle) return backendTitle;

  const firstUserMessage = lines.find(
    line => line.inbound && cleanText(line.text || '')
  );
  if (!firstUserMessage?.text) return '';

  return truncateTitle(cleanText(firstUserMessage.text));
};
