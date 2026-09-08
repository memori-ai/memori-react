/// <reference types="react" />
interface AvatarViewProps {
    chatEmission: string | null | undefined;
    url: string;
    sex: 'MALE' | 'FEMALE';
    eyeBlink: boolean;
    halfBody: boolean;
    loading: boolean;
    avatarHeight: number;
    avatarDepth: number;
    updateCurrentViseme: (currentTime: number) => {
        name: string;
        weight: number;
    } | null;
    setCameraZ: (cameraZ: number) => void;
    headMovement: boolean;
    speaking: boolean;
    showControls: boolean;
}
export declare const AvatarView: ({ chatEmission, url, sex, eyeBlink, halfBody, loading, avatarHeight, avatarDepth, updateCurrentViseme, setCameraZ, headMovement, showControls, }: AvatarViewProps) => JSX.Element;
declare const _default: import("react").MemoExoticComponent<({ chatEmission, url, sex, eyeBlink, halfBody, loading, avatarHeight, avatarDepth, updateCurrentViseme, setCameraZ, headMovement, showControls, }: AvatarViewProps) => JSX.Element>;
export default _default;
