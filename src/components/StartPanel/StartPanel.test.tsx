import React from 'react';
import { render } from '@testing-library/react';
import { memori, tenant, sessionID, integration } from '../../mocks/data';
import StartPanel from './StartPanel';

it('renders StartPanel unchanged', () => {
  const { container } = render(
    <StartPanel
      memori={memori}
      tenant={tenant}
      language="it"
      userLang="en"
      setUserLang={() => {}}
      openPositionDrawer={() => {}}
      instruct={false}
      sessionId={sessionID}
      clickedStart={false}
      onClickStart={() => {}}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders StartPanel with gamification level unchanged', () => {
  const { container } = render(
    <StartPanel
      memori={memori}
      tenant={tenant}
      gamificationLevel={{
        points: 61,
        pointsForCurrentBadge: 60,
        badge: '🌍',
      }}
      language="it"
      userLang="en"
      setUserLang={() => {}}
      openPositionDrawer={() => {}}
      instruct={false}
      sessionId={sessionID}
      clickedStart={false}
      onClickStart={() => {}}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders StartPanel with completions enabled unchanged', () => {
  const { container } = render(
    <StartPanel
      memori={{
        ...memori,
        enableCompletions: true,
      }}
      tenant={tenant}
      language="it"
      userLang="en"
      setUserLang={() => {}}
      openPositionDrawer={() => {}}
      instruct={false}
      sessionId={sessionID}
      clickedStart={false}
      onClickStart={() => {}}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders StartPanel on instruct unchanged', () => {
  const { container } = render(
    <StartPanel
      memori={memori}
      tenant={tenant}
      gamificationLevel={{
        points: 61,
        pointsForCurrentBadge: 60,
        badge: '🌍',
      }}
      language="it"
      userLang="en"
      setUserLang={() => {}}
      openPositionDrawer={() => {}}
      instruct={true}
      sessionId={sessionID}
      clickedStart={false}
      onClickStart={() => {}}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders StartPanel with position required unchanged', () => {
  const { container } = render(
    <StartPanel
      memori={{
        ...memori,
        needsPosition: true,
      }}
      tenant={tenant}
      gamificationLevel={{
        points: 61,
        pointsForCurrentBadge: 60,
        badge: '🌍',
      }}
      language="it"
      userLang="en"
      setUserLang={() => {}}
      openPositionDrawer={() => {}}
      instruct={true}
      sessionId={sessionID}
      clickedStart={false}
      onClickStart={() => {}}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders StartPanel with integrationConfig unchanged', () => {
  const { container } = render(
    <StartPanel
      memori={memori}
      tenant={tenant}
      integrationConfig={JSON.parse(integration.customData ?? '{}')}
      language="it"
      userLang="en"
      setUserLang={() => {}}
      openPositionDrawer={() => {}}
      instruct={false}
      sessionId={sessionID}
      clickedStart={false}
      onClickStart={() => {}}
    />
  );
  expect(container).toMatchSnapshot();
});
