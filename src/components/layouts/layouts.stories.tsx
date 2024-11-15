import React from 'react';
import { Meta, Story } from '@storybook/react';
import { memori, tenant, integration } from '../../mocks/data';
import Memori, { LayoutProps, Props } from '../MemoriWidget/MemoriWidget';
import I18nWrapper from '../../I18nWrapper';
import Spin from '../ui/Spin';
import { VisemeProvider } from '../../context/visemeContext';

const meta: Meta = {
  title: 'General/Layouts',
  component: Memori,
  argTypes: {
    AZURE_COGNITIVE_SERVICES_TTS_KEY: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
    layout: 'fullscreen',
  },
};

export default meta;

export const CustomLayout: React.FC<LayoutProps> = ({
  Header,
  headerProps,
  Avatar,
  avatarProps,
  Chat,
  chatProps,
  StartPanel,
  startPanelProps,
  integrationStyle,
  integrationBackground,
  ChangeMode,
  changeModeProps,
  sessionId,
  hasUserActivatedSpeak,
  showInstruct = false,
  loading = false,
  poweredBy,
}) => (
  <>
    {integrationStyle}
    {integrationBackground}

    <Spin spinning={loading} className="memori-mycustom-layout">
      {poweredBy}

      <div className="memori-mycustom-layout--controls">
        {sessionId && hasUserActivatedSpeak && Chat && chatProps ? (
          <Chat {...chatProps} />
        ) : startPanelProps ? (
          <StartPanel {...startPanelProps} />
        ) : null}
      </div>
    </Spin>
  </>
);

const Template: Story<Props> = args => (
  <I18nWrapper>
    <VisemeProvider>
      <Memori {...args} />
    </VisemeProvider>
  </I18nWrapper>
);
// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  uiLang: 'it',
  showShare: true,
  showSettings: true,
  memori,
  tenant,
  layout: 'FULLPAGE',
};

export const FullPage = Template.bind({});
FullPage.args = {
  uiLang: 'it',
  showShare: true,
  showSettings: true,
  memori,
  tenant,
  layout: 'FULLPAGE',
};

