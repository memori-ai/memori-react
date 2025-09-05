import {
  Medium,
  Memori,
  Message,
  Memory,
  Integration,
  Tenant,
  DialogState,
  KnownFact,
  ExpertReference,
  User,
  Venue,
} from '@memori.ai/memori-api-client/dist/types';

export const sessionID = '131165be-9d1a-42fb-a3ce-e8f86d40c88f';

export const tenant: Tenant = {
  tenantID: '96caa4b4-31a4-48e5-8163-dec61869a2a7',
  name: 'www.aisuru.com',
  description: 'AIsuru',
  adminCount: 3,
  creationTimestamp: '2023-05-31T14:32:48.885287Z',
  disableRegistration: false,
  lastChangeTimestamp: '2023-05-31T14:32:48.885287Z',
  logoURL: 'https://aisuru.com/images/aisuru/logo.png',
  maxAdmins: 0,
  maxCompletions: 0,
  maxCompletionsPerUser: 0,
  maxFreeSessions: 400,
  maxFreeSessionsPerUser: 100,
  maxMemoriPerAdmin: 0,
  maxMemoriPerUser: 3,
  maxTotalMemori: 0,
  maxUsers: 0,
  memoriCount: 0,
  nonFreeSessionCost: 0.02,
  paying: true,
  theme: 'aisuru',
  userCount: 0,
};

export const user: User = {
  tenant: 'localhost:3000',
  userID: '97c42d18-ffe4-47e1-a3c7-e42729f1e6a3',
  userName: 'nzambello',
  eMail: 'nicola@nzambello.dev',
  admin: false,
  maxMemori: 0,
  enableMemoriCreation: true,
  enableBoardOfExperts: true,
  maxFreeSessions: 0,
  tnCAndPPAccepted: true,
  tnCAndPPAcceptanceDate: '2021-03-01T00:00:00.000Z',
  pAndCUAccepted: true,
  pAndCUAcceptanceDate: '2021-03-01T00:00:00.000Z',
  birthDate: '1900-03-01T00:00:00.000Z',
  age: 28,
  avatarURL: 'https://avatars.githubusercontent.com/u/21101435?v=4',
};

export const memori: Memori = {
  memoriID: '25ced51c-3520-41af-8bbe-222d861b8e32',
  engineMemoriID: '66b4e161-2431-4b21-9b70-d8c27de730ca',
  name: 'Memori',
  memoriConfigurationID: 'MemoriCloud-it_IT',
  description: 'Lorem ipsum.',
  voiceType: 'male',
  isGiver: true,
  isReceiver: false,
  privacyType: 'PUBLIC',
  needsPosition: false,
  culture: 'it-IT',
  categories: [],
  publishedInTheMetaverse: true,
  exposed: true,
  enableCompletions: true,
  nsfw: false,
  ageRestriction: 14,
  contentQualityIndex: 66.6,
  contentQualityIndexTimestamp: '2021-03-01T12:00:00.000Z',
  ownerUserName: 'username',
  ownerTenantName: 'aisuru.com',
  ownerUserID: '97c42d18-ffe4-47e1-a3c7-e42729f1e6a3',
  metaverseEnvironment: 'synthwave',
  secretToken: 'awanagana',
  giverPIN: '1234',
  giverTag: '🧑‍💻',
  avatarURL: 'https://aisuru.com/images/aisuru/square_logo.png',
  coverURL: 'https://aisuru.com/images/aisuru/og-image.png',
};

