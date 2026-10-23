import React from 'react';
import { fireEvent, render, screen } from '../../testUtils';
import { memori, history, user } from '../../mocks/data';
import Header, {
  HEADER_SESSION_OVERFLOW_THRESHOLD,
  countHeaderCoreButtons,
} from './Header';
import memoriApiClient from '@memori.ai/memori-api-client';

const loggedInFullpageProps = {
  memori,
  history,
  setVenue: jest.fn(),
  positionPopoverOpen: false,
  setPositionPopoverOpen: jest.fn(),
  setShowSettingsDrawer: jest.fn(),
  setShowKnownFactsDrawer: jest.fn(),
  setShowExpertsDrawer: jest.fn(),
  speakerMuted: false,
  setSpeakerMuted: jest.fn(),
  hasUserActivatedSpeak: true,
  showShare: false,
  showSettings: false,
  showFullscreen: false,
  enableAudio: false,
  clearHistory: jest.fn(),
  sessionID: '1234',
  loginToken: 'abcd',
  user,
  layout: 'FULLPAGE' as const,
  setShowLoginDrawer: jest.fn(),
  setShowChatHistoryDrawer: jest.fn(),
  apiClient: memoriApiClient(),
};

/** Enough core actions to force Known Facts + AI usage into the ⋯ menu. */
const crowdedHeaderProps = {
  ...loggedInFullpageProps,
  enableAudio: true,
  showShare: true,
  showReload: true,
  showClear: true,
  showExperts: true,
  memori: {
    ...memori,
    enableDeepThought: true,
    enableBoardOfExperts: true,
  },
};

