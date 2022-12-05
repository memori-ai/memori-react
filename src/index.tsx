import React, { useState, useEffect, useCallback } from 'react';
import {
  Memori as IMemori,
  Tenant,
} from '@memori.ai/memori-api-client/dist/types';
import memoriApiClient from '@memori.ai/memori-api-client';
import MemoriWidget from './components/MemoriWidget/MemoriWidget';

import { i18n } from './i18n';
import { useTranslation } from 'react-i18next';

export interface Props {
  memoriName?: string | null;
  memoriID?: string | null;
  ownerUserName?: string | null;
  ownerUserID?: string | null;
  integrationID?: string;
  tenantID: string;
  secretToken?: string;
  showShare?: boolean;
  showSettings?: boolean;
  baseURL?: string;
  apiURL?: string;
  tag?: string;
  pin?: string;
  showInstruct?: boolean;
  context?: { [key: string]: string };
  initialQuestion?: string;
  uiLang?: 'en' | 'it';
  spokenLang?: string;
  AZURE_COGNITIVE_SERVICES_TTS_KEY?: string;
}

const getPreferredLanguages = () => {
  const browserLanguage = navigator.language;
  if (browserLanguage) {
    let lng = browserLanguage.split('-')[0];
    if (['en', 'it'].includes(lng)) {
      return {
        lng,
        fallbackLng: lng === 'en' ? 'it' : 'en',
      };
    }
  }
  return {
    lng: 'en',
    fallbackLng: 'it',
  };
};

const Memori: React.FC<Props> = ({
  ownerUserName,
  ownerUserID,
  memoriName,
  memoriID,
  integrationID,
  tenantID,
  secretToken,
  showShare = true,
  showSettings = false,
  baseURL = 'https://app.twincreator.com',
  apiURL = 'https://backend.memori.ai',
  tag,
  pin,
  showInstruct = false,
  context,
  initialQuestion,
  uiLang,
  spokenLang,
  AZURE_COGNITIVE_SERVICES_TTS_KEY,
}) => {
  const [memori, setMemori] = useState<IMemori>();
  const [tenant, setTenant] = useState<Tenant>();
  const { t } = useTranslation();

  if (!((memoriID && ownerUserID) || (memoriName && ownerUserName))) {
    throw new Error(
      'Identifier pair required: please provide either memoriID and ownerUserID or memoriName and ownerUserName'
    );
  }

  const client = memoriApiClient(apiURL);

  /**
   * Fetches the tenant data from the backend
   */
  const fetchTenant = useCallback(async () => {
    const { tenant, ...resp } = await client.backend.getTenantConfig(tenantID);
    if (resp.resultCode === 0 && tenant) {
      setTenant(tenant);
    } else {
      throw new Error('Tenant not found');
    }
  }, [client.backend, tenantID]);
  useEffect(() => {
    fetchTenant();
  }, [client.backend, fetchTenant]);

  /**
   * Fetches the Memori data from the backend
   */
  const fetchMemori = useCallback(async () => {
    if (!tenant?.id) return;
    if (memoriID && ownerUserID) {
      const { memori, ...resp } = await client.backend.getMemoriByUserAndId(
        tenant.id,
        ownerUserID,
        memoriID
      );

      if (resp.resultCode === 0 && !!memori) {
        setMemori(memori);
      } else {
        console.error('[MEMORI]', resp, memori);
      }
    } else if (memoriName && ownerUserName) {
      const { memori, ...resp } = await client.backend.getMemori(
        tenant.id,
        ownerUserName,
        memoriName
      );

      if (resp.resultCode === 0 && !!memori) {
        setMemori(memori);
      } else {
        console.error('[MEMORI]', resp, memori);
      }
    }
  }, [
    client.backend,
    memoriID,
    ownerUserID,
    memoriName,
    ownerUserName,
    tenant,
  ]);
  useEffect(() => {
    fetchMemori();
  }, [client.backend, fetchMemori, tenant]);

  /**
   * Sets the language in the i18n instance
   */
  useEffect(() => {
    if (uiLang) {
      // @ts-ignore
      i18n.changeLanguage(uiLang.toLowerCase());
    } else {
      const { lng, fallbackLng } = getPreferredLanguages();
      // @ts-ignore
      i18n.changeLanguage(lng).catch(() => {
        // @ts-ignore
        i18n.changeLanguage(fallbackLng);
      });
    }
  }, [uiLang]);

  return memori ? (
    <MemoriWidget
      embed
      baseUrl={baseURL}
      apiUrl={apiURL}
      memori={{
        ...memori,
        secretToken,
      }}
      memoriLang={spokenLang ?? memori.culture?.split('-')?.[0]}
      tenant={tenant}
      showShare={showShare}
      showSettings={showSettings}
      showInstruct={showInstruct}
      integration={memori?.integrations?.find(i =>
        integrationID
          ? i.integrationID === integrationID
          : !!i.publish && i.type === 'LANDING_EXPERIENCE'
      )}
      initialContextVars={context}
      initialQuestion={initialQuestion}
      AZURE_COGNITIVE_SERVICES_TTS_KEY={AZURE_COGNITIVE_SERVICES_TTS_KEY}
      {...(tag && pin ? { personification: { tag, pin } } : {})}
    />
  ) : (
    <div>
      <p style={{ textAlign: 'center', margin: '2rem 0' }}>{t('loading')}...</p>
    </div>
  );
};

export default Memori;
