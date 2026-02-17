import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatInputs from './ChatInputs';
import { dialogState } from '../../mocks/data';
import {
  PASTE_AS_CARD_CHAR_THRESHOLD,
  PASTE_AS_CARD_LINE_THRESHOLD,
} from '../../helpers/constants';

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// jsdom does not define DataTransfer; UploadButton's paste handler uses it when clipboard has files
if (typeof globalThis.DataTransfer === 'undefined') {
  (globalThis as any).DataTransfer = class DataTransfer {
    _files: File[] = [];
    get files(): File[] {
      return this._files;
    }
    items = {
      add: (file: File) => {
        this._files.push(file);
      },
    };
  };
}

// jsdom does not define speechSynthesis/SpeechSynthesisUtterance; ChatInputs uses them in onSendMessage
if (typeof (globalThis as any).speechSynthesis === 'undefined') {
  (globalThis as any).speechSynthesis = { speak: jest.fn() };
}
if (typeof (globalThis as any).SpeechSynthesisUtterance === 'undefined') {
  (globalThis as any).SpeechSynthesisUtterance = function () {};
}

const defaultProps = {
  dialogState,
  userMessage: '',
  onChangeUserMessage: jest.fn(),
  sendMessage: jest.fn(),
  onTextareaFocus: jest.fn(),
  onTextareaBlur: jest.fn(),
  setAttachmentsMenuOpen: jest.fn(),
  setSendOnEnter: jest.fn(),
  listening: false,
  isPlayingAudio: false,
  stopAudio: jest.fn(),
  startListening: jest.fn(),
  stopListening: jest.fn(),
  showMicrophone: true,
};

function createPasteEvent(plainText: string, files: File[] = []) {
  return {
    clipboardData: {
      files,
      getData: (type: string) => (type === 'text/plain' ? plainText : ''),
    },
    preventDefault: jest.fn(),
  };
}

