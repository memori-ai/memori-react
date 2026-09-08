export interface ResourceURLParams {
    type?: 'avatar' | 'cover';
    resourceURI?: string;
    sessionID?: string;
    baseURL?: string;
    apiURL?: string;
    tenantID?: string;
}
export declare const getResourceUrl: ({ type, resourceURI, sessionID, baseURL, apiURL, }: ResourceURLParams) => string;
