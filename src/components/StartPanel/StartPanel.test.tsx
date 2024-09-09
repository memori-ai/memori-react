import React from 'react';
import { render } from '@testing-library/react';
import { memori, tenant, sessionID, integration, user } from '../../mocks/data';
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
      setShowLoginDrawer={jest.fn()}
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
      setShowLoginDrawer={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders StartPanel for board of experts unchanged', () => {
  const { container } = render(
    <StartPanel
      memori={{
        ...memori,
        enableBoardOfExperts: true,
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
      setShowLoginDrawer={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders StartPanel with deep thought enabled unchanged', () => {
  const { container } = render(
    <StartPanel
      memori={{
        ...memori,
        enableDeepThought: true,
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
      isUserLoggedIn
      user={{
        ...user,
        pAndCUAccepted: true,
      }}
      setShowLoginDrawer={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders StartPanel with deep thought but unlogged unchanged', () => {
  const { container } = render(
    <StartPanel
      memori={{
        ...memori,
        enableDeepThought: true,
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
      showLogin
      setShowLoginDrawer={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders StartPanel with deep thought enabled but without permission flag unchanged', () => {
  const { container } = render(
    <StartPanel
      memori={{
        ...memori,
        enableDeepThought: true,
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
      isUserLoggedIn
      user={{
        ...user,
        pAndCUAccepted: false,
      }}
      setShowLoginDrawer={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders StartPanel on instruct unchanged', () => {
  const { container } = render(
    <StartPanel
      memori={memori}
      tenant={tenant}
      language="it"
      userLang="en"
      setUserLang={() => {}}
      openPositionDrawer={() => {}}
      instruct={true}
      sessionId={sessionID}
      clickedStart={false}
      onClickStart={() => {}}
      setShowLoginDrawer={jest.fn()}
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
      language="it"
      userLang="en"
      setUserLang={() => {}}
      openPositionDrawer={() => {}}
      instruct={true}
      sessionId={sessionID}
      clickedStart={false}
      onClickStart={() => {}}
      setShowLoginDrawer={jest.fn()}
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
      setShowLoginDrawer={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders StartPanel with multilangual unchanged', () => {
  const { container } = render(
    <StartPanel
      memori={memori}
      tenant={tenant}
      isMultilanguageEnabled
      language="it"
      userLang="en"
      setUserLang={() => {}}
      openPositionDrawer={() => {}}
      instruct={false}
      sessionId={sessionID}
      clickedStart={false}
      onClickStart={() => {}}
      setShowLoginDrawer={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders StartPanel with completion provider down unchanged', () => {
  const { container } = render(
    <StartPanel
      memori={{
        ...memori,
        completionConfigForQuestionAnswering: {
          completionConfigID: '1',
          configName: 'openai-gpt-4',
          provider: 'OpenAI',
          model: 'gpt-4',
        },
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
      setShowLoginDrawer={jest.fn()}
      _TEST_forceProviderStatus="major_outage"
    />
  );
  expect(container).toMatchSnapshot();
});
