import React from 'react';
import { render, screen } from '../../testUtils';
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
