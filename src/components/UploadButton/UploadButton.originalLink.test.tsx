import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { AlertProvider } from '@memori.ai/ui';
import UploadButton from './UploadButton';
import { convertDocument } from '../../helpers/convertDocument';

jest.mock('../../helpers/convertDocument', () => ({
  convertDocument: jest.fn(),
}));

const convertDocumentMock = convertDocument as jest.MockedFunction<
  typeof convertDocument
>;

const ORIGINAL_URL =
  'https://gateway.example.com/originali/66fa-3b1c/carta%20intestata%20spa.docx';

const renderAndUpload = async (
  props: Partial<React.ComponentProps<typeof UploadButton>> = {}
) => {
  const uploadAsset = jest.fn().mockResolvedValue({
    resultCode: 0,
    asset: { assetURL: 'https://backend.example.com/api/v2/asset/text.txt' },
  });
  const setDocumentPreviewFiles = jest.fn();
  const { container } = render(
    <AlertProvider>
      <UploadButton
        setDocumentPreviewFiles={setDocumentPreviewFiles}
        documentPreviewFiles={[]}
        sessionID="session"
        memoriID="memori"
        authToken="token"
        client={{ backend: { uploadAsset } } as any}
        {...props}
      />
    </AlertProvider>
  );

  const input = container.querySelector(
    '.memori--document-upload-wrapper input[type="file"]'
  ) as HTMLInputElement;
  const file = new File(['docx'], 'carta intestata spa.docx');
  Object.defineProperty(input, 'files', { value: [file] });
  fireEvent.change(input);

  await waitFor(() => expect(setDocumentPreviewFiles).toHaveBeenCalled());
  const [doc] = setDocumentPreviewFiles.mock.calls[0][0]([]);
  return { doc, uploadAsset };
};

describe('UploadButton original file link', () => {
  beforeEach(() => convertDocumentMock.mockReset());

  it('uses the original file link and skips the text asset upload', async () => {
    convertDocumentMock.mockResolvedValue({
      text: 'Hello',
      originalUrl: ORIGINAL_URL,
    });

    const { doc, uploadAsset } = await renderAndUpload({
      maxDocumentContentLength: 40000,
    });

    expect(convertDocumentMock).toHaveBeenCalledWith(expect.any(File), {
      sessionID: 'session',
      memoriID: 'memori',
      baseUrl: '',
      maxChars: 40000,
    });
    expect(uploadAsset).not.toHaveBeenCalled();
    expect(doc.url).toBe(ORIGINAL_URL);
    expect(doc.content).toContain(
      `<attachment_link>\n${ORIGINAL_URL}\n</attachment_link>`
    );
    expect(doc.content).not.toContain('Excerpt');
  });

  it('adds an excerpt note when the API cut the text', async () => {
    convertDocumentMock.mockResolvedValue({
      text: 'Partial',
      originalUrl: ORIGINAL_URL,
      truncated: true,
      totalChars: 182000,
    });

    const { doc } = await renderAndUpload();

    expect(doc.content).toContain(
      '[Excerpt: first 7 of 182000 characters. The full original document is available at the attachment_link URL.]'
    );
  });

  it('does not re-truncate when the API already truncated (even if over local limit)', async () => {
    const apiText = `${'x'.repeat(100)}\n\n> [conversione troncata]`;
    convertDocumentMock.mockResolvedValue({
      text: apiText,
      originalUrl: ORIGINAL_URL,
      truncated: true,
      totalChars: 182000,
    });

    const { doc } = await renderAndUpload({
      maxDocumentContentLength: 50,
    });

    expect(doc.content).toContain(apiText);
    expect(doc.content).toContain(
      `[Excerpt: first ${apiText.length} of 182000 characters.`
    );
  });

  it('falls back to the text asset when no original link is returned', async () => {
    convertDocumentMock.mockResolvedValue({ text: 'Hello' });

    const { doc, uploadAsset } = await renderAndUpload();

    expect(uploadAsset).toHaveBeenCalledWith(
      'carta intestata spa.txt',
      expect.any(String),
      'token'
    );
    expect(doc.url).toBe('https://backend.example.com/api/v2/asset/text.txt');
  });
});
