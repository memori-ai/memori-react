import { render } from '@testing-library/react';
import SettingsDrawer from './SettingsDrawer';

beforeEach(() => {
  // @ts-ignore
  window.IntersectionObserver = jest.fn(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
    takeRecords: jest.fn(),
  }));
});

it('renders SettingsDrawer unchanged', () => {
  const { container } = render(
    <SettingsDrawer
      open={false}
      onClose={jest.fn()}
      continuousSpeech={false}
      continuousSpeechTimeout={2}
      setContinuousSpeech={jest.fn()}
      setContinuousSpeechTimeout={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders SettingsDrawer open unchanged', () => {
  const { container } = render(
    <SettingsDrawer
      open={true}
      onClose={jest.fn()}
      continuousSpeech={false}
      continuousSpeechTimeout={2}
      setContinuousSpeech={jest.fn()}
      setContinuousSpeechTimeout={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});
