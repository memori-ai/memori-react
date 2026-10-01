import React from 'react';
import { fireEvent } from '@testing-library/react';
import { render } from '../../testUtils';
import MicrophoneButton from './MicrophoneButton';

const idleLabel = 'write_and_speak.micButtonPopover';
const stopLabel = 'write_and_speak.stopRecording';

it('starts recording on a single click', () => {
  const startListening = jest.fn();
  const stopListening = jest.fn();
  const stopAudio = jest.fn();

  const { getByRole } = render(
    <MicrophoneButton
      startListening={startListening}
      stopListening={stopListening}
      stopAudio={stopAudio}
    />
  );

  fireEvent.click(getByRole('button', { name: idleLabel }));

  expect(stopAudio).toHaveBeenCalledTimes(1);
  expect(startListening).toHaveBeenCalledTimes(1);
  expect(stopListening).not.toHaveBeenCalled();
});

it('shows the stop icon while recording and stops on click', () => {
  const startListening = jest.fn();
  const stopListening = jest.fn();

  const { getByRole } = render(
    <MicrophoneButton
      listening
      startListening={startListening}
      stopListening={stopListening}
      stopAudio={jest.fn()}
    />
  );

  const button = getByRole('button', { name: stopLabel });
  expect(button).toHaveAttribute('aria-pressed', 'true');
  expect(button.querySelector('.memori-chat-inputs--mic-stop')).not.toBeNull();

  fireEvent.click(button);

  expect(stopListening).toHaveBeenCalledTimes(1);
  expect(startListening).not.toHaveBeenCalled();
});
