import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
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

it('renders StartPanel with existing sessionunchanged', () => {
  const { container } = render(
    <StartPanel
      memori={memori}
      tenant={tenant}
      language="it"
      userLang="en"
      hasInitialSession
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

it('renders StartPanel with login required unchanged', () => {
  const { container } = render(
    <StartPanel
      memori={{
        ...memori,
        requireLoginToken: true,
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

it('renders StartPanel with not enough credits unchanged', () => {
  const { container } = render(
    <StartPanel
      memori={memori}
      tenant={tenant}
      language="it"
      userLang="en"
      setUserLang={() => {}}
      openPositionDrawer={() => {}}
      instruct={false}
      clickedStart={false}
      onClickStart={() => {}}
      setShowLoginDrawer={jest.fn()}
      notEnoughCredits
    />
  );
  expect(container).toMatchSnapshot();
});

// When the agent owner has not enough credits, opening the chat for a PUBLIC
// agent must not start a session nor ask for a password: the start button is
// disabled and a "not enough credits" badge is shown instead.
it('blocks start and shows credits badge when owner has not enough credits', () => {
  const onClickStart = jest.fn();
  const { container, getByText, queryByPlaceholderText } = render(
    <StartPanel
      memori={{ ...memori, privacyType: 'PUBLIC' }}
      tenant={tenant}
      language="it"
      userLang="en"
      setUserLang={() => {}}
      openPositionDrawer={() => {}}
      instruct={false}
      clickedStart={false}
      onClickStart={onClickStart}
      setShowLoginDrawer={jest.fn()}
      notEnoughCredits
    />
  );

  const startButton = container.querySelector(
    '.memori--start-button'
  ) as HTMLButtonElement;
  expect(startButton).toBeInTheDocument();
  expect(startButton).toBeDisabled();

  // Clicking the disabled button must not attempt to open a session.
  fireEvent.click(startButton);
  expect(onClickStart).not.toHaveBeenCalled();

  // No password field is ever rendered for a public agent.
  expect(queryByPlaceholderText('Password')).not.toBeInTheDocument();

  // The credits badge is rendered and surfaces the proper message on hover.
  const badge = container.querySelector('.blocked-memori-badge--wrapper');
  expect(badge).toBeInTheDocument();

  const tooltipTrigger = container.querySelector(
    '.blocked-memori-badge--tooltip'
  ) as HTMLElement;
  fireEvent.mouseEnter(tooltipTrigger);
  expect(getByText('notEnoughCredits')).toBeInTheDocument();
});
