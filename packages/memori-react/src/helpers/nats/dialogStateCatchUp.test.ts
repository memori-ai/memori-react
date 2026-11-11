import { DialogState } from '@memori.ai/memori-api-client/dist/types';
import {
  dialogStateFingerprint,
  isEnterTextCatchUpReady,
} from './dialogStateCatchUp';

const baseState = (overrides: Partial<DialogState> = {}): DialogState => ({
  state: 'R1',
  stateName: 'WaitingForReceiverQuestion',
  previousState: 'R1',
  confidenceLevel: 'NONE',
  emission: 'Ciao!',
  completion: false,
  acceptsMedia: true,
  contextVars: { LANG: 'IT' },
  emittedMedia: [],
  ...overrides,
});

describe('dialogStateFingerprint', () => {
  it('returns empty string for undefined', () => {
    expect(dialogStateFingerprint(undefined)).toBe('');
  });

  it('changes when emission changes (MediumSelected vs prior greeting)', () => {
    const before = dialogStateFingerprint(baseState());
    const afterMedia = dialogStateFingerprint(
      baseState({ emission: 'Ho aggiunto il contenuto.' })
    );
    expect(before).not.toBe(afterMedia);
  });

  it('is stable when only currentMedia changes (not in fingerprint)', () => {
    const withoutMedia = dialogStateFingerprint(baseState());
    const withMedia = dialogStateFingerprint(
      baseState({
        currentMedia: [
          {
            mediumID: 'm1',
            url: 'https://example.test/a.png',
            mimeType: 'image/png',
          },
        ],
      })
    );
    expect(withoutMedia).toBe(withMedia);
  });
});

describe('isEnterTextCatchUpReady', () => {
  it('returns false when session fingerprint matches stateBeforeRequest', () => {
    const mediaAck = baseState({ emission: 'Ho aggiunto il contenuto.' });
    const before = dialogStateFingerprint(mediaAck);
    expect(isEnterTextCatchUpReady(before, mediaAck)).toBe(false);
  });

  it('returns false when emission is unchanged and completion is not true', () => {
    const beforeSend = baseState({ emission: 'Ho aggiunto il contenuto.' });
    const midFlight = baseState({
      emission: 'Ho aggiunto il contenuto.',
      // Other fields may drift without a finished enter-text reply.
      contextVars: { LANG: 'IT', PATHNAME: '/other' },
      completion: false,
    });
    expect(
      isEnterTextCatchUpReady(dialogStateFingerprint(beforeSend), midFlight)
    ).toBe(false);
  });

  it('returns true when session has a new emission (finished turn)', () => {
    const beforeSend = baseState({ emission: 'Ho aggiunto il contenuto.' });
    const answer = baseState({
      emission: 'Stai guardando un panda.',
      completion: true,
    });
    expect(
      isEnterTextCatchUpReady(dialogStateFingerprint(beforeSend), answer)
    ).toBe(true);
  });

  it('returns true for non-AI replies with a new emission', () => {
    const beforeSend = baseState({ emission: 'Ho aggiunto il contenuto.' });
    const answer = baseState({
      emission: 'Ok, prosegui pure.',
      completion: false,
    });
    expect(
      isEnterTextCatchUpReady(dialogStateFingerprint(beforeSend), answer)
    ).toBe(true);
  });

  it('reproduces the media desync bug path: stale before vs media-ack session', () => {
    // Local state before MediumSelected sync (bug): greeting.
    // Engine / getSession after MediumSelected: media ack.
    // Without sync, catch-up would see a fingerprint mismatch; with emission
    // change it would still apply — primary fix is syncing MediumSelected so
    // stateBeforeRequest is the media-ack fingerprint instead.
    const staleLocal = baseState({ emission: 'Ciao!' });
    const mediaAck = baseState({
      emission: 'Ho aggiunto il contenuto.',
      completion: false,
    });
    expect(
      isEnterTextCatchUpReady(dialogStateFingerprint(staleLocal), mediaAck)
    ).toBe(true);

    // After sync: stateBeforeRequest matches media ack while LLM still runs.
    expect(
      isEnterTextCatchUpReady(dialogStateFingerprint(mediaAck), mediaAck)
    ).toBe(false);
  });
});
