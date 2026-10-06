import React from 'react';
import { fireEvent, render, screen } from '../../testUtils';
import MobileSessionPanel, {
  MobileSessionPanelTrigger,
  useSessionPanelEntries,
} from './MobileSessionPanel';

type EntriesParams = Parameters<typeof useSessionPanelEntries>[0];

const TriggerHarness = ({
  onToggle = jest.fn(),
  ...params
}: EntriesParams & { onToggle?: () => void }) => {
  const entries = useSessionPanelEntries(params);
  return (
    <MobileSessionPanelTrigger
      entries={entries}
      open={false}
      onToggle={onToggle}
    />
  );
};

const llmUsageHistory = [
  {
    text: 'Hi',
    fromUser: false,
    timestamp: '2026-10-06T08:00:00Z',
    llmUsage: { energyImpact: { energy: 0.001 } },
  },
] as any;

const clearAction = {
  key: 'clear',
  icon: <span>icon</span>,
  title: 'Clear chat',
};

const baseProps = {
  open: true,
  onClose: jest.fn(),
  title: 'Session',
  userName: 'Test user',
  actions: [],
  isLoggedIn: true,
  loginToken: 'abcd',
};

it('hides Known facts unless showKnownFacts is on', () => {
  render(<MobileSessionPanel {...baseProps} />);

  expect(screen.queryByText('Known facts')).toBeNull();
});

it('shows Known facts when showKnownFacts is on', () => {
  render(
    <MobileSessionPanel
      {...baseProps}
      showKnownFacts
      knownFactsPageTitle="Known facts"
    />
  );

  expect(screen.getByText('Known facts')).toBeTruthy();
});

it('hides chat history unless showChatHistory is on', () => {
  render(<MobileSessionPanel {...baseProps} />);

  expect(screen.queryByText('write_and_speak.chatHistory')).toBeNull();
});

it('opens chat history from the session panel when showChatHistory is on', () => {
  const onChatHistoryOpen = jest.fn();
  render(
    <MobileSessionPanel
      {...baseProps}
      showChatHistory
      onChatHistoryOpen={onChatHistoryOpen}
    />
  );

  fireEvent.click(
    screen.getByRole('button', { name: /write_and_speak.chatHistory/i })
  );

  expect(onChatHistoryOpen).toHaveBeenCalledTimes(1);
});

it('shows Known facts and AI usage disabled until they are usable', () => {
  render(
    <MobileSessionPanel
      {...baseProps}
      showKnownFacts
      knownFactsDisabled
      knownFactsPageTitle="Known facts"
      showMessageConsumption
    />
  );

  expect(
    screen.getByRole('button', { name: /Known facts/i }).hasAttribute('disabled')
  ).toBe(true);
  expect(
    screen
      .getByRole('button', { name: /widget.aiConsumption/i })
      .hasAttribute('disabled')
  ).toBe(true);
});

it('keeps the more actions menu when AI usage sits next to another action', () => {
  render(<TriggerHarness actions={[clearAction]} showMessageConsumption />);

  expect(screen.getByRole('button', { name: 'widget.moreActions' })).toBeTruthy();
});

it('hides AI usage unless showMessageConsumption is on', () => {
  render(<MobileSessionPanel {...baseProps} />);

  expect(screen.queryByText('widget.aiConsumption')).toBeNull();
});

it('shows AI usage when showMessageConsumption is on', () => {
  render(<MobileSessionPanel {...baseProps} showMessageConsumption />);

  expect(screen.getByText('widget.aiConsumption')).toBeTruthy();
});

it('opens the share page with inline share content', () => {
  render(
    <MobileSessionPanel
      {...baseProps}
      sharePageTitle="Share"
      backLabel="Back"
      actions={[
        {
          key: 'share',
          icon: <span>icon</span>,
          title: 'Share chat',
          view: 'share',
        },
      ]}
      shareContent={<div>Copy link or download</div>}
    />
  );

  expect(screen.queryByText('Copy link or download')).toBeNull();

  fireEvent.click(screen.getByRole('button', { name: /Share chat/i }));

  expect(screen.getByText('Copy link or download')).toBeTruthy();
  expect(screen.getByRole('heading', { name: 'Share' })).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Back' })).toBeTruthy();
});

it('shows the single action directly instead of the more actions menu', () => {
  const onClick = jest.fn();
  const onToggle = jest.fn();
  render(
    <TriggerHarness actions={[{ ...clearAction, onClick }]} onToggle={onToggle} />
  );

  expect(screen.queryByRole('button', { name: 'widget.moreActions' })).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Clear chat' }));

  expect(onClick).toHaveBeenCalledTimes(1);
  expect(onToggle).not.toHaveBeenCalled();
});

