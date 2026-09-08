import React from 'react';
import { Integration, Memori, Tenant } from '@memori.ai/memori-api-client/dist/types';
export interface Props {
    memori: Memori;
    integration?: Integration;
    integrationConfig?: {
        [key: string]: any;
    };
    tenant?: Tenant;
    instruct?: boolean;
    hasUserActivatedSpeak?: boolean;
    avatar3dVisible?: boolean;
    setAvatar3dVisible: (visible: boolean) => void;
    isPlayingAudio?: boolean;
    loading?: boolean;
    baseUrl?: string;
    apiUrl?: string;
    animation?: string;
    isZoomed?: boolean;
    chatProps?: any;
    enablePositionControls?: boolean;
    setEnablePositionControls: (value: boolean) => void;
    avatarType?: 'blob' | 'avatar3d' | null;
    isTotem?: boolean;
}
declare const _default: React.NamedExoticComponent<Props>;
export default _default;