export const historyWithArtifacts: Message[] = [
  {
    text: "Ciao, io sono test, c'è qualcosa che vorresti chiedermi?",
    timestamp: '2021-03-01T12:00:00.000Z',
  },
  {
    text: 'Prova',
    fromUser: true,
    timestamp: '2021-03-01T12:00:00.000Z',
  },
  
  {
    text: "Mi dispiace, le mie risposte sono limitate. Devi farmi le domande giuste. C'è altro che vuoi sapere?",
    timestamp: '2021-03-01T12:00:00.000Z',
  },
  
  {
    text: 'Come faccio a fare delle cose con questa cosa?',
    fromUser: true,
    timestamp: '2021-03-01T12:00:00.000Z',
  },
  
  
  {
    text: `Ecco qui come. <think>L'utente mi sta chiedendo di generare un'immagine di gattini. Per fare questo devo utilizzare il sistema di generazione immagini. Prima devo controllare quali strumenti sono disponibili per la generazione di immagini. Dovrei:1. Prima chiamare LISTA_TOOLS_FREE_IMAGE_GENERATOR_MCP_PROD per vedere gli strumenti disponibili2. Poi usare ESEGUI_TOOL_FREE_IMAGE_GENERATOR_MCP_PROD per generare l'immagine 2. Poi usare ESEGUI_TOOL_FREE_IMAGE_GENERATOR_MCP_PROD per generare l'immagine Dalle istruzioni so che devo provare i modelli in questo ordine: turbo, flux, kontext (iniziando sempre con turbo). Inoltre, dalle istruzioni specifiche, vedo che se ho ARTIFACT attivo posso usare JavaScript e ARTIFACT per effetti più avanzati, altrimenti devo avvisare che l'immagine ci può mettere un po' a caricarsi e predisporre il bordo width:100%. Dato che sto lavorando con il sistema Memori Artifact, dovrei avere ARTIFACT disponibile, quindi userò quello per una gestione più bella del loading.</think>Perfetto! Ho generato per te un'adorabile immagine di gattini! 🐱✨ <output class="memori-artifact" data-mimetype="html" data-title="Gattini Adorabili">
<!DOCTYPE html>
<html lang="it">
<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <title>Gattini Adorabili</title>
 <style>
 * {
 margin: 0;
 padding: 0;
 box-sizing: border-box;
 }
 
 body {
 font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
 background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
 min-height: 100vh;
 display: flex;
 flex-direction: column;
 align-items: center;
 justify-content: center;
 padding: 20px;
 }
 
 .container {
 background: rgba(255, 255, 255, 0.95);
 border-radius: 20px;
 padding: 30px;
 box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
 max-width: 800px;
 width: 100%;
 text-align: center;
 backdrop-filter: blur(10px);
 border: 1px solid rgba(255, 255, 255, 0.3);
 }
 
 h1 {
 color: #ff6b9d;
 margin-bottom: 20px;
 font-size: 2.5rem;
 text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
 }
 
 .image-container {
 position: relative;
 border-radius: 15px;
 overflow: hidden;
 box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
 margin: 20px 0;
 background: #f0f0f0;
 min-height: 400px;
 display: flex;
 align-items: center;
 justify-content: center;
 }
 
 .loading {
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translate(-50%, -50%);
 color: #ff6b9d;
 font-size: 1.2rem;
 z-index: 1;
 }
 
 .spinner {
 border: 4px solid #f3f3f3;
 border-top: 4px solid #ff6b9d;
 border-radius: 50%;
 width: 40px;
 height: 40px;
 animation: spin 1s linear infinite;
 margin: 0 auto 15px;
 }
 
 @keyframes spin {
 0% { transform: rotate(0deg); }
 100% { transform: rotate(360deg); }
 }
 
 .generated-image {
 width: 100%;
 max-width: 100%;
 height: auto;
 border-radius: 15px;
 opacity: 0;
 transition: opacity 0.5s ease-in-out;
 }
 
 .generated-image.loaded {
 opacity: 1;
 }
 
 .description {
 color: #666;
 font-size: 1.1rem;
 line-height: 1.6;
 margin-top: 20px;
 }
 
 .features {
 display: grid;
 grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
 gap: 15px;
 margin-top: 25px;
 }
 
 .feature {
 background: linear-gradient(135deg, #ff9a9e, #fecfef);
 color: white;
 padding: 15px;
 border-radius: 10px;
 font-weight: 600;
 text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
 }
 
 .download-btn {
 margin-top: 25px;
 padding: 12px 25px;
 background: linear-gradient(135deg, #ff6b9d, #c44569);
 color: white;
 border: none;
 border-radius: 25px;
 font-size: 1rem;
 font-weight: 600;
 cursor: pointer;
 transition: all 0.3s ease;
 text-decoration: none;
 display: inline-block;
 }
 
 .download-btn:hover {
 transform: translateY(-2px);
 box-shadow: 0 8px 25px rgba(255, 107, 157, 0.3);
 }
 </style>
</head>
<body>
 <div class="container">
 <h1>🐱 Gattini Adorabili 🐱</h1>
 
 <div class="image-container">
 <div class="loading" id="loading">
 <div class="spinner"></div>
 Generando i gattini più adorabili del mondo...
 </div>
 <img 
 class="generated-image" 
 id="kittenImage"
 src="https://image.pollinations.ai/prompt/adorable%20fluffy%20kittens%20playing%20together%2C%20cute%20baby%20cats%20with%20big%20eyes%2C%20soft%20fur%2C%20playful%20pose%2C%20warm%20lighting%2C%20high%20quality%2C%20detailed?model=turbo&seed=908545&width=1024&height=1024&enhance=true&nologo=true&private=true&safe=false"
 alt="Adorabili gattini che giocano insieme"
 >
 </div>
 
 <div class="description">
 <p>Ecco la tua immagine di <strong>gattini adorabili</strong> generata con AI! 
 Questi piccoli felini con i loro occhi grandi e il pelo soffice sono pronti a riempire la tua giornata di dolcezza.</p>
 </div>
 
 <div class="features">
 <div class="feature">🎨 Alta Qualità</div>
 <div class="feature">✨ AI Generata</div>
 <div class="feature">💕 Adorabili</div>
 <div class="feature">🐾 Dettagliata</div>
 </div>
 
 <a href="https://image.pollinations.ai/prompt/adorable%20fluffy%20kittens%20playing%20together%2C%20cute%20baby%20cats%20with%20big%20eyes%2C%20soft%20fur%2C%20playful%20pose%2C%20warm%20lighting%2C%20high%20quality%2C%20detailed?model=turbo&seed=908545&width=1024&height=1024&enhance=true&nologo=true&private=true&safe=false" 
 download="gattini-adorabili.jpg" 
 class="download-btn">
 📥 Scarica Immagine
 </a>
 </div>
 
 <script>
 const image = document.getElementById('kittenImage');
 const loading = document.getElementById('loading');
 
 image.onload = function() {
 loading.style.display = 'none';
 image.classList.add('loaded');
 };
 
 image.onerror = function() {
 loading.innerHTML = '😿 Ops! Errore nel caricamento dell\'immagine';
 };
 
 // Preload dell'immagine per un caricamento più fluido
 setTimeout(() => {
 if (!image.complete) {
 loading.innerHTML = '<div class="spinner"></div>I gattini stanno arrivando... 🐱';
 }
 }, 3000);
 </script>
</body>
</html>
</output>

Ho creato per te un'immagine di gattini adorabili utilizzando il modello AI "turbo"! 🐱✨

**Caratteristiche dell'immagine:**
- 🎨 **Qualità**: 1024x1024 pixel, alta risoluzione
- 🐾 **Soggetto**: Gattini soffici che giocano insieme con grandi occhi dolci
- ✨ **Stile**: Illuminazione calda, dettagli realistici, pelo morbido
- 💕 **Mood**: Adorabile e giocoso

L'immagine è visualizzata in una pagina web interattiva con:
- Loading animation mentre si carica
- Design responsive e moderno
- Pulsante per scaricare l'immagine
- Effetti di transizione fluidi

Se vuoi provare variazioni diverse, posso generare altre immagini con stili o pose differenti! 🎨`,
    timestamp: '2021-03-01T12:00:00.000Z',
  },
  
  
  {
    text: 'Ah, grazie! Ciao!',
    fromUser: true,
    timestamp: '2021-03-01T12:00:00.000Z',
  },
  
  
  {
    text: 'Arrivederci.',
    timestamp: '2021-03-01T12:00:00.000Z',
  },
  
  
];


