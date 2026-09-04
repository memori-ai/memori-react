import React from 'react';
import { render, screen } from '../../testUtils';
import { memori, history, user } from '../../mocks/data';
import Header from './Header';
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

it('hides the session menu when deep thought and AI consumption are off', () => {
  render(<Header {...loggedInFullpageProps} />);

  expect(screen.queryByLabelText('Info sessione')).toBeNull();
  expect(screen.queryByText('knownFacts.title')).toBeNull();
  expect(screen.queryByText('widget.aiConsumption')).toBeNull();
});

it('shows the session menu when deep thought is enabled', () => {
  render(
    <Header
      {...loggedInFullpageProps}
      memori={{
        ...memori,
        enableDeepThought: true,
      }}
    />
  );

  expect(screen.getByLabelText('Info sessione')).toBeTruthy();
});

it('shows the session menu when AI consumption is enabled', () => {
  render(<Header {...loggedInFullpageProps} showMessageConsumption />);

  expect(screen.getByLabelText('Info sessione')).toBeTruthy();
});