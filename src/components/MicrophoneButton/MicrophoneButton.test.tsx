import React from 'react';
import { fireEvent } from '@testing-library/react';
import { render } from '../../testUtils';
import MicrophoneButton from './MicrophoneButton';

const idleLabel = 'write_and_speak.micButtonPopover';
const stopLabel = 'write_and_speak.micButtonPopoverListening';

it('starts recording on a single click and shows the stop icon immediately', () => {
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

  const button = getByRole('button', { name: idleLabel });
  fireEvent.click(button);

  expect(stopAudio).toHaveBeenCalledTimes(1);
  expect(startListening).toHaveBeenCalledTimes(1);
  expect(stopListening).not.toHaveBeenCalled();
  expect(getByRole('button', { name: stopLabel })).toHaveAttribute(
    'aria-pressed',
    'true'
  );
});

it('stops recording on the next click and restores the microphone icon', () => {
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

  fireEvent.click(getByRole('button', { name: stopLabel }));

  expect(stopListening).toHaveBeenCalledTimes(1);
  expect(startListening).not.toHaveBeenCalled();
  expect(getByRole('button', { name: idleLabel })).toHaveAttribute(
    'aria-pressed',
    'false'
  );
});
