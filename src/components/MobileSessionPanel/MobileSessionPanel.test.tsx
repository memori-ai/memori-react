import React from 'react';
import { fireEvent, render, screen } from '../../testUtils';
import MobileSessionPanel from './MobileSessionPanel';

const baseProps = {
  open: true,
  onClose: jest.fn(),
  title: 'Session',
  userName: 'Test user',
  actions: [],
  showSessionInfo: true,
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
