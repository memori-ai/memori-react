import React from 'react';
import { fireEvent, render, screen, waitFor } from '../../testUtils';
import {
  chatOnlyInstructionProposals,
  instructionProposals,
} from '../../mocks/data';
import InstructionProposalCard, {
  describeCron,
  diffWords,
  formatRunAt,
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

it('says the common schedules in words and the others as written', () => {
  expect(describeCron('0 8 * * *')).toEqual({
    key: 'scheduleDaily',
    values: { time: '08:00' },
  });
  expect(describeCron('30 7 * * 1-5')).toEqual({
    key: 'scheduleWeekdays',
    values: { time: '07:30' },
  });
  expect(describeCron('0 9 * * 1', 'en')).toEqual({
    key: 'scheduleWeekly',
    values: { time: '09:00', day: 'Monday' },
  });
  expect(describeCron('0 9 * * 7', 'it')?.values.day).toBe('domenica');
  expect(describeCron('15 18 1 * *')).toEqual({
    key: 'scheduleMonthly',
    values: { time: '18:15', day: '1' },
  });
  expect(describeCron('*/15 * * * *')).toBeNull();
  expect(describeCron('0 8 * 6 *')).toBeNull();
  expect(describeCron('0 8 * * 1,3')).toBeNull();
  expect(describeCron('0 8 * *')).toBeNull();
});

it('writes the date of a task that runs once in the language of the page', () => {
  expect(formatRunAt('2099-03-02 09:30', 'en')).toContain('March 2, 2099');
  expect(formatRunAt('2099-03-02 09:30', 'en')).toContain('9:30');
  expect(formatRunAt('tomorrow', 'en')).toBe('tomorrow');
});

it('shows when a task runs and what it does, with its own button', async () => {
  const onConfirm = jest.fn().mockResolvedValue(true);
  render(
    <InstructionProposalCard
      medium={instructionProposals.scheduledTask}
      onConfirm={onConfirm}
    />
  );

  expect(
    screen.getByText('instructionProposal.scheduleWeekdays')
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Read the latest posts of the Bakery Rossi blog/)
  ).toBeInTheDocument();

  fireEvent.click(screen.getByText('instructionProposal.schedule'));

  await waitFor(() =>
    expect(
      screen.getByText('instructionProposal.scheduled')
    ).toBeInTheDocument()
  );
  expect(onConfirm).toHaveBeenCalledWith(
    instructionProposals.scheduledTask.mediumID,
    true,
    undefined
  );
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

it('is no longer pending when it mounts expired', () => {
  render(
    <InstructionProposalCard
      medium={instructionProposals.newContent}
      onConfirm={jest.fn()}
      expired
    />
  );
  expect(
    screen.getByText('instructionProposal.notPending')
  ).toBeInTheDocument();
  expect(
    screen.queryByText('instructionProposal.apply')
  ).not.toBeInTheDocument();
});

it('keeps the outcome it was confirmed with when it mounts expired', () => {
  render(
    <InstructionProposalCard
      medium={instructionProposals.newContent}
      onConfirm={jest.fn()}
      defaultStatus="applied"
      expired
    />
  );
  expect(screen.getByText('instructionProposal.applied')).toBeInTheDocument();
});

it('is no longer pending once newer proposals supersede it', () => {
  const { rerender } = render(
    <InstructionProposalCard
      medium={instructionProposals.newContent}
      onConfirm={jest.fn()}
    />
  );
  rerender(
    <InstructionProposalCard
      medium={instructionProposals.newContent}
      onConfirm={jest.fn()}
      expired
    />
  );
  expect(
    screen.getByText('instructionProposal.notPending')
  ).toBeInTheDocument();
});

it('has no card for the types it cannot show', () => {
  expect(
    hasInstructionProposalCard({
      ...instructionProposals.newContent,
      content: JSON.stringify({ id: 'x', type: 'Persona' }),
    })
  ).toBe(false);
});

it('shows the previous value only as context when the field does not change', () => {
  render(
    <InstructionProposalCard
      medium={{
        ...instructionProposals.landingPageSettings,
        content: JSON.stringify({
          id: 'x',
          type: 'LandingPage',
          previousLandingPageLayout: 'TOTEM',
          previousInitialQuestion: 'START',
          landingPageSettings: { theme: 'dark' },
        }),
      }}
      onConfirm={jest.fn()}
    />
  );
  expect(screen.queryByText('TOTEM')).not.toBeInTheDocument();
  expect(screen.queryByText('START')).not.toBeInTheDocument();
});

it('lists repeated variants without key warnings', () => {
  const error = jest.spyOn(console, 'error').mockImplementation(() => {});
  render(
    <InstructionProposalCard
      medium={{
        ...instructionProposals.contentVariants,
        content: JSON.stringify({
          id: 'x',
          type: 'ContentVariants',
          question: 'Q',
          variants: ['Same', 'Same'],
        }),
      }}
    />
  );
  expect(screen.getAllByText('Same')).toHaveLength(2);
  expect(
    error.mock.calls.some(c => String(c[0]).includes('same key'))
  ).toBe(false);
  error.mockRestore();
});