export const Totem = Template.bind({});
Totem.args = {
  uiLang: 'it',
  showShare: true,
  showSettings: true,
  // memori,
  // tenant,
  memori: {
    memoriID: '6573844d-a7cd-47ef-9e78-840d82020c21',
    name: 'Nicola',
    password: null,
    recoveryTokens: null,
    newPassword: null,
    ownerUserID: null,
    ownerUserName: 'nzambello',
    ownerTenantName: 'aisuru.com',
    memoriConfigurationID: 'fd10bb42-98d9-4c08-8e02-2b08bd4e4975',
    description:
      'Sono Nicola Zambello, sviluppatore e attivista per un web etico e sostenibile',
    completionDescription: null,
    engineMemoriID: '9b0a2913-d3d8-4e98-a49d-6e1c99479e1b',
    isOwner: false,
    isGiver: false,
    isReceiver: false,
    giverTag: null,
    giverPIN: null,
    privacyType: 'PUBLIC',
    secretToken: null,
    minimumNumberOfRecoveryTokens: null,
    totalNumberOfRecoveryTokens: null,
    sentInvitations: [],
    receivedInvitations: [],
    integrations: [
      {
        integrationID: '62de8c99-0ac2-4cbe-bd95-a39ad7dc6b32',
        memoriID: '6573844d-a7cd-47ef-9e78-840d82020c21',
        type: 'LANDING_EXPERIENCE',
        state: 'NEW',
        deviceEmails: null,
        invocationText: null,
        jobID: null,
        customData:
          '{"textColor":"#000000","buttonBgColor":"#007eb6","buttonTextColor":"#ffffff","globalBackground":"https://assets.memori.ai/api/v2/asset/cade3b9c-0437-4342-b2bd-8db9c2a3a20e.png","blurBackground":true,"innerBgColor":"light","multilanguage":true,"avatar":"readyplayerme","avatarURL":"https://assets.memori.ai/api/v2/asset/893c41df-7619-436d-9e86-fe1d406fc933.glb#1681736752156","name":"Pagina pubblica","contextVars":"ANIMALE:CANE","personTag":"☠️","personPIN":"666666","personName":"Pirata","showShare":true,"avatarFullBodyURL":"https://models.readyplayer.me/63b55751f17e295642bf07a2.glb"}',
        resources: [],
        publish: true,
        creationTimestamp: '2022-06-13T14:44:52.833573Z',
        lastChangeTimestamp: '2022-06-13T14:44:52.833573Z',
      },
    ],
    avatarURL:
      'https://assets.memori.ai/api/v2/asset/3049582f-db5f-452c-913d-e4340d4afd0a.png',
    coverURL:
      'https://assets.memori.ai/api/v2/asset/e9bb9f6d-8f34-45ab-af9e-6d630d9a51a8.png',
    avatar3DURL:
      'https://assets.memori.ai/api/v2/asset/893c41df-7619-436d-9e86-fe1d406fc933.glb',
    avatarOriginal3DURL:
      'https://d1a370nemizbjq.cloudfront.net/c7c80a1d-deda-4fe1-96c6-fabad0771aa2.glb',
    needsPosition: false,
    voiceType: 'MALE',
    culture: 'it-IT',
    categories: [
      'biografico',
      'tecnologia',
      'web',
      'open-source',
      'green',
      'privacy',
    ],
    exposed: true,
    disableR2R3Loop: null,
    disableR4Loop: null,
    disableR5Loop: null,
    enableCompletions: true,
    completionModel: null,
    chainingMemoriID: null,
    chainingBaseURL: null,
    chainingPassword: null,
    contentQualityIndex: 210.8,
    contentQualityIndexTimestamp: '2023-04-17T00:01:32.194744Z',
    publishedInTheMetaverse: true,
    metaverseEnvironment: 'apartment',
    blockedUntil: null,
    creationTimestamp: '2022-06-13T14:21:55.793034Z',
    lastChangeTimestamp: '2023-04-15T08:15:36.403546Z',
  },
  integration: {
    integrationID: '62de8c99-0ac2-4cbe-bd95-a39ad7dc6b32',
    memoriID: '6573844d-a7cd-47ef-9e78-840d82020c21',
    type: 'LANDING_EXPERIENCE',
    state: 'NEW',
    deviceEmails: null,
    invocationText: null,
    jobID: null,
    publish: true,
    creationTimestamp: '2022-06-13T14:44:52.833573Z',
    lastChangeTimestamp: '2022-06-13T14:44:52.833573Z',
    customData: JSON.stringify({
      ...JSON.parse(
        '{"textColor":"#000000","buttonBgColor":"#007eb6","buttonTextColor":"#ffffff","globalBackground":"https://assets.memori.ai/api/v2/asset/cade3b9c-0437-4342-b2bd-8db9c2a3a20e.png","blurBackground":true,"innerBgColor":"light","multilanguage":true,"avatar":"readyplayerme","avatarURL":"https://assets.memori.ai/api/v2/asset/893c41df-7619-436d-9e86-fe1d406fc933.glb#1681736752156","name":"Pagina pubblica","contextVars":"ANIMALE:CANE","personTag":"☠️","personPIN":"666666","personName":"Pirata","showShare":true,"avatarFullBodyURL":"https://models.readyplayer.me/63b55751f17e295642bf07a2.glb"}'
      ),
      avatar: 'readyplayerme-full',
      avatarURL:
        'https://models.readyplayer.me/63b55751f17e295642bf07a2.glb#' +
        // 'https://models.readyplayer.me/63b558263858282637c54115.glb#' +
        new Date(Date.now()).getTime(),
    }),
  },
  layout: 'TOTEM',
};

