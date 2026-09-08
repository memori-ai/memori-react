/// <reference types="react" />
import { Props as WidgetProps } from '../MemoriWidget/MemoriWidget';
export interface Props {
    open: boolean;
    layout?: WidgetProps['layout'];
    onClose: () => void;
    microphoneMode?: 'HOLD_TO_TALK' | 'CONTINUOUS';
    continuousSpeechTimeout?: number;
    setMicrophoneMode: (value: 'HOLD_TO_TALK' | 'CONTINUOUS') => void;
    setContinuousSpeechTimeout: (value: number) => void;
    controlsPosition?: 'center' | 'bottom';
    setControlsPosition: (value: 'center' | 'bottom') => void;
    hideEmissions?: boolean;
    setHideEmissions: (value: boolean) => void;
    additionalSettings?: WidgetProps['additionalSettings'];
    avatarType?: 'blob' | 'avatar3d' | null;
    setAvatarType: (value: 'blob' | 'avatar3d' | null) => void;
    enablePositionControls?: boolean;
    setEnablePositionControls: (value: boolean) => void;
    isAvatar3d?: boolean;
    speakerMuted?: boolean;
}
declare const SettingsDrawer: ({ open, layout, onClose, controlsPosition, setControlsPosition, hideEmissions, setHideEmissions, additionalSettings, avatarType, setAvatarType, enablePositionControls, setEnablePositionControls, isAvatar3d, }: Props) => JSX.Element;
export default SettingsDrawer;
