/// <reference types="react" />
import { KnownFact, Memori } from '@memori.ai/memori-api-client/dist/types';
import memoriApiClient from '@memori.ai/memori-api-client';
export interface Props {
    apiClient: ReturnType<typeof memoriApiClient>;
    sessionID: string;
    memori: Memori;
    initialKnownFacts?: KnownFact[];
    visible?: boolean;
    closeDrawer: () => void;
}
declare const KnownFacts: ({ apiClient, sessionID, memori, visible, initialKnownFacts, closeDrawer, }: Props) => JSX.Element;
export default KnownFacts;
