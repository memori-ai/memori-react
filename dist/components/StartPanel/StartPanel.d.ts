import { Memori as MemoriOriginal, Tenant, Venue, User } from '@memori.ai/memori-api-client/src/types';
import React from 'react';
import { Props as CPSProps } from '../CompletionProviderStatus/CompletionProviderStatus';
interface Memori extends MemoriOriginal {
    requireLoginToken?: boolean;
}
export interface Props {
    memori: Memori;
    tenant?: Tenant;
    language?: string;
    userLang?: string;
    setUserLang: (lang: string) => void;
    baseUrl?: string;
    apiUrl?: string;
    position?: Venue;
    openPositionDrawer: () => void;
    integrationConfig?: {
        [key: string]: any;
    };
    instruct?: boolean;
    sessionId?: string;
    hasInitialSession?: boolean;
    clickedStart?: boolean;
    onClickStart?: () => void;
    initializeTTS?: () => void;
    _TEST_forceProviderStatus?: CPSProps['forceStatus'];
    isUserLoggedIn?: boolean;
    user?: User;
    showLogin?: boolean;
    setShowLoginDrawer: (show: boolean) => void;
    notEnoughCredits?: boolean;
    isMultilanguageEnabled?: boolean | undefined;
}
declare const StartPanel: React.FC<Props>;
export default StartPanel;
