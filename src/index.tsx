import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  DialogState,
  Memori as IMemori,
} from '@memori.ai/memori-api-client/dist/types';
import memoriApiClient from '@memori.ai/memori-api-client';
import MemoriWidget, {
  Props as WidgetProps,
} from './components/MemoriWidget/MemoriWidget';

import i18n from './i18n';
import { useTranslation } from 'react-i18next';

export interface Props {
  memoriName?: string | null;
  memoriID?: string | null;
  ownerUserName?: string | null;
  ownerUserID?: string | null;
  integrationID?: string;
  tenantID: string;
  secretToken?: string;
  sessionID?: string;
  layout?: WidgetProps['layout'];
  customLayout?: WidgetProps['customLayout'];
  showShare?: boolean;
  showSettings?: boolean;
  showInstruct?: boolean;
  showTypingText?: boolean;
  height?: number | string;
  baseURL?: string;
  apiURL?: string;
  tag?: string;
  pin?: string;
  context?: { [key: string]: string };
  initialQuestion?: string;
  uiLang?: 'en' | 'it';
  spokenLang?: string;
  multilingual?: boolean;
  authToken?: string;
  AZURE_COGNITIVE_SERVICES_TTS_KEY?: string;
  onStateChange?: (state?: DialogState) => void;
  additionalInfo?: WidgetProps['additionalInfo'];
  customMediaRenderer?: WidgetProps['customMediaRenderer'];
  additionalSettings?: WidgetProps['additionalSettings'];
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
  sessionID,
  layout = 'DEFAULT',
  customLayout,
  showShare = true,
  showSettings = true,
  showInstruct = false,
  showTypingText = false,
  height = '100%',
  baseURL,
  apiURL = 'https://backend.memori.ai',
  tag,
  pin,
  context,
  initialQuestion,
  uiLang,
  spokenLang,
  multilingual,
  authToken,
  AZURE_COGNITIVE_SERVICES_TTS_KEY,
  onStateChange,
  additionalInfo,
  customMediaRenderer,
  additionalSettings,
}) => {
  const [memori, setMemori] = useState<IMemori>();
  const [speechKey, setSpeechKey] = useState<string | undefined>(
    AZURE_COGNITIVE_SERVICES_TTS_KEY
  );
  const { t } = useTranslation();

  if (!((memoriID && ownerUserID) || (memoriName && ownerUserName))) {
    throw new Error(
      'Identifier pair required: please provide either memoriID and ownerUserID or memoriName and ownerUserName'
    );
  }

  const client = memoriApiClient(apiURL);

  const fetchSpeechKey = useCallback(async () => {
    const url =
      baseURL ||
      (tenantID.startsWith('https://') ? tenantID : `https://${tenantID}`);
    const result = await fetch(`${url}/api/speechkey`);
    const data = await result.json();

    if (data.AZURE_COGNITIVE_SERVICES_TTS_KEY) {
      setSpeechKey(data.AZURE_COGNITIVE_SERVICES_TTS_KEY);
    }
  }, []);
  useEffect(() => {
    if (!AZURE_COGNITIVE_SERVICES_TTS_KEY) {
      fetchSpeechKey();
    }
  }, [AZURE_COGNITIVE_SERVICES_TTS_KEY]);

  /**
   * Fetches the Memori data from the backend
   */
  const fetchMemori = useCallback(async () => {
    if (memoriID && ownerUserID) {
      const { memori, ...resp } = await client.backend.getMemoriByUserAndId(
        tenantID,
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
        tenantID,
        ownerUserName,
        memoriName
      );

      if (resp.resultCode === 0 && !!memori) {
        setMemori(memori);
      } else {
        console.error('[MEMORI]', resp, memori);
      }
    }
  }, [memoriID, ownerUserID, memoriName, ownerUserName, tenantID]);
  useEffect(() => {
    fetchMemori();
  }, [fetchMemori, tenantID]);

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
      layout={layout}
      customLayout={customLayout}
      height={height}
      baseUrl={
        baseURL ||
        (tenantID.startsWith('https://') ? tenantID : `https://${tenantID}`)
      }
      apiUrl={apiURL}
      memori={{
        ...memori,
        secretToken,
      }}
      memoriLang={spokenLang ?? memori.culture?.split('-')?.[0]}
      multilingual={multilingual}
      tenant={{
        id: tenantID,
        theme: 'twincreator',
        config: {
          name: tenantID,
          showNewUser: false,
          requirePosition: !!memori.needsPosition,
        },
      }}
      secret={secretToken}
      sessionID={sessionID}
      showShare={showShare}
      showSettings={showSettings}
      showInstruct={showInstruct}
      showTypingText={showTypingText}
      integration={memori?.integrations?.find(i =>
        integrationID
          ? i.integrationID === integrationID
          : !!i.publish && i.type === 'LANDING_EXPERIENCE'
      )}
      initialContextVars={context}
      initialQuestion={initialQuestion}
      authToken={authToken}
      AZURE_COGNITIVE_SERVICES_TTS_KEY={
        speechKey || AZURE_COGNITIVE_SERVICES_TTS_KEY
      }
      onStateChange={onStateChange}
      additionalInfo={additionalInfo}
      customMediaRenderer={customMediaRenderer}
      additionalSettings={additionalSettings}
      {...(tag && pin ? { personification: { tag, pin } } : {})}
    />
  ) : (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <p style={{ textAlign: 'center', margin: '2rem auto' }}>
        {t('loading')}...
      </p>
    </div>
  );
};

Memori.propTypes = {
  memoriName: PropTypes.string,
  memoriID: PropTypes.string,
  ownerUserName: PropTypes.string,
  ownerUserID: PropTypes.string,
  integrationID: PropTypes.string,
  tenantID: PropTypes.string.isRequired,
  secretToken: PropTypes.string,
  sessionID: PropTypes.string,
  showShare: PropTypes.bool,
  showSettings: PropTypes.bool,
  showInstruct: PropTypes.bool,
  layout: PropTypes.oneOf(['DEFAULT', 'FULLPAGE', 'TOTEM', 'CHAT']),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  baseURL: PropTypes.string,
  apiURL: PropTypes.string,
  tag: PropTypes.string,
  pin: PropTypes.string,
  context: PropTypes.objectOf(PropTypes.any),
  initialQuestion: PropTypes.string,
  uiLang: PropTypes.oneOf(['en', 'it']),
  spokenLang: PropTypes.string,
  authToken: PropTypes.string,
  AZURE_COGNITIVE_SERVICES_TTS_KEY: PropTypes.string,
  onStateChange: PropTypes.func,
};

export default Memori;
