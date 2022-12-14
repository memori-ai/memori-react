export interface ResourceURLParams {
  type?: 'avatar' | 'cover';
  resourceURI?: string;
  sessionID?: string;
  baseURL?: string;
  tenantID?: string;
}
export const getResourceUrl = ({
  type,
  resourceURI,
  sessionID,
  baseURL = '',
}: ResourceURLParams): string => {
  let defaultUri =
    type === 'cover'
      ? `${baseURL}/images/memoriCover.png`
      : `${baseURL}/images/memoriAvatar.png`;
  if (!resourceURI || resourceURI.length === 0) {
    return defaultUri;
  } else if (
    resourceURI.includes('memoriai/memory') &&
    !resourceURI.includes('memori-ai-session-id') &&
    sessionID
  ) {
    return `${resourceURI}?memori-ai-session-id=${sessionID}`;
  } else if (
    resourceURI.startsWith('https://') ||
    resourceURI.startsWith('http://')
  ) {
    return `${resourceURI}${sessionID ? `/${sessionID}` : ''}`;
  } else if (resourceURI.startsWith('cloud://')) {
    return `${process.env.NEXT_PUBLIC_API_URL?.replace(/v2/, 'v1') ||
      ''}/CloudAsset/${resourceURI.replace('cloud://', '')}`;
  } else if (resourceURI.startsWith('guid://')) {
    return `${process.env.NEXT_PUBLIC_API_URL?.replace(/v2/, 'v1') ||
      ''}/GuidAsset/${resourceURI.replace('guid://', '')}`;
  } else {
    return defaultUri;
  }
};
