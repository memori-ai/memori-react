/// <reference types="react" />
export interface Props {
    pwdOrTokens: null | 'password' | 'tokens';
    setPwdOrTokens: (state: null | 'password' | 'tokens') => void;
    onFinish?: (values: AuthInputs) => Promise<void>;
    minimumNumberOfRecoveryTokens?: number;
    showTokens?: boolean;
    withModal?: boolean;
    openModal?: boolean;
}
type AuthInputs = {
    password?: string;
    tokens?: string[];
};
export declare const AuthWidget: ({ pwdOrTokens, setPwdOrTokens, onFinish, minimumNumberOfRecoveryTokens, showTokens, openModal, withModal, }: Props) => JSX.Element;
export default AuthWidget;
