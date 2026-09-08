import React from 'react';
import { Tenant, Memori, Message } from '@memori.ai/memori-api-client/dist/types';
export interface Props {
    tenant?: Tenant;
    memori?: Memori;
    sessionID?: string;
    url?: string;
    title?: string;
    className?: string;
    primary?: boolean;
    baseUrl?: string;
    showQrCode?: boolean;
    align?: 'left' | 'right';
    history?: Message[];
}
declare const ShareButton: React.FC<Props>;
export default ShareButton;
