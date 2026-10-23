// TEMPORARY: visual QA of header overflow rule. Delete after review.
import React from 'react';
import { Meta, Story } from '@storybook/react';
import { memori, history, user } from '../../mocks/data';
import I18nWrapper from '../../I18nWrapper';
import Header, { Props } from './Header';
import { ArtifactProvider } from '../MemoriArtifactSystem/context/ArtifactContext';
import memoriApiClient from '@memori.ai/memori-api-client';
import './Header.css';
import { AlertProvider } from '@memori.ai/ui';

export default { title: 'TmpQA/HeaderEdgeCases', component: Header } as Meta;

const withConsumption = [
  ...history,
  {
    ...history[history.length - 1],
    llmUsage: {
      energyImpact: {
        energy: { parsedValue: 0.0012 },
        gwp: { parsedValue: 0.00045 },
        wcf: { parsedValue: 0.0021 },
      },
    },
  },
] as any;

const T: Story<Props> = args => (
  <I18nWrapper>
    <AlertProvider>
      <ArtifactProvider>
        <Header {...args} apiClient={memoriApiClient()} />
      </ArtifactProvider>
    </AlertProvider>
  </I18nWrapper>
);

const noop = () => {};
const crowded: Partial<Props> = {
  memori: { ...memori, needsPosition: true, enableDeepThought: true },
  history: withConsumption,
  setVenue: noop,
  positionPopoverOpen: false,
  setPositionPopoverOpen: noop,
  setShowSettingsDrawer: noop,
  setShowChatHistoryDrawer: noop,
  setShowKnownFactsDrawer: noop,
  setShowExpertsDrawer: noop,
  setShowLoginDrawer: noop,
  setSpeakerMuted: noop,
  clearHistory: noop,
  speakerMuted: false,
  hasUserActivatedSpeak: true,
  showReload: true,
  showClear: true,
  showShare: true,
  showMessageConsumption: true,
  layout: 'FULLPAGE',
  sessionID: '1234',
  loginToken: 'abcd',
  user: { ...user, pAndCUAccepted: true },
};

export const D_AiOnly = T.bind({});
D_AiOnly.args = {
  ...crowded,
  memori: { ...memori, needsPosition: true, enableDeepThought: false },
};

export const H_NoConsent = T.bind({});
H_NoConsent.args = { ...crowded, user: { ...user, pAndCUAccepted: false } };

export const J_NoConsumptionData = T.bind({});
J_NoConsumptionData.args = { ...crowded, history };

export const K_FewCoreNoDataNotStarted = T.bind({});
K_FewCoreNoDataNotStarted.args = {
  ...crowded,
  history,
  showReload: false,
  showClear: false,
  hasUserActivatedSpeak: false,
};

export const L_KfOnlyNotStarted = T.bind({});
L_KfOnlyNotStarted.args = {
  ...crowded,
  showMessageConsumption: false,
  hasUserActivatedSpeak: false,
};

export const M_NonFullpage = T.bind({});
M_NonFullpage.args = { ...crowded, layout: 'DEFAULT' };
