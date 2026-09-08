"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const prop_types_1 = tslib_1.__importDefault(require("prop-types"));
const memori_api_client_1 = tslib_1.__importDefault(require("@memori.ai/memori-api-client"));
const MemoriWidget_1 = tslib_1.__importDefault(require("./components/MemoriWidget/MemoriWidget"));
const visemeContext_1 = require("./context/visemeContext");
const react_hot_toast_1 = require("react-hot-toast");
const utils_1 = require("./helpers/utils");
const i18n_1 = tslib_1.__importDefault(require("./i18n"));
const react_i18next_1 = require("react-i18next");
const I18nWrapper_1 = tslib_1.__importDefault(require("./I18nWrapper"));
const ArtifactContext_1 = require("./components/MemoriArtifactSystem/context/ArtifactContext");
const version_1 = require("./version");
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
    const [memori, setMemori] = (0, react_1.useState)();
    const [tenant, setTenant] = (0, react_1.useState)();
    const [provider, setProvider] = (0, react_1.useState)();
    const [sessionId, setSessionId] = (0, react_1.useState)();
    const { t } = (0, react_i18next_1.useTranslation)();
    if (!((memoriID && ownerUserID) || (memoriName && ownerUserName))) {
        throw new Error('Identifier pair required: please provide either memoriID and ownerUserID or memoriName and ownerUserName');
    }
    const client = (0, memori_api_client_1.default)(apiURL, engineURL);
    const fetchSpeechKey = (0, react_1.useCallback)(async () => {
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
    (0, react_1.useEffect)(() => {
        fetchSpeechKey();
    }, []);
    const fetchMemori = (0, react_1.useCallback)(async () => {
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
    (0, react_1.useEffect)(() => {
        fetchMemori();
    }, [fetchMemori, tenantID]);
    const fetchTenant = (0, react_1.useCallback)(async () => {
        const { tenant, ...resp } = await client.backend.tenant.getTenant(tenantID);
        if (tenant && resp.resultCode === 0)
            setTenant(tenant);
        else
            console.debug('[TENANT]', resp, tenant);
    }, [tenantID, apiURL]);
    (0, react_1.useEffect)(() => {
        fetchTenant();
    }, [fetchTenant]);
    (0, react_1.useEffect)(() => {
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
    (0, react_1.useEffect)(() => {
        if (uiLang) {
            i18n_1.default.changeLanguage(uiLang.toLowerCase());
        }
        else {
            const { lng, fallbackLng } = getPreferredLanguages();
            i18n_1.default.changeLanguage(lng).catch(() => {
                i18n_1.default.changeLanguage(fallbackLng);
            });
        }
    }, [uiLang]);
    const layoutIntegration = integration !== null && integration !== void 0 ? integration : (_a = memori === null || memori === void 0 ? void 0 : memori.integrations) === null || _a === void 0 ? void 0 : _a.find(i => integrationID
        ? i.integrationID === integrationID
        : !!i.publish && i.type === 'LANDING_EXPERIENCE');
    const layoutIntegrationConfig = (0, utils_1.safeParseJSON)((_b = layoutIntegration === null || layoutIntegration === void 0 ? void 0 : layoutIntegration.customData) !== null && _b !== void 0 ? _b : '{}');
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
    const [pulseSent, setPulseSent] = (0, react_1.useState)(false);
    const sendPulse = (0, react_1.useCallback)(() => {
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
                        clientVersion: `v${version_1.version}`,
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
    (0, react_1.useEffect)(() => {
        sendPulse();
    }, [sendPulse]);
    return ((0, jsx_runtime_1.jsx)(I18nWrapper_1.default, { children: (0, jsx_runtime_1.jsx)(visemeContext_1.VisemeProvider, { children: (0, jsx_runtime_1.jsxs)(ArtifactContext_1.ArtifactProvider, { children: [(0, jsx_runtime_1.jsx)(react_hot_toast_1.Toaster, { position: "top-center", reverseOrder: true }), memori ? ((0, jsx_runtime_1.jsx)(MemoriWidget_1.default, { layout: layout, customLayout: customLayout, height: height, baseUrl: baseURL ||
                            (tenantID.startsWith('https://') ||
                                tenantID.startsWith('http://')
                                ? tenantID
                                : `https://${tenantID}`), apiURL: apiURL, engineURL: engineURL, memori: {
                            ...memori,
                            secretToken,
                        }, __WEBCOMPONENT__: __WEBCOMPONENT__, ownerUserName: ownerUserName !== null && ownerUserName !== void 0 ? ownerUserName : memori.ownerUserName, ownerUserID: ownerUserID !== null && ownerUserID !== void 0 ? ownerUserID : memori.ownerUserID, tenant: tenant, tenantID: tenantID, sessionID: sessionID !== null && sessionID !== void 0 ? sessionID : sessionId, secret: secretToken, ttsProvider: provider ? provider : 'azure', integration: layoutIntegration, authToken: authToken, onStateChange: onStateChange, additionalInfo: additionalInfo, customMediaRenderer: customMediaRenderer, additionalSettings: additionalSettings, userAvatar: userAvatar, applyVarsToRoot: applyVarsToRoot, maxTotalMessagePayload: maxTotalMessagePayload, maxTextareaCharacters: maxTextareaCharacters, disableTextEnteredEvents: disableTextEnteredEvents, avatar3dHidden: avatar3dHidden, ...clientAttributes, showOnlyLastMessages: showOnlyLastMessages, showInputs: showInputs, showDates: showDates })) : ((0, jsx_runtime_1.jsx)("div", { style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }, children: (0, jsx_runtime_1.jsxs)("p", { style: {
                                textAlign: 'center',
                                margin: '2rem auto',
                                textTransform: 'capitalize',
                            }, children: [t('loading') || 'Loading', "..."] }) }))] }) }) }));
};
Memori.propTypes = {
    memoriName: prop_types_1.default.string,
    memoriID: prop_types_1.default.string,
    ownerUserName: prop_types_1.default.string,
    ownerUserID: prop_types_1.default.string,
    integrationID: prop_types_1.default.string,
    integration: prop_types_1.default.any,
    tenantID: prop_types_1.default.string.isRequired,
    secretToken: prop_types_1.default.string,
    sessionID: prop_types_1.default.string,
    layout: prop_types_1.default.oneOf([
        'DEFAULT',
        'FULLPAGE',
        'TOTEM',
        'WEBSITE_ASSISTANT',
        'CHAT',
        'HIDDEN_CHAT',
        'ZOOMED_FULL_BODY',
    ]),
    customLayout: prop_types_1.default.any,
    showShare: prop_types_1.default.bool,
    showCopyButton: prop_types_1.default.bool,
    showTranslationOriginal: prop_types_1.default.bool,
    showInputs: prop_types_1.default.bool,
    showDates: prop_types_1.default.bool,
    showContextPerLine: prop_types_1.default.bool,
    showMessageConsumption: prop_types_1.default.bool,
    showSettings: prop_types_1.default.bool,
    showClear: prop_types_1.default.bool,
    showOnlyLastMessages: prop_types_1.default.bool,
    showTypingText: prop_types_1.default.bool,
    showLogin: prop_types_1.default.bool,
    showUpload: prop_types_1.default.bool,
    showReasoning: prop_types_1.default.bool,
    avatar3dHidden: prop_types_1.default.bool,
    height: prop_types_1.default.oneOfType([prop_types_1.default.string, prop_types_1.default.number]),
    baseURL: prop_types_1.default.string,
    apiURL: prop_types_1.default.string,
    engineURL: prop_types_1.default.string,
    tag: prop_types_1.default.string,
    pin: prop_types_1.default.string,
    context: prop_types_1.default.objectOf(prop_types_1.default.any),
    initialQuestion: prop_types_1.default.string,
    uiLang: prop_types_1.default.oneOf([
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
    spokenLang: prop_types_1.default.string,
    multilingual: prop_types_1.default.bool,
    authToken: prop_types_1.default.string,
    enableAudio: prop_types_1.default.bool,
    defaultSpeakerActive: prop_types_1.default.bool,
    disableTextEnteredEvents: prop_types_1.default.bool,
    onStateChange: prop_types_1.default.func,
    additionalInfo: prop_types_1.default.objectOf(prop_types_1.default.any),
    customMediaRenderer: prop_types_1.default.func,
    additionalSettings: prop_types_1.default.any,
    userAvatar: prop_types_1.default.oneOfType([prop_types_1.default.string, prop_types_1.default.any]),
    useMathFormatting: prop_types_1.default.bool,
    autoStart: prop_types_1.default.bool,
    applyVarsToRoot: prop_types_1.default.bool,
    maxTotalMessagePayload: prop_types_1.default.number,
    maxTextareaCharacters: prop_types_1.default.number,
};
exports.default = Memori;
//# sourceMappingURL=index.js.map