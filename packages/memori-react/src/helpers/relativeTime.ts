const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

export const parseTimestamp = (value?: string | Date | null): Date | null => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatExactDateTime = (
  value: string | Date,
  locale: string
): string => {
  const date = parseTimestamp(value);
  if (!date) return '';
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
};

export const formatRelativeTime = (
  value: string | Date,
  locale: string,
  now: Date = new Date()
): string => {
  const date = parseTimestamp(value);
  if (!date) return '';

  const diff = date.getTime() - now.getTime();
  const abs = Math.abs(diff);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (abs < MINUTE) {
    return rtf.format(Math.round(diff / SECOND), 'second');
  }
  if (abs < HOUR) {
    return rtf.format(Math.round(diff / MINUTE), 'minute');
  }
  if (abs < DAY) {
    return rtf.format(Math.round(diff / HOUR), 'hour');
  }
  if (abs < WEEK) {
    return rtf.format(Math.round(diff / DAY), 'day');
  }
  if (abs < MONTH) {
    return rtf.format(Math.round(diff / WEEK), 'week');
  }
  if (abs < YEAR) {
    return rtf.format(Math.round(diff / MONTH), 'month');
  }
  return rtf.format(Math.round(diff / YEAR), 'year');
};
