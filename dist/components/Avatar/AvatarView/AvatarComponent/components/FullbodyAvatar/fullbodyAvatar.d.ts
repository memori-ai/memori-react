/// <reference types="react" />
import { AvatarAnimator } from '../controllers/AvatarAnimator';
export interface FullbodyAvatarProps {
    url: string;
    sex: 'MALE' | 'FEMALE';
    eyeBlink: boolean;
    updateCurrentViseme: (currentTime: number) => {
        name: string;
        weight: number;
    } | null;
    avatarHeight?: number;
    avatarDepth?: number;
    onCameraZChange?: (value: number) => void;
    chatEmission: any;
    loading: boolean;
    setAnimatorRef?: (animator: AvatarAnimator | null) => void;
}
export declare function FullbodyAvatar({ url, sex, eyeBlink, updateCurrentViseme, avatarHeight, avatarDepth, onCameraZChange, chatEmission, loading, setAnimatorRef, }: FullbodyAvatarProps): JSX.Element;
