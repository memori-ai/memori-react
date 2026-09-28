import { Message } from '@memori.ai/memori-api-client/dist/types';

type MessageWithOptionalSources = Message & {
  sourcesCount?: unknown;
  sourceCount?: unknown;
  matchesCount?: unknown;
  matches?: unknown;
  sources?: unknown;
};

const isNonNegativeNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0;

/**
 * Returns a source count only when the backend already put it on the message.
 * Never infers or invents a number from unrelated fields.
 */
export const getExposedSourcesCount = (
  message?: Message | null
): number | undefined => {
  if (!message) return undefined;

  const extra = message as MessageWithOptionalSources;

  if (isNonNegativeNumber(extra.sourcesCount)) return extra.sourcesCount;
  if (isNonNegativeNumber(extra.sourceCount)) return extra.sourceCount;
  if (isNonNegativeNumber(extra.matchesCount)) return extra.matchesCount;
  if (Array.isArray(extra.matches)) return extra.matches.length;
  if (Array.isArray(extra.sources)) return extra.sources.length;

  return undefined;
};
