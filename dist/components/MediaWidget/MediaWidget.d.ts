import { Medium, TranslatedHint } from '@memori.ai/memori-api-client/dist/types';
import React from 'react';
import { Props as MediaItemProps } from './MediaItemWidget';
export interface Props {
    hints?: TranslatedHint[];
    links?: Medium[];
    media?: (Medium & {
        type?: string;
    })[];
    simulateUserPrompt?: (item: string, translatedItem?: string) => void;
    sessionID?: string;
    baseUrl?: string;
    apiUrl?: string;
    translateTo?: string;
    customMediaRenderer?: MediaItemProps['customMediaRenderer'];
    fromUser?: boolean;
}
declare const _default: React.NamedExoticComponent<Props>;
export default _default;
