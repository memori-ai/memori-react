/// <reference types="react" />
import { SearchMatches, Message } from '@memori.ai/memori-api-client/dist/types';
import memoriApiClient from '@memori.ai/memori-api-client';
export interface Props {
    sessionID: string;
    message: Message;
    initialMatches?: SearchMatches[];
    visible?: boolean;
    closeDrawer: () => void;
    client?: ReturnType<typeof memoriApiClient>;
    _TEST_loading?: boolean;
}
declare const WhyThisAnswer: ({ message, sessionID, visible, initialMatches, closeDrawer, client, _TEST_loading, }: Props) => JSX.Element;
export default WhyThisAnswer;
