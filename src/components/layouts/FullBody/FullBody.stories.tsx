import React from 'react';
import { Meta, Story } from '@storybook/react';
import { tenant } from '../../../mocks/data';
import { Props } from '../../MemoriWidget/MemoriWidget';
import Memori from '../../../index';
import I18nWrapper from '../../../I18nWrapper';
import { VisemeProvider } from '../../../context/visemeContext';
import { ArtifactProvider } from '../../MemoriArtifactSystem/context/ArtifactContext';

const meta: Meta = {
  title: 'General/Layouts/FullBody',
  component: (args: Props) => <Memori {...args}    />,
  argTypes: {},
  parameters: {
    controls: { expanded: true },
    layout: 'fullscreen',
  },
};

export default meta;


const Template: Story<Props> = args => (
  <I18nWrapper>
    <ArtifactProvider>
      <VisemeProvider>
        <Memori {...args} />
      </VisemeProvider>
    </ArtifactProvider>
  </I18nWrapper>
);

const DefaultLayout = Template.bind({});
DefaultLayout.args = {
  emoriName: 'Layout Storybook',
  ownerUserName: 'andrea.patini',
  memoriID: 'ae20fc5a-cc15-4db9-b7dd-2cd4a621b85e',
  ownerUserID: '91dbc9ba-b684-4fbe-9828-b5980af6cda9',
  tenantID: 'aisuru-staging.aclambda.online',
  engineURL: 'https://engine-staging.memori.ai/memori/v2',
  apiURL: 'https://backend-staging.memori.ai/api/v2',
  layout: 'FULL_CHAT',
  uiLang: 'IT',
  spokenLang: 'IT',
  integrationID: '0b1256c1-530c-4e67-aef8-36667c8887bb',
};

const baseIntegration = {
  integrationID: '0b1256c1-530c-4e67-aef8-36667c8887bb',
  memoriID: '157860e8-f014-43b3-a7c5-fb4a08c87025',
  type: 'LANDING_EXPERIENCE',
  state: 'NEW',
  deviceEmails: null,
  invocationText: null,
  jobID: null,
  publish: true,
  creationTimestamp: '2022-06-13T14:44:52.833573Z',
  lastChangeTimestamp: '2022-06-13T14:44:52.833573Z',
};

export const FullBodyWithFullBodyAvatar = Template.bind({});
FullBodyWithFullBodyAvatar.args = {
    ...DefaultLayout.args,
    avatar3DURL:
      'https://assets-staging.memori.ai/api/v2/asset/c0bb0d40-aebf-4e58-bfa0-45a4d7935153.glb#1763646903757',
  integration: {
    ...baseIntegration,
    customData: JSON.stringify({
      textColor: '#000000',
      buttonBgColor: '#007eb6',
      buttonTextColor: '#ffffff',
      blurBackground: true,
      innerBgColor: 'light',
      multilanguage: true,
      avatar: 'readyplayerme-full',
      avatarURL:
        'https://assets-staging.memori.ai/api/v2/asset/c0bb0d40-aebf-4e58-bfa0-45a4d7935153.glb#1763646903757',
      name: 'Layout Storybook',
      showShare: true,
    }),
  },
  tenant,
  layout: 'FULLPAGE',
};

export const FullBodyWithHalfBodyAvatar = Template.bind({});
FullBodyWithHalfBodyAvatar.args = {
    ...DefaultLayout.args,
    avatar3DURL:
      'https://assets.memori.ai/api/v2/asset/acc38f4a-e4c3-4a21-9818-c3d1672820ea.glb#1762875973109',
  integration: {
    ...baseIntegration,
    customData: JSON.stringify({
      textColor: '#000000',
      buttonBgColor: '#007eb6',
      buttonTextColor: '#ffffff',
      blurBackground: true,
      innerBgColor: 'light',
      multilanguage: true,
      avatar: 'readyplayerme',
      avatarURL:
        'https://assets.memori.ai/api/v2/asset/acc38f4a-e4c3-4a21-9818-c3d1672820ea.glb#1762875973109',
      name: 'Layout Storybook',
      showShare: true,
    }),
  },
  tenant,
  layout: 'FULLPAGE',
};