export const history: Message[] = [
  {
    text: "Ciao, io sono test, c'è qualcosa che vorresti chiedermi?",
    timestamp: '2021-03-01T12:00:00.000Z',
  },
  {
    text: 'Prova',
    fromUser: true,
    timestamp: '2021-03-01T12:00:00.000Z',
  },
  {
    text: "Mi dispiace, le mie risposte sono limitate. Devi farmi le domande giuste. C'è altro che vuoi sapere?",
    timestamp: '2021-03-01T12:00:00.000Z',
  },
  {
    text: 'Come faccio a fare delle cose con questa cosa?',
    fromUser: true,
    timestamp: '2021-03-01T12:00:00.000Z',
  },
  {
    text: 'Ecco qui come.',
    media: [
      {
        mediumID: 'c6851968-5d4d-409a-ae75-f22ec077efcd',
        url: 'https://memori.ai',
        mimeType: 'text/html',
        title: 'Link',
      },
    ],
    timestamp: '2021-03-01T12:00:00.000Z',
    contextVars: {
      TEST: 'test',
    },
  },
  {
    text: 'Ah, grazie! Ciao!',
    fromUser: true,
    timestamp: '2021-03-01T12:00:00.000Z',
  },
  {
    text: 'Arrivederci.',
    timestamp: '2021-03-01T12:00:00.000Z',
    contextVars: {
      TEST: 'test',
    },
  },
];

