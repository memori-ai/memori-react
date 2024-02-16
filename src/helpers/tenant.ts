import { Tenant } from '@memori.ai/memori-api-client/dist/types';

const defaultTenant: Tenant = {
  id: 'aisuru.com',
  theme: 'aisuru',
  config: {
    name: 'Memori',
    showNewUser: false,
    requirePosition: false,
  },
};

export const getTenant = async (
  tenantID: string,
  baseURL?: string
): Promise<Tenant> => {
  const apiBaseUrl = baseURL
    ? new URL(
        `${
          baseURL.startsWith('http')
            ? ''
            : baseURL.includes('localhost')
            ? 'http://'
            : 'https://'
        }${baseURL}`
      ).origin
    : 'https://aisuru.com';

  try {
    const response = await fetch(`${apiBaseUrl}/api/tenant/${tenantID}`);
    const { tenant } = await response.json();

    if (!tenant) {
      return {
        ...defaultTenant,
        tenantID,
      };
    }

    return tenant;
  } catch (error) {
    return {
      ...defaultTenant,
      tenantID,
    };
  }
};
