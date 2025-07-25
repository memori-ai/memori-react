import React, { useEffect } from 'react';
import { Meta, Story } from '@storybook/react';
import { memori, tenant } from '../../mocks/data';
import I18nWrapper from '../../I18nWrapper';
import ChatBubble, { Props } from './ChatBubble';
import { installMathJax } from '../../helpers/utils';

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
    useMathFormatting: {
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

const Template: Story<Props> = args => {
  useEffect(() => {
    // @ts-ignore
    if (args.useMathFormatting && !window.MathJax) installMathJax();
  }, [args.useMathFormatting]);

  return (
    <I18nWrapper>
      <ChatBubble {...args} />
    </I18nWrapper>
  );
};

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

export const FromUserWithLink = Template.bind({});
FromUserWithLink.args = {
  memori,
  tenant,
  message: {
    fromUser: true,
    text: 'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor. [Vedi altro](https://memori.ai)',
    initial: false,
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

export const CopyDisabled = Template.bind({});
CopyDisabled.args = {
  memori,
  tenant,
  message: {
    fromUser: false,
    text: 'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
  },
  showCopyButton: false,
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

export const WithTranslationAndOriginal = Template.bind({});
WithTranslationAndOriginal.args = {
  memori,
  tenant,
  message: {
    fromUser: false,
    text: 'Hello, this is a translated text so you can talk to me in different languages',
    initial: false,
    translatedText:
      'Ciao, questo è un testo tradotto in modo che tu possa parlarmi in diverse lingue',
  },
  showTranslationOriginal: true,
};

export const WithLongLink = Template.bind({});
WithLongLink.args = {
  memori,
  tenant,
  message: {
    fromUser: false,
    initial: false,
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor. Vedi altro su: https://aisuru.aclambda.online/it/memoridev/MANUALE%20DI%20RICHIEDENTE%20CENTRO%20DI%20COSTOAWANAGANAQUESTOLINKNONESISTEMADIVENTAMOLTOLUNGOESENZASPAZI',
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

export const WithDebugButton = Template.bind({});
WithDebugButton.args = {
  memori,
  tenant,
  message: {
    fromUser: false,
    text: 'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
    initial: false,
    generatedByAI: true,
    media: [
      {
        mediumID: 'c6851968-5d4d-409a-ae75-f22ec077efcd',
        mimeType: 'text/plain',
        content: 'Lorem ipsum dolor sit amet',
        title: 'Function Cache Lorem ispum',
        properties: {
          functionCache: 'true',
        },
      },
    ],
  },
  showFeedback: true,
  showFunctionCache: true,
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
    text: `## Test

Ecco tutte le possibili personalizzazioni che puoi applicare:

- **Colletto**:
  - Girocollo
  - Scollo a V
- **Manica**:
  - Manica Lunga
  - Manica Corta
- **Taglia**:
  - XS
  - S\
  - M
  - L
  - XL
  - XXL
  - 3XL
- **Posizione Stampa**:
  - Fronte Petto
  - Retro Schiena
  - Fronte DX
  - Fronte SX
- **Generazione Immagine**:
  - Prompt generazione immagine

Seleziona le personalizzazioni che desideri applicare.

[Vedi altro](https://memori.ai)`,
    initial: false,
    generatedByAI: true,
  },
};

export const WithMarkdownAndBreakLine = Template.bind({});
WithMarkdownAndBreakLine.args = {
  memori,
  apiUrl: 'https://backend.memori.ai',
  tenant,
  message: {
    fromUser: false,
    text: "Per l'avvio di una progettualità è necessario fornire le seguenti informazioni:\n- Natura dell'esigenza progettuale e obiettivi\n- Descrizione del progetto\n- Prima identificazione delle risorse necessarie\n- Costi stimati\n- Benefici attesi\n- Rischi identificati.\n\n\n",
    initial: false,
    generatedByAI: true,
  },
};

export const WithMarkdownAndMultipleBreakLine = Template.bind({});
WithMarkdownAndMultipleBreakLine.args = {
  memori,
  apiUrl: 'https://backend.memori.ai',
  tenant,
  message: {
    fromUser: false,
    initial: false,
    generatedByAI: true,
    text: `Ah, ottima domanda! Stavo giusto riflettendo su come spiegare al meglio le funzionalità di questo sistema. \n\nDa qui puoi fare diverse cose interessanti:\n\n1. Puoi conversare con me, Nunzio Fiore, e io risponderò basandomi sulle mie conoscenze ed esperienze.\n\n2. Puoi aggiungere nuove "memorie" o informazioni al mio database. Questo significa che puoi insegnarmi cose nuove o aggiornare le mie conoscenze esistenti.\n\n3. Puoi creare, modificare o eliminare "ricevitori". Questi sono come utenti specifici che possono interagire con me in modo personalizzato.\n\n4. Puoi associare determinate memorie a ricevitori specifici, creando così contenuti personalizzati per diverse persone.\n\n5. Puoi cercare tra le memorie esistenti, visualizzare le ultime aggiunte, o modificare quelle già presenti.\n\nIn pratica, stai interagendo con un sistema che permette di creare e gestire un "gemello digitale" - in questo caso, me stesso. È un po' come scrivere un libro interattivo sulla mia vita e le mie conoscenze.\n\nC'è qualcosa in particolare che ti interessa esplorare o su cui vorresti saperne di più?`,
  },
};

export const WithMarkdownCode = Template.bind({});
WithMarkdownCode.args = {
  memori,
  apiUrl: 'https://backend.memori.ai',
  tenant,
  message: {
    fromUser: false,
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n\n```markdown\n# titolo\n```\n\nSed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    initial: false,
    generatedByAI: true,
  },
};

export const WithOutputCode = Template.bind({});
WithOutputCode.args = {
  memori,
  apiUrl: 'https://backend.memori.ai',
  tenant,
  message: {
    fromUser: false,
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n\n```markdown\n# titolo\n```\n\nSed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\n<output class="memori-output">{ "data": [ 0, 1, 2 ] }</output>',
    initial: false,
    generatedByAI: true,
  },
};

export const WithReasoning = Template.bind({});
WithReasoning.args = {
  memori,
  apiUrl: 'https://backend.memori.ai',
  tenant,
  message: {
    fromUser: false,
    text: `<think>
Okay, the user is asking for a couple of relevant links to help them show the product to the girl. Let me think about what they need.

First, they want to present the Lenovo tablet and accessories. The user mentioned using visual materials, so links to product pages or guides would be useful. They might need official Lenovo sources for accuracy.

I should check if there are official Lenovo pages for the Yoga Tab 10 Pro and ThinkPad X1 Tablet. Those would be the main products. Also, maybe a guide on how to use the tablet for video calls, especially for elderly users.

Wait, the user is a girl who wants to give a gift to her grandmother. The links should be trustworthy and in Italian. Let me make sure the links are in Italian and from Lenovo's official site.

I remember that Lenovo has a website with product details. The Yoga Tab 10 Pro and ThinkPad X1 Tablet are both available there. Also, there might be a guide or FAQ section on their site that explains how to use the tablet for video calls, which would be helpful for the grandmother.

I should also consider if there are any official guides or videos from Lenovo that demonstrate the tablet's features, especially for elderly users. Maybe a video tutorial on setting up the tablet for video calls.

Wait, the user might need links that are in Italian. So I should check if Lenovo's Italian site has these resources. If not, maybe a general guide in Italian from a reliable source. But the user wants to use Lenovo's official materials, so sticking to their site is better.

Also, the user might need links to the product pages, the accessories, and a guide on using the tablet for video calls. Let me verify the URLs for the Yoga Tab 10 Pro and ThinkPad X1 Tablet on Lenovo's Italian site.

Once I have those, I can provide them as the main links. Then, a guide or FAQ that explains how to use the tablet for video calls, especially for elderly users.

I should make sure the links are up-to-date and correct. If there's a specific page on Lenovo's site that's relevant, that's the best. If not, maybe a general guide from a trusted source, but the user prefers Lenovo's official resources.

So, the two main links would be the product pages for the Yoga Tab 10 Pro and ThinkPad X1 Tablet. Then, a guide or video on using the tablet for video calls.

Wait, the user asked for a couple of links. Maybe two main ones: the product pages and a guide. That should cover the essentials.

I need to present these links in a clear way, making sure they are from Lenovo's official site and in Italian. Also, mention that they can use these to show the product and its features to the girl.

Double-check the URLs to ensure they are correct. If there's a specific page for the accessories, that could be another link, but the user might need the main product pages first.

Alright, I think that's it. Provide the product pages and a guide on using the tablet for video calls, both from Lenovo's official site in Italian.
</think>

Ecco due link rilevanti che puoi utilizzare per aiutare la ragazza a mostrare il prodotto e i suoi accessori. Questi link puntano a risorse ufficiali Lenovo in italiano, che forniscono informazioni dettagliate e accurate su i prodotti e le loro funzionalità:

---

### **1. Pagina ufficiale del Lenovo Yoga Tab 10 Pro (10.1" - 2024)**
**Link**: [https://www.lenovo.com/it/it/products/tablets/yoga-tab-10-pro/](https://www.lenovo.com/it/it/products/tablets/yoga-tab-10-pro/)
**Descrizione**:
- Informazioni complete sul tablet, inclusi i dettagli tecnici (display, batteria, sistema operativo), le caratteristiche principali e le opzioni di personalizzazione.
- Include una sezione dedicata alle videochiamate, con spiegazioni su come utilizzare il tablet per chiamate in alta definizione.
- Ideale per mostrare la compatibilità con app di videochiamate come Zoom, Skype e FaceTime.

**Utilizzo consigliato**:
- Mostra la pagina per spiegare le caratteristiche tecniche del tablet.
- Fornisci un'immagine del tablet con il filtro di privacy attivo per illustrare la protezione della privacy.

---

### **2. Guida ufficiale per l'uso del tablet per videochiamate (in italiano)**
**Link**: [https://www.lenovo.com/it/it/support/faq/](https://www.lenovo.com/it/it/support/faq/)
**Descrizione**:
- Una sezione FAQ (Frequently Asked Questions) che risponde a domande comuni su come utilizzare il tablet per videochiamate, inclusi:
 - Come iniziare una chiamata.
 - Come utilizzare il filtro di privacy.
 - Come gestire la batteria e le connessioni.
- Include video tutorial e immagini per spiegare passaggi semplici.
- Adatto per un pubblico non esperto, come la nonna.

**Utilizzo consigliato**:
- Mostra la guida per spiegare come usare il tablet in modo semplice.
- Usa i video tutorial per dimostrare l'esperienza di videochiamate.

---

### **Altri consigli per il materiale visivo**
Se vuoi aggiungere ulteriori risorse, puoi consultare:
- **Pagina ufficiale degli accessori Lenovo**: [https://www.lenovo.com/it/it/products/accessories/](https://www.lenovo.com/it/it/products/accessories/)
- **Video tutorial ufficiali su YouTube**: Cerca "Lenovo Yoga Tab 10 Pro videochiamate" o "Lenovo ThinkPad X1 Tablet uso per videochiamate".

Questi link ti permettono di creare un materiale visivo coerente e basato su informazioni verificate, che aiuterà la ragazza a spiegare il prodotto e gli accessori in modo chiaro e professionale. Se hai bisogno di aiuto per personalizzare ulteriormente il materiale, posso aiutarti! 😊`,
    initial: false,
    generatedByAI: true,
  },
};

export const WithReasoningShown = Template.bind({});
WithReasoningShown.args = {
  memori,
  apiUrl: 'https://backend.memori.ai',
  tenant,
  showReasoning: true,
  message: {
    fromUser: false,
    text: `<think>
Okay, the user is asking for a couple of relevant links to help them show the product to the girl. Let me think about what they need.

First, they want to present the Lenovo tablet and accessories. The user mentioned using visual materials, so links to product pages or guides would be useful. They might need official Lenovo sources for accuracy.

I should check if there are official Lenovo pages for the Yoga Tab 10 Pro and ThinkPad X1 Tablet. Those would be the main products. Also, maybe a guide on how to use the tablet for video calls, especially for elderly users.

Wait, the user is a girl who wants to give a gift to her grandmother. The links should be trustworthy and in Italian. Let me make sure the links are in Italian and from Lenovo's official site.

I remember that Lenovo has a website with product details. The Yoga Tab 10 Pro and ThinkPad X1 Tablet are both available there. Also, there might be a guide or FAQ section on their site that explains how to use the tablet for video calls, which would be helpful for the grandmother.

I should also consider if there are any official guides or videos from Lenovo that demonstrate the tablet's features, especially for elderly users. Maybe a video tutorial on setting up the tablet for video calls.

Wait, the user might need links that are in Italian. So I should check if Lenovo's Italian site has these resources. If not, maybe a general guide in Italian from a reliable source. But the user wants to use Lenovo's official materials, so sticking to their site is better.

Also, the user might need links to the product pages, the accessories, and a guide on using the tablet for video calls. Let me verify the URLs for the Yoga Tab 10 Pro and ThinkPad X1 Tablet on Lenovo's Italian site.

Once I have those, I can provide them as the main links. Then, a guide or FAQ that explains how to use the tablet for video calls, especially for elderly users.

I should make sure the links are up-to-date and correct. If there's a specific page on Lenovo's site that's relevant, that's the best. If not, maybe a general guide from a trusted source, but the user prefers Lenovo's official resources.

So, the two main links would be the product pages for the Yoga Tab 10 Pro and ThinkPad X1 Tablet. Then, a guide or video on using the tablet for video calls.

Wait, the user asked for a couple of links. Maybe two main ones: the product pages and a guide. That should cover the essentials.

I need to present these links in a clear way, making sure they are from Lenovo's official site and in Italian. Also, mention that they can use these to show the product and its features to the girl.

Double-check the URLs to ensure they are correct. If there's a specific page for the accessories, that could be another link, but the user might need the main product pages first.

Alright, I think that's it. Provide the product pages and a guide on using the tablet for video calls, both from Lenovo's official site in Italian.
</think>

Ecco due link rilevanti che puoi utilizzare per aiutare la ragazza a mostrare il prodotto e i suoi accessori. Questi link puntano a risorse ufficiali Lenovo in italiano, che forniscono informazioni dettagliate e accurate su i prodotti e le loro funzionalità:

---

### **1. Pagina ufficiale del Lenovo Yoga Tab 10 Pro (10.1" - 2024)**
**Link**: [https://www.lenovo.com/it/it/products/tablets/yoga-tab-10-pro/](https://www.lenovo.com/it/it/products/tablets/yoga-tab-10-pro/)
**Descrizione**:
- Informazioni complete sul tablet, inclusi i dettagli tecnici (display, batteria, sistema operativo), le caratteristiche principali e le opzioni di personalizzazione.
- Include una sezione dedicata alle videochiamate, con spiegazioni su come utilizzare il tablet per chiamate in alta definizione.
- Ideale per mostrare la compatibilità con app di videochiamate come Zoom, Skype e FaceTime.

**Utilizzo consigliato**:
- Mostra la pagina per spiegare le caratteristiche tecniche del tablet.
- Fornisci un'immagine del tablet con il filtro di privacy attivo per illustrare la protezione della privacy.

---

### **2. Guida ufficiale per l'uso del tablet per videochiamate (in italiano)**
**Link**: [https://www.lenovo.com/it/it/support/faq/](https://www.lenovo.com/it/it/support/faq/)
**Descrizione**:
- Una sezione FAQ (Frequently Asked Questions) che risponde a domande comuni su come utilizzare il tablet per videochiamate, inclusi:
 - Come iniziare una chiamata.
 - Come utilizzare il filtro di privacy.
 - Come gestire la batteria e le connessioni.
- Include video tutorial e immagini per spiegare passaggi semplici.
- Adatto per un pubblico non esperto, come la nonna.

**Utilizzo consigliato**:
- Mostra la guida per spiegare come usare il tablet in modo semplice.
- Usa i video tutorial per dimostrare l'esperienza di videochiamate.

---

### **Altri consigli per il materiale visivo**
Se vuoi aggiungere ulteriori risorse, puoi consultare:
- **Pagina ufficiale degli accessori Lenovo**: [https://www.lenovo.com/it/it/products/accessories/](https://www.lenovo.com/it/it/products/accessories/)
- **Video tutorial ufficiali su YouTube**: Cerca "Lenovo Yoga Tab 10 Pro videochiamate" o "Lenovo ThinkPad X1 Tablet uso per videochiamate".

Questi link ti permettono di creare un materiale visivo coerente e basato su informazioni verificate, che aiuterà la ragazza a spiegare il prodotto e gli accessori in modo chiaro e professionale. Se hai bisogno di aiuto per personalizzare ulteriormente il materiale, posso aiutarti! 😊`,
    initial: false,
    generatedByAI: true,
  },
};

export const WithMarkdownTable = Template.bind({});
WithMarkdownTable.args = {
  memori,
  apiUrl: 'https://backend.memori.ai',
  tenant,
  message: {
    fromUser: false,
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n\n| Header 1 | Header 2 | Header 3 |\n| -------- | -------- | -------- |\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |\n\nSed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    initial: false,
    generatedByAI: true,
  },
};

export const MarkdownWithSquareBrackets = Template.bind({});
MarkdownWithSquareBrackets.args = {
  memori,
  apiUrl: 'https://backend.memori.ai',
  tenant,
  message: {
    fromUser: false,
    text: `B. Funzione per lo stock:
  - Nome: "check_stock"
  - Descrizione: "Usa questa funzione per verificare la disponibilità di un prodotto nel magazzino"
  - Webhook: [URL del tuo gestionale]
  - Parametro: "product_id" (string)`,
    initial: false,
    generatedByAI: true,
  },
};

export const MarkdownWithSquareBracketsAndTable = Template.bind({});
MarkdownWithSquareBracketsAndTable.args = {
  memori,
  apiUrl: 'https://backend.memori.ai',
  tenant,
  message: {
    fromUser: false,
    initial: false,
    generatedByAI: true,
    text: `<table border="1" style="border-collapse: collapse; width: 100%; table-layout: fixed; font-family: Arial, sans-serif;">
<tr style="background-color: #f0f0f0;">
 <th style="text-align: left; padding: 8px; width: 200px;">Attività</th>
 <th colspan="4" style="text-align: center; padding: 8px;">Dic 2024</th>
 <th colspan="4" style="text-align: center; padding: 8px;">Gen 2025</th>
 <th colspan="4" style="text-align: center; padding: 8px;">Feb 2025</th>
 <th colspan="4" style="text-align: center; padding: 8px;">Mar 2025</th>
 <th colspan="4" style="text-align: center; padding: 8px;">Apr 2025</th>
 <th colspan="4" style="text-align: center; padding: 8px;">Mag 2025</th>
 <th colspan="4" style="text-align: center; padding: 8px;">Giu 2025</th>
</tr>
</table>

[Vuoi che continui con l'intera tabella mantenendo lo stesso formato della precedente ma con table-layout: fixed per garantire celle di uguale dimensione?]`,
  },
};

export const MarkdownWithLists = Template.bind({});
MarkdownWithLists.args = {
  memori,
  apiUrl: 'https://backend.memori.ai',
  tenant,
  message: {
    fromUser: false,
    initial: false,
    generatedByAI: true,
    text: `I buoni spesa sono acquistabili con il credito Fringe Benefit (pari a 1.000 € per l'anno 2024) e si distinguono in 3 tipologie:

1. **Buoni Elettronici**:
- Emessi digitalmente
- Scaricabili/stampabili dalla piattaforma
- Consegna in 3-4 giorni lavorativi

2. **Buoni Fisici**:
- Tessere fisiche inviate direttamente
- Tempi di consegna più lunghi

3. **Buoni Elettronici Locali**:
- Emessi da fornitori della zona
- Inviati in formato PDF

**NOTA IMPORTANTE**: Non è possibile acquistare buoni Amazon sulla piattaforma TreCuori.

Se hai bisogno di vedere quali buoni sono disponibili e dove spenderli, fammi sapere!`,
  },
};

export const ComplexMarkdownMath1 = Template.bind({});
ComplexMarkdownMath1.args = {
  memori,
  apiUrl: 'https://backend.memori.ai',
  tenant,
  useMathFormatting: true,
  message: {
    fromUser: false,
    initial: false,
    generatedByAI: true,
    text: `Per calcolare l'ipotenusa di un triangolo rettangolo, puoi usare il Teorema di Pitagora. Il teorema afferma che in un triangolo rettangolo, il quadrato dell'ipotenusa (la lato opposto all'angolo retto) è uguale alla somma dei quadrati degli altri due lati.\n\nLa formula è:\n\n\\[ c = \\sqrt{a^2 + b^2} \\]\n\nDove:\n- $c$ è l'ipotenusa.\n- $a$ e $ b $ sono i due cateti del triangolo.\n\n### Passaggi per il Calcolo\n\n1. **Misura o identifica i cateti $ a $ e $ b $**:\n   I cateti sono i due lati che formano l'angolo retto.\n\n2. **Calcola i quadrati dei cateti**:\n   Eleva al quadrato entrambe le misure dei cateti: $ a^2 $ e $ b^2 $.\n\n3. **Somma i quadrati dei cateti**:\n   Somma i risultati ottenuti: $ a^2 + b^2 $.\n\n4. **Calcola la radice quadrata della somma**:\n   Prendi la radice quadrata della somma per trovare l'ipotenusa: [ c = \\sqrt{a^2 + b^2} ].\n\n### Esempio di Calcolo\n\nSupponiamo di avere un triangolo rettangolo con i cateti di lunghezza 3 cm e 4 cm.\n\n1. **Cateto $ a $**: 3 cm\n2. **Cateto $ b $**: 4 cm\n\nUsiamo la formula:\n\n\\[ c = \\sqrt{a^2 + b^2} \\]\n\n\\[ c = \\sqrt{(3 \\, \\text{cm})^2 + (4 \\, \\text{cm})^2} \\]\n\n\\[ c = \\sqrt{9 \\, \\text{cm}^2 + 16 \\, \\text{cm}^2} \\]\n\n\\[ c = \\sqrt{25 \\, \\text{cm}^2} \\]\n\n\\[ c = 5 \\, \\text{cm} \\]\n\nQuindi, l'ipotenusa del triangolo è di 5 cm.`,
  },
};

export const ComplexMarkdownMath2 = Template.bind({});
ComplexMarkdownMath2.args = {
  memori,
  apiUrl: 'https://backend.memori.ai',
  tenant,
  useMathFormatting: true,
  message: {
    fromUser: false,
    initial: false,
    generatedByAI: true,
    text: "Per calcolare le resistenze dei materiali per le verifiche rispetto ad azioni antropiche e ambientali secondo la Specifica Tecnica ST-VAL4, si procede in questo modo:\n\n1. **Determinazione della resistenza dei materiali:**\n   La resistenza dei materiali da utilizzare nelle verifiche accurate si determina a partire dalle indagini sull’opera. La caratterizzazione deve essere distinta per tutti i materiali presenti nell'opera, in accordo con la ST-PI. Le resistenze per verifiche rispetto ad azioni antropiche come i carichi da traffico e le azioni ambientali sono definite dalle LG20. Questo include la distinzione rispetto a quelle utilizzate per le azioni sismiche, come dettagliato dalle NTC18 e CIR19  .\n\n2. **Calcolo della resistenza:**\n   Il valore della resistenza dei materiali $ f_d $ da utilizzare nelle verifiche per carichi gravitazionali si ottiene mediante la seguente espressione:\n\n   \\[\n   f_d = \\min \\left( \\frac{f_m}{FC \\cdot \\gamma_M}, \\frac{f_k}{FC} \\right)\n   \\]\n\n   Dove:\n   - $ f_m $ è il valor medio della resistenza valutato dai risultati delle prove effettuate sui campioni prelevati in situ;\n   - $ f_k $ è la resistenza caratteristica calcolata sulla base dei risultati delle prove sui campioni prelevati in situ;\n   - $ FC $ è il Fattore di Confidenza associato al Livello di Conoscenza raggiunto;\n   - $ \\gamma_M $ è il fattore parziale di sicurezza del materiale   .\n\n3. **Caratterizzazione dei materiali:**\n   I valori medi, caratteristici e di progetto delle resistenze a compressione e trazione per il calcestruzzo, e delle resistenze a snervamento per l’acciaio ordinario sono determinati a partire dai risultati delle prove. Specifiche espressioni e metodi sono forniti per diversi materiali nell'Appendice 13 della ST-VAL4  .\n\n4. **Stima della resistenza da prove non distruttive:**\n   Per valutare le resistenze dei materiali, si possono anche utilizzare prove non distruttive come le prove SonReb per il calcestruzzo e le prove di durezza per l'acciaio ordinario e armonico. Formulazioni specifiche per queste prove si trovano in Appendice al §13.1 della ST-VAL4 .\n\n5. **Analisi dei risultati delle indagini:**\n   Gli esiti delle prove devono essere attentamente analizzati per confermare le caratteristiche originarie o rilevare eventuali decadimenti del materiale. Questo processo include anche l'identificazione delle cause di dispersione significative nei risultati delle prove  .\n\nSeguendo questi passaggi, si ottiene una stima accurata delle resistenze dei materiali che possono essere utilizzate per le verifiche di sicurezza rispetto ad azioni antropiche e ambientali.",
  },
};

export const ComplexMarkdownMath3 = Template.bind({});
ComplexMarkdownMath3.args = {
  memori,
  apiUrl: 'https://backend.memori.ai',
  tenant,
  useMathFormatting: true,
  message: {
    fromUser: false,
    initial: false,
    generatedByAI: true,
    text: "Ok. \n\nPer calcolare l'urto su barriere metalliche, il documento *\"Ponti, viadotti e cavalcavia - Specifica Tecnica per la redazione delle Verifiche Accurate di sicurezza di Livello 4 (ST-VAL4)\"* fornisce un metodo specifico. Ecco l'iter riassunto:\n\n1. **Determinazione del sistema di forze orizzontali:** Partendo dal momento di plasticizzazione del montante (§5.1.3.10 delle NTC18). La forza orizzontale che plasticizza il montante può essere determinata con riferimento alla resistenza caratteristica degli elementi strutturali principali della barriera.\n\n2. **Quota di applicazione della forza:** La forza orizzontale deve essere applicata ad una quota h, che è il minimo tra (altezza della barriera - 0,10 m) e 1,00 m.\n\n3. **Amplificazione delle forze orizzontali:** Per il dimensionamento dell'impalcato, le forze orizzontali sono amplificate di un fattore di 1,50, e il coefficiente parziale di sicurezza per la combinazione di carico agli SLU per l’urto di veicolo in svio è assunto unitario.\n\n4. **Calcolo della massima azione tagliante:** Alla base del montante (estradosso cordolo):\n\n    \\[\n    F_{\\text{urto}} = \\frac{M_{\\text{pl}}}{h^*}\n    \\]\n\n    Dove:\n    - $M_{\\text{pl}}$ è il momento plastico calcolato con la resistenza caratteristica.\n    - $h^* = h - h_R - h_C$\n    - $h$ è pari all’altezza della forza di urto sulla superficie di rotolamento (1.00 m), $h_B$ è l’altezza della forza rispetto all’estradosso del cordolo, $h_C$ è l’altezza del cordolo, e $h_R$ è l’altezza dell’irrigidimento del nodo e della piastra di base.\n\n5. **Determinazione del momento trasferito all’estradosso del cordolo:**\n\n    \\[\n    M_{\\text{urto}} = F_{\\text{urto}} \\cdot h_B = M_{\\text{pl}} \\cdot \\left(1 + \\frac{h_R}{h^*}\\right)\n    \\]\n\n6. **Amplificazione per le incertezze:** Il valore caratteristico è amplificato di un fattore parziale pari a 1,50 per tenere conto delle incertezze e possibili deformabilità della lamiera irrigidita.\n\n7. **Considerazione della plasticizzazione:** Nel caso di barriere ordinarie, si considera la piena plasticizzazione di tre montanti consecutivi a seguito dell’urto, salvo diversa valutazione motivata.\n\n8. **Normative alternative:** In assenza di informazioni, si può fare riferimento al valore normativo della forza d’urto di 100 kN (NTC18) da collocarsi a 100 mm sotto la sommità dell’elemento o 1,0 m sopra il livello del piano di marcia【4:0†source】【4:1†source】【4:4†source】【4:9†source】【4:5†source】. \n\nPer ulteriori dettagli o chiarimenti, puoi consultare la sezione del documento ST-VAL4 o scrivere a anna.sganzerla@tecneautostrade.it.",
  },
};

export const ComplexMarkdownMath4 = Template.bind({});
ComplexMarkdownMath4.args = {
  memori,
  apiUrl: 'https://backend.memori.ai',
  tenant,
  useMathFormatting: true,
  message: {
    fromUser: false,
    initial: false,
    generatedByAI: true,
    text: "Per calcolare l'urto su barriere metalliche, è necessario considerare diversi fattori come la massa del veicolo, la velocità dell'impatto, l'angolo di impatto e le caratteristiche della barriera stessa. Di seguito è riportata una descrizione generale del processo di calcolo:\n\n1. **Determinazione dei parametri dell'urto:**\n - **Massa del veicolo (m):** La massa del veicolo che colpisce la barriera.\n - **Velocità dell'impatto (v):** La velocità del veicolo al momento dell'impatto.\n - **Angolo di impatto (θ):** L'angolo con cui il veicolo colpisce la barriera.\n\n2. **Calcolo dell'energia cinetica:**\n L'energia cinetica del veicolo al momento dell'impatto è data dalla formula:\n \\[\n E_k = \\frac{1}{2} m v^2\n \\]\n dove $E_k$ è l'energia cinetica, $m$ è la massa del veicolo e $v$ è la velocità del veicolo.\n\n3. **Calcolo della forza d'impatto:**\n La forza d'impatto può essere calcolata considerando la decelerazione del veicolo e il tempo di contatto con la barriera. Una formula semplificata per la forza d'impatto $F$ è:\n \\[\n F = \\frac{m \\Delta v}{\\Delta t}\n \\]\n dove $ \\Delta v $ è la variazione di velocità (che può essere considerata uguale alla velocità iniziale \\(v\\) se il veicolo si ferma completamente), e $ \\Delta t $ è il tempo di contatto.\n\n4. **Considerazioni sulla barriera:**\n Le barriere metalliche sono progettate per assorbire energia e ridurre la forza trasmessa ai veicoli e agli occupanti. La capacità di assorbimento dell'energia della barriera dipende dal materiale, dalla geometria e dalla costruzione della barriera stessa.\n\n5. **Normative e standard:**\n È importante seguire le normative e gli standard specifici per la progettazione e il calcolo delle barriere di sicurezza. Questi possono variare a seconda del paese e dell'applicazione specifica (ad esempio, autostrade, ponti, ecc.).\n\nPer calcoli più dettagliati e specifici, si consiglia di consultare le normative tecniche locali e di utilizzare software di simulazione specializzati che possono prendere in considerazione tutti i fattori rilevanti.",
  },
};

export const ComplexMarkdownMath5 = Template.bind({});
ComplexMarkdownMath5.args = {
  memori,
  tenant,
  useMathFormatting: true,
  apiUrl: 'https://backend.memori.ai',
  message: {
    fromUser: false,
    initial: false,
    generatedByAI: true,
    text: "Per calcolare l'ipotenusa di un triangolo rettangolo, puoi utilizzare il teorema di Pitagora. La formula è:\n\n\\\\[ c = \\\\sqrt{a^2 + b^2} \\\\]\n\nDove:\n- \\\\( c \\\\) è l'ipotenusa,\n- \\\\( a \\\\) e \\\\( b \\\\) sono i due cateti del triangolo.\n\nAd esempio, se hai un triangolo con i cateti di lunghezza 3 e 4, l'ipotenusa sarà:\n\n\\\\[ c = \\\\sqrt{3^2 + 4^2} = \\\\sqrt{9 + 16} = \\\\sqrt{25} = 5 \\\\]\n\nSe hai altre domande o dubbi, sono qui per aiutarti!",
  },
};

export const ComplexMarkdownMath6 = Template.bind({});
ComplexMarkdownMath6.args = {
  memori,
  tenant,
  useMathFormatting: true,
  apiUrl: 'https://backend.memori.ai',
  message: {
    fromUser: false,
    initial: false,
    generatedByAI: true,
    text: `La formula per il calcolo della spinta passiva non è riportata precisamente nel documento, ma in base alle informazioni presenti nella Specifica Tecnica per la redazione delle Verifiche Accurate di sicurezza di Livello 4 (ST-VAL4), il contesto del calcolo delle spinte passive può essere richiamato come segue:

Il calcolo della spinta passiva in geotecnica solitamente coinvolge il coefficiente di spinta passiva, che può esser calcolato usando diverse formulazioni a seconda delle condizioni (statiche o sismiche).

1. **In condizioni statiche**, il calcolo della pressione del terreno avviene considerando il coefficiente passivo $k_p$:$k_p = \frac{1 + sin(\phi)}{1 - sin(\phi)}$

2. **In condizioni sismiche**, si può utilizzare la formulazione di Mononobe-Okabe:
 \[
 k_h = \beta \cdot \frac{a_{\max}}{g}
 \]
 dove:
 - $\beta$ è il coefficiente di riduzione della accelerazione massima attesa al sito
 - $a_{\max}$ è l'accelerazione massima
 - $g$ è l'accelerazione di gravità .

Se hai bisogno di dettagli più specifici o ulteriori informazioni su un altro argomento, fammi sapere!`,
  },
};

export const ComplexMarkdownMath7 = Template.bind({});
ComplexMarkdownMath7.args = {
  memori,
  tenant,
  apiUrl: 'https://backend.memori.ai',
  useMathFormatting: true,
  message: {
    fromUser: false,
    initial: false,
    generatedByAI: true,
    text: `Il coefficiente di adeguatezza $𝜁_V$ è definito dalle normative NTC18 come il rapporto tra il valore massimo del sovraccarico verticale variabile sopportabile dalla parte i-esima della costruzione e il valore del sovraccarico verticale variabile che si utilizzerebbe nel progetto di una nuova costruzione.

Tale parametro viene calcolato tramite la seguente espressione:

$$
𝜁_V = \frac{𝑅_d - (𝐸_{d,G} + 𝐸_{d,Q𝑡,𝑜𝑟𝑖𝑧𝑧𝑜𝑛𝑡𝑎𝑙𝑖} + 𝐸_{d,Q𝑣𝑎𝑟𝑖𝑎𝑏𝑖𝑙𝑖})}{𝐸_{d,Q𝑡,𝑣𝑒𝑟𝑡𝑖𝑐𝑎𝑙𝑖}}
$$

dove:

- $𝑅_d$ è la capacità della sezione resistente;
- $𝐸_{d,G}$ è l’azione sollecitante derivante dai carichi permanenti;
- $𝐸_{d,Q𝑣𝑎𝑟𝑖𝑎𝑏𝑖𝑙𝑖}$ è l’azione sollecitante derivante dai carichi accidentali non da traffico (vento, azioni termiche, ecc.);
- $𝐸_{d,Q𝑡,𝑣𝑒𝑟𝑡𝑖𝑐𝑎𝑙𝑖}$ è l’azione sollecitante derivante dalla componente verticale dei carichi da traffico;
- $𝐸_{d,Q𝑡,𝑜𝑟𝑖𝑧𝑧𝑜𝑛𝑡𝑎𝑙𝑖}$ è l’azione sollecitante derivante dalla componente orizzontale dei carichi da traffico (frenatura o azione centrifuga).

In accordo con il §6.1.5 delle LG20, il coefficiente $𝜁_V$ ha significato solo per il livello di analisi di "Adeguamento" in quanto per i livelli di "Operatività" e "Transitabilità" la domanda per la quale si svolgono le valutazioni di sicurezza è determinata in condizioni differenti da quelle che si avrebbero per nuove costruzioni ($𝑡_{r𝑒𝑓}$ ridotto, restrizioni all’uso, limitazioni di carico).

I coefficienti $𝜁_V$ possono essere valutati per le combinazioni che considerano carichi da traffico con componente d’azione verticale .`,
  },
};

export const WithHTML = Template.bind({});
WithHTML.args = {
  memori,
  tenant,
  apiUrl: 'https://backend.memori.ai',
  message: {
    fromUser: false,
    initial: false,
    generatedByAI: true,
    text: `
<div>
<div style="width: 30%; margin-bottom: 20px;">
<img src="https://www.e-stayon.com/images/thumbs/0244280_lenovo-ideapad-3-chromebook-15-intel-celeron-4gb-64gb_360.jpeg" style="width:100%">
<h3>Lenovo IdeaPad 3 Chromebook</h3>
<p>Intel Celeron, 15", 4GB RAM, 64GB</p>
<p>Prezzo: €194,88 (sconto 12% da €221,59)</p>
</div>

<div style="width: 30%; margin-bottom: 20px;">
<img src="https://www.e-stayon.com/images/thumbs/0244280_lenovo-ideapad-3-chromebook-15-intel-celeron-4gb-64gb_360.jpeg" style="width:100%">
<h3>Lenovo IdeaPad 3 Chromebook</h3>
<p>Intel Celeron, 15", 4GB RAM, 64GB</p>
<p>Prezzo: €194,88 (sconto 12% da €221,59)</p>
</div>

<div style="width: 30%; margin-bottom: 20px;">
<img src="https://www.e-stayon.com/images/thumbs/0244280_lenovo-ideapad-3-chromebook-15-intel-celeron-4gb-64gb_360.jpeg" style="width:100%">
<h3>Lenovo IdeaPad 3 Chromebook</h3>
<p>Intel Celeron, 15", 4GB RAM, 64GB</p>
<p>Prezzo: €194,88 (sconto 12% da €221,59)</p>
</div>
</div>
`,
  },
};

// 9. Complex HTML Table
export const ComplexHTMLTable = Template.bind({});
ComplexHTMLTable.args = {
  memori,
  tenant,
  message: {
    fromUser: false,
    text: `<table border="1" style="border-collapse: collapse; width: 100%;">
    <thead>
      <tr style="background-color: #f2f2f2;">
        <th colspan="3" style="text-align: center; padding: 8px;">Project Timeline</th>
      </tr>
      <tr style="background-color: #f2f2f2;">
        <th style="text-align: left; padding: 8px;">Phase</th>
        <th style="text-align: left; padding: 8px;">Start Date</th>
        <th style="text-align: left; padding: 8px;">End Date</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding: 8px;">Planning</td>
        <td style="padding: 8px;">Jan 15, 2025</td>
        <td style="padding: 8px;">Feb 28, 2025</td>
      </tr>
      <tr style="background-color: #f9f9f9;">
        <td style="padding: 8px;">Development</td>
        <td style="padding: 8px;">Mar 1, 2025</td>
        <td style="padding: 8px;">Jun 30, 2025</td>
      </tr>
      <tr>
        <td style="padding: 8px;">Testing</td>
        <td style="padding: 8px;">Jul 1, 2025</td>
        <td style="padding: 8px;">Aug 15, 2025</td>
      </tr>
      <tr style="background-color: #f9f9f9;">
        <td style="padding: 8px;">Deployment</td>
        <td style="padding: 8px;">Aug 16, 2025</td>
        <td style="padding: 8px;">Sep 30, 2025</td>
      </tr>
    </tbody>
    <tfoot>
      <tr style="background-color: #f2f2f2;">
        <td colspan="3" style="text-align: center; padding: 8px;">Total Duration: 8.5 months</td>
      </tr>
    </tfoot>
  </table>`,
    initial: false,
  },
};
ComplexHTMLTable.parameters = {
  docs: {
    description: {
      story:
        'A message containing a complex HTML table that should trigger the loading spinner before rendering.',
    },
  },
};

//10. Long text message
export const MediumLongTextMessage = Template.bind({});
MediumLongTextMessage.args = {
  memori,
  tenant,
  message: {
    fromUser: false,
    text: Array(100)
      .fill(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.'
      )
      .join('\n\n'),
    initial: false,
  },
};

export const LongTextMessage = Template.bind({});
LongTextMessage.args = {
  memori,
  tenant,
  message: {
    fromUser: false,
    text: Array(200)
      .fill(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.'
      )
      .join('\n\n'),
    initial: false,
  },
};

export const LongTextMessageWithHTML = Template.bind({});
LongTextMessageWithHTML.args = {
  memori,
  tenant,
  message: {
    fromUser: false,
    text:
      Array(200)
        .fill(
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat.'
        )
        .join('\n\n') +
      `
    <div>
    <div style="width: 30%; margin-bottom: 20px;">
    <img src="https://www.e-stayon.com/images/thumbs/0244280_lenovo-ideapad-3-chromebook-15-intel-celeron-4gb-64gb_360.jpeg" style="width:100%">
    <h3>Lenovo IdeaPad 3 Chromebook</h3>
    <p>Intel Celeron, 15", 4GB RAM, 64GB</p>
    <p>Prezzo: €194,88 (sconto 12% da €221,59)</p>
    </div>`,
  },
};

// 10. Message with an embedded helper function to show requiresFormatting detection
export const FormattingDetectionDemo = Template.bind({});
FormattingDetectionDemo.args = {
  memori,
  tenant,
  message: {
    fromUser: false,
    text: 'This message demonstrates how the formatting detection works.\n\nBelow are some examples of content that will be detected as requiring formatting:\n\n1. HTML tags: <div>Example</div>\n2. Markdown tables: | Header | Content |\n3. Code blocks: ```javascript\nconst x = 1;\n```\n4. Math formulas: $E = mc^2$\n5. Tabbed data: Name\tAge\tLocation\n\nThe requiresFormatting function will detect these patterns and show a loading spinner.',
    initial: false,
  },
};
FormattingDetectionDemo.parameters = {
  docs: {
    description: {
      story:
        'A demonstration of different content patterns that trigger the loading spinner.',
    },
  },
};

export const HTMLTable = Template.bind({});
HTMLTable.args = {
  memori,
  tenant,
  message: {
    fromUser: false,
    text: `Ecco la lista formattata in HTML dei task e dei relativi assegnatari:
<table>
 <tr>
 <th>Task</th>
 <th>Assegnato a</th>
 </tr>
 <tr><td>Market Research</td><td>Alice</td></tr>
 <tr><td>Content Creation</td><td>Bob</td></tr>
 <tr><td>Social Media Planning</td><td>Charlie</td></tr>
 <tr><td>Campaign Analysis</td><td>Daisy</td></tr>
 <tr><td>Prototype Development</td><td>Ethan</td></tr>
 <tr><td>Quality Assurance</td><td>Fiona</td></tr>
 <tr><td>User Interface Design</td><td>Gabriel</td></tr>
 <tr><td>Service Improvement</td><td>Hannah</td></tr>
 <tr><td>Ticket Resolution</td><td>Ian</td></tr>
 <tr><td>Customer Feedback</td><td>Julia</td></tr>
 <tr><td>Budget Analysis</td><td>Kevin</td></tr>
 <tr><td>Financial Reporting</td><td>Mark</td></tr>
 <tr><td>Investment Planning</td><td>Mark</td></tr>
 <tr><td>Market Trends Analysis</td><td>Nathan</td></tr>
 <tr><td>Data Collection</td><td>Olivia</td></tr>
 <tr><td>Research Paper Writing</td><td>Peter</td></tr>
 <tr><td>Software Development</td><td>Quinn</td></tr>
 <tr><td>Feature Enhancement</td><td>Rachel</td></tr>
 <tr><td>Code Review</td><td>Sam</td></tr>
 <tr><td>Manufacturing</td><td>Tim</td></tr>
 <tr><td>Product Design</td><td>Uma</td></tr>
 <tr><td>UX Research</td><td>Victor</td></tr>
 <tr><td>API Development</td><td>Wendy</td></tr>
 <tr><td>Database Management</td><td>Xavier</td></tr>
 <tr><td>Cloud Infrastructure</td><td>Yara</td></tr>
 <tr><td>Security Testing</td><td>Zack</td></tr>
 <tr><td>Documentation</td><td>Adam</td></tr>
 <tr><td>Technical Support</td><td>Beth</td></tr>
 <tr><td>Project Management</td><td>Carl</td></tr>
 <tr><td>Business Analysis</td><td>Diana</td></tr>
 <tr><td>DevOps Engineering</td><td>Erik</td></tr>
 <tr><td>Mobile Development</td><td>Faith</td></tr>
 <tr><td>Frontend Development</td><td>George</td></tr>
 <tr><td>Backend Development</td><td>Helen</td></tr>
 <tr><td>System Architecture</td><td>Isaac</td></tr>
 <tr><td>Data Analysis</td><td>Jane</td></tr>
 <tr><td>Machine Learning</td><td>Kyle</td></tr>
 <tr><td>AI Development</td><td>Lisa</td></tr>
 <tr><td>Network Security</td><td>Mike</td></tr>
 <tr><td>Performance Testing</td><td>Nina</td></tr>
 <tr><td>Load Testing</td><td>Oscar</td></tr>
 <tr><td>Penetration Testing</td><td>Penny</td></tr>
 <tr><td>Automation Testing</td><td>Quentin</td></tr>
 <tr><td>Release Management</td><td>Rose</td></tr>
 <tr><td>Configuration Management</td><td>Steve</td></tr>
 <tr><td>Change Management</td><td>Tina</td></tr>
 <tr><td>Risk Management</td><td>Ulysses</td></tr>
 <tr><td>Resource Planning</td><td>Violet</td></tr>
 <tr><td>Capacity Planning</td><td>Walter</td></tr>
 <tr><td>Strategic Planning</td><td>Xena</td></tr>
 <tr><td>Operations Management</td><td>Yuki</td></tr>
 <tr><td>Quality Management</td><td>Zara</td></tr>
</table>

Ho mostrato i primi 20 task per brevità. La tabella include il nome del task e la persona assegnata.`,
    initial: false,
  },
};
