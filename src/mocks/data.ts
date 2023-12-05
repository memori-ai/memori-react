import {
  Medium,
  Memori,
  Message,
  Integration,
  Tenant,
  DialogState,
} from '@memori.ai/memori-api-client/dist/types';

export const sessionID = '131165be-9d1a-42fb-a3ce-e8f86d40c88f';

export const tenant: Tenant = {
  adminCount: 3,
  config: {
    feedbackURL:
      'https://form.asana.com/?k=XC7S3JWQeIhnjipBuA3gbw&d=1199599736247413',
    name: 'TwinCreator',
    requirePosition: false,
    showNewUser: true,
  },
  creationTimestamp: '2023-05-31T14:32:48.885287Z',
  description: 'TwinCreator',
  disableRegistration: false,
  id: 'app.twincreator.com',
  lastChangeTimestamp: '2023-05-31T14:32:48.885287Z',
  logoURL: 'https://app.twincreator.com/images/twincreator/logo.png',
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
  name: 'app.twincreator.com',
  nonFreeSessionCost: 0.02,
  paying: true,
  tenantID: '96caa4b4-31a4-48e5-8163-dec61869a2a7',
  theme: 'twincreator',
  userCount: 0,
  usersCanAccessAPI: false,
  usersCanCreateMemori: false,
  usersCanEditDynamicIntents: false,
  usersCanEditIntegrations: false,
  usersCanEditMemoriChaining: false,
  usersCanRunSnippets: false,
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
  ownerTenantName: 'app.twincreator.com',
  ownerUserID: '97c42d18-ffe4-47e1-a3c7-e42729f1e6a3',
  metaverseEnvironment: 'synthwave',
  secretToken: 'awanagana',
  giverPIN: '1234',
  giverTag: '🧑‍💻',
  avatarURL: 'https://app.twincreator.com/images/twincreator/square_logo.png',
  coverURL: 'https://app.twincreator.com/images/twincreator/og-image.png',
};

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
