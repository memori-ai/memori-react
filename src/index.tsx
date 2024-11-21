import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import {
  DialogState,
  Memori as IMemori,
  Tenant,
} from '@memori.ai/memori-api-client/dist/types';
import memoriApiClient from '@memori.ai/memori-api-client';

import MemoriWidget, {
  Props as WidgetProps,
} from './components/MemoriWidget/MemoriWidget';
import { VisemeProvider } from './context/visemeContext';

import { Toaster } from 'react-hot-toast';
import { getTenant } from './helpers/tenant';
import { installMathJax } from './helpers/utils';

import i18n from './i18n';
import { useTranslation } from 'react-i18next';
import I18nWrapper from './I18nWrapper';

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
  showCopyButton?: boolean;
  showTranslationOriginal?: boolean;
  showInstruct?: boolean;
  showInputs?: boolean;
  showDates?: boolean;
  showContextPerLine?: boolean;
  showSettings?: boolean;
  showClear?: boolean;
  showOnlyLastMessages?: boolean;
  showTypingText?: boolean;
  showLogin?: boolean;
  height?: number | string;
  baseURL?: string;
  apiURL?: string;
  engineURL?: string;
  tag?: string;
  pin?: string;
  context?: { [key: string]: string };
  initialQuestion?: string;
  uiLang?: 'en' | 'it' | 'fr' | 'es' | 'de' | 'IT' | 'EN' | 'FR' | 'ES' | 'DE';
  spokenLang?: string;
  multilingual?: boolean;
  authToken?: string;
  enableAudio?: boolean;
  defaultSpeakerActive?: boolean;
  disableTextEnteredEvents?: boolean;
  AZURE_COGNITIVE_SERVICES_TTS_KEY?: string;
  onStateChange?: (state?: DialogState) => void;
  additionalInfo?: WidgetProps['additionalInfo'];
  customMediaRenderer?: WidgetProps['customMediaRenderer'];
  additionalSettings?: WidgetProps['additionalSettings'];
  userAvatar?: WidgetProps['userAvatar'];
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
  showCopyButton = true,
  showTranslationOriginal = false,
  showSettings = true,
  showInstruct = false,
  showTypingText = false,
  showClear = false,
  showOnlyLastMessages = false,
  showInputs = true,
  showDates = false,
  showContextPerLine = false,
  showLogin,
  height = '100%',
  baseURL,
  apiURL = 'https://backend.memori.ai',
  engineURL = 'https://engine.memori.ai',
  tag,
  pin,
  context,
  initialQuestion,
  uiLang,
  spokenLang,
  multilingual,
  authToken,
  AZURE_COGNITIVE_SERVICES_TTS_KEY,
  enableAudio,
  defaultSpeakerActive = true,
  disableTextEnteredEvents = false,
  onStateChange,
  additionalInfo,
  customMediaRenderer,
  additionalSettings,
  userAvatar,
}) => {
  const [memori, setMemori] = useState<IMemori>();
  const [tenant, setTenant] = useState<Tenant>();
  const [speechKey, setSpeechKey] = useState<string | undefined>(
    AZURE_COGNITIVE_SERVICES_TTS_KEY
  );
  const { t } = useTranslation();

  if (!((memoriID && ownerUserID) || (memoriName && ownerUserName))) {
    throw new Error(
      'Identifier pair required: please provide either memoriID and ownerUserID or memoriName and ownerUserName'
    );
  }

  const client = memoriApiClient(apiURL, engineURL);

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
   * Fetches the Tenant data from the backend
   */
  const fetchTenant = useCallback(async () => {
    const tenant = await getTenant(tenantID, baseURL);
    if (tenant) setTenant(tenant);
  }, [tenantID, apiURL]);
  useEffect(() => {
    fetchTenant();
  }, [fetchTenant]);

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

  useEffect(() => {
    installMathJax();
  }, []);

  return (
    <I18nWrapper>
      <VisemeProvider>
        <Toaster position="top-center" reverseOrder={true} />
        {memori ? (
          <MemoriWidget
            layout={layout}
            customLayout={customLayout}
            height={height}
            baseUrl={
              baseURL ||
              (tenantID.startsWith('https://')
                ? tenantID
                : `https://${tenantID}`)
            }
            apiURL={apiURL}
            engineURL={engineURL}
            memori={{
              ...memori,
              secretToken,
            }}
            ownerUserName={ownerUserName ?? memori.ownerUserName}
            ownerUserID={ownerUserID ?? memori.ownerUserID}
            tenantID={tenantID}
            memoriLang={spokenLang ?? memori.culture?.split('-')?.[0]}
            multilingual={multilingual}
            tenant={tenant}
            secret={secretToken}
            sessionID={sessionID}
            showShare={showShare}
            showCopyButton={showCopyButton}
            showTranslationOriginal={showTranslationOriginal}
            showSettings={showSettings}
            showInstruct={showInstruct}
            showTypingText={showTypingText}
            showClear={showClear}
            showOnlyLastMessages={showOnlyLastMessages}
            showInputs={showInputs}
            showDates={showDates}
            showContextPerLine={showContextPerLine}
            showLogin={showLogin ?? memori?.enableDeepThought}
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
            enableAudio={enableAudio}
            defaultSpeakerActive={defaultSpeakerActive}
            disableTextEnteredEvents={disableTextEnteredEvents}
            onStateChange={onStateChange}
            additionalInfo={additionalInfo}
            customMediaRenderer={customMediaRenderer}
            additionalSettings={additionalSettings}
            userAvatar={userAvatar}
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
            <p
              style={{
                textAlign: 'center',
                margin: '2rem auto',
                textTransform: 'capitalize',
              }}
            >
              {t('loading') || 'Loading'}...
            </p>
          </div>
        )}
      </VisemeProvider>
    </I18nWrapper>
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
  layout: PropTypes.oneOf([
    'DEFAULT',
    'FULLPAGE',
    'TOTEM',
    'WEBSITE_ASSISTANT',
    'CHAT',
    'HIDDEN_CHAT',
    'ZOOMED_FULL_BODY',
  ]),
  customLayout: PropTypes.any,
  showShare: PropTypes.bool,
  showCopyButton: PropTypes.bool,
  showTranslationOriginal: PropTypes.bool,
  showInstruct: PropTypes.bool,
  showInputs: PropTypes.bool,
  showDates: PropTypes.bool,
  showContextPerLine: PropTypes.bool,
  showSettings: PropTypes.bool,
  showClear: PropTypes.bool,
  showOnlyLastMessages: PropTypes.bool,
  showTypingText: PropTypes.bool,
  showLogin: PropTypes.bool,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  baseURL: PropTypes.string,
  apiURL: PropTypes.string,
  engineURL: PropTypes.string,
  tag: PropTypes.string,
  pin: PropTypes.string,
  context: PropTypes.objectOf(PropTypes.any),
  initialQuestion: PropTypes.string,
  uiLang: PropTypes.oneOf([
    'en',
    'it',
    'fr',
    'es',
    'de',
    'EN',
    'IT',
    'FR',
    'ES',
    'DE',
  ]),
  spokenLang: PropTypes.string,
  multilingual: PropTypes.bool,
  authToken: PropTypes.string,
  enableAudio: PropTypes.bool,
  defaultSpeakerActive: PropTypes.bool,
  disableTextEnteredEvents: PropTypes.bool,
  AZURE_COGNITIVE_SERVICES_TTS_KEY: PropTypes.string,
  onStateChange: PropTypes.func,
  additionalInfo: PropTypes.objectOf(PropTypes.any),
  customMediaRenderer: PropTypes.func,
  additionalSettings: PropTypes.any,
  userAvatar: PropTypes.oneOfType([PropTypes.string, PropTypes.any]),
};

export default Memori;