it('renders Header unchanged', () => {
  const { container } = render(
    <Header
      memori={memori}
      history={history}
      setShowChatHistoryDrawer={jest.fn()}
      setVenue={jest.fn()}
      positionPopoverOpen={false}
      setPositionPopoverOpen={jest.fn()}
      setShowSettingsDrawer={jest.fn()}
      setShowKnownFactsDrawer={jest.fn()}
      setShowExpertsDrawer={jest.fn()}
      speakerMuted={false}
      setSpeakerMuted={jest.fn()}
      hasUserActivatedSpeak={false}
      showShare={false}
      showSettings={false}
      clearHistory={jest.fn()}
      setShowLoginDrawer={jest.fn()}
      apiClient={memoriApiClient()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders Header with position unchanged', () => {
  const { container } = render(
    <Header
      memori={{
        ...memori,
        needsPosition: true,
      }}
      position={{
        placeName: 'Berlin',
        latitude: 52.520008,
        longitude: 13.404954,
      }}
      history={history}
      setShowChatHistoryDrawer={jest.fn()}
      setVenue={jest.fn()}
      positionPopoverOpen={false}
      setPositionPopoverOpen={jest.fn()}
      setShowSettingsDrawer={jest.fn()}
      setShowKnownFactsDrawer={jest.fn()}
      setShowExpertsDrawer={jest.fn()}
      speakerMuted={false}
      setSpeakerMuted={jest.fn()}
      hasUserActivatedSpeak={false}
      showShare={false}
      showSettings={false}
      clearHistory={jest.fn()}
      setShowLoginDrawer={jest.fn()}
      apiClient={memoriApiClient()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders Header with speaker muted unchanged', () => {
  const { container } = render(
    <Header
      memori={memori}
      history={history}
      setVenue={jest.fn()}
      positionPopoverOpen={false}
      setPositionPopoverOpen={jest.fn()}
      setShowSettingsDrawer={jest.fn()}
      setShowKnownFactsDrawer={jest.fn()}
      setShowExpertsDrawer={jest.fn()}
      speakerMuted={true}
      setSpeakerMuted={jest.fn()}
      hasUserActivatedSpeak={false}
      showShare={false}
      showSettings={false}
      clearHistory={jest.fn()}
      setShowLoginDrawer={jest.fn()}
      setShowChatHistoryDrawer={jest.fn()}
      apiClient={memoriApiClient()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders Header with audio disabled unchanged', () => {
  const { container } = render(
    <Header
      memori={memori}
      history={history}
      setVenue={jest.fn()}
      positionPopoverOpen={false}
      setPositionPopoverOpen={jest.fn()}
      setShowSettingsDrawer={jest.fn()}
      setShowKnownFactsDrawer={jest.fn()}
      setShowExpertsDrawer={jest.fn()}
      speakerMuted={true}
      setSpeakerMuted={jest.fn()}
      enableAudio={false}
      hasUserActivatedSpeak={false}
      showShare={false}
      showSettings={false}
      clearHistory={jest.fn()}
      setShowLoginDrawer={jest.fn()}
      setShowChatHistoryDrawer={jest.fn()}
      apiClient={memoriApiClient()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders Header with share button unchanged', () => {
  const { container } = render(
    <Header
      memori={memori}
      history={history}
      setVenue={jest.fn()}
      positionPopoverOpen={false}
      setPositionPopoverOpen={jest.fn()}
      setShowSettingsDrawer={jest.fn()}
      setShowKnownFactsDrawer={jest.fn()}
      setShowExpertsDrawer={jest.fn()}
      speakerMuted={false}
      setSpeakerMuted={jest.fn()}
      hasUserActivatedSpeak={false}
      showShare={true}
      showSettings={false}
      clearHistory={jest.fn()}
      setShowLoginDrawer={jest.fn()}
      setShowChatHistoryDrawer={jest.fn()}
      apiClient={memoriApiClient()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders Header with settings button unchanged', () => {
  const { container } = render(
    <Header
      memori={memori}
      history={history}
      setVenue={jest.fn()}
      positionPopoverOpen={false}
      setPositionPopoverOpen={jest.fn()}
      setShowSettingsDrawer={jest.fn()}
      setShowKnownFactsDrawer={jest.fn()}
      setShowExpertsDrawer={jest.fn()}
      speakerMuted={false}
      setSpeakerMuted={jest.fn()}
      hasUserActivatedSpeak={false}
      showShare={false}
      showSettings={true}
      clearHistory={jest.fn()}
      setShowLoginDrawer={jest.fn()}
      setShowChatHistoryDrawer={jest.fn()}
      apiClient={memoriApiClient()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders Header with clear button unchanged', () => {
  const { container } = render(
    <Header
      memori={memori}
      history={history}
      setVenue={jest.fn()}
      positionPopoverOpen={false}
      setPositionPopoverOpen={jest.fn()}
      setShowSettingsDrawer={jest.fn()}
      setShowKnownFactsDrawer={jest.fn()}
      setShowExpertsDrawer={jest.fn()}
      speakerMuted={false}
      setSpeakerMuted={jest.fn()}
      hasUserActivatedSpeak={false}
      showShare={false}
      showSettings={false}
      showClear={true}
      clearHistory={jest.fn()}
      setShowLoginDrawer={jest.fn()}
      setShowChatHistoryDrawer={jest.fn()}
      apiClient={memoriApiClient()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders Header with user activated speak unchanged', () => {
  const { container } = render(
    <Header
      memori={memori}
      history={history}
      setVenue={jest.fn()}
      positionPopoverOpen={false}
      setPositionPopoverOpen={jest.fn()}
      setShowSettingsDrawer={jest.fn()}
      setShowKnownFactsDrawer={jest.fn()}
      setShowExpertsDrawer={jest.fn()}
      speakerMuted={false}
      setSpeakerMuted={jest.fn()}
      hasUserActivatedSpeak={true}
      showShare={false}
      showSettings={false}
      clearHistory={jest.fn()}
      setShowLoginDrawer={jest.fn()}
      setShowChatHistoryDrawer={jest.fn()}
      apiClient={memoriApiClient()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders Header with deep thought unlogged unchanged', () => {
  const { container } = render(
    <Header
      memori={{
        ...memori,
        enableDeepThought: true,
      }}
      history={history}
      setVenue={jest.fn()}
      positionPopoverOpen={false}
      setPositionPopoverOpen={jest.fn()}
      setShowSettingsDrawer={jest.fn()}
      setShowKnownFactsDrawer={jest.fn()}
      setShowExpertsDrawer={jest.fn()}
      setShowChatHistoryDrawer={jest.fn()}
      speakerMuted={false}
      setSpeakerMuted={jest.fn()}
      hasUserActivatedSpeak={false}
      showShare={false}
      showSettings={false}
      clearHistory={jest.fn()}
      showLogin
      setShowLoginDrawer={jest.fn()}
      apiClient={memoriApiClient()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders Header with deep thought logged but without permission flag unchanged', () => {
  const { container } = render(
    <Header
      memori={{
        ...memori,
        enableDeepThought: true,
      }}
      history={history}
      setVenue={jest.fn()}
      positionPopoverOpen={false}
      setPositionPopoverOpen={jest.fn()}
      setShowSettingsDrawer={jest.fn()}
      setShowKnownFactsDrawer={jest.fn()}
      setShowExpertsDrawer={jest.fn()}
      speakerMuted={false}
      setSpeakerMuted={jest.fn()}
      hasUserActivatedSpeak={false}
      apiClient={memoriApiClient()}
      showShare={false}
      showSettings={false}
      clearHistory={jest.fn()}
      loginToken="abcd"
      user={{
        ...user,
        pAndCUAccepted: false,
      }}
      setShowLoginDrawer={jest.fn()}
      setShowChatHistoryDrawer={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders Header with deep thought logged with permission flag unchanged', () => {
  const { container } = render(
    <Header
      memori={{
        ...memori,
        enableDeepThought: true,
      }}
      history={history}
      setVenue={jest.fn()}
      positionPopoverOpen={false}
      setPositionPopoverOpen={jest.fn()}
      setShowSettingsDrawer={jest.fn()}
      setShowKnownFactsDrawer={jest.fn()}
      setShowExpertsDrawer={jest.fn()}
      speakerMuted={false}
      setSpeakerMuted={jest.fn()}
      hasUserActivatedSpeak={false}
      showShare={false}
      showSettings={false}
      clearHistory={jest.fn()}
      apiClient={memoriApiClient()}
      loginToken="abcd"
      user={{
        ...user,
        pAndCUAccepted: true,
      }}
      setShowLoginDrawer={jest.fn()}
      setShowChatHistoryDrawer={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders Header with deep thought and session open unchanged', () => {
  const { container } = render(
    <Header
      memori={{
        ...memori,
        enableDeepThought: true,
      }}
      history={history}
      setVenue={jest.fn()}
      positionPopoverOpen={false}
      setPositionPopoverOpen={jest.fn()}
      setShowSettingsDrawer={jest.fn()}
      setShowKnownFactsDrawer={jest.fn()}
      setShowExpertsDrawer={jest.fn()}
      speakerMuted={false}
      setSpeakerMuted={jest.fn()}
      hasUserActivatedSpeak={true}
      showShare={false}
      showSettings={false}
      clearHistory={jest.fn()}
      sessionID="1234"
      apiClient={memoriApiClient()}
      loginToken="abcd"
      setShowLoginDrawer={jest.fn()}
      setShowChatHistoryDrawer={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders Header for board of experts unchanged', () => {
  const { container } = render(
    <Header
      memori={{
        ...memori,
        enableBoardOfExperts: true,
      }}
      history={history}
      setVenue={jest.fn()}
      positionPopoverOpen={false}
      setPositionPopoverOpen={jest.fn()}
      setShowSettingsDrawer={jest.fn()}
      setShowKnownFactsDrawer={jest.fn()}
      setShowExpertsDrawer={jest.fn()}
      speakerMuted={false}
      setSpeakerMuted={jest.fn()}
      hasUserActivatedSpeak={false}
      showShare={false}
      showSettings={false}
      showExperts={true}
      clearHistory={jest.fn()}
      loginToken="abcd"
      setShowLoginDrawer={jest.fn()}
      apiClient={memoriApiClient()}
      setShowChatHistoryDrawer={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders Header for board of experts with session open unchanged', () => {
  const { container } = render(
    <Header
      memori={{
        ...memori,
        enableBoardOfExperts: true,
      }}
      history={history}
      setVenue={jest.fn()}
      positionPopoverOpen={false}
      setPositionPopoverOpen={jest.fn()}
      setShowSettingsDrawer={jest.fn()}
      setShowKnownFactsDrawer={jest.fn()}
      setShowExpertsDrawer={jest.fn()}
      speakerMuted={false}
      setSpeakerMuted={jest.fn()}
      hasUserActivatedSpeak={true}
      showShare={false}
      showSettings={false}
      showExperts={true}
      clearHistory={jest.fn()}
      sessionID="1234"
      loginToken="abcd"
      setShowLoginDrawer={jest.fn()}
      apiClient={memoriApiClient()}
      setShowChatHistoryDrawer={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('hides the experts button for board of experts by default', () => {
  render(
    <Header
      memori={{
        ...memori,
        enableBoardOfExperts: true,
      }}
      history={history}
      setVenue={jest.fn()}
      positionPopoverOpen={false}
      setPositionPopoverOpen={jest.fn()}
      setShowSettingsDrawer={jest.fn()}
      setShowKnownFactsDrawer={jest.fn()}
      setShowExpertsDrawer={jest.fn()}
      speakerMuted={false}
      setSpeakerMuted={jest.fn()}
      hasUserActivatedSpeak={true}
      showShare={false}
      showSettings={false}
      clearHistory={jest.fn()}
      sessionID="1234"
      setShowLoginDrawer={jest.fn()}
      apiClient={memoriApiClient()}
      setShowChatHistoryDrawer={jest.fn()}
    />
  );
  expect(screen.queryByLabelText('widget.showExpertsInTheBoard')).toBeNull();
});

it('hides the session menu when deep thought and AI consumption are off', () => {
  render(<Header {...loggedInFullpageProps} />);

  expect(
    screen.queryByLabelText('widget.mobileSession.sessionInfo')
  ).toBeNull();
  expect(screen.queryByText('knownFacts.title')).toBeNull();
  expect(screen.queryByText('widget.aiConsumption')).toBeNull();
});

it('shows Known Facts inline when the header is not crowded', () => {
  render(
    <Header
      {...loggedInFullpageProps}
      memori={{
        ...memori,
        enableDeepThought: true,
      }}
    />
  );

  expect(
    screen.queryByLabelText('widget.mobileSession.sessionInfo')
  ).toBeNull();
  expect(screen.getByLabelText('knownFacts.title')).toBeTruthy();
});

it('shows AI consumption inline when the header is not crowded', () => {
  render(<Header {...loggedInFullpageProps} showMessageConsumption />);

  expect(
    screen.queryByLabelText('widget.mobileSession.sessionInfo')
  ).toBeNull();
  expect(
    screen.getByLabelText('write_and_speak.showMessageConsumptionLabel')
  ).toBeTruthy();
});

it('collapses Known Facts and AI consumption into the session menu when the header is crowded', () => {
  expect(
    countHeaderCoreButtons({
      audio: true,
      share: true,
      reload: true,
      clear: true,
      experts: true,
    })
  ).toBeGreaterThan(HEADER_SESSION_OVERFLOW_THRESHOLD);

  render(<Header {...crowdedHeaderProps} showMessageConsumption />);

  expect(
    screen.getByLabelText('widget.mobileSession.sessionInfo')
  ).toBeTruthy();
  expect(screen.queryByLabelText('knownFacts.title')).toBeNull();
  expect(
    screen.queryByLabelText('write_and_speak.showMessageConsumptionLabel')
  ).toBeNull();

  fireEvent.click(screen.getByLabelText('widget.mobileSession.sessionInfo'));
  expect(screen.getByText('knownFacts.title')).toBeTruthy();
  expect(screen.getByText('widget.aiConsumption')).toBeTruthy();
});

it('keeps Known Facts inline when it is the only candidate in a crowded header', () => {
  render(<Header {...crowdedHeaderProps} />);

  expect(
    screen.queryByLabelText('widget.mobileSession.sessionInfo')
  ).toBeNull();
  expect(screen.getByLabelText('knownFacts.title')).toBeTruthy();
});

it('keeps AI consumption inline when it is the only candidate in a crowded header', () => {
  render(
    <Header
      {...crowdedHeaderProps}
      memori={{ ...crowdedHeaderProps.memori, enableDeepThought: false }}
      showMessageConsumption
    />
  );

  expect(
    screen.queryByLabelText('widget.mobileSession.sessionInfo')
  ).toBeNull();
  expect(
    screen.getByLabelText('write_and_speak.showMessageConsumptionLabel')
  ).toBeTruthy();
});

it('shows neither the session menu nor inline icons before the conversation starts in a crowded header', () => {
  render(
    <Header
      {...crowdedHeaderProps}
      hasUserActivatedSpeak={false}
      showMessageConsumption
    />
  );

  expect(
    screen.queryByLabelText('widget.mobileSession.sessionInfo')
  ).toBeNull();
  expect(screen.queryByLabelText('knownFacts.title')).toBeNull();
  expect(
    screen.queryByLabelText('write_and_speak.showMessageConsumptionLabel')
  ).toBeNull();
});

it('keeps the session menu hidden on mobile even when the header is crowded', () => {
  const matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches: query.includes('max-width: 767px'),
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
  const original = window.matchMedia;
  window.matchMedia = matchMedia as typeof window.matchMedia;

  try {
    render(<Header {...crowdedHeaderProps} showMessageConsumption />);

    expect(
      screen.queryByLabelText('widget.mobileSession.sessionInfo')
    ).toBeNull();
    // Logged-in fullpage mobile still defers Known Facts to the session panel.
    expect(screen.queryByLabelText('knownFacts.title')).toBeNull();
  } finally {
    window.matchMedia = original;
  }
});

it('shows the agent description in the fullpage header', () => {
  render(<Header {...loggedInFullpageProps} />);

  expect(
    document.querySelector('.memori-fullpage-header-brand-role')
  ).toHaveTextContent('Lorem ipsum.');
});
