import { DialogState } from '@memori.ai/memori-api-client/dist/types';

/** Stable engine-owned fields used to tell whether a pending turn completed. */
export function dialogStateFingerprint(state: DialogState | undefined): string {
  if (!state) return '';
  return JSON.stringify({
    state: state.state,
    previousState: state.previousState,
    emission: state.emission,
    emitter: state.emitter,
    lastMatchedMemoryID: state.lastMatchedMemoryID,
    currentDate: state.currentDate,
    currentMemoryID: state.currentMemoryID,
    contextVars: state.contextVars,
    emittedMedia: state.emittedMedia,
  });
}

/**
 * Whether catch-up should deliver `sessionState` as the enter-text response.
 *
 * Returns false when the session still matches the pre-request snapshot, or when
 * the emission has not advanced and the engine has not marked an AI completion
 * (covers intermediate mutations such as MediumSelected while the LLM runs).
 */
export function isEnterTextCatchUpReady(
  stateBeforeRequest: string | undefined,
  sessionState: DialogState
): boolean {
  const sessionFp = dialogStateFingerprint(sessionState);
  if (sessionFp === (stateBeforeRequest ?? '')) {
    return false;
  }

  try {
    const before = stateBeforeRequest
      ? (JSON.parse(stateBeforeRequest) as { emission?: string })
      : {};
    if (
      before.emission !== undefined &&
      before.emission === sessionState.emission &&
      sessionState.completion !== true
    ) {
      return false;
    }
  } catch {
    // Malformed snapshot — fall through and apply.
  }

  return true;
}
