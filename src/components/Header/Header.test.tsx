import React from 'react';
import { render } from '@testing-library/react';
import { memori, history } from '../../mocks/data';
import Header from './Header';

it('renders Header unchanged', () => {
  const { container } = render(
    <Header
      memori={memori}
      history={history}
      setShowPositionDrawer={jest.fn()}
      setShowSettingsDrawer={jest.fn()}
      speakerMuted={false}
      setSpeakerMuted={jest.fn()}
      hasUserActivatedSpeak={false}
      showShare={false}
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
      setShowPositionDrawer={jest.fn()}
      setShowSettingsDrawer={jest.fn()}
      speakerMuted={false}
      setSpeakerMuted={jest.fn()}
      hasUserActivatedSpeak={false}
      showShare={false}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders Header with speaker muted unchanged', () => {
  const { container } = render(
    <Header
      memori={memori}
      history={history}
      setShowPositionDrawer={jest.fn()}
      setShowSettingsDrawer={jest.fn()}
      speakerMuted={true}
      setSpeakerMuted={jest.fn()}
      hasUserActivatedSpeak={false}
      showShare={false}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders Header with share button unchanged', () => {
  const { container } = render(
    <Header
      memori={memori}
      history={history}
      setShowPositionDrawer={jest.fn()}
      setShowSettingsDrawer={jest.fn()}
      speakerMuted={false}
      setSpeakerMuted={jest.fn()}
      hasUserActivatedSpeak={false}
      showShare={true}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders Header with user activated speak unchanged', () => {
  const { container } = render(
    <Header
      memori={memori}
      history={history}
      setShowPositionDrawer={jest.fn()}
      setShowSettingsDrawer={jest.fn()}
      speakerMuted={false}
      setSpeakerMuted={jest.fn()}
      hasUserActivatedSpeak={true}
      showShare={false}
    />
  );
  expect(container).toMatchSnapshot();
});
