import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import {
  DialogState,
  Memori as IMemori,
  Tenant,
  Integration,
} from '@memori.ai/memori-api-client/dist/types';
import memoriApiClient from '@memori.ai/memori-api-client';

import MemoriWidget, {
  Props as WidgetProps,
} from './components/MemoriWidget/MemoriWidget';
import { VisemeProvider } from './context/visemeContext';

import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { safeParseJSON } from './helpers/utils';

import i18n from './i18n';
import { useTranslation } from 'react-i18next';
import I18nWrapper from './I18nWrapper';
import { ArtifactProvider } from './components/MemoriArtifactSystem/context/ArtifactContext';

export interface Props {
  memoriName?: string | null;
  memoriID?: string | null;
  ownerUserName?: string | null;
  ownerUserID?: string | null;
  integration?: Integration;
  integrationID?: string;
  tenantID: string;
  secretToken?: string;
  sessionID?: string;
  layout?: WidgetProps['layout'];
  customLayout?: WidgetProps['customLayout'];
  showShare?: boolean;
  showChatHistory?: boolean;
  showCopyButton?: boolean;
  showTranslationOriginal?: boolean;
  showInputs?: boolean;
  showDates?: boolean;
  showContextPerLine?: boolean;
  showSettings?: boolean;
  __WEBCOMPONENT__?: boolean;
  showClear?: boolean;
  showOnlyLastMessages?: boolean;
  showTypingText?: boolean;
  showLogin?: boolean;
  showUpload?: boolean;
  showReasoning?: boolean;
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
  onStateChange?: (state?: DialogState) => void;
  additionalInfo?: WidgetProps['additionalInfo'];
  customMediaRenderer?: WidgetProps['customMediaRenderer'];
  additionalSettings?: WidgetProps['additionalSettings'];
  userAvatar?: WidgetProps['userAvatar'];
  useMathFormatting?: boolean;
  autoStart?: boolean;
  applyVarsToRoot?: boolean;
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

const getParsedContext = (context?: string | null) => {
  if (!context) return {};
  const parsedContext = context?.split(',')?.reduce((acc, cur) => {
    const [key, value] = cur.split(':').map(t => t.trim());
    return { ...acc, [key]: value };
  }, {});
  return parsedContext;
};

const Memori: React.FC<Props> = ({
  ownerUserName,
  ownerUserID,
  memoriName,
  memoriID,
  integration,
  integrationID,
  tenantID,
  secretToken,
  sessionID,
  layout,
  customLayout,
  showShare,
  showCopyButton = true,
  showTranslationOriginal = false,
  showSettings,
  showTypingText = false,
  showClear = false,
  showOnlyLastMessages,
  showInputs = true,
  showDates = false,
  showContextPerLine = false,
  showUpload,
  showLogin,
  showReasoning,
  height = '100%',
  baseURL,
  apiURL = 'https://backend.memori.ai',
  engineURL = 'https://engine.memori.ai',
  tag,
  pin,
  context,
  initialQuestion,
  showChatHistory = true,
  uiLang,
  spokenLang,
  multilingual,
  authToken,
  enableAudio,
  defaultSpeakerActive = true,
  disableTextEnteredEvents = false,
  onStateChange,
  additionalInfo,
  customMediaRenderer,
  additionalSettings,
  userAvatar,
  useMathFormatting = false,
  autoStart,
  applyVarsToRoot = false,
  __WEBCOMPONENT__ = false,
}) => {
  const [memori, setMemori] = useState<IMemori>();
  const [tenant, setTenant] = useState<Tenant>();
  const [provider, setProvider] = useState<string | undefined>();
  const [sessionId, setSessionId] = useState<string | undefined>();

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
    try {
      const result = await fetch(`${url}/api/speechkey?tenant=${tenantID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await result.json();

      if (data.provider) {
        setProvider(data.provider);
      } else {
        console.warn('Provider not found in speech key response');
      }
    } catch (error) {
      console.error('Error fetching speech key:', error);
    }
  }, [baseURL, tenantID]);

  useEffect(() => {
    fetchSpeechKey();
  }, []);

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
        if (!memori.ownerUserID && ownerUserID) {
          memori.ownerUserID = ownerUserID;
        }

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
    const { tenant, ...resp } = await client.backend.tenant.getTenant(tenantID);
    if (tenant && resp.resultCode === 0) setTenant(tenant);
    else console.debug('[TENANT]', resp, tenant);
  }, [tenantID, apiURL]);
  useEffect(() => {
    fetchTenant();
  }, [fetchTenant]);

  useEffect(() => {
    const targetNode =
      document.querySelector(`memori-client[memoriname="${memori?.name}"]`) ||
      document.querySelector(`memori-client[memoriid="${memori?.memoriID}"]`) ||
      document.querySelector('memori-client');
    if (!targetNode) {
      return;
    }

    const config = { attributes: true, childList: false, subtree: false };
    const callback: MutationCallback = (mutationList, _observer) => {
      for (const mutation of mutationList) {
        if (mutation.type === 'attributes') {
          const target =
            mutation.target.nodeName === 'MEMORI-CLIENT'
              ? mutation.target
              : mutation.target.parentElement;
          // @ts-ignore
          const targetSessionId = target.getAttribute('sessionid') || undefined;
          if (target && targetSessionId) {
            setSessionId(targetSessionId);
          }
        }
      }
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    return () => {
      observer.disconnect();
    };
  }, []);

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

  const layoutIntegration =
    integration ??
    memori?.integrations?.find(i =>
      integrationID
        ? i.integrationID === integrationID
        : !!i.publish && i.type === 'LANDING_EXPERIENCE'
    );
  const layoutIntegrationConfig = safeParseJSON(
    layoutIntegration?.customData ?? '{}'
  );

  const whiteListedDomains = [
    tenant?.name,
    ...(tenant?.aliases || []),
    ...(layoutIntegrationConfig.whiteListedDomains || []),
  ];
  if (layoutIntegrationConfig?.whiteListedDomains?.length) {
    // check if we are client side
    if (typeof window !== 'undefined') {
      // check if the current domain is in the whiteListedDomains with Regex
      if (
        !whiteListedDomains.some((domain: string) =>
          new RegExp(domain).test(window.location.hostname)
        )
      ) {
        return null;
      }
    }
  }

  const ignoreClientAttributes =
    layoutIntegrationConfig.ignoreClientAttributes ?? false;

  const clientAttributes = ignoreClientAttributes
    ? {
        initialContextVars: getParsedContext(
          layoutIntegrationConfig.contextVars
        ),
        initialQuestion: layoutIntegrationConfig.initialQuestion as
          | string
          | undefined,
        showLogin: memori?.enableDeepThought,
        memoriLang: memori?.culture?.split('-')?.[0],
        autoStart: layout === 'HIDDEN_CHAT' ? true : layout === 'WEBSITE_ASSISTANT' ? false : autoStart,
      }
    : {
        ...(tag && pin ? { personification: { tag, pin } } : {}),
        multilingual,
        showCopyButton,
        showTranslationOriginal,
        showSettings,
        showChatHistory,
        showShare,
        showTypingText,
        showClear,
        showLogin: showLogin ?? memori?.enableDeepThought,
        showUpload,
        showReasoning,
        showContextPerLine,
        initialContextVars:
          context ?? getParsedContext(layoutIntegrationConfig.contextVars),
        initialQuestion:
          initialQuestion ??
          (layoutIntegrationConfig.initialQuestion as string | undefined),
        autoStart:
          layout === 'WEBSITE_ASSISTANT'
            ? false
            : autoStart !== undefined
            ? autoStart
            : layout === 'HIDDEN_CHAT'
            ? true
            : autoStart,
        enableAudio,
        defaultSpeakerActive,
        useMathFormatting,
        memoriLang: spokenLang ?? memori?.culture?.split('-')?.[0],
      };

  return (
    <I18nWrapper>
      <VisemeProvider>
        <ArtifactProvider>
          <Toaster position="top-center" reverseOrder={true} />
          {memori ? (
            <MemoriWidget
              // General props
              layout={layout}
              customLayout={customLayout}
              height={height}
              baseUrl={
                baseURL ||
                (tenantID.startsWith('https://') ||
                tenantID.startsWith('http://')
                  ? tenantID
                  : `https://${tenantID}`)
              }
              apiURL={apiURL}
              engineURL={engineURL}
              memori={{
                ...memori,
                secretToken,
              }}
              __WEBCOMPONENT__={__WEBCOMPONENT__}
              ownerUserName={ownerUserName ?? memori.ownerUserName}
              ownerUserID={ownerUserID ?? memori.ownerUserID}
              tenant={tenant}
              tenantID={tenantID}
              sessionID={sessionID ?? sessionId}
              secret={secretToken}
              ttsProvider={
                provider ? (provider as 'azure' | 'openai') : 'azure'
              }
              integration={layoutIntegration}
              authToken={authToken}
              onStateChange={onStateChange}
              additionalInfo={additionalInfo}
              customMediaRenderer={customMediaRenderer}
              additionalSettings={additionalSettings}
              userAvatar={userAvatar}
              applyVarsToRoot={applyVarsToRoot}
              disableTextEnteredEvents={disableTextEnteredEvents}
              // From layout, from client if allowed
              {...clientAttributes}
              // Client only
              showOnlyLastMessages={showOnlyLastMessages}
              showInputs={showInputs}
              showDates={showDates}
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
        </ArtifactProvider>
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
  integration: PropTypes.any,
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
  showInputs: PropTypes.bool,
  showDates: PropTypes.bool,
  showContextPerLine: PropTypes.bool,
  showSettings: PropTypes.bool,
  showClear: PropTypes.bool,
  showOnlyLastMessages: PropTypes.bool,
  showTypingText: PropTypes.bool,
  showLogin: PropTypes.bool,
  showUpload: PropTypes.bool,
  showReasoning: PropTypes.bool,
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
  onStateChange: PropTypes.func,
  additionalInfo: PropTypes.objectOf(PropTypes.any),
  customMediaRenderer: PropTypes.func,
  additionalSettings: PropTypes.any,
  userAvatar: PropTypes.oneOfType([PropTypes.string, PropTypes.any]),
  useMathFormatting: PropTypes.bool,
  autoStart: PropTypes.bool,
  applyVarsToRoot: PropTypes.bool,
};
export default Memori;