export const historyWithMedia: Message[] = [
  {
    text: "Ciao, io sono test, c'è qualcosa che vorresti chiedermi?",
    timestamp: '2021-03-01T12:00:00.000Z',
  },
  {
    text: 'Prova',
    fromUser: true,
    timestamp: '2021-03-01T12:00:00.000Z',
  },
  {
    text: "Mi dispiace, le mie risposte sono limitate. Devi farmi le domande giuste. C'è altro che vuoi sapere?",
    timestamp: '2021-03-01T12:00:00.000Z',
  },
  {
    text: 'Come faccio a fare delle cose con questa cosa?',
    fromUser: true,
    timestamp: '2021-03-01T12:00:00.000Z',
  },
  {
    text: 'Ecco qui delle cose per te.',
    media: [
      {
        mediumID: 'c6851968-5d4d-409a-ae75-f22ec077efcd',
        url: 'https://memori.ai/en',
        mimeType: 'text/html',
        title: 'Link Memori Srl',
      },
      {
        mediumID: 'c6851968-5d4d-409a-ae75-f22ec077efce',
        url: 'https://rawmaterial.it/en',
        mimeType: 'text/html',
        title: 'Link RawMaterial',
      },
      {
        mediumID: '95226d7e-7bae-465e-8b80-995587bb5971',
        mimeType: 'text/html',
        title: 'Introducing Plone Remix | Vimeo',
        url: 'https://vimeo.com/766468314',
      },
      {
        mediumID: '95226d7e-7bae-465e-8b80-995587bb5969',
        mimeType: 'text/html',
        title: 'A sustainable web: is it possible? - Nicola Zambello | YouTube',
        url: 'https://www.youtube.com/watch?v=feH26j3rBz8',
      },
      ...Array.from({ length: 3 }, (_, i) => ({
        mediumID: `95226d7e-7bae-465e-8b80-995587bb597${i}`,
        mimeType: 'image/png',
        title: `Image ${i}`,
        url: `https://picsum.photos/${i % 2 ? '200' : '300'}/${
          i % 3 ? '300' : '200'
        }?random=${i}`,
      })),
    ],
    timestamp: '2021-03-01T12:00:00.000Z',
  },
  {
    text: 'Ah, grazie! Ciao!',
    fromUser: true,
    timestamp: '2021-03-01T12:00:00.000Z',
  },
  {
    text: 'Arrivederci.',
    timestamp: '2021-03-01T12:00:00.000Z',
  },
];

