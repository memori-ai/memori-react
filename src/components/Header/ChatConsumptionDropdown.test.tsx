import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Message } from '@memori.ai/memori-api-client/dist/types';
import ChatConsumptionDropdown, {
  ChatConsumptionContent,
} from './ChatConsumptionDropdown';

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

const historyWithUsage = [
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

describe('ChatConsumptionContent', () => {
  it('renders aggregated token and environmental usage', () => {
    render(<ChatConsumptionContent history={historyWithUsage} />);

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
});

describe('ChatConsumptionDropdown', () => {
  it('renders a disabled trigger when the chat has no llm usage data', () => {
    const history = [
      {
        text: 'Plain message',
        timestamp: '2021-03-01T12:00:00.000Z',
      },
    ] as TestMessage[];

    render(<ChatConsumptionDropdown history={history} />);

    expect(
      screen.getByTitle('write_and_speak.showMessageConsumptionLabel')
    ).toBeDisabled();
  });

  it('renders the default trigger when usage data is present', () => {
    render(<ChatConsumptionDropdown history={historyWithUsage} />);

    expect(
      screen.getByTitle('write_and_speak.showMessageConsumptionLabel')
    ).toBeTruthy();
  });

  it('opens consumption details in a modal instead of a dropdown', () => {
    render(<ChatConsumptionDropdown history={historyWithUsage} />);

    expect(screen.queryByRole('dialog')).toBeNull();

    fireEvent.click(
      screen.getByTitle('write_and_speak.showMessageConsumptionLabel')
    );

    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText('chatLogs.totalChatConsumptionTitle')).toBeTruthy();
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('supports a custom trigger component', () => {
    render(
      <ChatConsumptionDropdown
        history={historyWithUsage}
        trigger={props => (
          <button type="button" {...props}>
            Custom Trigger
          </button>
        )}
      />
    );

    expect(
      screen.getByRole('button', { name: 'Custom Trigger' })
    ).toBeTruthy();
  });

  it('supports a custom trigger node', () => {
    render(
      <ChatConsumptionDropdown
        history={historyWithUsage}
        trigger={<button type="button">Open usage</button>}
      />
    );

    expect(screen.getByRole('button', { name: 'Open usage' })).toBeTruthy();
  });

  it('keeps a controlled modal mounted when the original trigger unmounts', () => {
    const Harness = () => {
      const [open, setOpen] = React.useState(false);
      const [showTrigger, setShowTrigger] = React.useState(true);

      return (
        <>
          {showTrigger && (
            <button
              type="button"
              onClick={() => {
                setOpen(true);
                setShowTrigger(false);
              }}
            >
              Open then hide
            </button>
          )}
          <ChatConsumptionDropdown
            history={historyWithUsage}
            open={open}
            onOpenChange={setOpen}
            hideTrigger
          />
        </>
      );
    };

    render(<Harness />);

    fireEvent.click(screen.getByRole('button', { name: 'Open then hide' }));

    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText('chatLogs.totalChatConsumptionTitle')).toBeTruthy();
  });
});
