import { CSSProperties } from 'react';
import React from 'react';
export interface Props {
    url: string;
    sex: 'MALE' | 'FEMALE';
    fallbackImg?: string;
    eyeBlink?: boolean;
    headMovement?: boolean;
    rotateAvatar?: boolean;
    speaking?: boolean;
    style?: CSSProperties;
    fallback?: React.ReactNode;
    halfBody?: boolean;
    loading?: boolean;
    animation?: string;
    showControls?: boolean;
    isZoomed?: boolean;
    chatEmission?: any;
    enablePositionControls?: boolean;
    setEnablePositionControls: (value: boolean) => void;
    isTotem?: boolean;
    setMeshRef?: any;
    stopProcessing: () => void;
    resetVisemeQueue: () => void;
    updateCurrentViseme: (currentTime: number) => {
        name: string;
        weight: number;
    } | null;
}
export default function ContainerAvatarView({ url, sex, style, rotateAvatar, eyeBlink, headMovement, speaking, fallback, fallbackImg, halfBody, loading, showControls, isZoomed, chatEmission, updateCurrentViseme, enablePositionControls, setEnablePositionControls, isTotem, }: Props): JSX.Element;
