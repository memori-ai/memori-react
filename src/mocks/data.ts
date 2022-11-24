import {
  Medium,
  Memori,
  Message,
} from '@memori.ai/memori-api-client/dist/types';

export const sessionID = '131165be-9d1a-42fb-a3ce-e8f86d40c88f';

export const memori: Memori = {
  memoriID: '49d74e3a-faca-41ff-a87c-dd649aefe1b2',
  engineMemoriID: '12712c98-cbab-4537-95f5-4cd4bf924161',
  name: 'Memori',
  memoriConfigurationID: 'MemoriCloud-it_IT',
  description: 'Lorem ipsum.',
  voiceType: 'male',
  isGiver: true,
  isReceiver: false,
  privacyType: 'PUBLIC',
  needsPosition: false,
  categories: [],
  publishedInTheMetaverse: true,
  exposed: true,
  contentQualityIndex: 66.6,
  contentQualityIndexTimestamp: '2021-03-01T12:00:00.000Z',
  ownerUserName: 'username',
  ownerTenantName: 'app.twincreator.com',
  ownerUserID: '97c42d18-ffe4-47e1-a3c7-e42729f1e6a3',
  metaverseEnvironment: 'synthwave',
  secretToken: 'awanagana',
  giverPIN: '1234',
  giverTag: '🧑‍💻',
  avatarURL: 'https://api.lorem.space/image/face?hash=0p9vyl1e',
  coverURL: 'https://api.lorem.space/image/pizza?hash=ecz70guu',
};

export const history: Message[] = [
  {
    text: "Ciao, io sono test, c'è qualcosa che vorresti chiedermi?",
  },
  {
    text: 'Prova',
    fromUser: true,
  },
  {
    text:
      "Mi dispiace, le mie risposte sono limitate. Devi farmi le domande giuste. C'è altro che vuoi sapere?",
  },
  {
    text: 'Come faccio a fare delle cose con questa cosa?',
    fromUser: true,
  },
  {
    text: 'Ecco qui delle cose per te.',
    media: [
      {
        mediumID: 'c6851968-5d4d-409a-ae75-f22ec077efcd',
        content: '',
        mimeType: 'text/plain',
        title: 'Properties',
      },
      {
        mediumID: 'aa139b0c-3d78-411a-a4b5-88851208ab9c',
        url: 'https://youtu.be/nFsljT1362s',
        mimeType: 'text/html',
        title: 'Arena di Verona - Nabucco - Va pensiero',
      },
      {
        mediumID: 'aa139b0c-3d78-411a-a4b5-88851208ab9d',
        url: 'https://api.lorem.space/image/game',
        mimeType: 'image/jpeg',
        title: 'Random game poster',
      },
    ],
  },
  {
    text: 'Ah, grazie! Ciao!',
    fromUser: true,
  },
  {
    text: 'Arrivederci.',
  },
];

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
