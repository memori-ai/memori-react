/// <reference types="react" />
import { User, Tenant } from '@memori.ai/memori-api-client/dist/types';
import memoriApiClient from '@memori.ai/memori-api-client';
export interface Props {
    open?: boolean;
    onClose: () => void;
    user?: User;
    loginToken?: string;
    onLogin: (user: User, token: string) => void;
    onLogout: () => void;
    tenant: Tenant;
    apiClient: ReturnType<typeof memoriApiClient>;
    __TEST__signup?: boolean;
    __TEST__needMissingData?: boolean;
    setUser: (user: User) => void;
    drawerClassName?: string;
}
declare const LoginDrawer: ({ open, onClose, onLogin, user, loginToken, setUser, tenant, apiClient, __TEST__signup, __TEST__needMissingData, drawerClassName, }: Props) => JSX.Element;
export default LoginDrawer;