export const ChatOnly = Template.bind({});
ChatOnly.args = {
  uiLang: 'it',
  showShare: true,
  showSettings: true,
  // memori,
  // tenant,
  memori: {
    memoriID: '6573844d-a7cd-47ef-9e78-840d82020c21',
    name: 'Nicola',
    password: null,
    recoveryTokens: null,
    newPassword: null,
    ownerUserID: null,
    ownerUserName: 'nzambello',
    ownerTenantName: 'aisuru.com',
    memoriConfigurationID: 'fd10bb42-98d9-4c08-8e02-2b08bd4e4975',
    description:
      'Sono Nicola Zambello, sviluppatore e attivista per un web etico e sostenibile',
    completionDescription: null,
    engineMemoriID: '9b0a2913-d3d8-4e98-a49d-6e1c99479e1b',
    isOwner: false,
    isGiver: false,
    isReceiver: false,
    giverTag: null,
    giverPIN: null,
    privacyType: 'PUBLIC',
    secretToken: null,
    minimumNumberOfRecoveryTokens: null,
    totalNumberOfRecoveryTokens: null,
    sentInvitations: [],
    receivedInvitations: [],
    integrations: [
      {
        integrationID: '62de8c99-0ac2-4cbe-bd95-a39ad7dc6b32',
        memoriID: '6573844d-a7cd-47ef-9e78-840d82020c21',
        type: 'LANDING_EXPERIENCE',
        state: 'NEW',
        deviceEmails: null,
        invocationText: null,
        jobID: null,
        customData:
          '{"textColor":"#000000","buttonBgColor":"#007eb6","buttonTextColor":"#ffffff","globalBackground":"https://assets.memori.ai/api/v2/asset/cade3b9c-0437-4342-b2bd-8db9c2a3a20e.png","blurBackground":true,"innerBgColor":"light","multilanguage":true,"avatar":"readyplayerme","avatarURL":"https://assets.memori.ai/api/v2/asset/893c41df-7619-436d-9e86-fe1d406fc933.glb#1681736752156","name":"Pagina pubblica","contextVars":"ANIMALE:CANE","personTag":"☠️","personPIN":"666666","personName":"Pirata","showShare":true,"avatarFullBodyURL":"https://models.readyplayer.me/63b55751f17e295642bf07a2.glb"}',
        resources: [],
        publish: true,
        creationTimestamp: '2022-06-13T14:44:52.833573Z',
        lastChangeTimestamp: '2022-06-13T14:44:52.833573Z',
      },
    ],
    avatarURL:
      'https://assets.memori.ai/api/v2/asset/3049582f-db5f-452c-913d-e4340d4afd0a.png',
    coverURL:
      'https://assets.memori.ai/api/v2/asset/e9bb9f6d-8f34-45ab-af9e-6d630d9a51a8.png',
    avatar3DURL:
      'https://assets.memori.ai/api/v2/asset/893c41df-7619-436d-9e86-fe1d406fc933.glb',
    avatarOriginal3DURL:
      'https://d1a370nemizbjq.cloudfront.net/c7c80a1d-deda-4fe1-96c6-fabad0771aa2.glb',
    needsPosition: false,
    voiceType: 'MALE',
    culture: 'it-IT',
    categories: [
      'biografico',
      'tecnologia',
      'web',
      'open-source',
      'green',
      'privacy',
    ],
    exposed: true,
    disableR2R3Loop: null,
    disableR4Loop: null,
    disableR5Loop: null,
    enableCompletions: true,
    completionModel: null,
    chainingMemoriID: null,
    chainingBaseURL: null,
    chainingPassword: null,
    contentQualityIndex: 210.8,
    contentQualityIndexTimestamp: '2023-04-17T00:01:32.194744Z',
    publishedInTheMetaverse: true,
    metaverseEnvironment: 'apartment',
    blockedUntil: null,
    creationTimestamp: '2022-06-13T14:21:55.793034Z',
    lastChangeTimestamp: '2023-04-15T08:15:36.403546Z',
  },
  integration: {
    integrationID: '62de8c99-0ac2-4cbe-bd95-a39ad7dc6b32',
    memoriID: '6573844d-a7cd-47ef-9e78-840d82020c21',
    type: 'LANDING_EXPERIENCE',
    state: 'NEW',
    deviceEmails: null,
    invocationText: null,
    jobID: null,
    publish: true,
    creationTimestamp: '2022-06-13T14:44:52.833573Z',
    lastChangeTimestamp: '2022-06-13T14:44:52.833573Z',
    customData: JSON.stringify({
      ...JSON.parse(
        '{"textColor":"#000000","buttonBgColor":"#007eb6","buttonTextColor":"#ffffff","globalBackground":"https://assets.memori.ai/api/v2/asset/cade3b9c-0437-4342-b2bd-8db9c2a3a20e.png","blurBackground":true,"innerBgColor":"light","multilanguage":true,"avatar":"readyplayerme","avatarURL":"https://assets.memori.ai/api/v2/asset/893c41df-7619-436d-9e86-fe1d406fc933.glb#1681736752156","name":"Pagina pubblica","contextVars":"ANIMALE:CANE","personTag":"☠️","personPIN":"666666","personName":"Pirata","showShare":true,"avatarFullBodyURL":"https://models.readyplayer.me/63b55751f17e295642bf07a2.glb"}'
      ),
      avatar: 'readyplayerme-full',
      avatarURL:
        'https://models.readyplayer.me/63b55751f17e295642bf07a2.glb#' +
        // 'https://models.readyplayer.me/63b558263858282637c54115.glb#' +
        new Date(Date.now()).getTime(),
    }),
  },
  layout: 'CHAT',
};

