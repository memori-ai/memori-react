import React from 'react';
import { Meta, Story } from '@storybook/react';
import { memori, tenant } from '../../../mocks/data';
import { Props } from '../../MemoriWidget/MemoriWidget';
import Memori from '../../../index';
import I18nWrapper from '../../../I18nWrapper';
import { VisemeProvider } from '../../../context/visemeContext';
import { ArtifactProvider } from '../../MemoriArtifactSystem/context/ArtifactContext';

const meta: Meta = {
  title: 'General/Layouts/ZoomedFullBody',
  component: (args: Props) => <Memori {...args} engineURL="https://engine.memori.ai" apiURL="https://backend.memori.ai" baseURL="https://www.aisuru.com"    />,
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
  memoriName: 'Layout Storybook',
  ownerUserName: 'andrea.patini',
  memoriID: '157860e8-f014-43b3-a7c5-fb4a08c87025',
  ownerUserID: '95753bbe-9e88-4799-ae35-dc060bc11c48',
  tenantID: 'www.aisuru.com',
  engineURL: 'https://engine.memori.ai/memori/v2',
  apiURL: 'https://backend.memori.ai/api/v2',
  baseURL: 'https://www.aisuru.com',
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

export const ZoomedFullBodyWithFullBodyAvatar = Template.bind({});
ZoomedFullBodyWithFullBodyAvatar.args = {
    ...DefaultLayout.args,
    avatar3DURL:
      'https://assets.memori.ai/api/v2/asset/692580d6-7b25-4ed0-84ce-82d5f4ac4270.glb#1762875775270',
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
        'https://assets.memori.ai/api/v2/asset/692580d6-7b25-4ed0-84ce-82d5f4ac4270.glb#1762875775270',
      name: 'Layout Storybook',
      showShare: true,
    }),
  },
  tenant,
  layout: 'ZOOMED_FULL_BODY',
};

export const ZoomedFullBodyWithHalfBodyAvatar = Template.bind({});
ZoomedFullBodyWithHalfBodyAvatar.args = {
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
  layout: 'ZOOMED_FULL_BODY',
};

export const ZoomedFullBodyWithDefaultTotem = Template.bind({});
ZoomedFullBodyWithDefaultTotem.args = {
  ...DefaultLayout.args,
  integration: {
    ...baseIntegration,
    customData: JSON.stringify({
      textColor: '#000000',
      buttonBgColor: '#007eb6',
      buttonTextColor: '#ffffff',
      blurBackground: true,
      innerBgColor: 'light',
      multilanguage: true,
      avatar: 'default_totem',
      name: 'Layout Storybook',
      showShare: true,
    }),
  },
  tenant,
  layout: 'ZOOMED_FULL_BODY',
};

