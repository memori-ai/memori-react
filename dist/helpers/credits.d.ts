export type CreditsOperation = 'twin_creation' | 'session_creation' | 'import_document' | 'dt_session_creation';
export declare const getCredits: ({ operation, baseUrl, userID, userName, tenant, characters, }: {
    operation?: CreditsOperation | undefined;
    baseUrl: string;
    userID?: string | null | undefined;
    userName?: string | null | undefined;
    tenant: string;
    characters?: number | undefined;
}) => Promise<{
    enough: boolean;
    required: number;
    tokens?: number;
}>;