export const Custom = Template.bind({});
Custom.args = {
  uiLang: 'it',
  showShare: true,
  showSettings: true,
  memori,
  tenant,
  layout: 'FULLPAGE',
  customLayout: CustomLayout,
};

export const WebsiteAssistant = Template.bind({});
WebsiteAssistant.args = {
  uiLang: 'it',
  showShare: true,
  showSettings: true,
  memori: {
    memoriID: '6573844d-a7cd-47ef-9e78-840d82020c21',
    name: 'Nicola',
    password: null,
    recoveryTokens: null,
    newPassword: null,
    ownerUserID: null,
    ownerUserName: 'nzambello',
    ownerTenantName: 'aisuru.com',
    memoriConfigurationID: 'fd10bb42-98d9-4c08-8e02-2b08bd4e4975',
    description:
      'Sono Nicola Zambello, sviluppatore e attivista per un web etico e sostenibile',
    completionDescription: null,
    engineMemoriID: '9b0a2913-d3d8-4e98-a49d-6e1c99479e1b',
    isOwner: false,
    isGiver: false,
    isReceiver: false,
    giverTag: null,
    giverPIN: null,
    privacyType: 'PUBLIC',
    secretToken: null,
    minimumNumberOfRecoveryTokens: null,
    totalNumberOfRecoveryTokens: null,
    sentInvitations: [],
    receivedInvitations: [],
    integrations: [
      {
        integrationID: '62de8c99-0ac2-4cbe-bd95-a39ad7dc6b32',
        memoriID: '6573844d-a7cd-47ef-9e78-840d82020c21',
        type: 'LANDING_EXPERIENCE',
        state: 'NEW',
        deviceEmails: null,
        invocationText: null,
        jobID: null,
        customData:
          '{"textColor":"#000000","buttonBgColor":"#007eb6","buttonTextColor":"#ffffff","globalBackground":"https://assets.memori.ai/api/v2/asset/cade3b9c-0437-4342-b2bd-8db9c2a3a20e.png","blurBackground":true,"innerBgColor":"light","multilanguage":true,"avatar":"readyplayerme","avatarURL":"https://assets.memori.ai/api/v2/asset/893c41df-7619-436d-9e86-fe1d406fc933.glb#1681736752156","name":"Pagina pubblica","contextVars":"ANIMALE:CANE","personTag":"☠️","personPIN":"666666","personName":"Pirata","showShare":true,"avatarFullBodyURL":"https://models.readyplayer.me/63b55751f17e295642bf07a2.glb"}',
        resources: [],
        publish: true,
        creationTimestamp: '2022-06-13T14:44:52.833573Z',
        lastChangeTimestamp: '2022-06-13T14:44:52.833573Z',
      },
    ],
    avatarURL:
      'https://assets.memori.ai/api/v2/asset/3049582f-db5f-452c-913d-e4340d4afd0a.png',
    coverURL:
      'https://assets.memori.ai/api/v2/asset/e9bb9f6d-8f34-45ab-af9e-6d630d9a51a8.png',
    avatar3DURL:
      'https://assets.memori.ai/api/v2/asset/893c41df-7619-436d-9e86-fe1d406fc933.glb',
    avatarOriginal3DURL:
      'https://d1a370nemizbjq.cloudfront.net/c7c80a1d-deda-4fe1-96c6-fabad0771aa2.glb',
    needsPosition: false,
    voiceType: 'MALE',
    culture: 'it-IT',
    categories: [
      'biografico',
      'tecnologia',
      'web',
      'open-source',
      'green',
      'privacy',
    ],
    exposed: true,
    disableR2R3Loop: null,
    disableR4Loop: null,
    disableR5Loop: null,
    enableCompletions: true,
    completionModel: null,
    chainingMemoriID: null,
    chainingBaseURL: null,
    chainingPassword: null,
    contentQualityIndex: 210.8,
    contentQualityIndexTimestamp: '2023-04-17T00:01:32.194744Z',
    publishedInTheMetaverse: true,
    metaverseEnvironment: 'apartment',
    blockedUntil: null,
    creationTimestamp: '2022-06-13T14:21:55.793034Z',
    lastChangeTimestamp: '2023-04-15T08:15:36.403546Z',
  },
  integration: {
    integrationID: '62de8c99-0ac2-4cbe-bd95-a39ad7dc6b32',
    memoriID: '6573844d-a7cd-47ef-9e78-840d82020c21',
    type: 'LANDING_EXPERIENCE',
    state: 'NEW',
    deviceEmails: null,
    invocationText: null,
    jobID: null,
    publish: true,
    creationTimestamp: '2022-06-13T14:44:52.833573Z',
    lastChangeTimestamp: '2022-06-13T14:44:52.833573Z',
    customData: JSON.stringify({
      ...JSON.parse(
        '{"textColor":"#000000","buttonBgColor":"#007eb6","buttonTextColor":"#ffffff","globalBackground":"https://assets.memori.ai/api/v2/asset/cade3b9c-0437-4342-b2bd-8db9c2a3a20e.png","blurBackground":true,"innerBgColor":"light","multilanguage":true,"avatar":"readyplayerme","avatarURL":"https://assets.memori.ai/api/v2/asset/893c41df-7619-436d-9e86-fe1d406fc933.glb#1681736752156","name":"Pagina pubblica","contextVars":"ANIMALE:CANE","personTag":"☠️","personPIN":"666666","personName":"Pirata","showShare":true,"avatarFullBodyURL":"https://models.readyplayer.me/63b55751f17e295642bf07a2.glb"}'
      ),
      avatar: 'readyplayerme-full',
      avatarURL:
        'https://models.readyplayer.me/63b55751f17e295642bf07a2.glb#' +
        // 'https://models.readyplayer.me/63b558263858282637c54115.glb#' +
        new Date(Date.now()).getTime(),
    }),
  },
  tenant,
  layout: 'WEBSITE_ASSISTANT',
};

