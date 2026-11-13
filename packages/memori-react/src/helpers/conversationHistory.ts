import { parseTimestamp } from './relativeTime';

const DAY = 24 * 60 * 60 * 1000;

export type ConversationGroupKey =
  | { type: 'thisWeek' }
  | { type: 'month'; year: number; month: number };

const startOfDay = (date: Date): Date => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
};

const startOfWeek = (date: Date): Date => {
  const next = startOfDay(date);
  const weekday = next.getDay();
  const mondayOffset = (weekday + 6) % 7;
  next.setDate(next.getDate() - mondayOffset);
  return next;
};

const capitalize = (value: string): string =>
  value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : value;

export const getLastMessageDate = (
  lines: Array<{ timestamp?: string }>
): Date | null => {
  let latest: Date | null = null;
  for (const line of lines) {
    const date = parseTimestamp(line.timestamp);
    if (!date) continue;
    if (!latest || date.getTime() > latest.getTime()) latest = date;
  }
  return latest;
};

export const formatConversationListDate = (
  value: string | Date,
  locale: string,
  now: Date = new Date()
): string => {
  const date = parseTimestamp(value);
  if (!date) return '';

  const time = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);

  const dayDiff = Math.round(
    (startOfDay(date).getTime() - startOfDay(now).getTime()) / DAY
  );

  if (dayDiff === 0 || dayDiff === -1) {
    const dayLabel = new Intl.RelativeTimeFormat(locale, {
      numeric: 'auto',
    }).format(dayDiff, 'day');
    return `${capitalize(dayLabel)}, ${time}`;
  }

  const datePart = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    ...(date.getFullYear() === now.getFullYear() ? {} : { year: 'numeric' }),
  }).format(date);

  return `${datePart}, ${time}`;
};

export const getConversationGroupKey = (
  date: Date,
  now: Date = new Date()
): ConversationGroupKey => {
  if (date.getTime() >= startOfWeek(now).getTime()) {
    return { type: 'thisWeek' };
  }
  return {
    type: 'month',
    year: date.getFullYear(),
    month: date.getMonth(),
  };
};

export const groupConversations = <T>(
  items: T[],
  getDate: (item: T) => Date | null,
  now: Date = new Date()
): Array<{ key: ConversationGroupKey; items: T[] }> => {
  const groups: Array<{ key: ConversationGroupKey; items: T[] }> = [];

  for (const item of items) {
    const date = getDate(item);
    if (!date) continue;
    const key = getConversationGroupKey(date, now);
    const last = groups[groups.length - 1];
    const sameGroup =
      last &&
      ((key.type === 'thisWeek' && last.key.type === 'thisWeek') ||
        (key.type === 'month' &&
          last.key.type === 'month' &&
          key.year === last.key.year &&
          key.month === last.key.month));

    if (sameGroup) {
      last.items.push(item);
    } else {
      groups.push({ key, items: [item] });
    }
  }

  return groups;
};
