import React from 'react';
import { fireEvent, render, screen, waitFor } from '../../testUtils';
import { DialogState } from '@memori.ai/memori-api-client/dist/types';
import MemoriWidget from './MemoriWidget';
import { VisemeProvider } from '../../context/visemeContext';
import { ArtifactProvider } from '../MemoriArtifactSystem/context/ArtifactContext';
import { instructionProposals, memori, tenant } from '../../mocks/data';

const mockEngine = {
  initSession: jest.fn(),
  getSession: jest.fn(),
  postProposalConfirmedEvent: jest.fn(),
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
  });
  return { __esModule: true, ...actual, default: mocked };
});

jest.mock('../../helpers/nats/useNats', () => ({
  useNats: () => ({ connected: true, configError: null }),
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

async function openChatWithPendingProposal() {
  mockEngine.initSession.mockResolvedValue({
    resultCode: 0,
    resultMessage: 'Ok',
    sessionID: SESSION_ID,
    currentState: giverState({
      emission: 'I propose a new content',
      emittedMedia: [instructionProposals.newContent],
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

  return screen.findByText('instructionProposal.apply');
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
    const apply = await openChatWithPendingProposal();

    fireEvent.click(apply);

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
    const apply = await openChatWithPendingProposal();

    fireEvent.click(apply);

    expect(await screen.findByText('instructionProposal.notPending')).toBeVisible();
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
    const apply = await openChatWithPendingProposal();
    const typing = () =>
      document.querySelector('.memori-chat--bubble-container--typing');

    fireEvent.click(apply);
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
});
