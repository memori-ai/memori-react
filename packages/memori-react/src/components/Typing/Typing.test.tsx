import { act, render } from '@testing-library/react';
import Typing from './Typing';

it('renders Typing unchanged', () => {
  const { container } = render(<Typing />);
  expect(container).toMatchSnapshot();
});

it('runs a single continuous loop on the typing indicator', () => {
  const { container } = render(<Typing />);
  const wave = container.querySelector('#wave');
  expect(wave).toHaveClass('memori-motion-loop');
  expect(wave?.querySelectorAll('.dot')).toHaveLength(3);
});

it('renders Typing with default loading text unchanged', () => {
  const { container } = render(<Typing useDefaultSentences lang="en" />);
  expect(container).toMatchSnapshot();
});

it('renders Typing with default italian loading text unchanged', () => {
  const { container } = render(<Typing useDefaultSentences lang="it" />);
  expect(container).toMatchSnapshot();
});

it('renders Typing with custom loading text unchanged', () => {
  const { container } = render(
    <Typing sentence="Chiedo agli unicorni cosa ne pensano..." />
  );
  expect(container).toMatchSnapshot();
});

it('renders Typing with custom loading text list unchanged', () => {
  const { container } = render(
    <Typing
      sentences={{
        en: [
          {
            text: 'I am asking the unicorns what they think about it',
            delayAfter: 5,
          },
          {
            text: 'I am trying to understand what my cat is saying about it',
            delayAfter: 10,
          },
          {
            text: 'I am collecting the opinions of the people I know',
            delayAfter: 2,
          },
        ],
        it: [
          {
            text: 'Chiedo agli unicorni cosa ne pensano',
            delayAfter: 5,
          },
          {
            text: 'Sto cercando di capire cosa ne pensa il mio gatto',
            delayAfter: 10,
          },
          {
            text: 'Sto raccogliendo le opinioni delle persone che conosco',
            delayAfter: 2,
          },
        ],
      }}
    />
  );
  expect(container).toMatchSnapshot();
});

it('does not render delay padding spaces in the typing bubble', () => {
  jest.useFakeTimers();

  const { container } = render(<Typing sentence="I'm thinking" />);

  // Type past the visible sentence ("I'm thinking...") into the delay spaces.
  for (let i = 0; i < 40; i++) {
    act(() => {
      jest.advanceTimersByTime(50);
    });
  }

  const paragraph = container.querySelector('.memori-chat--bubble-typing p');
  expect(paragraph?.textContent).toBe("I'm thinking...");
  expect(paragraph?.textContent).not.toMatch(/ {2,}/);

  jest.useRealTimers();
});
