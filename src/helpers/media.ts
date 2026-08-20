export interface ResourceURLParams {
  type?: 'avatar' | 'cover';
  resourceURI?: string;
  sessionID?: string;
  baseURL?: string;
  apiURL?: string;
  tenantID?: string;
}

/**
 * Whether this HTTP(S) URL should get a session ID appended for auth.
 * Matches Memori asset API paths on any host, known Memori/AIsuru hosts,
 * and the configured API host — instead of a hard hostname allowlist only.
 */
const shouldAppendSessionId = (
  resourceURI: string,
  apiURL?: string
): boolean => {
  const url = new URL(resourceURI);
  const { hostname, pathname } = url;

  // Memori asset endpoints require session auth regardless of host
  // (e.g. backend-ws-bologna.aisuru.ai/api/v2/asset/…)
  if (/\/api\/v\d+\/asset\//i.test(pathname)) {
    return true;
  }

  if (apiURL) {
    try {
      if (new URL(apiURL).hostname === hostname) {
        return true;
      }
    } catch {
      // ignore invalid apiURL
    }
  }

  return false;
};

export const getResourceUrl = ({
  type,
  resourceURI,
  sessionID,
  baseURL = '',
  apiURL = '',
}: ResourceURLParams): string => {
  let defaultUri =
    type === 'cover'
      ? `${baseURL}/images/memoriCover.png`
      : `${baseURL}/images/memoriAvatar.png?v=20231208`;

  try {
    if (!resourceURI || resourceURI.length === 0) {
      return defaultUri;
    } else if (
      resourceURI.includes('memoriai/memory') &&
      !resourceURI.includes('memori-ai-session-id') &&
      sessionID
    ) {
      return `${resourceURI}?memori-ai-session-id=${sessionID}`;
    } else if (
      (resourceURI.startsWith('https://') ||
        resourceURI.startsWith('http://')) &&
      shouldAppendSessionId(resourceURI, apiURL)
    ) {
      return `${resourceURI}${resourceURI.endsWith('/') || !sessionID ? '' : '/'
        }${sessionID || ''}`;
    } else if (resourceURI.startsWith('cloud://')) {
      return `${apiURL?.replace(/v2/, 'v1') || ''
        }/CloudAsset/${resourceURI.replace('cloud://', '')}`;
    } else if (resourceURI.startsWith('guid://')) {
      return `${apiURL?.replace(/v2/, 'v1') || ''
        }/GuidAsset/${resourceURI.replace('guid://', '')}`;
    } else {
      return resourceURI || defaultUri;
    }
  } catch (e) {
    return resourceURI || defaultUri;
  }
};
