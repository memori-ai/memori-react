import React from 'react';
import { render } from '@testing-library/react';
import { memori, tenant, integration } from '../../mocks/data';
import Avatar from './Avatar';

const integrationConfig = JSON.parse(integration.customData ?? '{}');

it('renders defualt Avatar (blob) unchanged', () => {
  const { container } = render(
    <Avatar
      memori={memori}
      tenant={tenant}
      instruct={false}
      avatar3dVisible={true}
      setAvatar3dVisible={() => {}}
      hasUserActivatedSpeak={false}
      isPlayingAudio={false}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders Avatar with blob and avatar in blob unchanged', () => {
  const { container } = render(
    <Avatar
      memori={memori}
      integrationConfig={{
        ...integrationConfig,
        avatar: 'userAvatar',
        avatarURL: memori.avatarURL,
      }}
      tenant={tenant}
      instruct={false}
      avatar3dVisible={true}
      setAvatar3dVisible={() => {}}
      hasUserActivatedSpeak={false}
      isPlayingAudio={false}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders Avatar with custom glb model unchanged', () => {
  const { container } = render(
    <Avatar
      memori={memori}
      integration={integration}
      integrationConfig={{
        ...integrationConfig,
        avatar: 'customglb',
        avatarURL:
          'https://assets.memori.ai/api/v2/asset/7383f05a-0788-49b0-b9b9-3bfc402c7ddf.glb#1669136149862',
      }}
      tenant={tenant}
      instruct={false}
      avatar3dVisible={true}
      setAvatar3dVisible={() => {}}
      hasUserActivatedSpeak={false}
      isPlayingAudio={false}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders Avatar with rpm 3d avatar unchanged', () => {
  const { container } = render(
    <Avatar
      memori={memori}
      integration={integration}
      integrationConfig={{
        ...integrationConfig,
        avatar: 'readyplayerme',
        avatarURL:
          'https://assets.memori.ai/api/v2/asset/b791f77c-1a94-4272-829e-eca82fcc62b7.glb',
      }}
      tenant={tenant}
      instruct={false}
      avatar3dVisible={true}
      setAvatar3dVisible={() => {}}
      hasUserActivatedSpeak={false}
      isPlayingAudio={false}
    />
  );
  expect(container).toMatchSnapshot();
});
