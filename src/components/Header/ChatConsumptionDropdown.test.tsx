import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Message } from '@memori.ai/memori-api-client/dist/types';
import ChatConsumptionDropdown from './ChatConsumptionDropdown';

type TestMessage = Message & {
  llmUsage?: {
    provider?: string;
    model?: string;
    totalInputTokens?: number;
    outputTokens?: number;
    energyImpact?: {
      energy?: number | { parsedValue?: number };
      gwp?: number | { parsedValue?: number; source?: string };
      wcf?: number | { parsedValue?: number; source?: string };
    };
  };
};

describe('ChatConsumptionDropdown', () => {
  it('renders aggregated token and environmental usage', () => {
    const history = [
      {
        text: 'First response',
        timestamp: '2021-03-01T12:00:00.000Z',
        llmUsage: {
          provider: 'OpenAI',
          model: 'gpt-5',
          totalInputTokens: 1000,
          outputTokens: 200,
          energyImpact: {
            energy: { parsedValue: 0.0012 },
            gwp: { parsedValue: 0.00045 },
            wcf: { parsedValue: 0.0021 },
          },
        },
      },
      {
        text: 'Second response',
        timestamp: '2021-03-01T12:01:00.000Z',
        llmUsage: {
          provider: 'Anthropic',
          model: 'claude-3',
          totalInputTokens: 250,
          outputTokens: 50,
          energyImpact: {
            energy: 0.0008,
            gwp: { source: '0.00035' },
            wcf: { source: '0.0014' },
          },
        },
      },
    ] as TestMessage[];

    render(<ChatConsumptionDropdown history={history} />);

    fireEvent.click(
      screen.getByTitle('write_and_speak.showMessageConsumptionLabel')
    );

    expect(screen.getByText('chatLogs.totalChatConsumptionTitle')).toBeTruthy();
    expect(screen.getByText('chatLogs.modelUsage')).toBeTruthy();
    expect(screen.getByText('chatLogs.environmentalImpact')).toBeTruthy();
    expect(screen.getByText('1,250')).toBeTruthy();
    expect(screen.getByText('250')).toBeTruthy();
    expect(screen.getByText('OpenAI · gpt-5')).toBeTruthy();
    expect(screen.getByText('Anthropic · claude-3')).toBeTruthy();
    expect(screen.getByText('2 Wh')).toBeTruthy();
    expect(screen.getByText('800 mg')).toBeTruthy();
    expect(screen.getByText('3.5 mL')).toBeTruthy();
  });

  it('does not render when the chat has no llm usage data', () => {
    const history = [
      {
        text: 'Plain message',
        timestamp: '2021-03-01T12:00:00.000Z',
      },
    ] as TestMessage[];

    const { container } = render(<ChatConsumptionDropdown history={history} />);

    expect(container.firstChild).toBeNull();
    // expect(
    //   screen.queryByTitle('write_and_speak.showMessageConsumptionLabel')
    // ).toBeNull();
  });

  it('supports a custom trigger component', () => {
    const history = [
      {
        text: 'Response',
        timestamp: '2021-03-01T12:00:00.000Z',
        llmUsage: {
          provider: 'OpenAI',
          model: 'gpt-5',
          totalInputTokens: 10,
          outputTokens: 5,
          energyImpact: {
            energy: 0.0002,
            gwp: 0.0001,
            wcf: 0.0003,
          },
        },
      },
    ] as TestMessage[];

    render(
      <ChatConsumptionDropdown
        history={history}
        trigger={props => (
          <button type="button" {...props}>
            Custom Trigger
          </button>
        )}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Custom Trigger' }));

    expect(screen.getByText('chatLogs.totalChatConsumptionTitle')).toBeTruthy();
  });

  it('supports a custom trigger node', () => {
    const history = [
      {
        text: 'First response',
        timestamp: '2021-03-01T12:00:00.000Z',
        llmUsage: {
          provider: 'OpenAI',
          model: 'gpt-5',
          totalInputTokens: 1000,
          outputTokens: 200,
          energyImpact: {
            energy: { parsedValue: 0.0012 },
            gwp: { parsedValue: 0.00045 },
            wcf: { parsedValue: 0.0021 },
          },
        },
      },
    ] as TestMessage[];

    render(
      <ChatConsumptionDropdown
        history={history}
        trigger={<button type="button">Open usage</button>}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open usage' }));

    expect(screen.getByText('chatLogs.totalChatConsumptionTitle')).toBeTruthy();
  });
});
