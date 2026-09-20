import React from 'react';
import { fireEvent, render, screen } from '../../../../../testUtils';
import I18nWrapper from '../../../../../I18nWrapper';
import TabSwitch from './TabSwitch';

const renderSwitch = (
  activeTab: 'preview' | 'code' = 'preview',
  onTabChange = jest.fn()
) =>
  render(
    <I18nWrapper>
      <TabSwitch activeTab={activeTab} onTabChange={onTabChange} hasPreview />
    </I18nWrapper>
  );

it('exposes a segmented control with aria-pressed', () => {
  renderSwitch('preview');

  expect(
    screen.getByRole('group', { name: 'artifact.viewMode' })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: 'artifact.preview' })
  ).toHaveAttribute('aria-pressed', 'true');
  expect(
    screen.getByRole('button', { name: 'artifact.source' })
  ).toHaveAttribute('aria-pressed', 'false');
  expect(
    screen.getByRole('button', { name: 'artifact.preview' }).querySelector('svg')
  ).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: 'artifact.source' }).querySelector('svg')
  ).toBeInTheDocument();
});

it('notifies when the source segment is pressed', () => {
  const onTabChange = jest.fn();
  renderSwitch('preview', onTabChange);

  fireEvent.click(screen.getByRole('button', { name: 'artifact.source' }));
  expect(onTabChange).toHaveBeenCalledWith('code');
});
