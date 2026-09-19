import React from 'react';

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const STOPWORDS = new Set([
  'the',
  'and',
  'for',
  'are',
  'but',
  'not',
  'you',
  'that',
  'this',
  'with',
  'from',
  'was',
  'have',
  'has',
  'had',
  'per',
  'del',
  'della',
  'delle',
  'che',
  'non',
  'una',
  'uno',
  'con',
  'come',
  'quali',
  'quale',
  'questa',
  'questo',
]);

const tokenize = (query: string): string[] =>
  query
    .split(/\s+/)
    .map(token => token.replace(/[^\p{L}\p{N}]+/gu, ''))
    .filter(
      token => token.length >= 3 && !STOPWORDS.has(token.toLowerCase())
    );

export const highlightMatches = (
  text: string,
  query: string
): React.ReactNode => {
  const terms = Array.from(new Set(tokenize(query)));
  if (!text || terms.length === 0) return text;

  const pattern = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'gi');
  const parts = text.split(pattern);
  if (parts.length === 1) return text;

  return parts.map((part, index) =>
    terms.some(term => part.toLowerCase() === term.toLowerCase()) ? (
      <mark key={`${part}-${index}`} className="memori-whythisanswer-mark">
        {part}
      </mark>
    ) : (
      <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>
    )
  );
};
