/// <reference types="react" />
import { Tenant } from '@memori.ai/memori-api-client/dist/types';
export interface Props {
    tenant?: Tenant;
    userLang?: string;
    integrationID?: string;
    memoriHash?: string;
}
declare const PoweredBy: ({ tenant, userLang, integrationID, memoriHash, }: Props) => JSX.Element;
export default PoweredBy;
