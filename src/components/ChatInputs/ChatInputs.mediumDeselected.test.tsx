import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import { render } from '../../testUtils';
import ChatInputs from './ChatInputs';
import { dialogState, sessionID } from '../../mocks/data';

jest.mock('../UploadButton/UploadButton', () => ({
  __esModule: true,
  default: ({
    setDocumentPreviewFiles,
  }: {
    setDocumentPreviewFiles: (files: unknown[]) => void;
  }) => (
    <button
      type="button"
      onClick={() =>
        setDocumentPreviewFiles([
          {
            id: 'file-1',
            name: 'panda',
            content: 'https://example.test/panda.png',
            url: 'https://example.test/panda.png',
            type: 'image',
            mimeType: 'image/png',
            mediumID: 'medium-1',
          },
        ])
      }
    >
      mock-attach
    </button>
  ),
}));

it('syncs the engine dialog state after removing an attached image', async () => {
  const removedState = {
    ...dialogState,
    emission: 'Ho rimosso il contenuto.',
  };
  const postMediumDeselectedEvent = jest
    .fn()
    .mockResolvedValue({ resultCode: 0, currentState: removedState });
  const onMediumSelectedState = jest.fn();

  const { getByText, container } = render(
    <ChatInputs
      dialogState={{ ...dialogState, acceptsMedia: true }}
      sessionID={sessionID}
      userMessage=""
      sendOnEnter="keypress"
      setSendOnEnter={jest.fn()}
      setAttachmentsMenuOpen={jest.fn()}
      onChangeUserMessage={jest.fn()}
      sendMessage={jest.fn()}
      onTextareaFocus={jest.fn()}
      onTextareaBlur={jest.fn()}
      stopAudio={jest.fn()}
      startListening={jest.fn()}
      stopListening={jest.fn()}
      showUpload
      client={{ dialog: { postMediumDeselectedEvent } } as any}
      onMediumSelectedState={onMediumSelectedState}
    />
  );

  fireEvent.click(getByText('mock-attach'));
  const removeButton = container.querySelector(
    '.memori--remove-button'
  ) as HTMLButtonElement;
  fireEvent.click(removeButton);

  await waitFor(() =>
    expect(onMediumSelectedState).toHaveBeenCalledWith(removedState)
  );
  expect(postMediumDeselectedEvent).toHaveBeenCalledWith(sessionID, 'medium-1');
});
