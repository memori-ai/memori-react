/// <reference types="react" />
import { Props as ChatInputProps } from '../ChatInputs/ChatInputs';
export interface Props {
    listening?: ChatInputProps['listening'];
    stopAudio: ChatInputProps['stopAudio'];
    startListening: ChatInputProps['startListening'];
    stopListening: ChatInputProps['stopListening'];
}
declare const MicrophoneButton: ({ listening, stopAudio, startListening, stopListening, }: Props) => JSX.Element;
export default MicrophoneButton;
