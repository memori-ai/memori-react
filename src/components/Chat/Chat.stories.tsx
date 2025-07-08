import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import {
  memori,
  tenant,
  history,
  historyWithMedia,
  historyWithAIGeneratedMessages,
  sessionID,
  dialogState as dialogStateWithHints,
  historyWithExpandable,
} from '../../mocks/data';
import I18nWrapper from '../../I18nWrapper';
import Chat, { Props } from './Chat';

import './Chat.css';

const meta: Meta = {
  title: 'Widget/Chat',
  component: Chat,
  argTypes: {},
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const dialogState = {
  ...dialogStateWithHints,
  hints: [],
};

const Template: Story<Props> = args => {
  const [userMessage, setUserMessage] = useState(args.userMessage);

  return (
    <I18nWrapper>
      <Chat
        {...args}
        userMessage={userMessage}
        onChangeUserMessage={setUserMessage}
      />
    </I18nWrapper>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  memori,
  tenant,
  sessionID,
  history,
  dialogState,
  layout: 'DEFAULT',
  simulateUserPrompt: () => {},
  sendMessage: (msg: string) => console.log(msg),
  stopListening: () => {},
  resetTranscript: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
};

export const MemoriTyping = Template.bind({});
MemoriTyping.args = {
  memori,
  tenant,
  sessionID,
  history,
  dialogState,
  layout: 'DEFAULT',
  simulateUserPrompt: () => {},
  memoriTyping: true,
  sendMessage: (msg: string) => console.log(msg),
  stopListening: () => {},
  resetTranscript: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
};

export const WithHints = Template.bind({});
WithHints.args = {
  memori,
  tenant,
  sessionID,
  history,
  dialogState: dialogStateWithHints,
  layout: 'DEFAULT',
  simulateUserPrompt: () => {},
  sendMessage: (msg: string) => console.log(msg),
  stopListening: () => {},
  resetTranscript: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
};

export const WithMedia = Template.bind({});
WithMedia.args = {
  memori,
  tenant,
  sessionID,
  history: historyWithMedia,
  dialogState,
  layout: 'DEFAULT',
  simulateUserPrompt: () => {},
  sendMessage: (msg: string) => console.log(msg),
  stopListening: () => {},
  resetTranscript: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
};

export const WithDates = Template.bind({});
WithDates.args = {
  memori,
  tenant,
  sessionID,
  history,
  dialogState,
  layout: 'DEFAULT',
  simulateUserPrompt: () => {},
  sendMessage: (msg: string) => console.log(msg),
  stopListening: () => {},
  resetTranscript: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
  showDates: true,
};

export const WithContext = Template.bind({});
WithContext.args = {
  memori,
  tenant,
  sessionID,
  history,
  dialogState,
  layout: 'DEFAULT',
  simulateUserPrompt: () => {},
  sendMessage: (msg: string) => console.log(msg),
  stopListening: () => {},
  resetTranscript: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
  showContextPerLine: true,
};

export const WithDatesAndContext = Template.bind({});
WithDatesAndContext.args = {
  memori,
  tenant,
  sessionID,
  history,
  dialogState,
  layout: 'DEFAULT',
  simulateUserPrompt: () => {},
  sendMessage: (msg: string) => console.log(msg),
  stopListening: () => {},
  resetTranscript: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
  showDates: true,
  showContextPerLine: true,
};

export const OnX3State = Template.bind({});
OnX3State.args = {
  memori,
  tenant,
  sessionID,
  history,
  dialogState: {
    ...dialogState,
    state: 'X3',
  },
  layout: 'DEFAULT',
  simulateUserPrompt: () => {},
  sendMessage: (msg: string) => console.log(msg),
  stopListening: () => {},
  resetTranscript: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
};

export const OnX2aState = Template.bind({});
OnX2aState.args = {
  memori,
  tenant,
  sessionID,
  history,
  dialogState: {
    ...dialogState,
    state: 'X2a',
  },
  layout: 'DEFAULT',
  simulateUserPrompt: () => {},
  sendMessage: (msg: string) => console.log(msg),
  stopListening: () => {},
  resetTranscript: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
};

export const AcceptsFeedback = Template.bind({});
AcceptsFeedback.args = {
  memori,
  tenant,
  sessionID,
  history,
  dialogState: {
    ...dialogState,
    acceptsFeedback: true,
  },
  layout: 'DEFAULT',
  simulateUserPrompt: () => {},
  sendMessage: (msg: string) => console.log(msg),
  stopListening: () => {},
  resetTranscript: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
};

export const WithAIGeneratedMessages = Template.bind({});
WithAIGeneratedMessages.args = {
  memori,
  tenant,
  sessionID,
  history: historyWithAIGeneratedMessages,
  dialogState,
  layout: 'DEFAULT',
  simulateUserPrompt: () => {},
  sendMessage: (msg: string) => console.log(msg),
  stopListening: () => {},
  resetTranscript: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
};

export const WithUser = Template.bind({});
WithUser.args = {
  user: { avatarURL: 'https://picsum.photos/200' },
  memori,
  tenant,
  sessionID,
  history,
  dialogState,
  layout: 'DEFAULT',
  simulateUserPrompt: () => {},
  sendMessage: (msg: string) => console.log(msg),
  stopListening: () => {},
  resetTranscript: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
};

export const WithCustomUserAvatar = Template.bind({});
WithCustomUserAvatar.args = {
  userAvatar: 'https://picsum.photos/200',
  memori,
  tenant,
  sessionID,
  history,
  dialogState,
  layout: 'DEFAULT',
  simulateUserPrompt: () => {},
  sendMessage: (msg: string) => console.log(msg),
  stopListening: () => {},
  resetTranscript: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
};

export const WithCustomUserAvatarAsElement = Template.bind({});
WithCustomUserAvatarAsElement.args = {
  userAvatar: <span>USER</span>,
  memori,
  tenant,
  sessionID,
  history,
  dialogState,
  layout: 'DEFAULT',
  simulateUserPrompt: () => {},
  sendMessage: (msg: string) => console.log(msg),
  stopListening: () => {},
  resetTranscript: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
};


export const WithExpandable = Template.bind({});
WithExpandable.args = {
  memori,
  tenant,
  sessionID,
  history: historyWithExpandable,
  dialogState,
  layout: 'DEFAULT',
  simulateUserPrompt: () => {},
  sendMessage: (msg: string) => console.log(msg),
  stopListening: () => {},
  resetTranscript: () => {},
};


export const WithLongHTMLTable = Template.bind({});
WithLongHTMLTable.args = {
  memori,
  tenant,
  sessionID,
  history,
  dialogState,
  layout: 'DEFAULT',
};

export const WithUploads = Template.bind({});
WithUploads.args = {
  memori,
  tenant,
  sessionID,
  history: [
    {
      text: "Ciao! Sono qui per aiutarti. Puoi condividere con me documenti, immagini o link che vorresti che analizzi.",
      timestamp: '2021-03-01T12:00:00.000Z',
    },
    {
      text: 'Certo! Ti invio alcune immagini e documenti.',
      fromUser: true,
      timestamp: '2021-03-01T12:01:00.000Z',
      media: [
        {
          mediumID: 'user-img-1',
          url: 'https://picsum.photos/400/300?random=1',
          mimeType: 'image/jpeg',
          title: 'Screenshot del progetto',
        },
        {
          mediumID: 'user-img-2',
          url: 'https://picsum.photos/400/300?random=2',
          mimeType: 'image/png',
          title: 'Diagramma architettura',
        },
        {
          mediumID: 'user-doc-1',
          url: 'https://example.com/document.pdf',
          mimeType: 'application/pdf',
          title: 'Specifiche tecniche.pdf',
        },
        {
          mediumID: 'user-link-1',
          url: 'https://github.com/memori-ai/memori-react',
          mimeType: 'text/html',
          title: 'Repository GitHub',
        },
      ],
    },
    {
      text: 'Perfetto! Ho analizzato i tuoi file. Ecco la mia risposta con alcuni documenti correlati.',
      timestamp: '2021-03-01T12:02:00.000Z',
      media: [
        {
          mediumID: 'agent-img-1',
          url: 'https://picsum.photos/400/300?random=10',
          mimeType: 'image/jpeg',
          title: 'Analisi comparativa',
        },
        {
          mediumID: 'agent-img-2',
          url: 'https://picsum.photos/400/300?random=11',
          mimeType: 'image/png',
          title: 'Grafico risultati',
        },
        {
          mediumID: 'agent-doc-1',
          url: 'https://example.com/analysis.pdf',
          mimeType: 'application/pdf',
          title: 'Report analisi.pdf',
        },
        {
          mediumID: 'agent-link-1',
          url: 'https://docs.memori.ai',
          mimeType: 'text/html',
          title: 'Documentazione Memori',
        },
        {
          mediumID: 'agent-link-2',
          url: 'https://stackoverflow.com/questions/tagged/memori',
          mimeType: 'text/html',
          title: 'Domande Stack Overflow',
        },
      ],
    },
    {
      text: 'Grazie! Posso inviarti anche un video tutorial.',
      fromUser: true,
      timestamp: '2021-03-01T12:03:00.000Z',
      media: [
        {
          mediumID: 'user-video-1',
          url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
          mimeType: 'video/mp4',
          title: 'Tutorial.mp4',
        },
        {
          mediumID: 'user-audio-1',
          url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
          mimeType: 'audio/wav',
          title: 'Notifica.wav',
        },
      ],
    },
    {
      text: 'Eccellente! Ecco la mia risposta con un modello 3D e alcuni snippet di codice.',
      timestamp: '2021-03-01T12:04:00.000Z',
      media: [
        {
          mediumID: 'agent-3d-1',
          url: 'https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb',
          mimeType: 'model/gltf-binary',
          title: 'Modello 3D Robot',
        },
        {
          mediumID: 'agent-code-1',
          content: `function analyzeData(data) {
  const results = data.map(item => ({
    id: item.id,
    score: calculateScore(item),
    category: classifyItem(item)
  }));
  
  return results.filter(result => result.score > 0.8);
}`,
          mimeType: 'text/javascript',
          title: 'analisi-dati.js',
          properties: {
            executable: 'true',
          },
        },
        {
          mediumID: 'agent-code-2',
          content: `# Analisi dei dati
import pandas as pd
import numpy as np

def process_data(df):
    # Pulizia dati
    df = df.dropna()
    
    # Calcolo statistiche
    stats = df.describe()
    
    return stats`,
          mimeType: 'text/x-python',
          title: 'process_data.py',
        },
      ],
    },
  ],
  dialogState,
  layout: 'DEFAULT',
  simulateUserPrompt: () => {},
  sendMessage: (msg: string) => console.log(msg),
  stopListening: () => {},
  resetTranscript: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
};