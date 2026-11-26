import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '../../testUtils';
import { DialogState } from '@memori.ai/memori-api-client/dist/types';
import MemoriWidget from './MemoriWidget';
import { VisemeProvider } from '../../context/visemeContext';
import { ArtifactProvider } from '../MemoriArtifactSystem/context/ArtifactContext';
import { instructionProposals, memori, tenant } from '../../mocks/data';
import type { Medium } from '@memori.ai/memori-api-client/dist/types';
import type { UseNatsOptions } from '../../helpers/nats/useNats';

const mockEngine = {
  initSession: jest.fn(),
  getSession: jest.fn(),
  postProposalConfirmedEvent: jest.fn(),
  postEnterTextAsync: jest.fn(),
};

jest.mock('@memori.ai/memori-api-client', () => {
  const actual = jest.requireActual('@memori.ai/memori-api-client');
  const factory = actual.default ?? actual;
  const mocked = (...args: unknown[]) => ({
    ...factory(...args),
    initSession: (...a: unknown[]) => mockEngine.initSession(...a),
    getSession: (...a: unknown[]) => mockEngine.getSession(...a),
    postProposalConfirmedEvent: (...a: unknown[]) =>
      mockEngine.postProposalConfirmedEvent(...a),
    postEnterTextAsync: (...a: unknown[]) =>
      mockEngine.postEnterTextAsync(...a),
  });
  return { __esModule: true, ...actual, default: mocked };
});

let natsOptions: UseNatsOptions | undefined;
jest.mock('../../helpers/nats/useNats', () => ({
  useNats: (options: UseNatsOptions) => {
    natsOptions = options;
    return { connected: true, configError: null };
  },
}));

const SESSION_ID = 'session-1';
// The ID of instructionProposals.newContent
const PROPOSAL_ID = '0b1f6a52-2f4e-4d4b-9c1e-1a2b3c4d5e01';

const giverState = (overrides: Partial<DialogState>): DialogState =>
  ({
    state: 'G6',
    stateName: 'WaitingForGiverInstruction',
    previousState: 'G6',
    confidenceLevel: 'NONE',
    completion: true,
    acceptsMedia: false,
    contextVars: {},
    emittedMedia: [],
    hints: [],
    ...overrides,
  } as DialogState);

async function openChatWithPendingProposals(
  proposals: Medium[] = [instructionProposals.newContent]
) {
  mockEngine.initSession.mockResolvedValue({
    resultCode: 0,
    resultMessage: 'Ok',
    sessionID: SESSION_ID,
    currentState: giverState({
      emission: 'I propose a change',
      emittedMedia: proposals,
      hints: ['Apply', 'Ignore'],
    }),
  });

  render(
    <VisemeProvider>
      <ArtifactProvider>
        <MemoriWidget
          memori={{ ...memori, ageRestriction: 0 }}
          tenant={tenant}
          tenantID="www.aisuru.com"
          autoStart
          layout="FULLPAGE"
          enableAudio={false}
        />
      </ArtifactProvider>
    </VisemeProvider>
  );

  await screen.findAllByText('instructionProposal.ignore');
}

