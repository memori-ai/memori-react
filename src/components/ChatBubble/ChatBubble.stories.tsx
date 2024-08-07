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

export const ComplexMarkdownMath1 = Template.bind({});
ComplexMarkdownMath1.args = {
  memori,
  apiUrl: 'https://backend.memori.ai',
  tenant,
  message: {
    fromUser: false,
    initial: false,
    generatedByAI: true,
    text: `Per calcolare l'ipotenusa di un triangolo rettangolo, puoi usare il Teorema di Pitagora. Il teorema afferma che in un triangolo rettangolo, il quadrato dell'ipotenusa (la lato opposto all'angolo retto) è uguale alla somma dei quadrati degli altri due lati.\n\nLa formula è:\n\n\\[ c = \\sqrt{a^2 + b^2} \\]\n\nDove:\n- $c$ è l'ipotenusa.\n- $a$ e $ b $ sono i due cateti del triangolo.\n\n### Passaggi per il Calcolo\n\n1. **Misura o identifica i cateti $ a $ e $ b $**:\n   I cateti sono i due lati che formano l'angolo retto.\n\n2. **Calcola i quadrati dei cateti**:\n   Eleva al quadrato entrambe le misure dei cateti: $ a^2 $ e $ b^2 $.\n\n3. **Somma i quadrati dei cateti**:\n   Somma i risultati ottenuti: $ a^2 + b^2 $.\n\n4. **Calcola la radice quadrata della somma**:\n   Prendi la radice quadrata della somma per trovare l'ipotenusa: $ c = \\sqrt{a^2 + b^2} $.\n\n### Esempio di Calcolo\n\nSupponiamo di avere un triangolo rettangolo con i cateti di lunghezza 3 cm e 4 cm.\n\n1. **Cateto $ a $**: 3 cm\n2. **Cateto $ b $**: 4 cm\n\nUsiamo la formula:\n\n\\[ c = \\sqrt{a^2 + b^2} \\]\n\n\\[ c = \\sqrt{(3 \\, \\text{cm})^2 + (4 \\, \\text{cm})^2} \\]\n\n\\[ c = \\sqrt{9 \\, \\text{cm}^2 + 16 \\, \\text{cm}^2} \\]\n\n\\[ c = \\sqrt{25 \\, \\text{cm}^2} \\]\n\n\\[ c = 5 \\, \\text{cm} \\]\n\nQuindi, l'ipotenusa del triangolo è di 5 cm.`,
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
    text: "Per calcolare le resistenze dei materiali per le verifiche rispetto ad azioni antropiche e ambientali secondo la Specifica Tecnica ST-VAL4, si procede in questo modo:\n\n1. **Determinazione della resistenza dei materiali:**\n   La resistenza dei materiali da utilizzare nelle verifiche accurate si determina a partire dalle indagini sull’opera. La caratterizzazione deve essere distinta per tutti i materiali presenti nell'opera, in accordo con la ST-PI. Le resistenze per verifiche rispetto ad azioni antropiche come i carichi da traffico e le azioni ambientali sono definite dalle LG20. Questo include la distinzione rispetto a quelle utilizzate per le azioni sismiche, come dettagliato dalle NTC18 e CIR19  .\n\n2. **Calcolo della resistenza:**\n   Il valore della resistenza dei materiali $ f_d $ da utilizzare nelle verifiche per carichi gravitazionali si ottiene mediante la seguente espressione:\n\n   \\[\n   f_d = \\min \\left( \\frac{f_m}{FC \\cdot \\gamma_M}, \\frac{f_k}{FC} \\right)\n   \\]\n\n   Dove:\n   - $ f_m $ è il valor medio della resistenza valutato dai risultati delle prove effettuate sui campioni prelevati in situ;\n   - $ f_k $ è la resistenza caratteristica calcolata sulla base dei risultati delle prove sui campioni prelevati in situ;\n   - $ FC $ è il Fattore di Confidenza associato al Livello di Conoscenza raggiunto;\n   - $ \\gamma_M $ è il fattore parziale di sicurezza del materiale   .\n\n3. **Caratterizzazione dei materiali:**\n   I valori medi, caratteristici e di progetto delle resistenze a compressione e trazione per il calcestruzzo, e delle resistenze a snervamento per l’acciaio ordinario sono determinati a partire dai risultati delle prove. Specifiche espressioni e metodi sono forniti per diversi materiali nell'Appendice 13 della ST-VAL4  .\n\n4. **Stima della resistenza da prove non distruttive:**\n   Per valutare le resistenze dei materiali, si possono anche utilizzare prove non distruttive come le prove SonReb per il calcestruzzo e le prove di durezza per l'acciaio ordinario e armonico. Formulazioni specifiche per queste prove si trovano in Appendice al §13.1 della ST-VAL4 .\n\n5. **Analisi dei risultati delle indagini:**\n   Gli esiti delle prove devono essere attentamente analizzati per confermare le caratteristiche originarie o rilevare eventuali decadimenti del materiale. Questo processo include anche l'identificazione delle cause di dispersione significative nei risultati delle prove  .\n\nSeguendo questi passaggi, si ottiene una stima accurata delle resistenze dei materiali che possono essere utilizzate per le verifiche di sicurezza rispetto ad azioni antropiche e ambientali.",
  },
};