it('renders ChatInputs unchanged', () => {
  const { container } = render(
    <ChatInputs
      dialogState={dialogState}
      userMessage=""
      onChangeUserMessage={jest.fn()}
      sendMessage={jest.fn()}
      onTextareaFocus={jest.fn()}
      onTextareaBlur={jest.fn()}
      setAttachmentsMenuOpen={jest.fn()}
      setSendOnEnter={jest.fn()}
      listening={false}
      isPlayingAudio={false}
      stopAudio={jest.fn()}
      startListening={jest.fn()}
      stopListening={jest.fn()}
      showMicrophone={true}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders ChatInputs with user message unchanged', () => {
  const { container } = render(
    <ChatInputs
      userMessage="Lorem ipsum"
      onChangeUserMessage={jest.fn()}
      dialogState={dialogState}
      sendMessage={jest.fn()}
      onTextareaFocus={jest.fn()}
      onTextareaBlur={jest.fn()}
      setAttachmentsMenuOpen={jest.fn()}
      setSendOnEnter={jest.fn()}
      listening={false}
      isPlayingAudio={false}
      stopAudio={jest.fn()}
      startListening={jest.fn()}
      stopListening={jest.fn()}
      showMicrophone={true}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders ChatInputs on instruct unchanged', () => {
  const { container } = render(
    <ChatInputs
      userMessage="Lorem ipsum"
      onChangeUserMessage={jest.fn()}
      dialogState={{
        ...dialogState,
        acceptsMedia: true,
      }}
      sendMessage={jest.fn()}
      onTextareaFocus={jest.fn()}
      onTextareaBlur={jest.fn()}
      setAttachmentsMenuOpen={jest.fn()}
      setSendOnEnter={jest.fn()}
      instruct
      listening={false}
      isPlayingAudio={false}
      stopAudio={jest.fn()}
      startListening={jest.fn()}
      stopListening={jest.fn()}
      showMicrophone={true}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders ChatInputs listening unchanged', () => {
  const { container } = render(
    <ChatInputs
      userMessage="Lorem ipsum"
      onChangeUserMessage={jest.fn()}
      dialogState={dialogState}
      sendMessage={jest.fn()}
      onTextareaFocus={jest.fn()}
      onTextareaBlur={jest.fn()}
      setAttachmentsMenuOpen={jest.fn()}
      setSendOnEnter={jest.fn()}
      listening={true}
      isPlayingAudio={false}
      stopAudio={jest.fn()}
      startListening={jest.fn()}
      stopListening={jest.fn()}
      showMicrophone={true}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders ChatInputs without microphone button unchanged', () => {
  const { container } = render(
    <ChatInputs
      userMessage="Lorem ipsum"
      onChangeUserMessage={jest.fn()}
      dialogState={dialogState}
      sendMessage={jest.fn()}
      onTextareaFocus={jest.fn()}
      onTextareaBlur={jest.fn()}
      setAttachmentsMenuOpen={jest.fn()}
      setSendOnEnter={jest.fn()}
      listening={true}
      isPlayingAudio={false}
      stopAudio={jest.fn()}
      startListening={jest.fn()}
      stopListening={jest.fn()}
      showMicrophone={false}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders ChatInputs disabled unchanged', () => {
  const { container } = render(
    <ChatInputs
      userMessage="Lorem ipsum"
      onChangeUserMessage={jest.fn()}
      dialogState={{
        ...dialogState,
        state: 'X3',
      }}
      sendMessage={jest.fn()}
      onTextareaFocus={jest.fn()}
      onTextareaBlur={jest.fn()}
      setAttachmentsMenuOpen={jest.fn()}
      setSendOnEnter={jest.fn()}
      listening={false}
      isPlayingAudio={false}
      stopAudio={jest.fn()}
      startListening={jest.fn()}
      stopListening={jest.fn()}
      showMicrophone={true}
    />
  );
  expect(container).toMatchSnapshot();
});

describe('paste as card (long text becomes attachment)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('adds pasted long text (by chars) as attachment when showUpload is true', async () => {
    const longText = 'x'.repeat(PASTE_AS_CARD_CHAR_THRESHOLD + 1);
    render(
      <ChatInputs
        {...defaultProps}
        showUpload={true}
        dialogState={{ ...dialogState, acceptsMedia: true }}
      />
    );
    const textarea = document.querySelector('textarea');
    expect(textarea).toBeTruthy();

    const paste = createPasteEvent(longText);
    fireEvent.paste(textarea!, paste);

    await waitFor(() => {
      expect(screen.getByText(/pasted-text/)).toBeTruthy();
    });
  });

  it('adds pasted long text (by lines) as attachment when showUpload is true', async () => {
    const lines = Array(PASTE_AS_CARD_LINE_THRESHOLD + 1)
      .fill('line')
      .join('\n');
    render(
      <ChatInputs
        {...defaultProps}
        showUpload={true}
        dialogState={{ ...dialogState, acceptsMedia: true }}
      />
    );
    const textarea = document.querySelector('textarea');
    const paste = createPasteEvent(lines);
    fireEvent.paste(textarea!, paste);

    await waitFor(() => {
      expect(screen.getByText(/pasted-text/)).toBeTruthy();
    });
  });

  it('does not add card for short paste', () => {
    const shortText = 'hello';
    render(
      <ChatInputs
        {...defaultProps}
        showUpload={true}
        dialogState={{ ...dialogState, acceptsMedia: true }}
      />
    );
    const textarea = document.querySelector('textarea');
    const paste = createPasteEvent(shortText);
    fireEvent.paste(textarea!, paste);

    expect(screen.queryByText(/pasted-text/)).toBeNull();
  });

  it('adds card even when showUpload is false (paste-as-card always enabled)', async () => {
    const longText = 'x'.repeat(PASTE_AS_CARD_CHAR_THRESHOLD + 1);
    render(
      <ChatInputs
        {...defaultProps}
        showUpload={false}
      />
    );
    const textarea = document.querySelector('textarea');
    fireEvent.paste(textarea!, createPasteEvent(longText));

    await waitFor(() => {
      expect(screen.getByText(/pasted-text/)).toBeTruthy();
    });
  });

  it('calls toast.error when max attachments reached', async () => {
    const { MAX_DOCUMENTS_PER_MESSAGE } = require('../../helpers/constants');
    const longText = 'x'.repeat(PASTE_AS_CARD_CHAR_THRESHOLD + 1);
    render(
      <ChatInputs
        {...defaultProps}
        showUpload={true}
        dialogState={{ ...dialogState, acceptsMedia: true }}
      />
    );
    const textarea = document.querySelector('textarea');
    for (let i = 0; i < MAX_DOCUMENTS_PER_MESSAGE; i++) {
      fireEvent.paste(textarea!, createPasteEvent(longText + i));
      await waitFor(() => {
        expect(document.querySelectorAll('.memori--preview-filename').length).toBe(i + 1);
      });
    }

    fireEvent.paste(textarea!, createPasteEvent(longText + ' over'));

    await waitFor(() => {
      const toast = require('react-hot-toast').default;
      expect(toast.error).toHaveBeenCalled();
    });
    expect(document.querySelectorAll('.memori--preview-filename').length).toBe(
      MAX_DOCUMENTS_PER_MESSAGE
    );
  });

  it('calls toast.error when pasted content exceeds size limit', async () => {
    const { MAX_DOCUMENT_CONTENT_LENGTH } = require('../../helpers/constants');
    const tooLongText = 'x'.repeat(MAX_DOCUMENT_CONTENT_LENGTH + 1);
    render(
      <ChatInputs
        {...defaultProps}
        showUpload={true}
        dialogState={{ ...dialogState, acceptsMedia: true }}
      />
    );
    const textarea = document.querySelector('textarea');
    const paste = createPasteEvent(tooLongText);
    fireEvent.paste(textarea!, paste);

    await waitFor(() => {
      const toast = require('react-hot-toast').default;
      expect(toast.error).toHaveBeenCalled();
    });
    expect(screen.queryByText(/pasted-text/)).toBeNull();
  });

  it('does not add card when paste has exactly 100 lines (boundary exclusive)', () => {
    const exactly150Lines = Array(100).fill('line').join('\n');
    render(
      <ChatInputs
        {...defaultProps}
        showUpload={true}
        dialogState={{ ...dialogState, acceptsMedia: true }}
      />
    );
    const textarea = document.querySelector('textarea');
    fireEvent.paste(textarea!, createPasteEvent(exactly150Lines));
    expect(screen.queryByText(/pasted-text/)).toBeNull();
  });

  it('does not add card when paste has exactly 8000 chars (boundary exclusive)', () => {
    const exactly8000Chars = 'x'.repeat(PASTE_AS_CARD_CHAR_THRESHOLD);
    render(
      <ChatInputs
        {...defaultProps}
        showUpload={true}
        dialogState={{ ...dialogState, acceptsMedia: true }}
      />
    );
    const textarea = document.querySelector('textarea');
    fireEvent.paste(textarea!, createPasteEvent(exactly8000Chars));
    expect(screen.queryByText(/pasted-text/)).toBeNull();
  });

  it('does not add card when clipboard has files (handler returns early)', () => {
    const longText = 'x'.repeat(PASTE_AS_CARD_CHAR_THRESHOLD + 1);
    const file = new File(['a'], 'a.txt', { type: 'text/plain' });
    const paste = createPasteEvent(longText, [file]);
    render(
      <ChatInputs
        {...defaultProps}
        showUpload={true}
        dialogState={{ ...dialogState, acceptsMedia: true }}
      />
    );
    const textarea = document.querySelector('textarea');
    fireEvent.paste(textarea!, paste);
    expect(screen.queryByText(/pasted-text/)).toBeNull();
  });

  it('does not add card for empty or whitespace-only paste', () => {
    render(
      <ChatInputs
        {...defaultProps}
        showUpload={true}
        dialogState={{ ...dialogState, acceptsMedia: true }}
      />
    );
    const textarea = document.querySelector('textarea');
    fireEvent.paste(textarea!, createPasteEvent(''));
    fireEvent.paste(textarea!, createPasteEvent('   \n\t  '));
    expect(screen.queryByText(/pasted-text/)).toBeNull();
  });

  it('adds two cards when same long text is pasted twice (duplicate paste)', async () => {
    const longText = 'x'.repeat(PASTE_AS_CARD_CHAR_THRESHOLD + 1);
    render(
      <ChatInputs
        {...defaultProps}
        showUpload={true}
        dialogState={{ ...dialogState, acceptsMedia: true }}
      />
    );
    const textarea = document.querySelector('textarea');
    fireEvent.paste(textarea!, createPasteEvent(longText));
    await waitFor(() => {
      expect(screen.getByText(/pasted-text/)).toBeTruthy();
    });
    fireEvent.paste(textarea!, createPasteEvent(longText));
    await waitFor(() => {
      expect(document.querySelectorAll('.memori--preview-filename').length).toBe(2);
    });
  });

  it('shows FilePreview when showUpload is false but pasted card was added', async () => {
    const longText = 'x'.repeat(PASTE_AS_CARD_CHAR_THRESHOLD + 1);
    render(
      <ChatInputs
        {...defaultProps}
        showUpload={false}
      />
    );
    expect(document.querySelector('.memori--preview-container')).toBeNull();
    const textarea = document.querySelector('textarea');
    fireEvent.paste(textarea!, createPasteEvent(longText));
    await waitFor(() => {
      expect(screen.getByText(/pasted-text/)).toBeTruthy();
    });
    expect(document.querySelector('.memori--preview-container')).toBeTruthy();
  });

  it('calls sendMessage with pasted card in media when user sends', async () => {
    const sendMessageMock = jest.fn();
    const longText = 'x'.repeat(PASTE_AS_CARD_CHAR_THRESHOLD + 1);
    const { container } = render(
      <ChatInputs
        {...defaultProps}
        showUpload={true}
        userMessage="hello"
        sendMessage={sendMessageMock}
        dialogState={{ ...dialogState, acceptsMedia: true }}
      />
    );
    const textarea = document.querySelector('textarea');
    fireEvent.paste(textarea!, createPasteEvent(longText));
    await waitFor(() => {
      expect(screen.getByText(/pasted-text/)).toBeTruthy();
    });
    const sendButton = container.querySelector('.memori-chat-inputs--send-btn');
    expect(sendButton).toBeTruthy();
    fireEvent.click(sendButton!);

    expect(sendMessageMock).toHaveBeenCalledTimes(1);
    expect(sendMessageMock).toHaveBeenCalledWith(
      'hello',
      expect.arrayContaining([
        expect.objectContaining({
          mimeType: 'text/plain',
          title: 'pasted-text',
          content: longText,
          type: 'document',
          properties: expect.objectContaining({ isAttachedFile: true }),
          mediumID: expect.any(String),
        }),
      ])
    );
  });
});
