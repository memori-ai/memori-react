import React from 'react';
import { Meta, Story } from '@storybook/react';
import { memori, tenant } from '../../mocks/data';
import I18nWrapper from '../../I18nWrapper';
import ChatBubble, { Props } from './ChatBubble';

import './ChatBubble.css';

const meta: Meta = {
  title: 'Widget/Chat bubble',
  component: ChatBubble,
  argTypes: {
    fromUser: {
      control: {
        type: 'boolean',
      },
    },
    text: {
      control: {
        type: 'text',
      },
    },
    initial: {
      control: {
        type: 'boolean',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<Props> = args => (
  <I18nWrapper>
    <ChatBubble {...args} />
  </I18nWrapper>
);
// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  memori,
  tenant,
  message: {
    fromUser: false,
    text: 'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
    initial: false,
    translatedText:
      'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
  },
};

export const FromUser = Template.bind({});
FromUser.args = {
  memori,
  tenant,
  message: {
    fromUser: true,
    text: 'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
    initial: false,
    translatedText:
      'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
  },
};

export const Initial = Template.bind({});
Initial.args = {
  memori,
  tenant,
  message: {
    fromUser: false,
    text: 'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
    initial: true,
    translatedText:
      'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
  },
};

export const GeneratedByAI = Template.bind({});
GeneratedByAI.args = {
  memori,
  tenant,
  message: {
    fromUser: false,
    text: 'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
    initial: false,
    translatedText:
      'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
    generatedByAI: true,
  },
};

export const WithFeedbackButtons = Template.bind({});
WithFeedbackButtons.args = {
  memori,
  tenant,
  message: {
    fromUser: false,
    text: 'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
    initial: false,
    translatedText:
      'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
    generatedByAI: false,
  },
  showFeedback: true,
  simulateUserPrompt: () => {},
};

export const WithAllAddonsContents = Template.bind({});
WithAllAddonsContents.args = {
  memori,
  tenant,
  message: {
    fromUser: false,
    text: 'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
    initial: false,
    translatedText:
      'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
    generatedByAI: true,
  },
  showFeedback: true,
  simulateUserPrompt: () => {},
};

export const FromUserWithAvatar = Template.bind({});
FromUserWithAvatar.args = {
  memori,
  tenant,
  user: { avatarURL: 'https://picsum.photos/200' },
  message: {
    fromUser: true,
    text: 'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
    initial: false,
    translatedText:
      'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
  },
};

export const FromUserWithCustomAvatar = Template.bind({});
FromUserWithCustomAvatar.args = {
  memori,
  tenant,
  userAvatar: 'https://picsum.photos/200',
  message: {
    fromUser: true,
    text: 'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
    initial: false,
    translatedText:
      'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
  },
};

export const FromUserWithCustomAvatarElement = Template.bind({});
FromUserWithCustomAvatarElement.args = {
  memori,
  tenant,
  userAvatar: <span>USER</span>,
  message: {
    fromUser: true,
    text: 'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
    initial: false,
    translatedText:
      'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
  },
};

export const FromUserWithAvatarAndCustomAvatar = Template.bind({});
FromUserWithAvatarAndCustomAvatar.args = {
  memori,
  tenant,
  userAvatar: () => <span>USER</span>,
  user: { avatarURL: 'https://picsum.photos/200' },
  message: {
    fromUser: true,
    text: 'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
    initial: false,
    translatedText:
      'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
  },
};

export const FromExpertOfABoard = Template.bind({});
FromExpertOfABoard.args = {
  memori: {
    ...memori,
    enableBoardOfExperts: true,
  },
  apiUrl: 'https://backend.memori.ai',
  tenant,
  experts: [
    {
      expertID: '9b0a2913-d3d8-4e98-a49d-6e1c99479e1b',
      name: 'Expert name',
      description: 'Expert description',
      expertMemoriID: '9b0a2913-d3d8-4e98-a49d-6e1c99479e1b',
      expertBaseURL: 'https://engine.memori.ai',
    },
  ],
  message: {
    fromUser: false,
    text: 'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
    initial: false,
    generatedByAI: true,
    emitter: 'Expert name',
    translatedText:
      'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
  },
};

export const WithMarkdown = Template.bind({});
WithMarkdown.args = {
  memori,
  apiUrl: 'https://backend.memori.ai',
  tenant,
  message: {
    fromUser: false,
    text: '## Test\n\nEcco tutte le possibili personalizzazioni che puoi applicare:\n\n- **Colletto**:\n - Girocollo\n - Scollo a V\n\n- **Manica**:\n - Manica Lunga\n - Manica Corta\n\n- **Taglia**:\n - XS\n - S\n - M\n - L\n - XL\n - XXL\n - 3XL\n\n- **Posizione Stampa**:\n - Fronte Petto\n - Retro Schiena\n - Fronte DX\n - Fronte SX\n\n- **Generazione Immagine**:\n - Prompt generazione immagine\n\nSeleziona le personalizzazioni che desideri applicare.\n\n[Vedi altro](https://memori.ai)',
    initial: false,
    generatedByAI: true,
    translatedText:
      '## Test\n\nEcco tutte le possibili personalizzazioni che puoi applicare:\n\n- **Colletto**:\n - Girocollo\n - Scollo a V\n\n- **Manica**:\n - Manica Lunga\n - Manica Corta\n\n- **Taglia**:\n - XS\n - S\n - M\n - L\n - XL\n - XXL\n - 3XL\n\n- **Posizione Stampa**:\n - Fronte Petto\n - Retro Schiena\n - Fronte DX\n - Fronte SX\n\n- **Generazione Immagine**:\n - Prompt generazione immagine\n\nSeleziona le personalizzazioni che desideri applicare.\n\n[Vedi altro](https://memori.ai)',
  },
};

export const WithMarkdownAndBreakLine = Template.bind({});
WithMarkdownAndBreakLine.args = {
  memori,
  apiUrl: 'https://backend.memori.ai',
  tenant,
  message: {
    fromUser: false,
    text: "Per l'avvio di una progettualità è necessario fornire le seguenti informazioni:\n- Natura dell'esigenza progettuale e obiettivi\n- Descrizione del progetto\n- Prima identificazione delle risorse necessarie\n- Costi stimati\n- Benefici attesi\n- Rischi identificati.",
    initial: false,
    generatedByAI: true,
    translatedText:
      "Per l'avvio di una progettualità è necessario fornire le seguenti informazioni:\n- Natura dell'esigenza progettuale e obiettivi\n- Descrizione del progetto\n- Prima identificazione delle risorse necessarie\n- Costi stimati\n- Benefici attesi\n- Rischi identificati.",
  },
};

export const ComplexMarkdownMath1 = Template.bind({});
ComplexMarkdownMath1.args = {
  memori,
  apiUrl: 'https://backend.memori.ai',
  tenant,
  message: {
    fromUser: false,
    initial: false,
    generatedByAI: true,
    text: `Per calcolare l'ipotenusa di un triangolo rettangolo, puoi usare il Teorema di Pitagora. Il teorema afferma che in un triangolo rettangolo, il quadrato dell'ipotenusa (la lato opposto all'angolo retto) è uguale alla somma dei quadrati degli altri due lati.\n\nLa formula è:\n\n\\[ c = \\sqrt{a^2 + b^2} \\]\n\nDove:\n- \\( c \\) è l'ipotenusa.\n- \\( a \\) e \\( b \\) sono i due cateti del triangolo.\n\n### Passaggi per il Calcolo\n\n1. **Misura o identifica i cateti \\( a \\) e \\( b \\)**:\n   I cateti sono i due lati che formano l'angolo retto.\n\n2. **Calcola i quadrati dei cateti**:\n   Eleva al quadrato entrambe le misure dei cateti: \\( a^2 \\) e \\( b^2 \\).\n\n3. **Somma i quadrati dei cateti**:\n   Somma i risultati ottenuti: \\( a^2 + b^2 \\).\n\n4. **Calcola la radice quadrata della somma**:\n   Prendi la radice quadrata della somma per trovare l'ipotenusa: \\( c = \\sqrt{a^2 + b^2} \\).\n\n### Esempio di Calcolo\n\nSupponiamo di avere un triangolo rettangolo con i cateti di lunghezza 3 cm e 4 cm.\n\n1. **Cateto \\( a \\)**: 3 cm\n2. **Cateto \\( b \\)**: 4 cm\n\nUsiamo la formula:\n\n\\[ c = \\sqrt{a^2 + b^2} \\]\n\n\\[ c = \\sqrt{(3 \\, \\text{cm})^2 + (4 \\, \\text{cm})^2} \\]\n\n\\[ c = \\sqrt{9 \\, \\text{cm}^2 + 16 \\, \\text{cm}^2} \\]\n\n\\[ c = \\sqrt{25 \\, \\text{cm}^2} \\]\n\n\\[ c = 5 \\, \\text{cm} \\]\n\nQuindi, l'ipotenusa del triangolo è di 5 cm.`,
  },
};

export const ComplexMarkdownMath2 = Template.bind({});
ComplexMarkdownMath2.args = {
  memori,
  apiUrl: 'https://backend.memori.ai',
  tenant,
  message: {
    fromUser: false,
    initial: false,
    generatedByAI: true,
    text: "Per calcolare le resistenze dei materiali per le verifiche rispetto ad azioni antropiche e ambientali secondo la Specifica Tecnica ST-VAL4, si procede in questo modo:\n\n1. **Determinazione della resistenza dei materiali:**\n   La resistenza dei materiali da utilizzare nelle verifiche accurate si determina a partire dalle indagini sull’opera. La caratterizzazione deve essere distinta per tutti i materiali presenti nell'opera, in accordo con la ST-PI. Le resistenze per verifiche rispetto ad azioni antropiche come i carichi da traffico e le azioni ambientali sono definite dalle LG20. Questo include la distinzione rispetto a quelle utilizzate per le azioni sismiche, come dettagliato dalle NTC18 e CIR19  .\n\n2. **Calcolo della resistenza:**\n   Il valore della resistenza dei materiali \\( f_d \\) da utilizzare nelle verifiche per carichi gravitazionali si ottiene mediante la seguente espressione:\n\n   \\[\n   f_d = \\min \\left( \\frac{f_m}{FC \\cdot \\gamma_M}, \\frac{f_k}{FC} \\right)\n   \\]\n\n   Dove:\n   - \\( f_m \\) è il valor medio della resistenza valutato dai risultati delle prove effettuate sui campioni prelevati in situ;\n   - \\( f_k \\) è la resistenza caratteristica calcolata sulla base dei risultati delle prove sui campioni prelevati in situ;\n   - \\( FC \\) è il Fattore di Confidenza associato al Livello di Conoscenza raggiunto;\n   - \\( \\gamma_M \\) è il fattore parziale di sicurezza del materiale   .\n\n3. **Caratterizzazione dei materiali:**\n   I valori medi, caratteristici e di progetto delle resistenze a compressione e trazione per il calcestruzzo, e delle resistenze a snervamento per l’acciaio ordinario sono determinati a partire dai risultati delle prove. Specifiche espressioni e metodi sono forniti per diversi materiali nell'Appendice 13 della ST-VAL4  .\n\n4. **Stima della resistenza da prove non distruttive:**\n   Per valutare le resistenze dei materiali, si possono anche utilizzare prove non distruttive come le prove SonReb per il calcestruzzo e le prove di durezza per l'acciaio ordinario e armonico. Formulazioni specifiche per queste prove si trovano in Appendice al §13.1 della ST-VAL4 .\n\n5. **Analisi dei risultati delle indagini:**\n   Gli esiti delle prove devono essere attentamente analizzati per confermare le caratteristiche originarie o rilevare eventuali decadimenti del materiale. Questo processo include anche l'identificazione delle cause di dispersione significative nei risultati delle prove  .\n\nSeguendo questi passaggi, si ottiene una stima accurata delle resistenze dei materiali che possono essere utilizzate per le verifiche di sicurezza rispetto ad azioni antropiche e ambientali.",
  },
};
