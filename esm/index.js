import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import memoriApiClient from '@memori.ai/memori-api-client';
import MemoriWidget from './components/MemoriWidget/MemoriWidget';
import { VisemeProvider } from './context/visemeContext';
import { Toaster } from 'react-hot-toast';
import { safeParseJSON } from './helpers/utils';
import i18n from './i18n';
import { useTranslation } from 'react-i18next';
import I18nWrapper from './I18nWrapper';
import { ArtifactProvider } from './components/MemoriArtifactSystem/context/ArtifactContext';
import { version } from './version';
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
const getParsedContext = (context) => {
    var _a;
    if (!context)
        return {};
    const parsedContext = (_a = context === null || context === void 0 ? void 0 : context.split(',')) === null || _a === void 0 ? void 0 : _a.reduce((acc, cur) => {
        const [key, value] = cur.split(':').map(t => t.trim());
        return { ...acc, [key]: value };
    }, {});
    return parsedContext;
};
const Memori = ({ ownerUserName, ownerUserID, memoriName, memoriID, integration, integrationID, tenantID, secretToken, sessionID, layout, customLayout, showShare, showCopyButton = true, showTranslationOriginal = false, showSettings, showTypingText = false, showClear = false, showOnlyLastMessages, showInputs = true, showDates = false, showContextPerLine = false, showMessageConsumption = false, showUpload, showLogin, showReasoning, avatar3dHidden, height = '100%', baseURL, apiURL = 'https://backend.memori.ai', engineURL = 'https://engine.memori.ai', tag, pin, context, initialQuestion, showChatHistory = true, uiLang, spokenLang, multilingual, authToken, enableAudio, defaultSpeakerActive = true, disableTextEnteredEvents = false, onStateChange, additionalInfo, customMediaRenderer, additionalSettings, userAvatar, useMathFormatting = false, autoStart, applyVarsToRoot = false, __WEBCOMPONENT__ = false, maxTotalMessagePayload, maxTextareaCharacters, }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const [memori, setMemori] = useState();
    const [tenant, setTenant] = useState();
    const [provider, setProvider] = useState();
    const [sessionId, setSessionId] = useState();
    const { t } = useTranslation();
    if (!((memoriID && ownerUserID) || (memoriName && ownerUserName))) {
        throw new Error('Identifier pair required: please provide either memoriID and ownerUserID or memoriName and ownerUserName');
    }
    const client = memoriApiClient(apiURL, engineURL);
    const fetchSpeechKey = useCallback(async () => {
        const url = baseURL ||
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
            }
            else {
                console.warn('Provider not found in speech key response');
            }
        }
        catch (error) {
            console.error('Error fetching speech key:', error);
        }
    }, [baseURL, tenantID]);
    useEffect(() => {
        fetchSpeechKey();
    }, []);
    const fetchMemori = useCallback(async () => {
        if (memoriID && ownerUserID) {
            const { memori, ...resp } = await client.backend.getMemoriByUserAndId(tenantID, ownerUserID, memoriID);
            if (resp.resultCode === 0 && !!memori) {
                setMemori(memori);
            }
            else {
                console.error('[MEMORI]', resp, memori);
            }
        }
        else if (memoriName && ownerUserName) {
            const { memori, ...resp } = await client.backend.getMemori(tenantID, ownerUserName, memoriName);
            if (resp.resultCode === 0 && !!memori) {
                if (!memori.ownerUserID && ownerUserID) {
                    memori.ownerUserID = ownerUserID;
                }
                setMemori(memori);
            }
            else {
                console.error('[MEMORI]', resp, memori);
            }
        }
    }, [memoriID, ownerUserID, memoriName, ownerUserName, tenantID]);
    useEffect(() => {
        fetchMemori();
    }, [fetchMemori, tenantID]);
    const fetchTenant = useCallback(async () => {
        const { tenant, ...resp } = await client.backend.tenant.getTenant(tenantID);
        if (tenant && resp.resultCode === 0)
            setTenant(tenant);
        else
            console.debug('[TENANT]', resp, tenant);
    }, [tenantID, apiURL]);
    useEffect(() => {
        fetchTenant();
    }, [fetchTenant]);
    useEffect(() => {
        const targetNode = document.querySelector(`memori-client[memoriname="${memori === null || memori === void 0 ? void 0 : memori.name}"]`) ||
            document.querySelector(`memori-client[memoriid="${memori === null || memori === void 0 ? void 0 : memori.memoriID}"]`) ||
            document.querySelector('memori-client');
        if (!targetNode) {
            return;
        }
        const config = { attributes: true, childList: false, subtree: false };
        const callback = (mutationList, _observer) => {
            for (const mutation of mutationList) {
                if (mutation.type === 'attributes') {
                    const target = mutation.target.nodeName === 'MEMORI-CLIENT'
                        ? mutation.target
                        : mutation.target.parentElement;
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
    useEffect(() => {
        if (uiLang) {
            i18n.changeLanguage(uiLang.toLowerCase());
        }
        else {
            const { lng, fallbackLng } = getPreferredLanguages();
            i18n.changeLanguage(lng).catch(() => {
                i18n.changeLanguage(fallbackLng);
            });
        }
    }, [uiLang]);
    const layoutIntegration = integration !== null && integration !== void 0 ? integration : (_a = memori === null || memori === void 0 ? void 0 : memori.integrations) === null || _a === void 0 ? void 0 : _a.find(i => integrationID
        ? i.integrationID === integrationID
        : !!i.publish && i.type === 'LANDING_EXPERIENCE');
    const layoutIntegrationConfig = safeParseJSON((_b = layoutIntegration === null || layoutIntegration === void 0 ? void 0 : layoutIntegration.customData) !== null && _b !== void 0 ? _b : '{}');
    const whiteListedDomains = [
        tenant === null || tenant === void 0 ? void 0 : tenant.name,
        ...((tenant === null || tenant === void 0 ? void 0 : tenant.aliases) || []),
        ...(layoutIntegrationConfig.whiteListedDomains || []),
    ];
    if ((_c = layoutIntegrationConfig === null || layoutIntegrationConfig === void 0 ? void 0 : layoutIntegrationConfig.whiteListedDomains) === null || _c === void 0 ? void 0 : _c.length) {
        if (typeof window !== 'undefined') {
            if (!whiteListedDomains.some((domain) => new RegExp(domain).test(window.location.hostname))) {
                return null;
            }
        }
    }
    const ignoreClientAttributes = (_d = layoutIntegrationConfig.ignoreClientAttributes) !== null && _d !== void 0 ? _d : false;
    const clientAttributes = ignoreClientAttributes
        ? {
            initialContextVars: getParsedContext(layoutIntegrationConfig.contextVars),
            initialQuestion: layoutIntegrationConfig.initialQuestion,
            showLogin: memori === null || memori === void 0 ? void 0 : memori.enableDeepThought,
            memoriLang: (_f = (_e = memori === null || memori === void 0 ? void 0 : memori.culture) === null || _e === void 0 ? void 0 : _e.split('-')) === null || _f === void 0 ? void 0 : _f[0],
            uiLang,
            spokenLang,
            autoStart: layout === 'HIDDEN_CHAT'
                ? true
                : layout === 'WEBSITE_ASSISTANT'
                    ? false
                    : autoStart,
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
            showLogin: showLogin !== null && showLogin !== void 0 ? showLogin : memori === null || memori === void 0 ? void 0 : memori.enableDeepThought,
            showUpload,
            showReasoning,
            showContextPerLine,
            showMessageConsumption,
            initialContextVars: context !== null && context !== void 0 ? context : getParsedContext(layoutIntegrationConfig.contextVars),
            initialQuestion: initialQuestion !== null && initialQuestion !== void 0 ? initialQuestion : layoutIntegrationConfig.initialQuestion,
            autoStart: layout === 'WEBSITE_ASSISTANT'
                ? false
                : autoStart !== undefined
                    ? autoStart
                    : layout === 'HIDDEN_CHAT'
                        ? true
                        : autoStart,
            enableAudio,
            defaultSpeakerActive,
            useMathFormatting,
            memoriLang: (_h = (_g = memori === null || memori === void 0 ? void 0 : memori.culture) === null || _g === void 0 ? void 0 : _g.split('-')) === null || _h === void 0 ? void 0 : _h[0],
            uiLang,
            spokenLang,
        };
    const [pulseSent, setPulseSent] = useState(false);
    const sendPulse = useCallback(() => {
        var _a;
        if (((memori === null || memori === void 0 ? void 0 : memori.memoriID) || memoriID) && !pulseSent) {
            let origin = window === null || window === void 0 ? void 0 : window.location.origin;
            if (!origin ||
                origin.includes('localhost') ||
                origin.includes('memori-ai.github.io')) {
                setPulseSent(true);
                return;
            }
            setPulseSent(true);
            fetch('https://pulse.aisuru.com/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pulse: {
                        clientType: __WEBCOMPONENT__
                            ? 'memori-webcomponent'
                            : 'memori-react',
                        clientVersion: `v${version}`,
                        userAgent: navigator.userAgent,
                        language: navigator.language,
                        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                        memoriID: (_a = memori === null || memori === void 0 ? void 0 : memori.memoriID) !== null && _a !== void 0 ? _a : memoriID,
                        tenant: tenantID,
                        referrer: origin,
                    },
                }),
            });
        }
    }, [memori === null || memori === void 0 ? void 0 : memori.memoriID, memoriID, tenantID, __WEBCOMPONENT__, pulseSent]);
    useEffect(() => {
        sendPulse();
    }, [sendPulse]);
    return (_jsx(I18nWrapper, { children: _jsx(VisemeProvider, { children: _jsxs(ArtifactProvider, { children: [_jsx(Toaster, { position: "top-center", reverseOrder: true }), memori ? (_jsx(MemoriWidget, { layout: layout, customLayout: customLayout, height: height, baseUrl: baseURL ||
                            (tenantID.startsWith('https://') ||
                                tenantID.startsWith('http://')
                                ? tenantID
                                : `https://${tenantID}`), apiURL: apiURL, engineURL: engineURL, memori: {
                            ...memori,
                            secretToken,
                        }, __WEBCOMPONENT__: __WEBCOMPONENT__, ownerUserName: ownerUserName !== null && ownerUserName !== void 0 ? ownerUserName : memori.ownerUserName, ownerUserID: ownerUserID !== null && ownerUserID !== void 0 ? ownerUserID : memori.ownerUserID, tenant: tenant, tenantID: tenantID, sessionID: sessionID !== null && sessionID !== void 0 ? sessionID : sessionId, secret: secretToken, ttsProvider: provider ? provider : 'azure', integration: layoutIntegration, authToken: authToken, onStateChange: onStateChange, additionalInfo: additionalInfo, customMediaRenderer: customMediaRenderer, additionalSettings: additionalSettings, userAvatar: userAvatar, applyVarsToRoot: applyVarsToRoot, maxTotalMessagePayload: maxTotalMessagePayload, maxTextareaCharacters: maxTextareaCharacters, disableTextEnteredEvents: disableTextEnteredEvents, avatar3dHidden: avatar3dHidden, ...clientAttributes, showOnlyLastMessages: showOnlyLastMessages, showInputs: showInputs, showDates: showDates })) : (_jsx("div", { style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }, children: _jsxs("p", { style: {
                                textAlign: 'center',
                                margin: '2rem auto',
                                textTransform: 'capitalize',
                            }, children: [t('loading') || 'Loading', "..."] }) }))] }) }) }));
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
    showMessageConsumption: PropTypes.bool,
    showSettings: PropTypes.bool,
    showClear: PropTypes.bool,
    showOnlyLastMessages: PropTypes.bool,
    showTypingText: PropTypes.bool,
    showLogin: PropTypes.bool,
    showUpload: PropTypes.bool,
    showReasoning: PropTypes.bool,
    avatar3dHidden: PropTypes.bool,
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
    maxTotalMessagePayload: PropTypes.number,
    maxTextareaCharacters: PropTypes.number,
};
export default Memori;
//# sourceMappingURL=index.js.map