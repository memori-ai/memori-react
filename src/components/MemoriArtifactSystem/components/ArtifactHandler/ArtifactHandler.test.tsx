import React from 'react';
import { fireEvent, render, screen, waitFor } from '../../../../testUtils';
import I18nWrapper from '../../../../I18nWrapper';
import { ArtifactProvider } from '../../context/ArtifactContext';
import ArtifactHandler from './ArtifactHandler';

const message = {
  fromUser: false,
  text: `<output class="memori-artifact" data-mimetype="markdown" data-title="Hello notes"># Hello</output>`,
  timestamp: '2026-01-01T00:00:00.000Z',
};

const renderCard = (isChatlogPanel = false) =>
  render(
    <I18nWrapper>
      <ArtifactProvider>
        <ArtifactHandler
          isChatlogPanel={isChatlogPanel}
          message={message as any}
        />
      </ArtifactProvider>
    </I18nWrapper>
  );

it('wraps visible artifacts in the chat artifact block', async () => {
  const { container } = renderCard(false);

  await screen.findByRole('button', { name: 'Hello notes' });

  const block = container.querySelector('.memori-chat--artifact-block');
  expect(block).toBeInTheDocument();
  expect(block).not.toHaveClass('memori-chat--artifact-block--chatlog');
});

it('marks the artifact block as chatlog when rendered in the chatlog panel', async () => {
  const { container } = renderCard(true);

  await screen.findByRole('button', { name: 'Hello notes' });

  expect(container.querySelector('.memori-chat--artifact-block')).toHaveClass(
    'memori-chat--artifact-block--chatlog'
  );
});

it('points the side chevron at the column and flips it when expanded', async () => {
  renderCard(false);

  const card = await screen.findByRole('button', { name: 'Hello notes' });
  expect(card).toHaveAttribute('data-placement', 'side');
  expect(
    card.querySelectorAll('.memori-artifact-handler-chevron')
  ).toHaveLength(1);

  await waitFor(() => {
    expect(card).toHaveAttribute('aria-expanded', 'true');
  });

  fireEvent.click(card);

  await waitFor(() => {
    expect(card).toHaveAttribute('aria-expanded', 'false');
  });
});

it('points the chatlog chevron down and flips it when the inline panel opens', async () => {
  renderCard(true);

  const card = await screen.findByRole('button', { name: 'Hello notes' });
  expect(card).toHaveAttribute('data-placement', 'bottom');
  expect(card).toHaveAttribute('aria-expanded', 'false');

  fireEvent.click(card);

  await waitFor(() => {
    expect(card).toHaveAttribute('aria-expanded', 'true');
  });
});

it('hides the drawer title and expands to full chat width when opened in the chatlog panel', async () => {
  const { container } = renderCard(true);

  const card = await screen.findByRole('button', { name: 'Hello notes' });
  const block = container.querySelector('.memori-chat--artifact-block');

  expect(block).not.toHaveClass('memori-chat--artifact-block--expanded');

  fireEvent.click(card);

  await waitFor(() => {
    expect(card).toHaveAttribute('aria-expanded', 'true');
  });

  expect(block).toHaveClass('memori-chat--artifact-block--expanded');
  expect(
    screen.queryByRole('heading', { name: 'Hello notes' })
  ).not.toBeInTheDocument();
  expect(screen.queryByText('Markdown')).not.toBeInTheDocument();
});
