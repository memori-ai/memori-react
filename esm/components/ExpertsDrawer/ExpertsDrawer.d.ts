/// <reference types="react" />
import { ExpertReference, Tenant } from '@memori.ai/memori-api-client/dist/types';
export interface Props {
    experts: ExpertReference[];
    baseUrl: string;
    apiUrl: string;
    tenant?: Tenant;
    open?: boolean;
    onClose: () => void;
}
declare const ExpertsDrawer: ({ open, baseUrl, apiUrl, tenant, experts, onClose, }: Props) => JSX.Element;
export default ExpertsDrawer;
