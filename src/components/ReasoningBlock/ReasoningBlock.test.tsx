import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import I18nWrapper from '../../I18nWrapper';
import ReasoningBlock from './ReasoningBlock';

const renderBlock = (ui: React.ReactElement) =>
  render(ui, { wrapper: I18nWrapper });

describe('ReasoningBlock', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('is expanded and labelled Thinking while streaming', () => {
    renderBlock(
      <ReasoningBlock content="Considering the request." complete={false} />
    );

    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveTextContent(/thinking/i);
    expect(screen.getByText('Considering the request.')).toBeInTheDocument();
  });

  it('collapses to Thought when already complete on mount', () => {
    renderBlock(<ReasoningBlock content="Finished thinking." complete />);

    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveTextContent(/thought/i);
    expect(trigger).not.toHaveTextContent(/thoughtFor|Thought for/i);
  });

  it('records duration when streaming finishes', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));

    const { rerender } = renderBlock(
      <ReasoningBlock content="Working it out." complete={false} />
    );

    jest.setSystemTime(new Date('2026-01-01T00:00:08.000Z'));
    rerender(<ReasoningBlock content="Working it out." complete />);

    expect(screen.getByRole('button')).toHaveTextContent(
      /thoughtFor|Thought for 8s/
    );
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });

  it('lets the user expand and collapse the thoughts', () => {
    renderBlock(<ReasoningBlock content="Hidden until opened." complete />);

    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Hidden until opened.')).toBeVisible();

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('does not auto-collapse if the user re-expanded during streaming', () => {
    const { rerender } = renderBlock(
      <ReasoningBlock content="Still going." complete={false} />
    );

    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');

    rerender(<ReasoningBlock content="Still going." complete />);

    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });
});
