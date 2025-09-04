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
  historyWithArtifacts,
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


export const WithArtifacts = Template.bind({});
WithArtifacts.args = {
  memori,
  tenant,
  sessionID,
  history: historyWithArtifacts,
  dialogState,
  layout: 'CHAT',
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

export const WithAllMediaTypes = Template.bind({});
WithAllMediaTypes.args = {
  memori,
  tenant,
  sessionID,
  history: [
    {
      text: "Ciao! Sono qui per aiutarti. Posso gestire molti tipi di file e contenuti multimediali. Dimmi cosa ti serve!",
      timestamp: '2021-03-01T12:00:00.000Z',
    },
    {
      text: 'Perfetto! Ti mostro alcuni esempi di file che posso gestire.',
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
          mediumID: 'user-img-3',
          url: 'https://picsum.photos/400/300?random=3',
          mimeType: 'image/gif',
          title: 'Animazione.gif',
        },
        {
          mediumID: 'user-doc-1',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          mimeType: 'application/pdf',
          title: 'Specifiche tecniche.pdf',
        },
        {
          mediumID: 'user-doc-2',
          url: 'https://file-examples.com/storage/feaade38c1651bd01984236/2017/10/file-sample_150kB.doc',
          mimeType: 'application/msword',
          title: 'Documento Word.doc',
        },
        {
          mediumID: 'user-doc-3',
          url: 'https://file-examples.com/storage/feaade38c1651bd01984236/2017/10/file_example_XLS_10.xls',
          mimeType: 'application/vnd.ms-excel',
          title: 'Foglio Excel.xls',
        },
        {
          mediumID: 'user-link-1',
          url: 'https://github.com/memori-ai/memori-react',
          mimeType: 'text/html',
          title: 'Repository GitHub',
        },
        {
          mediumID: 'user-link-2',
          url: 'https://stackoverflow.com/questions/tagged/react',
          mimeType: 'text/html',
          title: 'Stack Overflow React',
        },
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
      text: 'Eccellente! Ecco la mia risposta con diversi tipi di contenuti multimediali.',
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
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
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
          url: 'https://developer.mozilla.org/en-US/docs/Web/API',
          mimeType: 'text/html',
          title: 'MDN Web Docs',
        },
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
}

function calculateScore(item) {
  // Complex scoring algorithm
  let score = 0;
  if (item.quality > 0.7) score += 0.3;
  if (item.relevance > 0.8) score += 0.4;
  if (item.freshness > 0.6) score += 0.3;
  return score;
}`,
          mimeType: 'text/javascript',
          title: 'analisi-dati.js',
        },
        {
          mediumID: 'agent-code-2',
          content: `# Analisi dei dati con Python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

def process_data(df):
    """
    Processa i dati e genera statistiche
    """
    # Pulizia dati
    df = df.dropna()
    
    # Calcolo statistiche
    stats = df.describe()
    
    # Visualizzazione
    plt.figure(figsize=(10, 6))
    df.hist(bins=20)
    plt.title('Distribuzione dei dati')
    plt.show()
    
    return stats

# Esempio di utilizzo
if __name__ == "__main__":
    data = pd.read_csv('data.csv')
    results = process_data(data)
    print(results)`,
          mimeType: 'text/x-python',
          title: 'process_data.py',
        },
        {
          mediumID: 'agent-code-3',
          content: `/* Stili CSS per il componente */
.media-widget {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.media-item {
  background: white;
  border-radius: 6px;
  overflow: hidden;
  transition: transform 0.2s ease;
}

.media-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.media-item img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.media-item-content {
  padding: 1rem;
}

.media-item-title {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}`,
          mimeType: 'text/css',
          title: 'media-widget.css',
        },
        {
          mediumID: 'agent-code-4',
          content: `# Configurazione del progetto
name = "memori-react"
version = "1.0.0"
description = "React component library for Memori AI"

[dependencies]
react = "^18.0.0"
typescript = "^4.9.0"
@memori.ai/memori-api-client = "^1.0.0"

[dev-dependencies]
@types/react = "^18.0.0"
jest = "^29.0.0"
storybook = "^6.5.0"

[scripts]
build = "tsc"
test = "jest"
storybook = "start-storybook -p 6006"
build-storybook = "build-storybook"`,
          mimeType: 'text/x-toml',
          title: 'Cargo.toml',
        },
      ],
    },
    {
      fromUser: true,
      timestamp: '2021-03-01T12:04:00.000Z',
      text: 'E anche file di configurazione e dati strutturati:\n\n<document_attachment filename="database.sql" type="text/sql">-- Schema del database\nCREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  username VARCHAR(50) UNIQUE NOT NULL,\n  email VARCHAR(100) UNIQUE NOT NULL,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\nCREATE TABLE posts (\n  id SERIAL PRIMARY KEY,\n  user_id INTEGER REFERENCES users(id),\n  title VARCHAR(200) NOT NULL,\n  content TEXT,\n  published BOOLEAN DEFAULT FALSE,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\n-- Indici per performance\nCREATE INDEX idx_posts_user_id ON posts(user_id);\nCREATE INDEX idx_posts_published ON posts(published);</document_attachment>\n\n<document_attachment filename="data.xml" type="text/xml"><?xml version="1.0" encoding="UTF-8"?>\n<root>\n  <users>\n    <user id="1">\n      <name>Mario Rossi</name>\n      <email>mario@example.com</email>\n      <role>admin</role>\n    </user>\n    <user id="2">\n      <name>Giulia Bianchi</name>\n      <email>giulia@example.com</email>\n      <role>user</role>\n    </user>\n  </users>\n  <settings>\n    <theme>dark</theme>\n    <language>it</language>\n    <notifications>true</notifications>\n  </settings>\n</root></document_attachment>',
    },
    {
      text: 'Perfetto! Come puoi vedere, posso gestire molti tipi di contenuti:\n\n• **Immagini**: JPEG, PNG, GIF\n• **Documenti**: PDF, Word, Excel\n• **Link**: Siti web con preview\n• **Video**: MP4, AVI, QuickTime\n• **Audio**: MP3, WAV\n• **Modelli 3D**: GLB, GLTF\n• **Codice**: JavaScript, Python, CSS, SQL\n• **Dati**: JSON, XML, Markdown\n\nTutti questi contenuti vengono visualizzati in modo appropriato e possono essere interagiti dall\'utente!',
      timestamp: '2021-03-01T12:05:00.000Z',
      media: [
        {
          mediumID: 'agent-final-img',
          url: 'https://picsum.photos/400/300?random=99',
          mimeType: 'image/jpeg',
          title: 'Riepilogo funzionalità',
        },
        {
          mediumID: 'agent-final-link',
          url: 'https://github.com/memori-ai/memori-react/blob/main/README.md',
          mimeType: 'text/html',
          title: 'Documentazione completa',
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