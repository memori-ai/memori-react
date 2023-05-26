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
      microphoneMode="HOLD_TO_TALK"
      setMicrophoneMode={jest.fn()}
      continuousSpeechTimeout={2}
      setContinuousSpeechTimeout={jest.fn()}
      controlsPosition="bottom"
      setControlsPosition={jest.fn()}
      hideEmissions={false}
      setHideEmissions={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders SettingsDrawer open unchanged', () => {
  const { container } = render(
    <SettingsDrawer
      open={true}
      onClose={jest.fn()}
      microphoneMode="HOLD_TO_TALK"
      setMicrophoneMode={jest.fn()}
      continuousSpeechTimeout={2}
      setContinuousSpeechTimeout={jest.fn()}
      controlsPosition="bottom"
      setControlsPosition={jest.fn()}
      hideEmissions={false}
      setHideEmissions={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders SettingsDrawer open with continuous speech enabled unchanged', () => {
  const { container } = render(
    <SettingsDrawer
      open={true}
      onClose={jest.fn()}
      microphoneMode="CONTINUOUS"
      setMicrophoneMode={jest.fn()}
      continuousSpeechTimeout={2}
      setContinuousSpeechTimeout={jest.fn()}
      controlsPosition="bottom"
      setControlsPosition={jest.fn()}
      hideEmissions={false}
      setHideEmissions={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders SettingsDrawer open with non-default continuous speech timeout unchanged', () => {
  const { container } = render(
    <SettingsDrawer
      open={true}
      onClose={jest.fn()}
      microphoneMode="CONTINUOUS"
      setMicrophoneMode={jest.fn()}
      continuousSpeechTimeout={10}
      setContinuousSpeechTimeout={jest.fn()}
      controlsPosition="bottom"
      setControlsPosition={jest.fn()}
      hideEmissions={false}
      setHideEmissions={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders SettingsDrawer for totem layout open unchanged', () => {
  const { container } = render(
    <SettingsDrawer
      layout="TOTEM"
      open={true}
      onClose={jest.fn()}
      microphoneMode="HOLD_TO_TALK"
      setMicrophoneMode={jest.fn()}
      continuousSpeechTimeout={2}
      setContinuousSpeechTimeout={jest.fn()}
      controlsPosition="bottom"
      setControlsPosition={jest.fn()}
      hideEmissions={false}
      setHideEmissions={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders SettingsDrawer for totem layout open with controls at center unchanged', () => {
  const { container } = render(
    <SettingsDrawer
      layout="TOTEM"
      open={true}
      onClose={jest.fn()}
      microphoneMode="HOLD_TO_TALK"
      setMicrophoneMode={jest.fn()}
      continuousSpeechTimeout={2}
      setContinuousSpeechTimeout={jest.fn()}
      controlsPosition="center"
      setControlsPosition={jest.fn()}
      hideEmissions={false}
      setHideEmissions={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders SettingsDrawer for totem layout with continuous speech and hide emissions unchanged', () => {
  const { container } = render(
    <SettingsDrawer
      layout="TOTEM"
      open={true}
      onClose={jest.fn()}
      microphoneMode="HOLD_TO_TALK"
      setMicrophoneMode={jest.fn()}
      continuousSpeechTimeout={2}
      setContinuousSpeechTimeout={jest.fn()}
      controlsPosition="bottom"
      setControlsPosition={jest.fn()}
      hideEmissions={true}
      setHideEmissions={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});
