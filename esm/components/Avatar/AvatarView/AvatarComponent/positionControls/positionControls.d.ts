/// <reference types="react" />
interface PositionControlsProps {
    avatarHeight: number;
    avatarDepth: number;
    halfBody: boolean;
    setAvatarHeight: (value: number) => void;
    setAvatarDepth: (value: number) => void;
    setEnablePositionControls: (value: boolean) => void;
}
declare const PositionControls: React.FC<PositionControlsProps>;
export default PositionControls;
