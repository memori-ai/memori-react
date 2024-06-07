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
import { Toaster } from 'react-hot-toast';
import { getTenant } from './helpers/tenant';

import i18n from './i18n';
import { I18nextProvider, useTranslation } from 'react-i18next';

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
  tag?: string;
  pin?: string;
  context?: { [key: string]: string };
  initialQuestion?: string;
  uiLang?: 'en' | 'it' | 'IT' | 'EN';
  spokenLang?: string;
  multilingual?: boolean;
  authToken?: string;
  defaultSpeakerActive?: boolean;
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
  tag,
  pin,
  context,
  initialQuestion,
  uiLang,
  spokenLang,
  multilingual,
  authToken,
  AZURE_COGNITIVE_SERVICES_TTS_KEY,
  defaultSpeakerActive = true,
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

  const renderer = memori ? (
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
      tenant={tenant}
      secret={secretToken}
      sessionID={sessionID}
      showShare={showShare}
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
      defaultSpeakerActive={defaultSpeakerActive}
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
  );

  return (
    <I18nextProvider i18n={i18n}>
      <Toaster position="top-center" reverseOrder={true} />
      {renderer}

      <script
        dangerouslySetInnerHTML={{
          __html: `
          MathJax = {
            startup: {
              elements: ['.memori-chat--bubble-content'],
            },
            options: {
              processHtmlClass: 'memori-chat--bubble-content',
            },
            tex: {
              inlineMath: [['$', '$'], ['\\$', '\\$'], ['(',')'], ['\(','\)'], ['\[', '\]'], ['[', ']'], ['\\(', '\\)'], ['\\[', '\\]'], ['((','))']],
              displayMath: [['$$', '$$'], ['\\[[', '\\]]']],
              processEscapes: true,
            },
            asciimath: {
              fixphi: true,
              displaystyle: true,
              decimalsign: '.'
            },
            skipStartupTypeset: true,
            chtml: {
              displayAlign: 'left',
            },
            svg: {
              fontCache: 'global'
            }
          };
        `,
        }}
      />
      <script
        id="MathJax-script"
        async
        src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
      ></script>
    </I18nextProvider>
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
  ]),
  customLayout: PropTypes.any,
  showShare: PropTypes.bool,
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
  tag: PropTypes.string,
  pin: PropTypes.string,
  context: PropTypes.objectOf(PropTypes.any),
  initialQuestion: PropTypes.string,
  uiLang: PropTypes.oneOf(['en', 'it', 'EN', 'IT']),
  spokenLang: PropTypes.string,
  multilingual: PropTypes.bool,
  authToken: PropTypes.string,
  AZURE_COGNITIVE_SERVICES_TTS_KEY: PropTypes.string,
  defaultSpeakerActive: PropTypes.bool,
  onStateChange: PropTypes.func,
  additionalInfo: PropTypes.objectOf(PropTypes.any),
  customMediaRenderer: PropTypes.func,
  additionalSettings: PropTypes.any,
  userAvatar: PropTypes.oneOfType([PropTypes.string, PropTypes.any]),
};

export default Memori;