export const HiddenChat = Template.bind({});
HiddenChat.args = {
  uiLang: 'it',
  showShare: true,
  showSettings: true,
  // memori,
  // tenant,
  memori: {
    memoriID: '6573844d-a7cd-47ef-9e78-840d82020c21',
    name: 'Nicola',
    password: null,
    recoveryTokens: null,
    newPassword: null,
    ownerUserID: null,
    ownerUserName: 'nzambello',
    ownerTenantName: 'aisuru.com',
    memoriConfigurationID: 'fd10bb42-98d9-4c08-8e02-2b08bd4e4975',
    description:
      'Sono Nicola Zambello, sviluppatore e attivista per un web etico e sostenibile',
    completionDescription: null,
    engineMemoriID: '9b0a2913-d3d8-4e98-a49d-6e1c99479e1b',
    isOwner: false,
    isGiver: false,
    isReceiver: false,
    giverTag: null,
    giverPIN: null,
    privacyType: 'PUBLIC',
    secretToken: null,
    minimumNumberOfRecoveryTokens: null,
    totalNumberOfRecoveryTokens: null,
    sentInvitations: [],
    receivedInvitations: [],
    integrations: [
      {
        integrationID: '62de8c99-0ac2-4cbe-bd95-a39ad7dc6b32',
        memoriID: '6573844d-a7cd-47ef-9e78-840d82020c21',
        type: 'LANDING_EXPERIENCE',
        state: 'NEW',
        deviceEmails: null,
        invocationText: null,
        jobID: null,
        customData:
          '{"textColor":"#000000","buttonBgColor":"#007eb6","buttonTextColor":"#ffffff","globalBackground":"https://assets.memori.ai/api/v2/asset/cade3b9c-0437-4342-b2bd-8db9c2a3a20e.png","blurBackground":true,"innerBgColor":"light","multilanguage":true,"avatar":"readyplayerme","avatarURL":"https://assets.memori.ai/api/v2/asset/893c41df-7619-436d-9e86-fe1d406fc933.glb#1681736752156","name":"Pagina pubblica","contextVars":"ANIMALE:CANE","personTag":"☠️","personPIN":"666666","personName":"Pirata","showShare":true,"avatarFullBodyURL":"https://models.readyplayer.me/63b55751f17e295642bf07a2.glb"}',
        resources: [],
        publish: true,
        creationTimestamp: '2022-06-13T14:44:52.833573Z',
        lastChangeTimestamp: '2022-06-13T14:44:52.833573Z',
      },
    ],
    avatarURL:
      'https://assets.memori.ai/api/v2/asset/3049582f-db5f-452c-913d-e4340d4afd0a.png',
    coverURL:
      'https://assets.memori.ai/api/v2/asset/e9bb9f6d-8f34-45ab-af9e-6d630d9a51a8.png',
    avatar3DURL:
      'https://assets.memori.ai/api/v2/asset/893c41df-7619-436d-9e86-fe1d406fc933.glb',
    avatarOriginal3DURL:
      'https://d1a370nemizbjq.cloudfront.net/c7c80a1d-deda-4fe1-96c6-fabad0771aa2.glb',
    needsPosition: false,
    voiceType: 'MALE',
    culture: 'it-IT',
    categories: [
      'biografico',
      'tecnologia',
      'web',
      'open-source',
      'green',
      'privacy',
    ],
    exposed: true,
    disableR2R3Loop: null,
    disableR4Loop: null,
    disableR5Loop: null,
    enableCompletions: true,
    completionModel: null,
    chainingMemoriID: null,
    chainingBaseURL: null,
    chainingPassword: null,
    contentQualityIndex: 210.8,
    contentQualityIndexTimestamp: '2023-04-17T00:01:32.194744Z',
    publishedInTheMetaverse: true,
    metaverseEnvironment: 'apartment',
    blockedUntil: null,
    creationTimestamp: '2022-06-13T14:21:55.793034Z',
    lastChangeTimestamp: '2023-04-15T08:15:36.403546Z',
  },
  integration: {
    integrationID: '62de8c99-0ac2-4cbe-bd95-a39ad7dc6b32',
    memoriID: '6573844d-a7cd-47ef-9e78-840d82020c21',
    type: 'LANDING_EXPERIENCE',
    state: 'NEW',
    deviceEmails: null,
    invocationText: null,
    jobID: null,
    publish: true,
    creationTimestamp: '2022-06-13T14:44:52.833573Z',
    lastChangeTimestamp: '2022-06-13T14:44:52.833573Z',
    customData: JSON.stringify({
      ...JSON.parse(
        '{"textColor":"#000000","buttonBgColor":"#007eb6","buttonTextColor":"#ffffff","globalBackground":"https://assets.memori.ai/api/v2/asset/cade3b9c-0437-4342-b2bd-8db9c2a3a20e.png","blurBackground":true,"innerBgColor":"light","multilanguage":true,"avatar":"readyplayerme","avatarURL":"https://assets.memori.ai/api/v2/asset/893c41df-7619-436d-9e86-fe1d406fc933.glb#1681736752156","name":"Pagina pubblica","contextVars":"ANIMALE:CANE","personTag":"☠️","personPIN":"666666","personName":"Pirata","showShare":true,"avatarFullBodyURL":"https://models.readyplayer.me/63b55751f17e295642bf07a2.glb"}'
      ),
      avatar: 'readyplayerme-full',
      avatarURL:
        'https://models.readyplayer.me/63b55751f17e295642bf07a2.glb#' +
        // 'https://models.readyplayer.me/63b558263858282637c54115.glb#' +
        new Date(Date.now()).getTime(),
    }),
  },
  layout: 'HIDDEN_CHAT',
};

