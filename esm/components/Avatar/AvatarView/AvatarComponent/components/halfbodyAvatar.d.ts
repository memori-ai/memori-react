/// <reference types="react" />
interface HalfBodyAvatarProps {
    url: string;
    updateCurrentViseme: (currentTime: number) => any;
    eyeBlink?: boolean;
    avatarHeight: number;
    avatarDepth: number;
    onLoaded?: () => void;
    onCameraZChange: (value: number) => void;
    headMovement?: boolean;
    chatEmission?: any;
    loading?: boolean;
}
export default function HalfBodyAvatar({ url, updateCurrentViseme, eyeBlink, avatarHeight, avatarDepth, headMovement, onLoaded, onCameraZChange, chatEmission, loading, }: HalfBodyAvatarProps): JSX.Element;
export {};