export const ComplexMarkdownMath3 = Template.bind({});
ComplexMarkdownMath3.args = {
  memori,
  apiUrl: 'https://backend.memori.ai',
  tenant,
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
  apiUrl: 'https://backend.memori.ai',
  message: {
    fromUser: false,
    initial: false,
    generatedByAI: true,
    text: "Per calcolare l'ipotenusa di un triangolo rettangolo, puoi utilizzare il teorema di Pitagora. La formula è:\n\n\\\\[ c = \\\\sqrt{a^2 + b^2} \\\\]\n\nDove:\n- \\\\( c \\\\) è l'ipotenusa,\n- \\\\( a \\\\) e \\\\( b \\\\) sono i due cateti del triangolo.\n\nAd esempio, se hai un triangolo con i cateti di lunghezza 3 e 4, l'ipotenusa sarà:\n\n\\\\[ c = \\\\sqrt{3^2 + 4^2} = \\\\sqrt{9 + 16} = \\\\sqrt{25} = 5 \\\\]\n\nSe hai altre domande o dubbi, sono qui per aiutarti!",
  },
};

export const ComplexMarkdownTest = Template.bind({});
ComplexMarkdownTest.args = {
  memori,
  tenant,
  apiUrl: 'https://backend.memori.ai',
  message: {
    fromUser: false,
    initial: false,
    generatedByAI: true,
    text: "Basandomi sui dati forniti nel bilancio, ecco un'analisi generale della società ACME SRL IN LIQUIDAZIONE per l'anno 2023:\n\n1. Stato di liquidazione: La società è in liquidazione, come indicato dal nome \"ACME SRL IN LIQUIDAZIONE\". Questo significa che l'azienda sta cessando le sue attività e sta procedendo alla liquidazione dei suoi asset.\n\n2. Situazione patrimoniale:\n - Totale attivo: €4.577.945\n - Patrimonio netto: €4.406.550\n - Debiti: €171.395\n\n3. Composizione dell'attivo:\n - L'attivo è composto principalmente da crediti (€4.548.367), che rappresentano circa il 99% del totale attivo.\n - Le immobilizzazioni sono minime (€293), indicando che la società ha probabilmente già dismesso la maggior parte dei suoi asset fissi.\n\n4. Situazione economica:\n - La società ha registrato una perdita di €15.458 nell'esercizio 2023.\n - I ricavi sono minimi (€693), confermando che l'azienda non sta più svolgendo attività operative significative.\n\n5. Liquidità:\n - Le disponibilità liquide ammontano a €29.285, un valore relativamente basso rispetto al totale dell'attivo.\n\n6. Capitale sociale:\n - Il capitale sociale è di €4.251.690, interamente versato.\n\n7. Trend:\n - Rispetto all'anno precedente, si nota una diminuzione del totale attivo e una riduzione dei debiti.\n\nIn conclusione, questa società appare essere in una fase avanzata di liquidazione. La maggior parte dell'attivo è costituita da crediti, probabilmente in attesa di essere riscossi. La società non genera più ricavi significativi e sta probabilmente cercando di chiudere le ultime posizioni aperte prima di concludere definitivamente la sua esistenza. La solidità patrimoniale sembra buona, con un patrimonio netto che copre ampiamente i debiti residui.",
  },
};
