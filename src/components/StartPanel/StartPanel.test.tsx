import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
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
      setVenue={jest.fn()}
      openPositionPopover={() => {}}
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
      setVenue={jest.fn()}
      openPositionPopover={() => {}}
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
      setVenue={jest.fn()}
      openPositionPopover={() => {}}
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
      setVenue={jest.fn()}
      openPositionPopover={() => {}}
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
      setVenue={jest.fn()}
      openPositionPopover={() => {}}
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
      setVenue={jest.fn()}
      openPositionPopover={() => {}}
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
      setVenue={jest.fn()}
      openPositionPopover={() => {}}
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
      setVenue={jest.fn()}
      openPositionPopover={() => {}}
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
      setVenue={jest.fn()}
      openPositionPopover={() => {}}
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
      setVenue={jest.fn()}
      openPositionPopover={() => {}}
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
      setVenue={jest.fn()}
      openPositionPopover={() => {}}
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
      setVenue={jest.fn()}
      openPositionPopover={() => {}}
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
      setVenue={jest.fn()}
      openPositionPopover={() => {}}
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
      setVenue={jest.fn()}
      openPositionPopover={() => {}}
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
      setVenue={jest.fn()}
      openPositionPopover={() => {}}
      instruct={false}
      clickedStart={false}
      onClickStart={onClickStart}
      setShowLoginDrawer={jest.fn()}
      notEnoughCredits
    />
  );

  const startButton = container.querySelector(
    '.memori--start-actions__start'
  ) as HTMLButtonElement;
  expect(startButton).toBeInTheDocument();
  expect(startButton).toBeDisabled();

  // Clicking the disabled button must not attempt to open a session.
  fireEvent.click(startButton);
  expect(onClickStart).not.toHaveBeenCalled();

  // No password field is ever rendered for a public agent.
  expect(queryByPlaceholderText('Password')).not.toBeInTheDocument();

  // The credits badge is rendered (tooltip content is portaled on hover by
  // @memori.ai/ui and is covered by BlockedMemoriBadge unit tests).
  const badge = container.querySelector('.blocked-memori-badge--wrapper');
  expect(badge).toBeInTheDocument();
  expect(getByText('memoriBlockedTitle')).toBeInTheDocument();
});

it('requests geolocation from the use-my-position click and sets venue', () => {
  const setVenue = jest.fn();
  const openPositionPopover = jest.fn();
  const getCurrentPosition = jest.fn(
    (
      success: (position: {
        coords: { latitude: number; longitude: number; accuracy: number };
      }) => void
    ) => {
      success({
        coords: {
          latitude: 45.4642,
          longitude: 9.19,
          accuracy: 25,
        },
      });
    }
  );

  Object.defineProperty(navigator, 'geolocation', {
    configurable: true,
    value: { getCurrentPosition },
  });

  const { getByRole } = render(
    <StartPanel
      memori={{
        ...memori,
        needsPosition: true,
      }}
      tenant={tenant}
      language="it"
      userLang="en"
      setUserLang={() => {}}
      setVenue={setVenue}
      openPositionPopover={openPositionPopover}
      instruct={false}
      sessionId={sessionID}
      clickedStart={false}
      onClickStart={() => {}}
      setShowLoginDrawer={jest.fn()}
    />
  );

  fireEvent.click(
    getByRole('button', { name: /write_and_speak\.useMyPosition/i })
  );

  expect(getCurrentPosition).toHaveBeenCalled();
  expect(setVenue).toHaveBeenCalledWith({
    latitude: 45.4642,
    longitude: 9.19,
    placeName: '',
    uncertainty: 0.025,
  });
});

it('renders footerBrand inside the start panel', () => {
  const { container } = render(
    <StartPanel
      memori={memori}
      tenant={tenant}
      language="it"
      userLang="en"
      setUserLang={() => {}}
      setVenue={jest.fn()}
      openPositionPopover={() => {}}
      instruct={false}
      sessionId={sessionID}
      clickedStart={false}
      onClickStart={() => {}}
      setShowLoginDrawer={jest.fn()}
      footerBrand={
        <div className="memori--powered-by">Powered by Memori.AI</div>
      }
    />
  );

  const panel = container.querySelector('.memori--start-panel');
  const footer = panel?.querySelector('.memori--start-panel__footer');

  expect(footer).not.toBeNull();
  expect(footer).toHaveTextContent('Powered by Memori.AI');
});

it('opens a mobile info modal whose title leaves room for the close button', async () => {
  const matchMedia = window.matchMedia as jest.Mock;
  matchMedia.mockImplementation((query: string) => ({
    matches: String(query).includes('max-width: 870px'),
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));

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
      setVenue={jest.fn()}
      openPositionPopover={() => {}}
      instruct={false}
      sessionId={sessionID}
      clickedStart={false}
      onClickStart={() => {}}
      setShowLoginDrawer={jest.fn()}
      isMultilanguageEnabled
    />
  );

  const privacyTrigger = await waitFor(() => {
    const triggers = container.querySelectorAll(
      '.memori--settings-section__info-trigger'
    );
    expect(triggers.length).toBeGreaterThan(0);
    return triggers[triggers.length - 1] as HTMLButtonElement;
  });

  fireEvent.click(privacyTrigger);

  const viewport = await waitFor(() => {
    const el = document.querySelector('.memori--start-panel-info-modal');
    expect(el).toBeInTheDocument();
    return el as HTMLElement;
  });

  const title = viewport.querySelector('.memori-modal__title');
  expect(title).toHaveClass('memori--start-panel-info-modal-title');
  expect(title).toHaveTextContent('privacyPolicy');
  expect(
    viewport.querySelector('.memori-modal__close')
  ).toBeInTheDocument();

  matchMedia.mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
});