it('opens the panel from a single view action', () => {
  const onToggle = jest.fn();
  render(
    <TriggerHarness
      actions={[{ ...clearAction, key: 'share', title: 'Share chat', view: 'share' }]}
      onToggle={onToggle}
    />
  );

  fireEvent.click(screen.getByRole('button', { name: 'Share chat' }));

  expect(onToggle).toHaveBeenCalledTimes(1);
});

it('keeps the more actions menu with more than one action', () => {
  render(
    <TriggerHarness
      actions={[clearAction, { ...clearAction, key: 'share', title: 'Share' }]}
    />
  );

  expect(screen.getByRole('button', { name: 'widget.moreActions' })).toBeTruthy();
});

it('keeps the more actions menu when login is available', () => {
  render(<TriggerHarness actions={[clearAction]} showLogin />);

  expect(screen.getByRole('button', { name: 'widget.moreActions' })).toBeTruthy();
});

it('keeps the more actions menu when a user is logged in', () => {
  render(<TriggerHarness actions={[clearAction]} isLoggedIn />);

  expect(screen.getByRole('button', { name: 'widget.moreActions' })).toBeTruthy();
});

it('hides the back button on the page of the single direct action', () => {
  render(
    <MobileSessionPanel
      {...baseProps}
      isLoggedIn={false}
      backLabel="Back"
      initialView="share"
      actions={[
        { key: 'share', icon: <span>icon</span>, title: 'Share chat', view: 'share' },
      ]}
      shareContent={<div>Copy link or download</div>}
    />
  );

  expect(screen.getByText('Copy link or download')).toBeTruthy();
  expect(screen.queryByRole('button', { name: 'Back' })).toBeNull();
});

it('renders no trigger when the panel would be empty', () => {
  const { container } = render(<TriggerHarness actions={[]} />);

  expect(container.querySelector('button')).toBeNull();
});

it('ignores filtered-out actions when counting entries', () => {
  const { container } = render(
    <TriggerHarness
      actions={[
        { ...clearAction, key: 'audio', title: 'Audio' },
        { ...clearAction, key: 'facts', title: 'Facts', view: 'knownFacts' },
      ]}
    />
  );

  expect(container.querySelector('button')).toBeNull();
});

it('keeps the more actions menu for a logged-in user with only Known facts', () => {
  render(<TriggerHarness actions={[]} isLoggedIn showKnownFacts />);

  expect(screen.getByRole('button', { name: 'widget.moreActions' })).toBeTruthy();
});

it('opens chat history directly when it is the only entry', () => {
  const onChatHistoryOpen = jest.fn();
  render(
    <TriggerHarness
      actions={[]}
      loginToken="abcd"
      showChatHistory
      onChatHistoryOpen={onChatHistoryOpen}
    />
  );

  fireEvent.click(
    screen.getByRole('button', { name: 'write_and_speak.chatHistory' })
  );

  expect(onChatHistoryOpen).toHaveBeenCalledTimes(1);
});

it('ignores chat history without a login token', () => {
  render(
    <TriggerHarness actions={[clearAction]} showChatHistory />
  );

  expect(screen.getByRole('button', { name: 'Clear chat' })).toBeTruthy();
});

it('shows AI usage directly, disabled until there is usage data', () => {
  const onToggle = jest.fn();
  const { rerender } = render(
    <TriggerHarness actions={[]} showMessageConsumption onToggle={onToggle} />
  );

  const trigger = screen.getByRole('button', { name: 'widget.aiConsumption' });
  expect(trigger.hasAttribute('disabled')).toBe(true);

  rerender(
    <TriggerHarness
      actions={[]}
      showMessageConsumption
      history={llmUsageHistory}
      onToggle={onToggle}
    />
  );
  fireEvent.click(screen.getByRole('button', { name: 'widget.aiConsumption' }));

  expect(onToggle).toHaveBeenCalledTimes(1);
});

it('disables the direct trigger when the single action is disabled', () => {
  const onClick = jest.fn();
  render(<TriggerHarness actions={[{ ...clearAction, onClick, disabled: true }]} />);

  const trigger = screen.getByRole('button', { name: 'Clear chat' });
  expect(trigger.hasAttribute('disabled')).toBe(true);
  fireEvent.click(trigger);
  expect(onClick).not.toHaveBeenCalled();
});
