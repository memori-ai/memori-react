import { Message } from '@memori.ai/memori-api-client/dist/types';
export declare const initMemoriArtifactAPI: () => void;
export declare const ArtifactAPIBridge: ({ pushMessage, }: {
    pushMessage: (message: Message) => void;
}) => null;