export const ZoomedFullBody = Template.bind({});
ZoomedFullBody.args = {
  uiLang: 'it',
  showShare: true,
  showSettings: true,
  showAudio: true,
  enableAudio: true,
  memori: {
    memoriID: '6573844d-a7cd-47ef-9e78-840d82020c21',
    name: 'Nicola',
    password: null,
    recoveryTokens: null,
    newPassword: null,
    ownerUserID: null,
    ownerUserName: 'nzambello',
    ownerTenantName: 'aisuru.com',
    memoriConfigurationID: 'fd10bb42-98d9-4c08-8e02-2b08bd4e4975',
    description:
      'Sono Nicola Zambello, sviluppatore e attivista per un web etico e sostenibile',
    completionDescription: null,
    engineMemoriID: '9b0a2913-d3d8-4e98-a49d-6e1c99479e1b',
    isOwner: false,
    isGiver: false,
    isReceiver: false,
    giverTag: null,
    giverPIN: null,
    privacyType: 'PUBLIC',
    enableAudio: true,
    secretToken: null,
    minimumNumberOfRecoveryTokens: null,
    totalNumberOfRecoveryTokens: null,
    sentInvitations: [],
    receivedInvitations: [],
    integrations: [
      {
        integrationID: '62de8c99-0ac2-4cbe-bd95-a39ad7dc6b32',
        memoriID: '6573844d-a7cd-47ef-9e78-840d82020c21',
        type: 'LANDING_EXPERIENCE',
        state: 'NEW',
        deviceEmails: null,
        invocationText: null,
        jobID: null,
        customData:
          '{"textColor":"#000000","buttonBgColor":"#007eb6","buttonTextColor":"#ffffff","globalBackground":"https://assets.memori.ai/api/v2/asset/cade3b9c-0437-4342-b2bd-8db9c2a3a20e.png","blurBackground":true,"innerBgColor":"light","multilanguage":true,"avatar":"readyplayerme","avatarURL":"https://assets.memori.ai/api/v2/asset/893c41df-7619-436d-9e86-fe1d406fc933.glb#1681736752156","name":"Pagina pubblica","contextVars":"ANIMALE:CANE","personTag":"☠️","personPIN":"666666","personName":"Pirata","showShare":true,"avatarFullBodyURL":"https://models.readyplayer.me/63b55751f17e295642bf07a2.glb"}',
        resources: [],
        publish: true,
        creationTimestamp: '2022-06-13T14:44:52.833573Z',
        lastChangeTimestamp: '2022-06-13T14:44:52.833573Z',
      },
    ],
    avatarURL:
      'https://assets.memori.ai/api/v2/asset/3049582f-db5f-452c-913d-e4340d4afd0a.png',
    coverURL:
      'https://assets.memori.ai/api/v2/asset/e9bb9f6d-8f34-45ab-af9e-6d630d9a51a8.png',
    avatar3DURL:
      'https://assets.memori.ai/api/v2/asset/3932bf70-e953-4e8a-b63a-f316544c283e.glb',
    avatarOriginal3DURL:
      'https://assets.memori.ai/api/v2/asset/3932bf70-e953-4e8a-b63a-f316544c283e.glb',
    needsPosition: false,
    voiceType: 'FEMALE',
    culture: 'it-IT',
    categories: [
      'biografico',
      'tecnologia',
      'web',
      'open-source',
      'green',
      'privacy',
    ],
    exposed: true,
    disableR2R3Loop: null,
    disableR4Loop: null,
    disableR5Loop: null,
    enableCompletions: true,
    completionModel: null,
    chainingMemoriID: null,
    chainingBaseURL: null,
    chainingPassword: null,
    contentQualityIndex: 210.8,
    contentQualityIndexTimestamp: '2023-04-17T00:01:32.194744Z',
    publishedInTheMetaverse: true,
    metaverseEnvironment: 'apartment',
    blockedUntil: null,
    creationTimestamp: '2022-06-13T14:21:55.793034Z',
    lastChangeTimestamp: '2023-04-15T08:15:36.403546Z',
  },
  integration: {
    integrationID: '62de8c99-0ac2-4cbe-bd95-a39ad7dc6b32',
    memoriID: '6573844d-a7cd-47ef-9e78-840d82020c21',
    type: 'LANDING_EXPERIENCE',
    state: 'NEW',
    deviceEmails: null,
    invocationText: null,
    jobID: null,
    publish: true,
    creationTimestamp: '2022-06-13T14:44:52.833573Z',
    lastChangeTimestamp: '2022-06-13T14:44:52.833573Z',
    customData: JSON.stringify({
      ...JSON.parse(
        '{"textColor":"#000000","buttonBgColor":"#007eb6","buttonTextColor":"#ffffff","globalBackground":"https://assets.memori.ai/api/v2/asset/cade3b9c-0437-4342-b2bd-8db9c2a3a20e.png","blurBackground":true,"innerBgColor":"light","multilanguage":true,"avatar":"readyplayerme","avatarURL":"https://assets.memori.ai/api/v2/asset/893c41df-7619-436d-9e86-fe1d406fc933.glb#1681736752156","name":"Pagina pubblica","contextVars":"ANIMALE:CANE","personTag":"☠️","personPIN":"666666","personName":"Pirata","showShare":true,"avatarFullBodyURL":"https://models.readyplayer.me/63b55751f17e295642bf07a2.glb"}'
      ),
      avatar: 'readyplayerme-full',
      avatarURL:
        'https://assets.memori.ai/api/v2/asset/3932bf70-e953-4e8a-b63a-f316544c283e.glb' +
        new Date(Date.now()).getTime(),
    }),
  },
  layout: 'ZOOMED_FULL_BODY',
};
