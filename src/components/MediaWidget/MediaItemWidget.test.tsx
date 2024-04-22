import React from 'react';
import { render } from '@testing-library/react';
import { medium, sessionID } from '../../mocks/data';
import MediaItemWidget from './MediaItemWidget';

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