export const historyWithAIGeneratedMessages: Message[] = [
  {
    text: "Ciao, io sono test, c'è qualcosa che vorresti chiedermi?",
    timestamp: '2021-03-01T12:00:00.000Z',
  },
  {
    text: 'Prova',
    fromUser: true,
    timestamp: '2021-03-01T12:00:00.000Z',
  },
  {
    text: 'Sa. Sa. Prova',
    timestamp: '2021-03-01T12:00:00.000Z',
  },
  {
    text: 'Come faccio a fare delle cose con questa cosa?',
    fromUser: true,
    timestamp: '2021-03-01T12:00:00.000Z',
  },
  {
    text: 'Ecco qui come.',
    media: [
      {
        mediumID: 'c6851968-5d4d-409a-ae75-f22ec077efcd',
        url: 'https://memori.ai',
        mimeType: 'text/html',
        title: 'Link',
      },
    ],
    timestamp: '2021-03-01T12:00:00.000Z',
    generatedByAI: true,
    contextVars: {
      TEST: 'test',
    },
  },
  {
    text: 'Ah, grazie! Ciao!',
    fromUser: true,
    timestamp: '2021-03-01T12:00:00.000Z',
  },
  {
    text: 'Arrivederci.',
    timestamp: '2021-03-01T12:00:00.000Z',
    contextVars: {
      TEST: 'test',
    },
  },
];

export const dialogState: DialogState = {
  state: 'R1',
  previousState: 'I0',
  stateName: 'WaitingForReceiverQuestion',
  confidence: 1,
  knownTags: {
    '☠️': 'test',
    '😎': 'Ciccio',
  },
  emission: "Ciao, io sono test, c'è qualcosa che vorresti chiedermi?",
  hints: ['Va bene', 'No grazie'],
  media: [],
  acceptsTimeout: true,
  acceptsAbort: false,
  acceptsMedia: false,
  acceptsDate: false,
  acceptsPlace: false,
  acceptsTag: false,
  giverID: 'c832e2dc-403c-4baf-a3b7-2374e100dbcf',
  contextVars: {},
};

export const medium: Medium = {
  mediumID: 'a196b513-d745-4121-8913-8f457b999add',
  url: 'https://api.lorem.space/image/game?w=150&h=220&hash=8B7BCDC2',
  mimeType: 'image/jpeg',
  title: 'Game Cover',
  creationTimestamp: '2022-05-03T08:57:30.584439Z',
  creationName: 'fcfda4a7-bb19-41eb-8384-db0d22f825ec',
  lastChangeTimestamp: '2022-05-03T14:19:09.932865Z',
  lastChangeName: 'fcfda4a7-bb19-41eb-8384-db0d22f825ec',
};

export const integration: Integration = {
  integrationID: 'cb3c4776-7f0b-4f97-a773-c32a5d7a3bf1',
  memoriID: '25ced51c-3520-41af-8bbe-222d861b8e32',
  type: 'LANDING_EXPERIENCE',
  state: 'NEW',
  deviceEmails: [],
  customData:
    '{"textColor":"#2a2a2a","buttonBgColor":"#823ce1","buttonTextColor":"#ffffff","name":"Web","globalBackground":"https://assets.memori.ai/api/v2/asset/364e498c-11da-42d5-9e32-19e5d137d4b8.jpeg","blurBackground":true,"innerBgColor":"light","innerBgAlpha":0.8,"multilanguage":true,"avatar":"readyplayerme","avatarURL":"https://assets.memori.ai/api/v2/asset/b791f77c-1a94-4272-829e-eca82fcc62b7.glb#1669663599444"}',
  resources: [],
  publish: true,
  creationTimestamp: '2022-06-11T14:13:45.685038Z',
  lastChangeTimestamp: '2022-06-11T14:13:45.685038Z',
};

