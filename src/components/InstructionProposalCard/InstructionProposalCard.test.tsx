import React from 'react';
import { fireEvent, render, screen, waitFor } from '../../testUtils';
import {
  chatOnlyInstructionProposals,
  instructionProposals,
} from '../../mocks/data';
import InstructionProposalCard, {
  diffWords,
  getMissingConnectorFields,
  hasInstructionProposalCard,
  parseInstructionProposal,
} from './InstructionProposalCard';

const proposalStories = Object.entries(instructionProposals);

it.each(proposalStories)('renders %s proposal unchanged', (_, medium) => {
  const { container } = render(
    <InstructionProposalCard medium={medium} onConfirm={jest.fn()} />
  );
  expect(container).toMatchSnapshot();
});

it.each([
  ['applied', instructionProposals.newContent],
  ['applied', instructionProposals.connector],
  ['ignored', instructionProposals.newContent],
  ['notPending', instructionProposals.contentAnswerChange],
  ['error', instructionProposals.connector],
] as const)('renders %s status unchanged', (status, medium) => {
  const { container } = render(
    <InstructionProposalCard
      medium={medium}
      onConfirm={jest.fn()}
      defaultStatus={status}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders read-only proposal unchanged', () => {
  const { container } = render(
    <InstructionProposalCard medium={instructionProposals.newContent} />
  );
  expect(container).toMatchSnapshot();
});

it('renders nothing for a medium that is not a proposal', () => {
  const { container } = render(
    <InstructionProposalCard
      medium={{ mediumID: 'x', mimeType: 'text/plain', content: 'not json' }}
      onConfirm={jest.fn()}
    />
  );
  expect(
    container.querySelector('.memori-instruction-proposal')
  ).not.toBeInTheDocument();
});

it('parses the proposal from the medium content', () => {
  expect(parseInstructionProposal(instructionProposals.connector)?.type).toBe(
    'Connector'
  );
  expect(
    parseInstructionProposal({ mediumID: 'x', mimeType: 'x', content: '{}' })
  ).toBeNull();
});

it('has no card for the proposals confirmed in chat', () => {
  expect(hasInstructionProposalCard(instructionProposals.landingPage)).toBe(
    true
  );
  expect(
    hasInstructionProposalCard(chatOnlyInstructionProposals.welcomeMessage)
  ).toBe(false);
  expect(
    hasInstructionProposalCard(chatOnlyInstructionProposals.aisuruFunction)
  ).toBe(false);
});

it('shows the page settings before and after the proposal', () => {
  render(
    <InstructionProposalCard
      medium={instructionProposals.landingPageSettings}
      onConfirm={jest.fn()}
    />
  );

  expect(screen.getByText('light')).toBeInTheDocument();
  expect(screen.getByText('dark')).toBeInTheDocument();
  expect(
    screen.getByText('Bakery Rossi, fresh bread every morning')
  ).toBeInTheDocument();
});

it('diffs the answers word by word', () => {
  expect(
    diffWords('We open every day at 7:30.', 'We open every day at 7:00.')
  ).toEqual([
    { text: 'We open every day at ' },
    { text: '7:30.', removed: true },
    { text: '7:00.', added: true },
  ]);
  expect(diffWords('Same text', 'Same text')).toEqual([{ text: 'Same text' }]);
});

it('shows only the changed words of an answer', () => {
  render(
    <InstructionProposalCard
      medium={instructionProposals.contentAnswerChange}
      onConfirm={jest.fn()}
    />
  );

  expect(screen.getByText('7:30.').tagName).toBe('DEL');
  expect(screen.getByText('7:00.').tagName).toBe('INS');
});

it('shows the snippet texts and variants', () => {
  render(
    <InstructionProposalCard
      medium={instructionProposals.snippet}
      onConfirm={jest.fn()}
    />
  );

  expect(screen.getByText('Send')).toBeInTheDocument();
  expect(screen.getByText('Can I reserve a table?')).toBeInTheDocument();
  expect(screen.queryByText('TABLE_BOOKING')).not.toBeInTheDocument();
});

it('shows the instructions a revert restores', () => {
  render(
    <InstructionProposalCard
      medium={instructionProposals.promptRevert}
      onConfirm={jest.fn()}
    />
  );

  expect(
    screen.getByText('instructionProposal.restoredPrompt')
  ).toBeInTheDocument();
});

it('shows the layout before the proposal', () => {
  render(
    <InstructionProposalCard
      medium={instructionProposals.landingPage}
      onConfirm={jest.fn()}
    />
  );

  expect(screen.getByText('TOTEM').tagName).toBe('DEL');
  expect(screen.getByText('CHAT').tagName).toBe('INS');
  expect(screen.getByText('START').tagName).toBe('P');
});

it('is no longer pending once the hints confirm or discard the proposals', () => {
  const { rerender } = render(
    <InstructionProposalCard
      medium={instructionProposals.newContent}
      onConfirm={jest.fn()}
      proposalsPending
    />
  );
  expect(screen.getByText('instructionProposal.apply')).toBeInTheDocument();

  rerender(
    <InstructionProposalCard
      medium={instructionProposals.newContent}
      onConfirm={jest.fn()}
      proposalsPending={false}
    />
  );
  expect(
    screen.getByText('instructionProposal.notPending')
  ).toBeInTheDocument();
  expect(
    screen.queryByText('instructionProposal.apply')
  ).not.toBeInTheDocument();
});

it('keeps the outcome of its own confirmation when the hints go', async () => {
  const onConfirm = jest.fn().mockResolvedValue(true);
  const { rerender } = render(
    <InstructionProposalCard
      medium={instructionProposals.newContent}
      onConfirm={onConfirm}
    />
  );

  fireEvent.click(screen.getByText('instructionProposal.apply'));
  await waitFor(() =>
    expect(screen.getByText('instructionProposal.applied')).toBeInTheDocument()
  );

  rerender(
    <InstructionProposalCard
      medium={instructionProposals.newContent}
      onConfirm={onConfirm}
      proposalsPending={false}
    />
  );
  expect(screen.getByText('instructionProposal.applied')).toBeInTheDocument();
});

it('waits for the hints before following them', () => {
  render(
    <InstructionProposalCard
      medium={instructionProposals.newContent}
      onConfirm={jest.fn()}
      proposalsPending={false}
    />
  );
  expect(screen.getByText('instructionProposal.apply')).toBeInTheDocument();
});

it('lists the required connector fields still empty', () => {
  const fields =
    parseInstructionProposal(instructionProposals.connector)?.connectorFields ??
    [];
  expect(
    getMissingConnectorFields(fields, { MATOMO_URL: 'x', api_key: ' ' }).map(
      f => f.name
    )
  ).toEqual(['api_key']);
});

it('prefills the values given in chat but never the secret ones', () => {
  render(
    <InstructionProposalCard
      medium={instructionProposals.connector}
      onConfirm={jest.fn()}
    />
  );
  expect(
    screen.getByDisplayValue('https://analytics.example.com')
  ).toBeInTheDocument();
  expect(document.querySelector('input[name="api_key"]')).toHaveAttribute(
    'type',
    'password'
  );
  expect(document.querySelector('input[name="api_key"]')).toHaveValue('');
});

it('links a connector only when the required fields are filled', async () => {
  const onConfirm = jest.fn().mockResolvedValue(true);
  render(
    <InstructionProposalCard
      medium={instructionProposals.connector}
      onConfirm={onConfirm}
    />
  );

  const link = screen.getByText('instructionProposal.link').closest('button')!;
  expect(link).toBeDisabled();

  fireEvent.change(document.querySelector('input[name="api_key"]')!, {
    target: { value: 'test-matomo-key' },
  });
  expect(link).not.toBeDisabled();
  fireEvent.click(link);

  await waitFor(() =>
    expect(screen.getByText('instructionProposal.linked')).toBeInTheDocument()
  );
  expect(onConfirm).toHaveBeenCalledWith(
    instructionProposals.connector.mediumID,
    true,
    { MATOMO_URL: 'https://analytics.example.com', api_key: 'test-matomo-key' }
  );
});

it('ignores a proposal without parameters', async () => {
  const onConfirm = jest.fn().mockResolvedValue(true);
  render(
    <InstructionProposalCard
      medium={instructionProposals.connector}
      onConfirm={onConfirm}
    />
  );

  fireEvent.click(screen.getByText('instructionProposal.ignore'));

  await waitFor(() =>
    expect(screen.getByText('instructionProposal.ignored')).toBeInTheDocument()
  );
  expect(onConfirm).toHaveBeenCalledWith(
    instructionProposals.connector.mediumID,
    false,
    undefined
  );
});

it('says when the proposal is no longer pending', async () => {
  render(
    <InstructionProposalCard
      medium={instructionProposals.newContent}
      onConfirm={jest.fn().mockResolvedValue(false)}
    />
  );

  fireEvent.click(screen.getByText('instructionProposal.apply'));

  await waitFor(() =>
    expect(
      screen.getByText('instructionProposal.notPending')
    ).toBeInTheDocument()
  );
});

it('clears the secret fields and lets the Giver retry after an error', async () => {
  render(
    <InstructionProposalCard
      medium={instructionProposals.connector}
      onConfirm={jest.fn().mockRejectedValue(new Error('Network error'))}
    />
  );

  fireEvent.change(document.querySelector('input[name="api_key"]')!, {
    target: { value: 'test-matomo-key' },
  });
  fireEvent.click(screen.getByText('instructionProposal.link'));

  await waitFor(() =>
    expect(screen.getByText('instructionProposal.error')).toBeInTheDocument()
  );
  expect(document.querySelector('input[name="api_key"]')).toHaveValue('');
  expect(document.querySelector('input[name="MATOMO_URL"]')).toHaveValue(
    'https://analytics.example.com'
  );
});
