/// <reference types="react" />
export interface Props {
    visible?: boolean;
    onClose: (birthDate?: string) => void;
    minAge: number;
}
declare const AgeVerificationModal: ({ visible, onClose, minAge }: Props) => JSX.Element;
export default AgeVerificationModal;