export const knownFact: KnownFact = {
  knownFactID: 'b0b0b0b0-b0b0-b0b0-b0b0-b0b0b0b0b0b3',
  knownFactType: 'ShortTerm',
  text: 'I am a known fact. Quisque in ultrices lectus. Nulla at urna diam. Proin sodales lobortis libero eu facilisis.',
  creationTimestamp: '2023-12-01T13:40:25.235896Z',
  creationSessionID: '0ce713c0-c8f1-4aed-a2a6-40f81c06854f',
  lastChangeTimestamp: '2023-12-01T13:44:04.832072Z',
  lastChangeSessionID: '0ce713c0-c8f1-4aed-a2a6-40f81c06854f',
};

export const expertReference: ExpertReference = {
  expertID: 'f016f204-c307-483b-8891-680a3c974c53',
  name: 'TEST MEMORI',
  description: 'lui è competente',
  default: true,
  expertMemoriID: 'dfc44f1c-1ba7-4e1e-a234-28aa8b6b3d32',
  expertBaseURL: 'http://localhost:7778',
  creationTimestamp: '2023-12-01T13:40:25.235896Z',
  creationSessionID: '0ce713c0-c8f1-4aed-a2a6-40f81c06854f',
  lastChangeTimestamp: '2023-12-01T13:44:04.832072Z',
  lastChangeSessionID: '0ce713c0-c8f1-4aed-a2a6-40f81c06854f',
};

export const venue: Venue = {
  latitude: 44.66579,
  longitude: 11.48823,
  placeName: 'Altedo, Bologna, Italy',
  uncertainty: 2,
};

export const memoryQuestion: Memory = {
  memoryID: '08c0697d-f7f3-4a47-9970-aff75f01fb6c',
  memoryType: 'Question',
  lastRead: undefined,
  readOccurrences: undefined,
  receiverID: undefined,
  receiverTag: undefined,
  receiverName: undefined,
  media: [
    {
      mediumID: 'c6851968-5d4d-409a-ae75-f22ec077efcd',
      mimeType: 'text/html',
      url: 'https://rawmaterial.it/it',
      title: 'RawMaterial',
    },
  ],
  title: 'sei umano',
  titleVariants: ['sei reale'],
  answers: [
    {
      text: 'se ti dico si ci credi?',
      preformatted: false,
      creationTimestamp: '2022-03-23T09:37:25.410377',
      creationName: '6cfec2bd-a73f-4a21-b7ff-dd92d6db59c4',
      lastChangeTimestamp: '2022-03-23T09:37:25.410406',
      lastChangeName: '6cfec2bd-a73f-4a21-b7ff-dd92d6db59c4',
    },
    {
      text: 'probabilmente lo sono più di te',
      preformatted: false,
      creationTimestamp: '2022-03-23T09:37:36.957656',
      creationName: '6cfec2bd-a73f-4a21-b7ff-dd92d6db59c4',
      lastChangeTimestamp: '2022-03-23T09:37:36.957657',
      lastChangeName: '6cfec2bd-a73f-4a21-b7ff-dd92d6db59c4',
    },
  ],
  date: undefined,
  dateUncertaintyDays: undefined,
  placeName: undefined,
  placeLatitude: undefined,
  placeLongitude: undefined,
  placeUncertaintyKm: undefined,
  preformatted: false,
  conclusive: false,
  notPickable: false,
  contextVarsToSet: {
    SUBJECT: 'TRAVEL',
  },
  contextVarsToMatch: {
    SUBJECT: 'TRANSPORTS',
  },
  creationTimestamp: '2022-03-23T09:37:16.568149',
  creationName: '6cfec2bd-a73f-4a21-b7ff-dd92d6db59c4',
  lastChangeTimestamp: '2022-03-23T09:37:36.957695',
  lastChangeName: '6cfec2bd-a73f-4a21-b7ff-dd92d6db59c4',
};


export const historyWithExpandable: Message[] = [
  {
    text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    timestamp: '2021-03-01T12:00:00.000Z',
    fromUser: true,
  },
];