describe('MemoriWidget proposal confirmation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
    Element.prototype.scrollTo = jest.fn();
    window.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ resultCode: 0, resultMessage: 'Ok' }),
      text: async () => '{}',
    }) as any;
  });

  it('applies the proposal in the session and shows the reply of the engine', async () => {
    mockEngine.postProposalConfirmedEvent.mockResolvedValue({
      resultCode: 0,
      resultMessage: 'Ok',
      currentState: giverState({ emission: 'The content was created' }),
    });
    await openChatWithPendingProposals();

    fireEvent.click(screen.getByText('instructionProposal.apply'));

    expect(await screen.findByText('The content was created')).toBeVisible();
    expect(mockEngine.postProposalConfirmedEvent).toHaveBeenCalledWith({
      sessionId: SESSION_ID,
      proposalID: PROPOSAL_ID,
      apply: true,
      parameters: undefined,
    });
    expect(screen.getByText('instructionProposal.applied')).toBeVisible();
  });

  it.each([
    [
      'the session expired',
      { resultCode: 404, resultMessage: 'Session not found' },
    ],
    [
      'the engine ignores it because it is no longer pending',
      {
        resultCode: 0,
        resultMessage: 'Ok',
        currentState: giverState({ emission: undefined }),
      },
    ],
  ])('says it is no longer pending when %s', async (_, response) => {
    mockEngine.postProposalConfirmedEvent.mockResolvedValue(response);
    await openChatWithPendingProposals();

    fireEvent.click(screen.getByText('instructionProposal.apply'));

    expect(
      await screen.findByText('instructionProposal.notPending')
    ).toBeVisible();
    expect(
      screen.queryByText('instructionProposal.applied')
    ).not.toBeInTheDocument();
  });

  it('shows the typing indicator while confirming and lets the Giver retry after an engine error', async () => {
    let answer!: (response: unknown) => void;
    mockEngine.postProposalConfirmedEvent
      .mockReturnValueOnce(new Promise(resolve => (answer = resolve)))
      .mockResolvedValueOnce({
        resultCode: 0,
        resultMessage: 'Ok',
        currentState: giverState({ emission: 'The content was created' }),
      });
    await openChatWithPendingProposals();
    const typing = () =>
      document.querySelector('.memori-chat--bubble-container--typing');

    fireEvent.click(screen.getByText('instructionProposal.apply'));
    await waitFor(() => expect(typing()).toBeInTheDocument());

    answer({ resultCode: 500, resultMessage: 'Internal error' });

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'instructionProposal.error'
    );
    expect(typing()).not.toBeInTheDocument();
    expect(screen.getByText('instructionProposal.apply')).toBeEnabled();

    fireEvent.click(screen.getByText('instructionProposal.apply'));

    expect(await screen.findByText('The content was created')).toBeVisible();
    expect(mockEngine.postProposalConfirmedEvent).toHaveBeenCalledTimes(2);
  });

  it('discards a proposal the Giver ignores, without confirming anything else', async () => {
    mockEngine.postProposalConfirmedEvent.mockResolvedValue({
      resultCode: 0,
      resultMessage: 'Ok',
      currentState: giverState({ emission: 'Discarded' }),
    });
    await openChatWithPendingProposals();

    fireEvent.click(screen.getByText('instructionProposal.ignore'));

    expect(
      await screen.findByText('instructionProposal.ignored')
    ).toBeVisible();
    expect(mockEngine.postProposalConfirmedEvent).toHaveBeenCalledWith({
      sessionId: SESSION_ID,
      proposalID: PROPOSAL_ID,
      apply: false,
      parameters: undefined,
    });
  });

  it('sends the connector secret only in the confirmation, and clears it from the card', async () => {
    mockEngine.postProposalConfirmedEvent.mockResolvedValue({
      resultCode: 0,
      resultMessage: 'Ok',
      currentState: giverState({ emission: 'Matomo linked' }),
    });
    await openChatWithPendingProposals([instructionProposals.connector]);

    const secret = document.querySelector(
      'input[name="api_key"]'
    ) as HTMLInputElement;
    fireEvent.change(secret, { target: { value: 'matomo-secret-key' } });
    fireEvent.click(screen.getByText('instructionProposal.link'));

    expect(await screen.findByText('Matomo linked')).toBeVisible();
    expect(mockEngine.postProposalConfirmedEvent).toHaveBeenCalledWith({
      sessionId: SESSION_ID,
      proposalID: instructionProposals.connector.mediumID,
      apply: true,
      parameters: {
        MATOMO_URL: 'https://analytics.example.com',
        api_key: 'matomo-secret-key',
      },
    });
    expect(
      (document.querySelector('input[name="api_key"]') as HTMLInputElement)
        .value
    ).toBe('');
    expect(document.body.innerHTML).not.toContain('matomo-secret-key');
  });

  it('keeps the typing indicator on while another confirmation is still waiting', async () => {
    const answers: Array<(response: unknown) => void> = [];
    mockEngine.postProposalConfirmedEvent.mockImplementation(
      () => new Promise(resolve => answers.push(resolve))
    );
    await openChatWithPendingProposals([
      instructionProposals.newContent,
      instructionProposals.contentVariants,
    ]);
    const typing = () =>
      document.querySelector('.memori-chat--bubble-container--typing');

    const [first, second] = screen.getAllByText('instructionProposal.apply');
    fireEvent.click(first);
    fireEvent.click(second);
    await waitFor(() => expect(answers).toHaveLength(2));

    answers[0]({
      resultCode: 0,
      resultMessage: 'Ok',
      currentState: giverState({ emission: 'First applied' }),
    });

    expect(await screen.findByText('First applied')).toBeVisible();
    // The second confirmation is still waiting for the engine
    expect(typing()).toBeInTheDocument();

    answers[1]({
      resultCode: 0,
      resultMessage: 'Ok',
      currentState: giverState({ emission: 'Second applied' }),
    });
    expect(await screen.findByText('Second applied')).toBeVisible();
    expect(typing()).not.toBeInTheDocument();
  });

  it('keeps the typing indicator while a confirmation waits, when a message is answered meanwhile', async () => {
    let answerConfirmation: (response: unknown) => void = () => {};
    mockEngine.postProposalConfirmedEvent.mockImplementationOnce(
      () => new Promise(resolve => (answerConfirmation = resolve))
    );
    mockEngine.postEnterTextAsync.mockResolvedValue({
      resultCode: 0,
      resultMessage: 'Ok',
      correlationID: 'corr-1',
    });
    await openChatWithPendingProposals();
    const typing = () =>
      document.querySelector('.memori-chat--bubble-container--typing');

    fireEvent.click(screen.getByText('instructionProposal.apply'));
    await waitFor(() => expect(typing()).toBeInTheDocument());

    // A message sent meanwhile is answered by the engine, which turns the typing off for it
    act(() => {
      window.typeMessage('hello');
    });
    await waitFor(() =>
      expect(mockEngine.postEnterTextAsync).toHaveBeenCalled()
    );
    act(() => {
      natsOptions!.onDialogResponse!({
        eventType: 'dialog_text_entered_response',
        correlationID: 'corr-1',
        resultCode: 0,
        resultMessage: 'Ok',
        currentState: giverState({ emission: 'Answer to hello' }),
      } as any);
    });
    expect(await screen.findByText('Answer to hello')).toBeVisible();

    // The confirmation is still waiting for the engine
    expect(typing()).toBeInTheDocument();

    act(() => {
      answerConfirmation({
        resultCode: 0,
        resultMessage: 'Ok',
        currentState: giverState({ emission: 'Confirmed' }),
      });
    });
    expect(await screen.findByText('Confirmed')).toBeVisible();
    expect(typing()).not.toBeInTheDocument();
  });
});
