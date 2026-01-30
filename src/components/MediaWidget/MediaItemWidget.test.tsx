import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { medium, sessionID } from '../../mocks/data';
import MediaItemWidget from './MediaItemWidget';
import type { Medium } from '@memori.ai/memori-api-client/dist/types';

beforeAll(() => {
  if (typeof window !== 'undefined' && !window.IntersectionObserver) {
    (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  }
  if (typeof global !== 'undefined' && !globalThis.IntersectionObserver) {
    (globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  }
});

it('renders MediaItemWidget unchanged with no media', () => {
  const { container } = render(
    <MediaItemWidget items={[]} sessionID={sessionID} />
  );
  expect(container).toMatchSnapshot();
});

it('renders MediaItemWidget unchanged with img', () => {
  const { container } = render(<MediaItemWidget items={[medium]} />);
  expect(container).toMatchSnapshot();
});

it('renders MediaItemWidget unchanged with img and sessionID', () => {
  const { container } = render(
    <MediaItemWidget items={[medium]} sessionID={sessionID} />
  );
  expect(container).toMatchSnapshot();
});

it('renders MediaItemWidget with imgs in correct order (creation date)', () => {
  let now = new Date().toISOString();
  let past = new Date('01/01/1970').toISOString();

  const { container } = render(
    <MediaItemWidget
      items={[
        {
          ...medium,
          url: 'https://memori.ai/now',
          mediumID: 'now',
          creationTimestamp: now,
        },
        { ...medium, url: 'https://memori.ai/medium' },
        {
          ...medium,
          url: 'https://memori.ai/past',
          mediumID: 'past',
          creationTimestamp: past,
        },
      ]}
    />
  );

  expect(container).toMatchSnapshot();
});

it('renders MediaItemWidget unchanged with js snippet to show', () => {
  const { container } = render(
    <MediaItemWidget
      items={[
        {
          mediumID: 'a669fadb-12c0-469b-9b6c-34db22d371ca',
          mimeType: 'text/javascript',
          title: 'Snippet',
          content: 'console.log("Hello World!");',
        },
      ]}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders MediaItemWidget unchanged with js snippet to exec', () => {
  const { container } = render(
    <MediaItemWidget
      items={[
        {
          mediumID: 'a669fadb-12c0-469b-9b6c-34db22d371ca',
          mimeType: 'text/javascript',
          title: 'Snippet',
          content: 'console.log("Hello World!");',
          properties: {
            executable: true,
          },
        },
      ]}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders MediaItemWidget unchanged with css snippet to show', () => {
  const { container } = render(
    <MediaItemWidget
      items={[
        {
          mediumID: '65ca4a6d-f20b-402e-9d79-5e470f247927',
          mimeType: 'text/css',
          title: 'Snippet',
          content: 'body{\n  background-color: #f00;\n}',
        },
      ]}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders MediaItemWidget unchanged with css snippet to exec', () => {
  const { container } = render(
    <MediaItemWidget
      items={[
        {
          mediumID: '65ca4a6d-f20b-402e-9d79-5e470f247927',
          mimeType: 'text/css',
          title: 'Snippet',
          content: 'body{\n  background-color: #f00;\n}',
          properties: {
            executable: true,
          },
        },
      ]}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders MediaItemWidget unchanged with custom media renderer', () => {
  const { container } = render(
    <MediaItemWidget
      items={[]}
      sessionID={sessionID}
      customMediaRenderer={mimeType => <pre>{mimeType}</pre>}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders MediaItemWidget unchanged with rgb color', () => {
  const { container } = render(
    <MediaItemWidget
      items={[
        {
          mediumID: '65ca4a6d-f20b-402e-9d79-5e470f247927',
          mimeType: 'image/png',
          title: 'Rosso',
          url: 'rgb(255, 0, 0)',
        },
        {
          mediumID: '65ca4a6d-f20b-402e-9d79-5e470f247928',
          mimeType: 'image/png',
          title: 'Verde',
          url: 'rgb(0, 255, 0)',
        },
        {
          mediumID: '65ca4a6d-f20b-402e-9d79-5e470f247929',
          mimeType: 'image/png',
          title: 'Blu',
          url: 'rgb(0, 0, 255)',
        },
      ]}
      sessionID={sessionID}
    />
  );
  expect(container).toMatchSnapshot();
});

// --- Document cards & unified media list ---

it('renders PDF as document card with title and PDF badge', () => {
  const pdfItem: Medium & { type?: string } = {
    mediumID: 'pdf-1',
    mimeType: 'application/pdf',
    title: 'Report',
    url: 'https://example.com/report.pdf',
    type: 'document',
  };
  const { container } = render(
    <MediaItemWidget items={[pdfItem]} sessionID={sessionID} />
  );
  expect(screen.getByText('Report')).toBeInTheDocument();
  expect(screen.getByText('PDF')).toBeInTheDocument();
  expect(container.querySelector('.memori-media-item--document-link')).toBeInTheDocument();
});

it('renders HTML link as document card with Link badge when url present', () => {
  const linkItem: Medium & { type?: string } = {
    mediumID: 'link-1',
    mimeType: 'text/html',
    title: 'Memori',
    url: 'https://memori.ai',
    type: 'document',
  };
  render(
    <MediaItemWidget items={[linkItem]} sessionID={sessionID} />
  );
  expect(screen.getByText('Memori')).toBeInTheDocument();
  expect(screen.getByText('Link')).toBeInTheDocument();
});

it('opens MediaPreviewModal when clicking document attachment card', () => {
  const docItem: Medium & { type?: string } = {
    mediumID: 'doc-att-1',
    mimeType: 'application/pdf',
    title: 'Extracted Doc',
    content: 'Extracted text content',
    properties: { isDocumentAttachment: true },
    type: 'document',
  };
  render(
    <MediaItemWidget items={[docItem]} sessionID={sessionID} />
  );
  const card = screen.getByText('Extracted Doc').closest('[role="button"]');
  expect(card).toBeInTheDocument();
  fireEvent.click(card!);
  expect(screen.getByText('Extracted text content')).toBeInTheDocument();
});

it('opens MediaPreviewModal when clicking image with mediumID', () => {
  const imgItem: Medium & { type?: string } = {
    ...medium,
    mediumID: 'img-modal-1',
    mimeType: 'image/jpeg',
    title: 'Game Cover',
    url: 'https://api.lorem.space/image/game?w=150&h=220&hash=8B7BCDC2',
  };
  const { container } = render(
    <MediaItemWidget items={[imgItem]} sessionID={sessionID} />
  );
  const imageLink = container.querySelector('.memori-media-item--image-link');
  expect(imageLink).toBeInTheDocument();
  fireEvent.click(imageLink!);
  const modalImage = document.querySelector('.memori-content-preview-modal--image');
  expect(modalImage).toBeInTheDocument();
});
