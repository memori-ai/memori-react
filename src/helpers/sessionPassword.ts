/**
 * First non-blank password among the candidates.
 * The backend often returns a private agent's key on `password`
 * while `secretToken` is missing or blank.
 */
export function resolveSessionPassword(
  ...candidates: Array<string | null | undefined>
): string | undefined {
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim().length > 0) {
      return candidate;
    }
  }
  return undefined;
}

/** Engine openSession: non-public agent opened without a password. */
export function isEmptyPasswordError(
  resultCode?: number,
  resultMessage?: string
): boolean {
  return resultCode === 422 && /empty password/i.test(resultMessage ?? '');
}
