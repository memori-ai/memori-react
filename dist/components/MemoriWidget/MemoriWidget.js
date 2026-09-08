"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dialogStateFingerprint = void 0;
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const ArtifactAPI_1 = require("../MemoriArtifactSystem/utils/ArtifactAPI");
const piiDetection_1 = require("../../helpers/piiDetection");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const memori_api_client_1 = tslib_1.__importDefault(require("@memori.ai/memori-api-client"));
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const luxon_1 = require("luxon");
const react_hot_toast_1 = tslib_1.__importDefault(require("react-hot-toast"));
const PositionDrawer_1 = tslib_1.__importDefault(require("../PositionDrawer/PositionDrawer"));
const Auth_1 = tslib_1.__importDefault(require("../Auth/Auth"));
const Chat_1 = tslib_1.__importDefault(require("../Chat/Chat"));
const StartPanel_1 = tslib_1.__importDefault(require("../StartPanel/StartPanel"));
const Avatar_1 = tslib_1.__importDefault(require("../Avatar/Avatar"));
const Header_1 = tslib_1.__importDefault(require("../Header/Header"));
const PoweredBy_1 = tslib_1.__importDefault(require("../PoweredBy/PoweredBy"));
const AgeVerificationModal_1 = tslib_1.__importDefault(require("../AgeVerificationModal/AgeVerificationModal"));
const SettingsDrawer_1 = tslib_1.__importDefault(require("../SettingsDrawer/SettingsDrawer"));
const KnownFacts_1 = tslib_1.__importDefault(require("../KnownFacts/KnownFacts"));
const ExpertsDrawer_1 = tslib_1.__importDefault(require("../ExpertsDrawer/ExpertsDrawer"));
const LoginDrawer_1 = tslib_1.__importDefault(require("../LoginDrawer/LoginDrawer"));
const Button_1 = tslib_1.__importDefault(require("../ui/Button"));
const Close_1 = tslib_1.__importDefault(require("../icons/Close"));
const FullPage_1 = tslib_1.__importDefault(require("../layouts/FullPage"));
const Totem_1 = tslib_1.__importDefault(require("../layouts/Totem"));
const Chat_2 = tslib_1.__importDefault(require("../layouts/Chat"));
const WebsiteAssistant_1 = tslib_1.__importDefault(require("../layouts/WebsiteAssistant"));
const HiddenChat_1 = tslib_1.__importDefault(require("../layouts/HiddenChat"));
const ZoomedFullBody_1 = tslib_1.__importDefault(require("../layouts/ZoomedFullBody"));
const translations_1 = require("../../helpers/translations");
const configuration_1 = require("../../helpers/configuration");
const utils_1 = require("../../helpers/utils");
const ttsVoiceUtility_1 = require("../../helpers/tts/ttsVoiceUtility");
const constants_1 = require("../../helpers/constants");
const error_1 = require("../../helpers/error");
const credits_1 = require("../../helpers/credits");
const sanitizer_1 = require("../../helpers/sanitizer");
const useTTS_1 = require("../../helpers/tts/useTTS");
const ChatHistory_1 = tslib_1.__importDefault(require("../ChatHistoryDrawer/ChatHistory"));
const useSTT_1 = require("../../helpers/stt/useSTT");
const useNats_1 = require("../../helpers/nats/useNats");
const isSessionExpiredError_1 = require("../../helpers/nats/isSessionExpiredError");
const getMemoriState = (integrationId) => {
    var _a, _b, _c, _d, _f;
    let widget = integrationId
        ? document.querySelector(`.memori-widget[data-memori-integration="${integrationId}"]`) ||
            ((_b = (_a = document
                .querySelector('memori-client')) === null || _a === void 0 ? void 0 : _a.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector(`.memori-widget[data-memori-integration]`))
        : document.querySelector('.memori-widget') ||
            ((_d = (_c = document
                .querySelector('memori-client')) === null || _c === void 0 ? void 0 : _c.shadowRoot) === null || _d === void 0 ? void 0 : _d.querySelector('.memori-widget'));
    if (!widget)
        return null;
    let engineState = (_f = widget.dataset) === null || _f === void 0 ? void 0 : _f.memoriEngineState;
    if (!engineState)
        return null;
    let dialogState = JSON.parse(engineState);
    let loginToken = (0, configuration_1.getLocalConfig)('loginToken', undefined);
    return {
        ...dialogState,
        loginToken,
    };
};
const resolveLoginTokenValue = (loginToken, userTokenRef, callAdditionalInfoLoginToken, additionalInfoLoginToken, authTokenProp) => {
    var _a, _b, _c;
    return (_c = (_b = (_a = loginToken !== null && loginToken !== void 0 ? loginToken : userTokenRef) !== null && _a !== void 0 ? _a : callAdditionalInfoLoginToken) !== null && _b !== void 0 ? _b : additionalInfoLoginToken) !== null && _c !== void 0 ? _c : authTokenProp;
};
const NULL_PLACE_SPEC = {
    placeName: null,
    latitude: null,
    longitude: null,
    uncertaintyKm: null,
};
const logWidgetError = (context, detail) => {
    console.error(`[MemoriWidget] ${context}`, detail !== null && detail !== void 0 ? detail : '');
};
function readCorrelationID(response) {
    const value = response.correlationID;
    return typeof value === 'string' && value.length > 0 ? value : undefined;
}
function dialogStateFingerprint(state) {
    if (!state)
        return '';
    return JSON.stringify({
        state: state.state,
        previousState: state.previousState,
        emission: state.emission,
        emitter: state.emitter,
        lastMatchedMemoryID: state.lastMatchedMemoryID,
        currentDate: state.currentDate,
        currentMemoryID: state.currentMemoryID,
        contextVars: state.contextVars,
        emittedMedia: state.emittedMedia,
    });
}
exports.dialogStateFingerprint = dialogStateFingerprint;
const typeMessage = (message, waitForPrevious = true, hidden = false, typingText, useLoaderTextAsMsg = false, hasBatchQueued = false) => {
    const e = new CustomEvent('MemoriTextEntered', {
        detail: {
            text: message,
            waitForPrevious,
            hidden,
            typingText,
            useLoaderTextAsMsg,
            hasBatchQueued,
        },
    });
    document.dispatchEvent(e);
    const isSafariIOS = window.navigator.userAgent.includes('Safari') &&
        !window.navigator.userAgent.includes('Chrome') &&
        /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isSafariIOS) {
        setTimeout(() => {
            document.dispatchEvent(new CustomEvent('MemoriEndSpeak'));
        }, 300);
    }
};
const typeMessageHidden = (message, waitForPrevious = true, typingText, useLoaderTextAsMsg = false, hasBatchQueued = false) => typeMessage(message, waitForPrevious, true, typingText, useLoaderTextAsMsg, hasBatchQueued);
const typeBatchMessages = (messages) => {
    function disableInputs() {
        var _a, _b, _c, _d;
        (_a = document
            .querySelector('fieldset#chat-fieldset')) === null || _a === void 0 ? void 0 : _a.setAttribute('disabled', '');
        const styles = `opacity: 0.5; touch-action: none; pointer-events: none;`;
        (_b = document
            .querySelector('textarea.memori-chat-textarea--input')) === null || _b === void 0 ? void 0 : _b.setAttribute('style', styles);
        (_c = document
            .querySelector('button.memori-chat-inputs--send')) === null || _c === void 0 ? void 0 : _c.setAttribute('style', styles);
        (_d = document
            .querySelector('button.memori-chat-inputs--mic')) === null || _d === void 0 ? void 0 : _d.setAttribute('style', styles);
    }
    function reEnableInputs() {
        var _a, _b, _c, _d;
        (_a = document
            .querySelector('fieldset#chat-fieldset')) === null || _a === void 0 ? void 0 : _a.removeAttribute('disabled');
        (_b = document
            .querySelector('textarea.memori-chat-textarea--input')) === null || _b === void 0 ? void 0 : _b.removeAttribute('style');
        (_c = document
            .querySelector('button.memori-chat-inputs--send')) === null || _c === void 0 ? void 0 : _c.removeAttribute('style');
        (_d = document
            .querySelector('button.memori-chat-inputs--mic')) === null || _d === void 0 ? void 0 : _d.removeAttribute('style');
    }
    function areInputsDisabled() {
        var _a;
        return !!((_a = document
            .querySelector('fieldset#chat-fieldset')) === null || _a === void 0 ? void 0 : _a.hasAttribute('disabled'));
    }
    const isSafariIOS = window.navigator.userAgent.includes('Safari') &&
        !window.navigator.userAgent.includes('Chrome') &&
        /iPad|iPhone|iPod/.test(navigator.userAgent);
    const stepsGenerator = (function* () {
        yield* messages;
    })();
    disableInputs();
    const submitNewMessage = () => {
        const next = stepsGenerator.next();
        const step = next.value;
        if (step) {
            if (!areInputsDisabled()) {
                disableInputs();
            }
            let waitForPrevious = step.waitForPrevious;
            if (isSafariIOS)
                waitForPrevious = false;
            typeMessage(step.message, waitForPrevious, step.hidden, step.typingText, step.useLoaderTextAsMsg, !next.done);
            if (isSafariIOS) {
                setTimeout(() => {
                    document.dispatchEvent(new CustomEvent('MemoriEndSpeak'));
                    reEnableInputs();
                }, 3000);
            }
        }
        else if (areInputsDisabled()) {
            reEnableInputs();
        }
        if (next.done) {
            document.removeEventListener('MemoriEndSpeak', submitNewMessage);
            if (areInputsDisabled())
                reEnableInputs();
            return;
        }
    };
    document.addEventListener('MemoriEndSpeak', submitNewMessage);
    submitNewMessage();
};
window.getMemoriState = getMemoriState;
window.typeMessage = typeMessage;
window.typeMessageHidden = typeMessageHidden;
window.typeBatchMessages = typeBatchMessages;
let audioContext;
let memoriPassword;
const MemoriWidget = ({ memori, memoriConfigs, ownerUserID, ownerUserName, tenantID, memoriLang, uiLang, spokenLang, multilingual, integration, layout, customLayout, showShare, preview = false, embed = false, showCopyButton = true, showTranslationOriginal = false, showInputs = true, showDates = false, showContextPerLine = false, showMessageConsumption = false, showSettings, showTypingText = false, showClear = false, showLogin = false, showUpload, showOnlyLastMessages, showChatHistory, showReasoning, avatar3dHidden, height = '100vh', secret, baseUrl = 'https://aisuru-staging.aclambda.online', apiURL = 'https://backend-staging.memori.ai', engineURL = 'https://engine-staging.memori.ai', initialContextVars, initialQuestion, ttsProvider, ogImage, sessionID: initialSessionID, tenant, personification, authToken, enableAudio, defaultSpeakerActive = true, disableTextEnteredEvents = false, onStateChange, additionalInfo, additionalSettings, customMediaRenderer, userAvatar, __WEBCOMPONENT__ = false, useMathFormatting = false, autoStart = false, applyVarsToRoot = false, showFunctionCache = false, maxTotalMessagePayload, maxTextareaCharacters, }) => {
    var _a, _b, _c, _d, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18;
    const { t, i18n } = (0, react_i18next_1.useTranslation)();
    const [isClient, setIsClient] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        setIsClient(true);
    }, []);
    const client = (0, memori_api_client_1.default)(apiURL, engineURL);
    const { initSession, deleteSession, postEnterTextAsync, postTextEnteredEvent, postPlaceChangedEvent, postDateChangedEvent, postTagChangedEvent, getSession, getExpertReferences, getSessionChatLogs, } = client;
    const [instruct, setInstruct] = (0, react_1.useState)(false);
    const [enableFocusChatInput, setEnableFocusChatInput] = (0, react_1.useState)(true);
    const [loginToken, setLoginToken] = (0, react_1.useState)((_a = additionalInfo === null || additionalInfo === void 0 ? void 0 : additionalInfo.loginToken) !== null && _a !== void 0 ? _a : authToken);
    const userTokenRef = (0, react_1.useRef)((_b = additionalInfo === null || additionalInfo === void 0 ? void 0 : additionalInfo.loginToken) !== null && _b !== void 0 ? _b : authToken);
    const prevPropsLoginTokenRef = (0, react_1.useRef)((_c = additionalInfo === null || additionalInfo === void 0 ? void 0 : additionalInfo.loginToken) !== null && _c !== void 0 ? _c : authToken);
    const [user, setUser] = (0, react_1.useState)({
        avatarURL: typeof userAvatar === 'string' ? userAvatar : undefined,
    });
    const resolveLoginToken = (0, react_1.useCallback)((callAdditionalInfoLoginToken) => resolveLoginTokenValue(loginToken, userTokenRef.current, callAdditionalInfoLoginToken, additionalInfo === null || additionalInfo === void 0 ? void 0 : additionalInfo.loginToken, authToken), [loginToken, additionalInfo === null || additionalInfo === void 0 ? void 0 : additionalInfo.loginToken, authToken]);
    (0, react_1.useEffect)(() => {
        var _a;
        const incomingToken = (_a = additionalInfo === null || additionalInfo === void 0 ? void 0 : additionalInfo.loginToken) !== null && _a !== void 0 ? _a : authToken;
        const prevPropsToken = prevPropsLoginTokenRef.current;
        prevPropsLoginTokenRef.current = incomingToken;
        if (incomingToken !== prevPropsToken) {
            setLoginToken(incomingToken);
            userTokenRef.current = incomingToken;
            if (!incomingToken) {
                (0, configuration_1.removeLocalConfig)('loginToken');
                setUser(undefined);
            }
        }
    }, [additionalInfo === null || additionalInfo === void 0 ? void 0 : additionalInfo.loginToken, authToken]);
    (0, react_1.useEffect)(() => {
        if (!loginToken || !(showLogin || memori.requireLoginToken)) {
            return;
        }
        let cancelled = false;
        client.backend
            .pwlGetCurrentUser(loginToken)
            .then(({ user: fetchedUser, resultCode }) => {
            if (cancelled)
                return;
            if (fetchedUser && resultCode === 0) {
                setUser(fetchedUser);
                (0, configuration_1.setLocalConfig)('loginToken', loginToken);
                userTokenRef.current = loginToken;
                if (!birthDate && fetchedUser.birthDate) {
                    setBirthDate(fetchedUser.birthDate);
                    (0, configuration_1.setLocalConfig)('birthDate', fetchedUser.birthDate);
                }
            }
            else {
                setLoginToken(undefined);
                userTokenRef.current = undefined;
                setUser(undefined);
                (0, configuration_1.removeLocalConfig)('loginToken');
            }
        });
        return () => {
            cancelled = true;
        };
    }, [loginToken, showLogin, memori.requireLoginToken]);
    const [showLoginDrawer, setShowLoginDrawer] = (0, react_1.useState)(false);
    const [clickedStart, setClickedStart] = (0, react_1.useState)(false);
    const sessionStartingRef = (0, react_1.useRef)(false);
    const language = ((_g = (_f = (_d = memori.culture) === null || _d === void 0 ? void 0 : _d.split('-')) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.toUpperCase()) ||
        ((_l = (_k = (_j = (_h = memoriConfigs === null || memoriConfigs === void 0 ? void 0 : memoriConfigs.find(c => c.memoriConfigID === memori.memoriConfigurationID)) === null || _h === void 0 ? void 0 : _h.culture) === null || _j === void 0 ? void 0 : _j.split('-')) === null || _k === void 0 ? void 0 : _k[0]) === null || _l === void 0 ? void 0 : _l.toUpperCase());
    const integrationConfig = (integration === null || integration === void 0 ? void 0 : integration.customData)
        ? JSON.parse(integration.customData)
        : null;
    const isMultilanguageEnabled = multilingual !== undefined
        ? multilingual
        : !!(integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.multilanguage);
    const forcedTimeout = integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.forcedTimeout;
    const [userLang, setUserLang] = (0, react_1.useState)((_r = (_q = (_p = (_o = (_m = spokenLang !== null && spokenLang !== void 0 ? spokenLang : memoriLang) !== null && _m !== void 0 ? _m : integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.lang) !== null && _o !== void 0 ? _o : language) !== null && _p !== void 0 ? _p : integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.uiLang) !== null && _q !== void 0 ? _q : i18n.language) !== null && _r !== void 0 ? _r : 'IT');
    (0, react_1.useEffect)(() => {
        if (spokenLang != null) {
            setUserLang(spokenLang);
        }
    }, [spokenLang]);
    const applyMathFormatting = useMathFormatting !== undefined
        ? useMathFormatting
        : !!(integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.useMathFormatting);
    (0, react_1.useEffect)(() => {
        if (applyMathFormatting)
            (0, utils_1.installMathJax)();
    }, [applyMathFormatting]);
    (0, react_1.useEffect)(() => {
        const langToApply = uiLang && constants_1.uiLanguages.includes(uiLang.toLowerCase())
            ? uiLang.toLowerCase()
            : userLang && constants_1.uiLanguages.includes(userLang.toLowerCase())
                ? userLang.toLowerCase()
                : null;
        if (langToApply && typeof (i18n === null || i18n === void 0 ? void 0 : i18n.changeLanguage) === 'function') {
            i18n.changeLanguage(langToApply);
        }
    }, [uiLang, userLang]);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [memoriTyping, setMemoriTyping] = (0, react_1.useState)(false);
    const [typingText, setTypingText] = (0, react_1.useState)();
    const pendingEnterTextRef = (0, react_1.useRef)(new Map());
    const bufferedNatsResponsesRef = (0, react_1.useRef)(new Map());
    const layoutName = typeof layout === 'string'
        ? layout
        : typeof (integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.layout) === 'string'
            ? integrationConfig.layout
            : (_s = integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.layout) === null || _s === void 0 ? void 0 : _s.name;
    const selectedLayout = layoutName || 'DEFAULT';
    const piiDetection = typeof (integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.layout) === 'object' &&
        (integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.layout) !== null &&
        ((_u = (_t = integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.layout) === null || _t === void 0 ? void 0 : _t.piiDetection) === null || _u === void 0 ? void 0 : _u.enabled)
        ? integrationConfig.layout.piiDetection
        : undefined;
    const defaultEnableAudio = (_v = enableAudio !== null && enableAudio !== void 0 ? enableAudio : integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.enableAudio) !== null && _v !== void 0 ? _v : true;
    const [hasUserActivatedListening, setHasUserActivatedListening] = (0, react_1.useState)(false);
    const [hasUserTypedMessage, setHasUserTypedMessage] = (0, react_1.useState)(false);
    const [showPositionDrawer, setShowPositionDrawer] = (0, react_1.useState)(false);
    const [showSettingsDrawer, setShowSettingsDrawer] = (0, react_1.useState)(false);
    const [showChatHistoryDrawer, setShowChatHistoryDrawer] = (0, react_1.useState)(false);
    const [showKnownFactsDrawer, setShowKnownFactsDrawer] = (0, react_1.useState)(false);
    const [showExpertsDrawer, setShowExpertsDrawer] = (0, react_1.useState)(false);
    const [continuousSpeech, setContinuousSpeech] = (0, react_1.useState)(false);
    const [continuousSpeechTimeout, setContinuousSpeechTimeout] = (0, react_1.useState)(2);
    const [controlsPosition, setControlsPosition] = (0, react_1.useState)('center');
    const [enablePositionControls, setEnablePositionControls] = (0, react_1.useState)(false);
    const [avatarType, setAvatarType] = (0, react_1.useState)(null);
    const [hideEmissions, setHideEmissions] = (0, react_1.useState)(false);
    const [runtimeShowMessageConsumption, setRuntimeShowMessageConsumption] = (0, react_1.useState)(false);
    const speechSynthesizerRef = (0, react_1.useRef)(null);
    const [memoriSpeaking, setMemoriSpeaking] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        setMemoriSpeaking(!!speechSynthesizerRef.current);
    }, [speechSynthesizerRef.current]);
    (0, react_1.useEffect)(() => {
        var _a, _b;
        let defaultControlsPosition = 'bottom';
        let microphoneMode = (0, configuration_1.getLocalConfig)('microphoneMode', 'HOLD_TO_TALK');
        if (window.innerWidth <= 768) {
            defaultControlsPosition = 'bottom';
            microphoneMode = 'HOLD_TO_TALK';
        }
        else if (window.matchMedia('(orientation: portrait)').matches ||
            window.innerHeight > window.innerWidth) {
            defaultControlsPosition = 'center';
        }
        else {
            defaultControlsPosition = 'bottom';
        }
        setContinuousSpeech(speakerMuted ? false : microphoneMode === 'CONTINUOUS');
        setContinuousSpeechTimeout((0, configuration_1.getLocalConfig)('continuousSpeechTimeout', 2));
        setControlsPosition((0, configuration_1.getLocalConfig)('controlsPosition', defaultControlsPosition));
        setAvatarType((0, configuration_1.getLocalConfig)('avatarType', 'avatar3d'));
        setHideEmissions((0, configuration_1.getLocalConfig)('hideEmissions', false));
        setRuntimeShowMessageConsumption((0, configuration_1.getLocalConfig)('showMessageConsumption', (_a = showMessageConsumption !== null && showMessageConsumption !== void 0 ? showMessageConsumption : integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.showMessageConsumption) !== null && _a !== void 0 ? _a : false));
        if (!(additionalInfo === null || additionalInfo === void 0 ? void 0 : additionalInfo.loginToken) && !authToken) {
            setLoginToken((0, configuration_1.getLocalConfig)('loginToken', undefined));
            userTokenRef.current = (0, configuration_1.getLocalConfig)('loginToken', undefined);
            setBirthDate((0, configuration_1.getLocalConfig)('birthDate', undefined));
        }
        if (!((_b = enableAudio !== null && enableAudio !== void 0 ? enableAudio : integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.enableAudio) !== null && _b !== void 0 ? _b : true)) {
            (0, configuration_1.setLocalConfig)('muteSpeaker', true);
        }
    }, []);
    (0, react_1.useEffect)(() => {
        var _a;
        const isAudioEnabled = (_a = enableAudio !== null && enableAudio !== void 0 ? enableAudio : integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.enableAudio) !== null && _a !== void 0 ? _a : true;
        if (!isAudioEnabled) {
            (0, configuration_1.setLocalConfig)('muteSpeaker', true);
        }
    }, [enableAudio, integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.enableAudio]);
    const [memoriPwd, setMemoriPwd] = (0, react_1.useState)(secret);
    const [memoriTokens, setMemoriTokens] = (0, react_1.useState)();
    const [authModalState, setAuthModalState] = (0, react_1.useState)(null);
    const [position, _setPosition] = (0, react_1.useState)();
    const hasUserProvidedPosition = (0, react_1.useCallback)((venue) => {
        if (!venue)
            return false;
        if (venue.placeName === 'Position' &&
            venue.latitude === 0 &&
            venue.longitude === 0) {
            return false;
        }
        return true;
    }, []);
    const buildEnterTextPlace = (0, react_1.useCallback)((venue) => {
        if (!venue)
            return undefined;
        const place = {};
        if (venue.latitude != null && venue.longitude != null) {
            place.latitude = venue.latitude;
            place.longitude = venue.longitude;
            if (venue.placeName)
                place.placeName = venue.placeName;
            if (venue.uncertainty != null && venue.uncertainty > 0)
                place.uncertaintyKm = venue.uncertainty;
        }
        else if (venue.placeName) {
            place.placeName = venue.placeName;
        }
        return Object.keys(place).length > 0 ? place : undefined;
    }, []);
    const getPlaceSpecForEnterText = (0, react_1.useCallback)((venue) => {
        if (!memori.needsPosition)
            return undefined;
        return hasUserProvidedPosition(venue)
            ? buildEnterTextPlace(venue)
            : NULL_PLACE_SPEC;
    }, [memori.needsPosition, hasUserProvidedPosition, buildEnterTextPlace]);
    const setPosition = (venue) => {
        _setPosition(venue);
        if (venue && memori.needsPosition) {
            (0, configuration_1.setLocalConfig)('position', JSON.stringify(venue));
        }
        else if (!venue) {
            (0, configuration_1.removeLocalConfig)('position');
        }
    };
    (0, react_1.useEffect)(() => {
        if (memori.needsPosition) {
            const position = (0, configuration_1.getLocalConfig)('position', undefined);
            if (position) {
                _setPosition(position);
            }
        }
    }, [memori.needsPosition]);
    const [userMessage, setUserMessage] = (0, react_1.useState)('');
    const onChangeUserMessage = (value) => {
        if (!value || value === '\n' || value.trim() === '') {
            setUserMessage('');
            return;
        }
        setUserMessage(value);
        clearInteractionTimeout();
    };
    const [listening, setListening] = (0, react_1.useState)(false);
    const [history, setHistory] = (0, react_1.useState)([]);
    const pushMessage = (message) => {
        setHistory(history => {
            var _a, _b;
            return [
                ...history,
                {
                    ...message,
                    media: (_b = (_a = message.media) === null || _a === void 0 ? void 0 : _a.filter(m => { var _a; return !(m.mimeType === 'text/javascript' && !!((_a = m.properties) === null || _a === void 0 ? void 0 : _a.executable)); })) !== null && _b !== void 0 ? _b : [],
                },
            ];
        });
    };
    const [chatLogID, setChatLogID] = (0, react_1.useState)(undefined);
    const sendMessage = async (text, media, newSessionId, translate = true, translatedText, hidden = false, typingText, useLoaderTextAsMsg = false, hasBatchQueued = false, skipHistoryPush = false) => {
        var _a, _b;
        const sessionID = newSessionId ||
            sessionId ||
            ((_a = window.getMemoriState()) === null || _a === void 0 ? void 0 : _a.sessionID);
        if (!sessionID || !(text === null || text === void 0 ? void 0 : text.length))
            return;
        let msg = text;
        if (!hidden &&
            translate &&
            isMultilanguageEnabled &&
            userLang.toUpperCase() !== language.toUpperCase()) {
            const translation = await (0, translations_1.getTranslation)(text, language, userLang, baseUrl);
            msg = translation.text;
        }
        const mediaDocuments = media === null || media === void 0 ? void 0 : media.filter(m => { var _a; return m.type === 'document' && ((_a = m.properties) === null || _a === void 0 ? void 0 : _a.isAttachedFile); });
        if (mediaDocuments && mediaDocuments.length > 0) {
            const documentContents = mediaDocuments.map(doc => doc.content).join(' ');
            msg = msg + ' ' + documentContents;
        }
        if (piiDetection === null || piiDetection === void 0 ? void 0 : piiDetection.enabled) {
            const piiResult = (0, piiDetection_1.checkPii)(msg, piiDetection, (userLang === null || userLang === void 0 ? void 0 : userLang.toLowerCase()) || 'en');
            if (piiResult.matched && piiResult.errorText) {
                if (!hidden) {
                    pushMessage({
                        text: text,
                        translatedText,
                        fromUser: true,
                        media: media !== null && media !== void 0 ? media : [],
                        initial: sessionId
                            ? !!newSessionId && newSessionId !== sessionId
                            : !!newSessionId,
                    });
                }
                pushMessage({
                    text: piiResult.errorText,
                    emitter: 'system',
                    fromUser: false,
                    initial: false,
                    contextVars: {},
                    date: new Date().toISOString(),
                });
                return;
            }
        }
        if (!hidden && !skipHistoryPush)
            pushMessage({
                text: text,
                translatedText,
                fromUser: true,
                media: media !== null && media !== void 0 ? media : [],
                initial: sessionId
                    ? !!newSessionId && newSessionId !== sessionId
                    : !!newSessionId,
            });
        let gotError = false;
        try {
            const placeSpec = getPlaceSpecForEnterText(position);
            const response = await postEnterTextAsync({
                sessionId: sessionID,
                text: msg,
                ...(memori.needsDateTime && {
                    dateUTC: (_b = luxon_1.DateTime.utc().toISO()) !== null && _b !== void 0 ? _b : undefined,
                }),
                ...(placeSpec !== undefined && { place: placeSpec }),
            });
            const correlationID = readCorrelationID(response);
            if (response.resultCode === 0 && correlationID) {
                registerPendingEnterText(correlationID, {
                    msg,
                    stateBeforeRequest: dialogStateFingerprint(currentDialogState),
                    text,
                    media,
                    translate,
                    translatedText,
                    hidden,
                    typingText,
                    useLoaderTextAsMsg,
                    hasBatchQueued,
                });
                setMemoriTyping(true);
                setTypingText(typingText);
            }
            else if (response.resultCode === 0) {
                logWidgetError('enter-text missing correlationID', response);
            }
            else if (response.resultCode === 404) {
                retryAfterExpiredSessionRef.current({
                    text,
                    media,
                    translate,
                    translatedText,
                    hidden,
                    typingText,
                    useLoaderTextAsMsg,
                    hasBatchQueued,
                    expiredSessionID: sessionID,
                    continueFromChatLogID: chatLogID,
                });
            }
            else if (response.resultCode === 500 && response.resultMessage) {
                setHistory(h => [
                    ...h,
                    {
                        text: 'Error: ' + response.resultMessage,
                        emitter: 'system',
                        fromUser: false,
                        initial: false,
                        contextVars: {},
                        date: new Date().toISOString(),
                    },
                ]);
            }
            else {
                return Promise.reject(response);
            }
        }
        catch (error) {
            gotError = true;
            logWidgetError('sendMessage failed', error);
            setTypingText(undefined);
            setMemoriTyping(false);
        }
    };
    const translateDialogState = async (state, userLang, msg, avoidPushingMessage = false) => {
        var _a, _b, _c, _d, _f, _g;
        const emission = (_a = state === null || state === void 0 ? void 0 : state.emission) !== null && _a !== void 0 ? _a : currentDialogState === null || currentDialogState === void 0 ? void 0 : currentDialogState.emission;
        let translatedState = { ...state };
        let translatedMsg = null;
        if (!emission ||
            language.toUpperCase() === userLang.toUpperCase() ||
            !isMultilanguageEnabled ||
            avoidPushingMessage) {
            translatedState = { ...state, emission };
            if (emission) {
                translatedMsg = {
                    text: emission,
                    emitter: state.emitter,
                    media: (_b = state.emittedMedia) !== null && _b !== void 0 ? _b : state.media,
                    llmUsage: state.llmUsage,
                    fromUser: false,
                    questionAnswered: msg,
                    contextVars: state.contextVars,
                    date: state.currentDate,
                    placeName: state.currentPlaceName,
                    placeLatitude: state.currentLatitude,
                    placeLongitude: state.currentLongitude,
                    placeUncertaintyKm: state.currentUncertaintyKm,
                    tag: state.currentTag,
                    memoryTags: state.memoryTags,
                };
            }
        }
        else {
            try {
                const t = await (0, translations_1.getTranslation)(emission, userLang, language, baseUrl);
                if (state.hints && state.hints.length > 0) {
                    const translatedHints = await Promise.all(((_c = state.hints) !== null && _c !== void 0 ? _c : []).map(async (hint) => {
                        var _a;
                        const tHint = await (0, translations_1.getTranslation)(hint, userLang, language, baseUrl);
                        return {
                            text: (_a = tHint === null || tHint === void 0 ? void 0 : tHint.text) !== null && _a !== void 0 ? _a : hint,
                            originalText: hint,
                        };
                    }));
                    translatedState = {
                        ...state,
                        emission: t.text,
                        translatedHints,
                    };
                }
                else {
                    translatedState = {
                        ...state,
                        emission: emission,
                        translatedEmission: t.text,
                        hints: (_d = state.hints) !== null && _d !== void 0 ? _d : (state.state === 'G1' ? currentDialogState === null || currentDialogState === void 0 ? void 0 : currentDialogState.hints : []),
                    };
                }
                if (t.text.length > 0) {
                    translatedMsg = {
                        text: emission,
                        translatedText: t.text,
                        emitter: state.emitter,
                        media: (_f = state.emittedMedia) !== null && _f !== void 0 ? _f : state.media,
                        llmUsage: state.llmUsage,
                        fromUser: false,
                        questionAnswered: msg,
                        generatedByAI: !!state.completion,
                        contextVars: state.contextVars,
                        date: state.currentDate,
                        placeName: state.currentPlaceName,
                        placeLatitude: state.currentLatitude,
                        placeLongitude: state.currentLongitude,
                        placeUncertaintyKm: state.currentUncertaintyKm,
                        tag: state.currentTag,
                        memoryTags: state.memoryTags,
                    };
                }
            }
            catch (error) {
                translatedState = { ...state, emission };
                translatedMsg = {
                    text: emission,
                    emitter: state.emitter,
                    media: (_g = state.emittedMedia) !== null && _g !== void 0 ? _g : state.media,
                    llmUsage: state.llmUsage,
                    fromUser: false,
                    questionAnswered: msg,
                    contextVars: state.contextVars,
                    date: state.currentDate,
                    placeName: state.currentPlaceName,
                    placeLatitude: state.currentLatitude,
                    placeLongitude: state.currentLongitude,
                    placeUncertaintyKm: state.currentUncertaintyKm,
                    tag: state.currentTag,
                    memoryTags: state.memoryTags,
                };
            }
        }
        setCurrentDialogState(translatedState);
        if (!avoidPushingMessage && translatedMsg) {
            pushMessage(translatedMsg);
        }
        return translatedState;
    };
    const minAge = memori.ageRestriction !== undefined
        ? memori.ageRestriction
        : memori.nsfw
            ? 18
            : memori.enableCompletions
                ? 14
                : 0;
    const [birthDate, setBirthDate] = (0, react_1.useState)();
    const [showAgeVerification, setShowAgeVerification] = (0, react_1.useState)(false);
    const getCultureCodeByLanguage = (lang) => {
        var _a, _b;
        let voice = '';
        let voiceLang = (lang ||
            ((_b = (_a = memori.culture) === null || _a === void 0 ? void 0 : _a.split('-')) === null || _b === void 0 ? void 0 : _b[0]) ||
            i18n.language ||
            'IT').toUpperCase();
        switch (voiceLang) {
            case 'IT':
                voice = 'it-IT';
                break;
            case 'DE':
                voice = 'de-DE';
                break;
            case 'EN':
                voice = 'en-GB';
                break;
            case 'ES':
                voice = 'es-ES';
                break;
            case 'FR':
                voice = 'fr-FR';
                break;
            case 'PT':
                voice = 'pt-PT';
                break;
            case 'UK':
                voice = 'uk-UK';
                break;
            case 'RU':
                voice = 'ru-RU';
                break;
            case 'PL':
                voice = 'pl-PL';
                break;
            case 'FI':
                voice = 'fi-FI';
                break;
            case 'EL':
                voice = 'el-GR';
                break;
            case 'AR':
                voice = 'ar-SA';
                break;
            case 'ZH':
                voice = 'zh-CN';
                break;
            case 'JA':
                voice = 'ja-JP';
                break;
            default:
                voice = 'it-IT';
                break;
        }
        return voice;
    };
    const [sessionId, setSessionId] = (0, react_1.useState)(initialSessionID);
    const [currentDialogState, _setCurrentDialogState] = (0, react_1.useState)();
    const setCurrentDialogState = (state) => {
        var _a, _b;
        _setCurrentDialogState(state);
        if (onStateChange) {
            onStateChange(state);
        }
        const e = new CustomEvent('MemoriNewDialogState', {
            detail: state,
        });
        document.dispatchEvent(e);
        const executableSnippets = (_b = ((_a = state === null || state === void 0 ? void 0 : state.emittedMedia) !== null && _a !== void 0 ? _a : state === null || state === void 0 ? void 0 : state.media)) === null || _b === void 0 ? void 0 : _b.filter(m => { var _a; return m.mimeType === 'text/javascript' && !!((_a = m.properties) === null || _a === void 0 ? void 0 : _a.executable); });
        executableSnippets === null || executableSnippets === void 0 ? void 0 : executableSnippets.forEach(s => {
            try {
                setTimeout(() => {
                    var _a;
                    new Function((_a = s.content) !== null && _a !== void 0 ? _a : '')();
                    setTimeout(() => {
                        var _a, _b, _c;
                        (_a = document
                            .querySelector('.memori-chat--content')) === null || _a === void 0 ? void 0 : _a.scrollTo(0, (_c = (_b = document.querySelector('.memori-chat--content')) === null || _b === void 0 ? void 0 : _b.scrollHeight) !== null && _c !== void 0 ? _c : 0);
                    }, 400);
                }, 1000);
            }
            catch (_a) {
            }
        });
    };
    (0, react_1.useEffect)(() => {
        if (initialSessionID) {
            setSessionId(initialSessionID);
            onClickStart(undefined, false, undefined, initialSessionID);
        }
    }, [initialSessionID]);
    const fetchSession = async (params) => {
        var _a, _b, _c, _d, _f, _g, _h;
        let storageBirthDate = (0, configuration_1.getLocalConfig)('birthDate', undefined);
        let userBirthDate = (_a = birthDate !== null && birthDate !== void 0 ? birthDate : params.birthDate) !== null && _a !== void 0 ? _a : storageBirthDate;
        if (!userBirthDate && !!minAge) {
            setShowAgeVerification(true);
            return;
        }
        if (memori.privacyType !== 'PUBLIC' &&
            !memori.secretToken &&
            !memoriPwd &&
            !memoriTokens) {
            setAuthModalState('password');
            return;
        }
        if (!(await checkCredits({ notify: true }))) {
            return;
        }
        setLoading(true);
        try {
            let referral;
            try {
                referral = (() => {
                    return window.location.href;
                })();
            }
            catch (_j) {
            }
            const session = await initSession({
                ...params,
                birthDate: userBirthDate,
                tag: (_b = params.tag) !== null && _b !== void 0 ? _b : personification === null || personification === void 0 ? void 0 : personification.tag,
                pin: (_c = params.pin) !== null && _c !== void 0 ? _c : personification === null || personification === void 0 ? void 0 : personification.pin,
                additionalInfo: {
                    ...(params.additionalInfo || additionalInfo || {}),
                    loginToken: resolveLoginToken((_d = params.additionalInfo) === null || _d === void 0 ? void 0 : _d.loginToken),
                    language: ((_h = userLang !== null && userLang !== void 0 ? userLang : (_g = (_f = memori.culture) === null || _f === void 0 ? void 0 : _f.split('-')) === null || _g === void 0 ? void 0 : _g[0]) !== null && _h !== void 0 ? _h : 'IT').toLowerCase(),
                    referral: referral,
                    timeZoneOffset: new Date().getTimezoneOffset().toString(),
                },
            });
            if ((session === null || session === void 0 ? void 0 : session.sessionID) &&
                (session === null || session === void 0 ? void 0 : session.currentState) &&
                session.resultCode === 0) {
                setSessionId(session.sessionID);
                if ((currentDialogState === null || currentDialogState === void 0 ? void 0 : currentDialogState.currentTag) && memori.giverTag) {
                    setInstruct((currentDialogState === null || currentDialogState === void 0 ? void 0 : currentDialogState.currentTag) === memori.giverTag);
                }
                else {
                    setInstruct(false);
                }
                setLoading(false);
                return {
                    dialogState: session.currentState,
                    sessionID: session.sessionID,
                };
            }
            else if (session === null || session === void 0 ? void 0 : session.resultMessage.startsWith('This Memori is aged restricted')) {
                react_hot_toast_1.default.error(t('underageTwinSession', { age: minAge }));
            }
            else if ((session === null || session === void 0 ? void 0 : session.resultCode) === 403 && memori.privacyType !== 'PUBLIC') {
                setMemoriPwd(undefined);
                setAuthModalState('password');
                return session;
            }
            else {
                react_hot_toast_1.default.error(tst => ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { children: t((0, error_1.getErrori18nKey)(session === null || session === void 0 ? void 0 : session.resultCode)) }), (0, jsx_runtime_1.jsx)(Button_1.default, { outlined: true, padded: false, onClick: () => react_hot_toast_1.default.dismiss(tst.id), icon: (0, jsx_runtime_1.jsx)(Close_1.default, {}), children: t('close') })] })), {
                    duration: Infinity,
                });
                return session;
            }
        }
        catch (err) {
            logWidgetError('fetchSession failed', err);
        }
    };
    const reopenSession = async (updateDialogState = false, password, recoveryTokens, tag, pin, initialContextVars, initialQuestion, birthDate, additionalInfoProp, continueFromChatLogID, continueFromSessionID, isSessionExpired, suppressHistoryUpdate) => {
        var _a, _b, _c, _d, _f, _g, _h, _j;
        setLoading(true);
        let storageBirthDate = (0, configuration_1.getLocalConfig)('birthDate', undefined);
        let userBirthDate = birthDate !== null && birthDate !== void 0 ? birthDate : storageBirthDate;
        try {
            if (!userBirthDate && !!minAge) {
                setShowAgeVerification(true);
                return;
            }
            if (memori.privacyType !== 'PUBLIC' &&
                !password &&
                !memori.secretToken &&
                !memoriPwd &&
                !recoveryTokens &&
                !memoriTokens) {
                setAuthModalState('password');
                return;
            }
            if (!(await checkCredits({ notify: true }))) {
                setLoading(false);
                return null;
            }
            let referral;
            try {
                referral = (() => {
                    return window.location.href;
                })();
            }
            catch (_k) {
            }
            const { sessionID, currentState, ...response } = await initSession({
                memoriID: (_a = memori.engineMemoriID) !== null && _a !== void 0 ? _a : '',
                password: password || memoriPwd || memori.secretToken,
                recoveryTokens: recoveryTokens || memoriTokens,
                tag: tag !== null && tag !== void 0 ? tag : personification === null || personification === void 0 ? void 0 : personification.tag,
                pin: pin !== null && pin !== void 0 ? pin : personification === null || personification === void 0 ? void 0 : personification.pin,
                continueFromChatLogID: continueFromChatLogID,
                continueFromSessionID: continueFromSessionID,
                initialContextVars: {
                    LANG: userLang,
                    PATHNAME: window.location.pathname,
                    ROUTE: ((_c = (_b = window.location.pathname) === null || _b === void 0 ? void 0 : _b.split('/')) === null || _c === void 0 ? void 0 : _c.pop()) || '',
                    ...(initialContextVars || {}),
                },
                initialQuestion,
                birthDate: userBirthDate,
                additionalInfo: {
                    ...(additionalInfoProp || additionalInfo || {}),
                    loginToken: resolveLoginToken(additionalInfoProp === null || additionalInfoProp === void 0 ? void 0 : additionalInfoProp.loginToken),
                    language: ((_g = userLang !== null && userLang !== void 0 ? userLang : (_f = (_d = memori.culture) === null || _d === void 0 ? void 0 : _d.split('-')) === null || _f === void 0 ? void 0 : _f[0]) !== null && _g !== void 0 ? _g : 'IT').toLowerCase(),
                    referral: referral,
                    timeZoneOffset: new Date().getTimezoneOffset().toString(),
                },
            });
            if (sessionID && currentState && response.resultCode === 0) {
                setSessionId(sessionID);
                if (updateDialogState) {
                    setCurrentDialogState(currentState);
                    const sessionExpiredStatus = isSessionExpired && history.length > 1
                        ? t('sessionExpiredReopening')
                        : null;
                    if (sessionExpiredStatus && suppressHistoryUpdate) {
                        pushMessage({
                            text: '',
                            emitter: 'system',
                            fromUser: false,
                            initial: sessionExpiredStatus,
                            contextVars: {},
                            date: new Date().toISOString(),
                        });
                    }
                    if (currentState.emission && !suppressHistoryUpdate) {
                        const initialStatus = sessionExpiredStatus
                            ? sessionExpiredStatus
                            : history.length <= 1
                                ? true
                                : undefined;
                        history.length <= 1
                            ? setHistory([
                                {
                                    text: currentState.emission,
                                    emitter: currentState.emitter,
                                    media: (_h = currentState.emittedMedia) !== null && _h !== void 0 ? _h : currentState.media,
                                    fromUser: false,
                                    initial: (initialStatus === true
                                        ? true
                                        : initialStatus || undefined),
                                    contextVars: currentState.contextVars,
                                    date: currentState.currentDate,
                                    placeName: currentState.currentPlaceName,
                                    placeLatitude: currentState.currentLatitude,
                                    placeLongitude: currentState.currentLongitude,
                                    placeUncertaintyKm: currentState.currentUncertaintyKm,
                                    tag: currentState.currentTag,
                                    memoryTags: currentState.memoryTags,
                                },
                            ])
                            : pushMessage({
                                text: currentState.emission,
                                emitter: currentState.emitter,
                                media: (_j = currentState.emittedMedia) !== null && _j !== void 0 ? _j : currentState.media,
                                fromUser: false,
                                initial: (initialStatus === true
                                    ? true
                                    : initialStatus || undefined),
                                contextVars: currentState.contextVars,
                                date: currentState.currentDate,
                                placeName: currentState.currentPlaceName,
                                placeLatitude: currentState.currentLatitude,
                                placeLongitude: currentState.currentLongitude,
                                placeUncertaintyKm: currentState.currentUncertaintyKm,
                                tag: currentState.currentTag,
                                memoryTags: currentState.memoryTags,
                            });
                    }
                }
                setLoading(false);
                return {
                    dialogState: currentState,
                    sessionID,
                };
            }
            else if (response === null || response === void 0 ? void 0 : response.resultMessage.startsWith('This Memori is aged restricted')) {
                react_hot_toast_1.default.error(t('underageTwinSession', { age: minAge }));
            }
            else if ((response === null || response === void 0 ? void 0 : response.resultCode) === 403 &&
                memori.privacyType !== 'PUBLIC') {
                setMemoriPwd(undefined);
                setAuthModalState('password');
            }
            else {
                react_hot_toast_1.default.error(t((0, error_1.getErrori18nKey)(response.resultCode)));
            }
        }
        catch (err) {
            logWidgetError('reopenSession failed', err);
        }
        setLoading(false);
        return null;
    };
    const retryAfterExpiredSessionRef = (0, react_1.useRef)(() => Promise.resolve(null));
    retryAfterExpiredSessionRef.current = (params) => {
        const { text, media, translate = true, translatedText, hidden = false, typingText, useLoaderTextAsMsg = false, hasBatchQueued = false, expiredSessionID, continueFromChatLogID: continueFromChatLogIDParam, } = params;
        const continueFromSessionID = expiredSessionID !== null && expiredSessionID !== void 0 ? expiredSessionID : sessionId;
        const continueFromChatLogID = continueFromChatLogIDParam !== null && continueFromChatLogIDParam !== void 0 ? continueFromChatLogIDParam : chatLogID;
        const reopenAfterExpiry = () => {
            var _a, _b;
            return reopenSession(true, memoriPwd || memori.secretToken, memoriTokens, undefined, undefined, {
                LANG: userLang,
                PATHNAME: window.location.pathname,
                ROUTE: ((_b = (_a = window.location.pathname) === null || _a === void 0 ? void 0 : _a.split('/')) === null || _b === void 0 ? void 0 : _b.pop()) || '',
                ...(initialContextVars || {}),
            }, initialQuestion, undefined, undefined, continueFromChatLogID, continueFromSessionID, true, true);
        };
        const scheduleRetry = (newSessionID) => {
            setTimeout(() => {
                sendMessage(text, media, newSessionID, translate, translatedText, hidden, typingText, useLoaderTextAsMsg, hasBatchQueued, true);
            }, 500);
        };
        const handleReopenFailure = (state) => {
            setMemoriTyping(false);
            setTypingText(undefined);
            if (state === null && text && !hidden) {
                react_hot_toast_1.default.error(t('errors.SESSION_EXPIRED'));
            }
        };
        if (!text) {
            return reopenAfterExpiry().then(state => {
                if (!(state === null || state === void 0 ? void 0 : state.sessionID)) {
                    handleReopenFailure(state);
                }
                return state;
            });
        }
        return reopenAfterExpiry().then(state => {
            if (state === null || state === void 0 ? void 0 : state.sessionID) {
                scheduleRetry(state.sessionID);
            }
            else {
                handleReopenFailure(state);
            }
            return state;
        });
    };
    const changeTag = async (memoriId, sessionId, tag, pin) => {
        var _a, _b, _c, _d, _f, _g, _h;
        if (!memoriId || !sessionId) {
            return Promise.reject('Session not found');
        }
        try {
            const { currentState, resultCode } = await postTagChangedEvent(sessionId, tag !== null && tag !== void 0 ? tag : constants_1.anonTag);
            if (resultCode === 0) {
                let textResult = 0;
                if (tag !== constants_1.anonTag &&
                    pin &&
                    (currentState.state === 'X1a' || currentState.state === 'X1b')) {
                    const placeSpec = getPlaceSpecForEnterText(position);
                    const { resultCode: textResultCode } = await postTextEnteredEvent({
                        sessionId,
                        text: pin !== null && pin !== void 0 ? pin : '',
                        ...(memori.needsDateTime && {
                            dateUTC: (_a = luxon_1.DateTime.utc().toISO()) !== null && _a !== void 0 ? _a : undefined,
                        }),
                        ...(placeSpec !== undefined && { place: placeSpec }),
                    });
                    textResult = textResultCode;
                }
                if (textResult === 0) {
                    const { currentState, ...response } = await getSession(sessionId);
                    if (response.resultCode === 0 && !!currentState) {
                        return {
                            currentState,
                            sessionId,
                            ...response,
                        };
                    }
                }
                else if ([400, 401, 403, 404, 500].includes(resultCode)) {
                    let storageBirthDate = (0, configuration_1.getLocalConfig)('birthDate', undefined);
                    let referral;
                    try {
                        referral = (() => {
                            return window.location.href;
                        })();
                    }
                    catch (_j) {
                    }
                    fetchSession({
                        memoriID: (_b = memori.engineMemoriID) !== null && _b !== void 0 ? _b : '',
                        password: secret || memoriPwd || memori.secretToken,
                        tag: tag !== null && tag !== void 0 ? tag : personification === null || personification === void 0 ? void 0 : personification.tag,
                        pin: pin !== null && pin !== void 0 ? pin : personification === null || personification === void 0 ? void 0 : personification.pin,
                        initialContextVars: {
                            LANG: userLang,
                            PATHNAME: window.location.pathname,
                            ROUTE: ((_d = (_c = window.location.pathname) === null || _c === void 0 ? void 0 : _c.split('/')) === null || _d === void 0 ? void 0 : _d.pop()) || '',
                            ...(initialContextVars || {}),
                        },
                        initialQuestion,
                        birthDate: birthDate || storageBirthDate || undefined,
                        additionalInfo: {
                            ...(additionalInfo || {}),
                            loginToken: resolveLoginToken(),
                            language: ((_h = userLang !== null && userLang !== void 0 ? userLang : (_g = (_f = memori.culture) === null || _f === void 0 ? void 0 : _f.split('-')) === null || _g === void 0 ? void 0 : _g[0]) !== null && _h !== void 0 ? _h : 'IT').toLowerCase(),
                            referral: referral,
                            timeZoneOffset: new Date().getTimezoneOffset().toString(),
                        },
                    });
                }
                else if (!!currentState) {
                    return {
                        currentState,
                        sessionId,
                        resultCode,
                    };
                }
            }
        }
        catch (_e) {
            let err = _e;
            return Promise.reject(err);
        }
        return null;
    };
    const [userInteractionTimeout, setUserInteractionTimeout] = (0, react_1.useState)();
    const timeoutRef = (0, react_1.useRef)();
    const clearInteractionTimeout = () => {
        if (userInteractionTimeout) {
            clearTimeout(userInteractionTimeout);
            setUserInteractionTimeout(undefined);
        }
        if (timeoutRef === null || timeoutRef === void 0 ? void 0 : timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = undefined;
        }
    };
    (0, react_1.useEffect)(() => {
        return () => {
            setHasUserActivatedSpeak(false);
            setClickedStart(false);
            sessionStartingRef.current = false;
            clearInteractionTimeout();
            timeoutRef.current = undefined;
        };
    }, []);
    const [requestedListening, setRequestedListening] = (0, react_1.useState)(false);
    const startListeningRef = (0, react_1.useRef)(null);
    const ttsConfig = (0, react_1.useMemo)(() => {
        var _a, _b;
        return ({
            provider: ttsProvider,
            voice: (0, ttsVoiceUtility_1.getTTSVoice)(userLang || ((_b = (_a = memori.culture) === null || _a === void 0 ? void 0 : _a.split('-')) === null || _b === void 0 ? void 0 : _b[0]) || 'EN', ttsProvider, memori.voiceType),
            tenant: tenantID,
            region: 'westeurope',
            voiceType: memori.voiceType,
            layout: selectedLayout,
        });
    }, [ttsProvider, userLang, memori.culture, memori.voiceType, selectedLayout]);
    const sttConfig = (0, react_1.useMemo)(() => ({
        provider: ttsProvider,
        language: getCultureCodeByLanguage(userLang),
        tenant: tenantID,
    }), [ttsProvider, userLang]);
    const { speak: ttsSpeak, stop: ttsStop, isPlaying: isPlayingAudio, speakerMuted, toggleMute, hasUserActivatedSpeak, setHasUserActivatedSpeak, } = (0, useTTS_1.useTTS)(ttsConfig, {
        apiUrl: `${baseUrl}/api/tts`,
        continuousSpeech: continuousSpeech,
        preview: preview,
    }, autoStart, defaultEnableAudio, (_w = defaultSpeakerActive !== null && defaultSpeakerActive !== void 0 ? defaultSpeakerActive : integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.defaultSpeakerActive) !== null && _w !== void 0 ? _w : true);
    const shouldPlayAudio = (text) => {
        const currentSpeakerMuted = (0, configuration_1.getLocalConfig)('muteSpeaker', !defaultEnableAudio);
        return (text &&
            text.trim() &&
            !preview &&
            !currentSpeakerMuted &&
            defaultEnableAudio);
    };
    const processSpeechAndSendMessage = (text) => {
        if (!text || text.trim().length === 0) {
            return;
        }
        try {
            const message = (0, utils_1.stripDuplicates)(text);
            if (message.length > 0) {
                setUserMessage('');
                sendMessage(message);
            }
        }
        catch (_a) {
        }
    };
    const { isListening, startRecording, stopRecording, } = (0, useSTT_1.useSTT)(sttConfig, processSpeechAndSendMessage, {
        apiUrl: `${baseUrl}/api/stt`,
    }, defaultEnableAudio);
    const handleSpeak = async (text) => {
        if (!shouldPlayAudio(text)) {
            const e = new CustomEvent('MemoriEndSpeak');
            document.dispatchEvent(e);
            return Promise.resolve();
        }
        if (typeof stopRecording === 'function') {
            stopRecording();
        }
        setHasUserTypedMessage(false);
        const processedText = (0, sanitizer_1.sanitizeText)(text);
        return ttsSpeak(processedText);
    };
    const translateAndSpeak = (0, react_1.useCallback)(async (dialogState, language, msg, skipEmission = false) => {
        try {
            if (!dialogState) {
                return null;
            }
            const translatedState = await translateDialogState(dialogState, language, msg, skipEmission);
            const textToSpeak = translatedState.translatedEmission || translatedState.emission;
            if (!hasUserActivatedSpeak) {
                setHasUserActivatedSpeak(true);
            }
            if (textToSpeak && !skipEmission && shouldPlayAudio(textToSpeak)) {
                await handleSpeak(textToSpeak);
            }
            return translatedState;
        }
        catch (_a) {
            if (!hasUserActivatedSpeak) {
                setHasUserActivatedSpeak(true);
            }
            return dialogState;
        }
    }, [
        translateDialogState,
        handleSpeak,
        hasUserActivatedSpeak,
        setHasUserActivatedSpeak,
        speakerMuted,
    ]);
    const processEnterTextDialogResponse = (0, react_1.useCallback)((event, pending) => {
        var _a, _b;
        const { msg, typingText: pendingTypingText, useLoaderTextAsMsg, } = pending;
        const currentState = event.currentState;
        if (event.resultCode !== 0 || !currentState) {
            if ((0, isSessionExpiredError_1.isSessionExpiredNatsResponse)(event) && pending.text) {
                setMemoriTyping(false);
                setTypingText(undefined);
                retryAfterExpiredSessionRef.current({
                    text: pending.text,
                    media: pending.media,
                    translate: pending.translate,
                    translatedText: pending.translatedText,
                    hidden: pending.hidden,
                    typingText: pending.typingText,
                    useLoaderTextAsMsg: pending.useLoaderTextAsMsg,
                    hasBatchQueued: pending.hasBatchQueued,
                    expiredSessionID: sessionId,
                    continueFromChatLogID: chatLogID,
                });
                return;
            }
            if (event.resultCode === 500 && event.resultMessage) {
                setHistory(h => [
                    ...h,
                    {
                        text: 'Error: ' + event.resultMessage,
                        emitter: 'system',
                        fromUser: false,
                        initial: false,
                        contextVars: {},
                        date: new Date().toISOString(),
                    },
                ]);
            }
            return;
        }
        if (!msg) {
            return;
        }
        setChatLogID(undefined);
        const emission = useLoaderTextAsMsg && pendingTypingText
            ? pendingTypingText
            : (_a = currentState.emission) !== null && _a !== void 0 ? _a : currentDialogState === null || currentDialogState === void 0 ? void 0 : currentDialogState.emission;
        if (userLang.toLowerCase() !== language.toLowerCase() &&
            emission &&
            isMultilanguageEnabled) {
            currentState.emission = emission;
            translateDialogState(currentState, userLang, msg).then(ts => {
                const text = ts.translatedEmission || ts.emission;
                if (text && shouldPlayAudio(text)) {
                    handleSpeak(text);
                }
            });
        }
        else {
            setCurrentDialogState({
                ...currentState,
                emission,
            });
            if (emission) {
                pushMessage({
                    text: emission,
                    emitter: currentState.emitter,
                    media: (_b = currentState.emittedMedia) !== null && _b !== void 0 ? _b : currentState.media,
                    llmUsage: currentState.llmUsage,
                    fromUser: false,
                    questionAnswered: msg,
                    generatedByAI: !!currentState.completion,
                    contextVars: currentState.contextVars,
                    date: currentState.currentDate,
                    placeName: currentState.currentPlaceName,
                    placeLatitude: currentState.currentLatitude,
                    placeLongitude: currentState.currentLongitude,
                    placeUncertaintyKm: currentState.currentUncertaintyKm,
                    tag: currentState.currentTag,
                    memoryTags: currentState.memoryTags,
                });
                if (emission && shouldPlayAudio(emission)) {
                    handleSpeak(emission);
                }
            }
        }
    }, [
        userLang,
        language,
        isMultilanguageEnabled,
        currentDialogState === null || currentDialogState === void 0 ? void 0 : currentDialogState.emission,
        translateDialogState,
        handleSpeak,
        shouldPlayAudio,
    ]);
    const clearEnterTextPending = (0, react_1.useCallback)((correlationID, pending) => {
        var _a;
        if ((_a = pending.waitForResponse) === null || _a === void 0 ? void 0 : _a.timeoutId) {
            clearTimeout(pending.waitForResponse.timeoutId);
        }
        pendingEnterTextRef.current.delete(correlationID);
    }, []);
    const deliverEnterTextNatsError = (0, react_1.useCallback)((event) => {
        var _a, _b, _c;
        const correlationID = event.correlationID;
        let pending;
        if (correlationID) {
            pending = pendingEnterTextRef.current.get(correlationID);
            if (pending) {
                clearEnterTextPending(correlationID, pending);
                (_a = pending.waitForResponse) === null || _a === void 0 ? void 0 : _a.reject(new Error((_b = event.errorMessage) !== null && _b !== void 0 ? _b : String((_c = event.errorCode) !== null && _c !== void 0 ? _c : 'NATS error')));
            }
        }
        if ((0, isSessionExpiredError_1.isSessionExpiredNatsError)(event) && (pending === null || pending === void 0 ? void 0 : pending.text)) {
            setMemoriTyping(false);
            setTypingText(undefined);
            retryAfterExpiredSessionRef.current({
                text: pending.text,
                media: pending.media,
                translate: pending.translate,
                translatedText: pending.translatedText,
                hidden: pending.hidden,
                typingText: pending.typingText,
                useLoaderTextAsMsg: pending.useLoaderTextAsMsg,
                hasBatchQueued: pending.hasBatchQueued,
                expiredSessionID: sessionId,
                continueFromChatLogID: chatLogID,
            });
            return;
        }
        const errorText = event.errorMessage
            ? `Error: ${event.errorMessage}`
            : event.errorCode
                ? `Error: ${event.errorCode}`
                : 'Error: An unexpected error occurred';
        pushMessage({
            text: errorText,
            emitter: 'system',
            fromUser: false,
            initial: false,
            contextVars: {},
            date: new Date().toISOString(),
        });
        setMemoriTyping(false);
        setTypingText(undefined);
    }, [clearEnterTextPending]);
    const deliverEnterTextNatsResponse = (0, react_1.useCallback)((correlationID, event) => {
        const pending = pendingEnterTextRef.current.get(correlationID);
        if (!pending) {
            bufferedNatsResponsesRef.current.set(correlationID, event);
            return;
        }
        clearEnterTextPending(correlationID, pending);
        if (pending.waitForResponse) {
            pending.waitForResponse.resolve(event);
            setMemoriTyping(false);
            setTypingText(undefined);
            return;
        }
        processEnterTextDialogResponse(event, pending);
        if (!pending.hasBatchQueued) {
            setMemoriTyping(false);
            setTypingText(undefined);
        }
    }, [processEnterTextDialogResponse, clearEnterTextPending]);
    const registerPendingEnterText = (0, react_1.useCallback)((correlationID, pending) => {
        const buffered = bufferedNatsResponsesRef.current.get(correlationID);
        if (buffered) {
            bufferedNatsResponsesRef.current.delete(correlationID);
            pendingEnterTextRef.current.set(correlationID, pending);
            deliverEnterTextNatsResponse(correlationID, buffered);
            return;
        }
        pendingEnterTextRef.current.set(correlationID, pending);
    }, [deliverEnterTextNatsResponse]);
    const waitForEnterTextNatsResponse = (0, react_1.useCallback)((correlationID, timeoutMs = 120000) => new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            const current = pendingEnterTextRef.current.get(correlationID);
            if (current) {
                clearEnterTextPending(correlationID, current);
            }
            logWidgetError('NATS timeout', { correlationID, timeoutMs });
            reject(new Error('NATS enter-text response timeout'));
        }, timeoutMs);
        registerPendingEnterText(correlationID, {
            stateBeforeRequest: dialogStateFingerprint(currentDialogState),
            waitForResponse: {
                resolve: event => {
                    clearTimeout(timeoutId);
                    resolve(event);
                },
                reject: error => {
                    clearTimeout(timeoutId);
                    reject(error);
                },
                timeoutId,
            },
        });
    }), [registerPendingEnterText, clearEnterTextPending, currentDialogState]);
    const catchUpPendingEnterText = (0, react_1.useCallback)(async () => {
        if (!sessionId || pendingEnterTextRef.current.size === 0)
            return;
        const latest = Array.from(pendingEnterTextRef.current.entries()).pop();
        if (!latest)
            return;
        const [correlationID, pending] = latest;
        try {
            const { currentState, resultCode, resultMessage, requestID } = await getSession(sessionId);
            if (resultCode !== 0 || !currentState) {
                deliverEnterTextNatsResponse(correlationID, {
                    eventType: 'dialog_text_entered_response',
                    correlationID,
                    requestID,
                    resultCode,
                    resultMessage,
                    currentState,
                });
                return;
            }
            if (dialogStateFingerprint(currentState) === pending.stateBeforeRequest) {
                console.info('[NATS] catch-up: pending turn has not completed yet');
                return;
            }
            console.info('[NATS] catch-up: applying current engine session state');
            deliverEnterTextNatsResponse(correlationID, {
                eventType: 'dialog_text_entered_response',
                correlationID,
                requestID,
                resultCode,
                resultMessage,
                currentState,
            });
        }
        catch (error) {
            logWidgetError('NATS catch-up failed', error);
        }
    }, [sessionId, deliverEnterTextNatsResponse]);
    (0, useNats_1.useNats)({
        baseUrl,
        sessionId,
        onProgress: (0, react_1.useCallback)((event) => {
            if (event.message) {
                setTypingText(event.message);
            }
        }, []),
        onDialogResponse: (0, react_1.useCallback)((event) => {
            const correlationID = event.correlationID;
            if (!correlationID) {
                logWidgetError('NATS dialog response missing correlationID', event);
                setMemoriTyping(false);
                setTypingText(undefined);
                return;
            }
            deliverEnterTextNatsResponse(correlationID, event);
        }, [deliverEnterTextNatsResponse]),
        onError: deliverEnterTextNatsError,
        onCatchUp: catchUpPendingEnterText,
    });
    const focusChatInput = () => {
        let textarea = document.querySelector('#chat-fieldset textarea');
        if (textarea && enableFocusChatInput) {
            textarea.focus();
        }
        else {
            textarea === null || textarea === void 0 ? void 0 : textarea.blur();
        }
    };
    (0, react_1.useEffect)(() => {
        if (selectedLayout !== 'TOTEM') {
            focusChatInput();
        }
    }, [currentDialogState === null || currentDialogState === void 0 ? void 0 : currentDialogState.emission]);
    const resetUIEffects = () => {
        try {
            clearInteractionTimeout();
            setClickedStart(false);
            timeoutRef.current = undefined;
            ttsStop();
        }
        catch (_a) {
        }
    };
    (0, react_1.useEffect)(() => {
        return () => {
            resetUIEffects();
        };
    }, []);
    (0, react_1.useEffect)(() => {
        document.addEventListener('MemoriResetUIEffects', resetUIEffects);
        return () => {
            document.removeEventListener('MemoriResetUIEffects', resetUIEffects);
        };
    }, []);
    (0, react_1.useEffect)(() => {
        if (!isPlayingAudio &&
            continuousSpeech &&
            (hasUserActivatedListening || !requestedListening) &&
            sessionId &&
            !hasUserTypedMessage) {
            startRecording();
        }
        else if (isPlayingAudio && isListening) {
            stopRecording();
        }
    }, [isPlayingAudio, hasUserActivatedListening, hasUserTypedMessage]);
    (0, react_1.useEffect)(() => {
        stopRecording();
    }, [language]);
    const [sendOnEnter, setSendOnEnter] = (0, react_1.useState)('keypress');
    (0, react_1.useEffect)(() => {
        if (window.innerWidth <= 768 && (0, utils_1.hasTouchscreen)())
            setSendOnEnter('click');
        else
            setSendOnEnter('keypress');
    }, []);
    const [attachmentsMenuOpen, setAttachmentsMenuOpen] = (0, react_1.useState)();
    const globalBackground = integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.globalBackground;
    const globalBackgroundUrl = globalBackground
        ? `url(${globalBackground})`
        : null;
    const integrationProperties = (integration
        ? {
            '--memori-chat-bubble-bg': '#fff',
            ...(integrationConfig && !instruct
                ? { '--memori-text-color': (_x = integrationConfig.textColor) !== null && _x !== void 0 ? _x : '#000' }
                : {}),
            ...((integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.buttonBgColor)
                ? {
                    '--memori-button-bg': integrationConfig.buttonBgColor,
                    '--memori-primary': integrationConfig.buttonBgColor,
                }
                : {}),
            ...((integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.buttonTextColor)
                ? {
                    '--memori-button-text': integrationConfig.buttonTextColor,
                }
                : {}),
            ...((integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.blurBackground)
                ? {
                    '--memori-blur-background': '5px',
                }
                : {
                    '--memori-blur-background': '0px',
                }),
            ...((integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.innerBgColor)
                ? {
                    '--memori-inner-bg': `rgba(${integrationConfig.innerBgColor === 'dark'
                        ? '0, 0, 0'
                        : '255, 255, 255'}, ${(_y = integrationConfig.innerBgAlpha) !== null && _y !== void 0 ? _y : 0.4})`,
                    '--memori-inner-content-pad': '1.5rem',
                    '--memori-nav-bg-image': 'none',
                    '--memori-nav-bg': `rgba(${integrationConfig.innerBgColor === 'dark'
                        ? '0, 0, 0'
                        : '255, 255, 255'}, ${(_z = integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.innerBgAlpha) !== null && _z !== void 0 ? _z : 0.4})`,
                }
                : {
                    '--memori-inner-content-pad': '0px',
                }),
        }
        : {});
    const integrationStylesheet = `
    ${preview ? '#preview, ' : applyVarsToRoot ? ':root, ' : ''}memori-client, .memori-widget, .memori-drawer, .memori-modal {
      ${Object.entries(integrationProperties)
        .map(([key, value]) => `${key}: ${value};`)
        .join('\n')}
    }
  `;
    const showAIicon = (integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.showAIicon) === undefined
        ? true
        : integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.showAIicon;
    const enableUpload = !!(showUpload !== null && showUpload !== void 0 ? showUpload : integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.showUpload);
    const enableReasoning = !!(showReasoning !== null && showReasoning !== void 0 ? showReasoning : integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.showReasoning);
    const enableMessageConsumption = !!runtimeShowMessageConsumption;
    const showWhyThisAnswer = (integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.showWhyThisAnswer) === undefined
        ? true
        : integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.showWhyThisAnswer;
    const [avatar3dVisible, setAvatar3dVisible] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if ((window.innerWidth >= 768 && selectedLayout === 'FULLPAGE') ||
            selectedLayout !== 'FULLPAGE') {
            setAvatar3dVisible(true);
        }
    }, []);
    (0, react_1.useEffect)(() => {
        if (integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.seoTitle) {
            let meta = document.createElement('meta');
            meta.setAttribute('property', 'og:title');
            meta.setAttribute('content', integrationConfig.seoTitle);
            document.head.append(meta);
        }
        if (integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.seoDescription) {
            let meta = document.createElement('meta');
            meta.setAttribute('property', 'og:description');
            meta.setAttribute('content', integrationConfig.seoDescription);
            document.head.append(meta);
        }
        if (integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.seoUrl) {
            let meta = document.createElement('meta');
            meta.setAttribute('property', 'og:url');
            meta.setAttribute('content', integrationConfig.seoUrl);
            document.head.append(meta);
        }
        let image = ogImage || memori.avatarURL;
        if ((integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.seoImageShowAvatar) && image) {
            let meta = document.createElement('meta');
            meta.setAttribute('property', 'og:image');
            meta.setAttribute('content', image);
            document.head.append(meta);
        }
    }, [integrationConfig, memori.avatarURL, ogImage]);
    const simulateUserPrompt = (text, translatedText) => {
        ttsStop();
        sendMessage(text, undefined, undefined, false, translatedText);
    };
    const memoriTextEnteredHandler = (0, react_1.useCallback)((e) => {
        if (disableTextEnteredEvents) {
            return;
        }
        const { text, waitForPrevious, hidden, typingText, useLoaderTextAsMsg, hasBatchQueued, } = e.detail;
        if (text) {
            if (waitForPrevious &&
                !speakerMuted &&
                (memoriSpeaking || !!memoriTyping)) {
                setTimeout(() => {
                    memoriTextEnteredHandler(e);
                }, 1000);
            }
            else {
                ttsStop();
                sendMessage(text, undefined, undefined, undefined, undefined, hidden, typingText, useLoaderTextAsMsg, hasBatchQueued);
            }
        }
    }, [
        sessionId,
        isPlayingAudio,
        memoriTyping,
        userLang,
        disableTextEnteredEvents,
        speakerMuted,
    ]);
    (0, react_1.useEffect)(() => {
        if (!disableTextEnteredEvents) {
            document.addEventListener('MemoriTextEntered', memoriTextEnteredHandler);
        }
        else {
            document.removeEventListener('MemoriTextEntered', memoriTextEnteredHandler);
        }
        return () => {
            document.removeEventListener('MemoriTextEntered', memoriTextEnteredHandler);
        };
    }, [sessionId, userLang, disableTextEnteredEvents]);
    const onClickStart = (0, react_1.useCallback)(async (session, initialSessionExpired = false, chatLog, targetSessionID) => {
        var _a, _b, _c, _d, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        const sessionID = chatLog ? undefined : (session === null || session === void 0 ? void 0 : session.sessionID) || sessionId;
        const dialogState = chatLog
            ? undefined
            : (session === null || session === void 0 ? void 0 : session.dialogState) || currentDialogState;
        setClickedStart(true);
        setHasUserTypedMessage(false);
        let translatedMessages = [];
        let storageBirthDate = (0, configuration_1.getLocalConfig)('birthDate', undefined);
        let birth = birthDate || storageBirthDate || (user === null || user === void 0 ? void 0 : user.birthDate);
        if (!birth && autoStart && (initialSessionID || targetSessionID))
            birth = '1970-01-01T10:24:03.845Z';
        const localPosition = (0, configuration_1.getLocalConfig)('position', undefined);
        if (autoStart && !localPosition && memori.needsPosition) {
            setShowPositionDrawer(true);
            return;
        }
        if (!(await checkCredits({ notify: true }))) {
            setClickedStart(false);
            setLoading(false);
            return;
        }
        if (!sessionID && !!minAge && !birth) {
            setShowAgeVerification(true);
            setClickedStart(false);
            return;
        }
        else if (!sessionID &&
            memori.privacyType !== 'PUBLIC' &&
            !memori.secretToken &&
            !memoriPwd &&
            !memoriTokens) {
            setAuthModalState('password');
            setClickedStart(false);
            return;
        }
        else if (!sessionID || initialSessionExpired) {
            if (sessionStartingRef.current) {
                return;
            }
            sessionStartingRef.current = true;
            try {
                const session = await fetchSession({
                    memoriID: memori.engineMemoriID,
                    password: secret || memoriPwd || memori.secretToken,
                    tag: personification === null || personification === void 0 ? void 0 : personification.tag,
                    pin: personification === null || personification === void 0 ? void 0 : personification.pin,
                    continueFromChatLogID: chatLog === null || chatLog === void 0 ? void 0 : chatLog.chatLogID,
                    initialContextVars: {
                        LANG: userLang,
                        PATHNAME: (_a = window.location.pathname) === null || _a === void 0 ? void 0 : _a.toUpperCase(),
                        ROUTE: ((_d = (_c = (_b = window.location.pathname) === null || _b === void 0 ? void 0 : _b.split('/')) === null || _c === void 0 ? void 0 : _c.pop()) === null || _d === void 0 ? void 0 : _d.toUpperCase()) ||
                            '',
                        ...((!chatLog
                            ? initialContextVars
                            : chatLog.lines[chatLog.lines.length - 1].contextVars) || {}),
                    },
                    initialQuestion: chatLog ? undefined : initialQuestion,
                    birthDate: birth,
                    additionalInfo: {
                        ...(additionalInfo || {}),
                        loginToken: resolveLoginToken(),
                        language: ((_h = userLang !== null && userLang !== void 0 ? userLang : (_g = (_f = memori.culture) === null || _f === void 0 ? void 0 : _f.split('-')) === null || _g === void 0 ? void 0 : _g[0]) !== null && _h !== void 0 ? _h : 'IT').toLowerCase(),
                        timeZoneOffset: new Date().getTimezoneOffset().toString(),
                    },
                });
                if (session === null || session === void 0 ? void 0 : session.dialogState) {
                    if (!chatLog) {
                        setHistory([]);
                        await translateAndSpeak(session.dialogState, userLang);
                        setHasUserActivatedSpeak(true);
                        setClickedStart(false);
                    }
                    else {
                        const messages = chatLog.lines.map((l, i) => {
                            var _a, _b;
                            return ({
                                text: l.text,
                                media: (_b = (_a = l.media) === null || _a === void 0 ? void 0 : _a.filter(m => constants_1.allowedMediaTypes.includes(m.mimeType))) === null || _b === void 0 ? void 0 : _b.map(m => ({
                                    mediumID: `${i}-${m.mimeType}`,
                                    ...m,
                                })),
                                fromUser: l.inbound,
                                llmUsage: l.llmUsage,
                                timestamp: l.timestamp,
                                emitter: l.emitter,
                                initial: i === 0,
                            });
                        });
                        translatedMessages = messages !== null && messages !== void 0 ? messages : [];
                        if (language.toUpperCase() !== userLang.toUpperCase() &&
                            isMultilanguageEnabled) {
                            try {
                                translatedMessages = await Promise.all(messages.map(async (m) => {
                                    if ('originalText' in m && m.originalText) {
                                        return m;
                                    }
                                    return {
                                        ...m,
                                        originalText: m.text,
                                        text: (await (0, translations_1.getTranslation)(m.text, userLang, language, baseUrl)).text,
                                    };
                                }));
                            }
                            catch (_u) {
                            }
                        }
                        setHistory(translatedMessages);
                        translateDialogState(session.dialogState, userLang, undefined, true).finally(() => {
                            setHasUserActivatedSpeak(true);
                            setClickedStart(false);
                        });
                    }
                }
                else if ((session === null || session === void 0 ? void 0 : session.resultCode) === 0) {
                    sessionStartingRef.current = false;
                    await onClickStart(session || undefined);
                }
                else {
                    setLoading(false);
                    setClickedStart(false);
                }
            }
            finally {
                sessionStartingRef.current = false;
            }
            return;
        }
        else if (initialSessionID || targetSessionID) {
            const sessionID = targetSessionID !== null && targetSessionID !== void 0 ? targetSessionID : initialSessionID;
            const { currentState, ...response } = await getSession(sessionID);
            if (response.resultCode !== 0 || !currentState) {
                const { chatLogs } = await getSessionChatLogs(sessionID, sessionID);
                setSessionId(undefined);
                await onClickStart(undefined, true, chatLogs === null || chatLogs === void 0 ? void 0 : chatLogs[0]);
                return;
            }
            setHistory([]);
            if (personification &&
                currentState.currentTag !== personification.tag) {
                try {
                    await changeTag(memori.engineMemoriID, sessionID, '-');
                    const session = await changeTag(memori.engineMemoriID, sessionID, personification.tag, personification.pin);
                    if (session && session.resultCode === 0) {
                        await translateAndSpeak(session.currentState, userLang);
                        setClickedStart(false);
                    }
                    else {
                        throw new Error('No session');
                    }
                }
                catch (_v) {
                    reopenSession(true, memori === null || memori === void 0 ? void 0 : memori.secretToken, undefined, personification.tag, personification.pin, {
                        LANG: userLang,
                        PATHNAME: (_j = window.location.pathname) === null || _j === void 0 ? void 0 : _j.toUpperCase(),
                        ROUTE: ((_m = (_l = (_k = window.location.pathname) === null || _k === void 0 ? void 0 : _k.split('/')) === null || _l === void 0 ? void 0 : _l.pop()) === null || _m === void 0 ? void 0 : _m.toUpperCase()) ||
                            '',
                        ...(initialContextVars || {}),
                    }, initialQuestion, birth).then(() => {
                        setHasUserActivatedSpeak(true);
                        setClickedStart(false);
                    });
                }
            }
            else if (!personification &&
                (currentState === null || currentState === void 0 ? void 0 : currentState.currentTag) &&
                (currentState === null || currentState === void 0 ? void 0 : currentState.currentTag) !== constants_1.anonTag &&
                (currentState === null || currentState === void 0 ? void 0 : currentState.currentTag) !== '-') {
                try {
                    await changeTag(memori.engineMemoriID, sessionID, '-');
                    const session = await changeTag(memori.engineMemoriID, sessionID, constants_1.anonTag);
                    if (session && session.resultCode === 0) {
                        await translateAndSpeak(session.currentState, userLang);
                        setClickedStart(false);
                    }
                    else {
                        throw new Error('No session');
                    }
                }
                catch (e) {
                    reopenSession(true, memori === null || memori === void 0 ? void 0 : memori.secretToken, undefined, undefined, undefined, {
                        LANG: userLang,
                        PATHNAME: (_o = window.location.pathname) === null || _o === void 0 ? void 0 : _o.toUpperCase(),
                        ROUTE: ((_r = (_q = (_p = window.location.pathname) === null || _p === void 0 ? void 0 : _p.split('/')) === null || _q === void 0 ? void 0 : _q.pop()) === null || _r === void 0 ? void 0 : _r.toUpperCase()) ||
                            '',
                        ...(initialContextVars || {}),
                    }, initialQuestion, birth).then(() => {
                        setHasUserActivatedSpeak(true);
                        setClickedStart(false);
                    });
                }
            }
            else {
                try {
                    const { chatLogs } = await getSessionChatLogs(sessionID, sessionID);
                    const messages = (_s = chatLogs === null || chatLogs === void 0 ? void 0 : chatLogs[0]) === null || _s === void 0 ? void 0 : _s.lines.map((l, i) => {
                        var _a, _b;
                        return ({
                            text: l.text,
                            media: (_b = (_a = l.media) === null || _a === void 0 ? void 0 : _a.filter(m => constants_1.allowedMediaTypes.includes(m.mimeType))) === null || _b === void 0 ? void 0 : _b.map(m => ({
                                mediumID: `${i}-${m.mimeType}`,
                                ...m,
                            })),
                            fromUser: l.inbound,
                            llmUsage: l.llmUsage,
                            timestamp: l.timestamp,
                            emitter: l.emitter,
                            initial: i === 0,
                        });
                    });
                    translatedMessages = messages !== null && messages !== void 0 ? messages : [];
                    if (language.toUpperCase() !== userLang.toUpperCase() &&
                        isMultilanguageEnabled) {
                        try {
                            translatedMessages = await Promise.all(messages.map(async (m) => ({
                                ...m,
                                originalText: m.text,
                                text: (await (0, translations_1.getTranslation)(m.text, userLang, language, baseUrl)).text,
                            })));
                        }
                        catch (_w) {
                        }
                    }
                    setHistory(translatedMessages);
                }
                catch (_x) {
                }
                if ((!!(translatedMessages === null || translatedMessages === void 0 ? void 0 : translatedMessages.length) && translatedMessages.length > 1) ||
                    !initialQuestion) {
                    setHasUserActivatedSpeak(true);
                    setClickedStart(false);
                    await translateAndSpeak(currentState, userLang, undefined, !!(translatedMessages === null || translatedMessages === void 0 ? void 0 : translatedMessages.length));
                }
                else {
                    translatedMessages = [];
                    setHistory([]);
                    const placeSpec = getPlaceSpecForEnterText(position);
                    const response = await postEnterTextAsync({
                        sessionId: sessionID,
                        text: initialQuestion,
                        ...(memori.needsDateTime && {
                            dateUTC: (_t = luxon_1.DateTime.utc().toISO()) !== null && _t !== void 0 ? _t : undefined,
                        }),
                        ...(placeSpec !== undefined && { place: placeSpec }),
                    });
                    if (response.resultCode === 500 && response.resultMessage) {
                        setHistory(h => [
                            ...h,
                            {
                                text: 'Error: ' + response.resultMessage,
                                emitter: 'system',
                                fromUser: false,
                                initial: false,
                                contextVars: {},
                                date: new Date().toISOString(),
                            },
                        ]);
                        return;
                    }
                    const onClickStartCorrelationID = readCorrelationID(response);
                    if (response.resultCode === 0 && onClickStartCorrelationID) {
                        setMemoriTyping(true);
                        try {
                            const natsEvent = await waitForEnterTextNatsResponse(onClickStartCorrelationID);
                            if (natsEvent.resultCode === 0 && natsEvent.currentState) {
                                await translateAndSpeak(natsEvent.currentState, userLang, undefined, false);
                                setClickedStart(false);
                            }
                        }
                        catch (err) {
                            logWidgetError('onClickStart NATS wait failed', err);
                            setMemoriTyping(false);
                            setTypingText(undefined);
                        }
                    }
                    else if (response.resultCode === 0) {
                        logWidgetError('onClickStart enter-text missing correlationID', response);
                    }
                }
            }
        }
        else {
            setHistory([]);
            await translateAndSpeak(dialogState, userLang);
            setClickedStart(false);
        }
    }, [memoriPwd, memori, memoriTokens, birthDate, sessionId, userLang, position]);
    const needsCredits = tenant === null || tenant === void 0 ? void 0 : tenant.billingDelegation;
    const [hasEnoughCredits, setHasEnoughCredits] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        if (!clickedStart &&
            !sessionStartingRef.current &&
            !sessionId &&
            autoStart &&
            selectedLayout !== 'HIDDEN_CHAT' &&
            (!needsCredits || hasEnoughCredits)) {
            onClickStart();
        }
    }, [
        clickedStart,
        autoStart,
        selectedLayout,
        sessionId,
        needsCredits,
        hasEnoughCredits,
    ]);
    (0, react_1.useEffect)(() => {
        var _a;
        const targetNode = document.querySelector(`memori-client[memoriname="${memori.name}"]`) ||
            document.querySelector(`memori-client[memoriid="${memori.memoriID}"]`) ||
            document.querySelector('memori-client');
        if (!targetNode) {
            return;
        }
        const propsToken = (_a = additionalInfo === null || additionalInfo === void 0 ? void 0 : additionalInfo.loginToken) !== null && _a !== void 0 ? _a : authToken;
        const initialDomToken = targetNode.getAttribute('authtoken') || undefined;
        if (initialDomToken && !propsToken) {
            setLoginToken(initialDomToken);
            userTokenRef.current = initialDomToken;
        }
        const applyAuthTokenFromElement = (element) => {
            var _a;
            const clientNode = element.nodeName === 'MEMORI-CLIENT'
                ? element
                : (_a = element.closest('memori-client')) !== null && _a !== void 0 ? _a : element.parentElement;
            const token = (clientNode === null || clientNode === void 0 ? void 0 : clientNode.getAttribute('authtoken')) || undefined;
            setLoginToken(token);
            userTokenRef.current = token;
        };
        const config = { attributes: true, childList: false, subtree: false };
        const callback = mutationList => {
            var _a;
            for (const mutation of mutationList) {
                if (mutation.type === 'attributes' &&
                    ((_a = mutation.attributeName) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'authtoken') {
                    applyAuthTokenFromElement(mutation.target);
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
        return () => {
            observer.disconnect();
        };
    }, [memori.name, memori.memoriID, additionalInfo === null || additionalInfo === void 0 ? void 0 : additionalInfo.loginToken, authToken]);
    const [experts, setExperts] = (0, react_1.useState)();
    const fetchExperts = (0, react_1.useCallback)(async () => {
        if (!sessionId || !(memori === null || memori === void 0 ? void 0 : memori.enableBoardOfExperts))
            return;
        try {
            const { experts, count, ...resp } = await getExpertReferences(sessionId);
            if (resp.resultCode === 0) {
                setExperts(experts);
            }
        }
        catch (_a) {
        }
    }, [sessionId, memori === null || memori === void 0 ? void 0 : memori.enableBoardOfExperts]);
    (0, react_1.useEffect)(() => {
        fetchExperts();
    }, [sessionId, fetchExperts]);
    const deepThoughtEnabled = memori.enableDeepThought &&
        !!loginToken &&
        !!(user === null || user === void 0 ? void 0 : user.userID) &&
        (user === null || user === void 0 ? void 0 : user.pAndCUAccepted);
    const handleNotEnoughCredits = (0, react_1.useCallback)(() => {
        setHasEnoughCredits(false);
        setAuthModalState(null);
        react_hot_toast_1.default.error(t('notEnoughCredits'));
    }, [t]);
    const checkCredits = (0, react_1.useCallback)(async (options) => {
        if (!(tenant === null || tenant === void 0 ? void 0 : tenant.billingDelegation))
            return true;
        if (!ownerUserID && !ownerUserName) {
            if (options === null || options === void 0 ? void 0 : options.notify) {
                handleNotEnoughCredits();
            }
            else {
                setHasEnoughCredits(false);
            }
            return false;
        }
        try {
            const resp = await (0, credits_1.getCredits)({
                operation: deepThoughtEnabled
                    ? 'dt_session_creation'
                    : 'session_creation',
                baseUrl: baseUrl,
                userID: ownerUserID,
                userName: ownerUserName,
                tenant: tenantID,
            });
            if (resp.enough) {
                setHasEnoughCredits(true);
                return true;
            }
            else {
                if (options === null || options === void 0 ? void 0 : options.notify) {
                    handleNotEnoughCredits();
                }
                else {
                    setHasEnoughCredits(false);
                }
                return false;
            }
        }
        catch (err) {
            logWidgetError('checkCredits failed', err);
            return true;
        }
    }, [
        baseUrl,
        deepThoughtEnabled,
        handleNotEnoughCredits,
        ownerUserID,
        ownerUserName,
        tenant === null || tenant === void 0 ? void 0 : tenant.billingDelegation,
        tenantID,
    ]);
    (0, react_1.useEffect)(() => {
        if (tenant === null || tenant === void 0 ? void 0 : tenant.billingDelegation) {
            checkCredits();
        }
    }, [tenant === null || tenant === void 0 ? void 0 : tenant.billingDelegation, deepThoughtEnabled, checkCredits]);
    (0, react_1.useEffect)(() => {
        if (__WEBCOMPONENT__)
            return;
        const closeSession = () => {
            if (sessionId) {
                deleteSession(sessionId);
            }
        };
        window.addEventListener('beforeunload', closeSession);
        return () => {
            window.removeEventListener('beforeunload', closeSession);
            closeSession();
        };
    }, [sessionId]);
    const showFullHistory = showOnlyLastMessages === undefined
        ? selectedLayout !== 'TOTEM' && selectedLayout !== 'WEBSITE_ASSISTANT'
        : !showOnlyLastMessages;
    const canShowLoginButton = !(tenant === null || tenant === void 0 ? void 0 : tenant.ssoLogin) &&
        ((_0 = showLogin !== null && showLogin !== void 0 ? showLogin : integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.showLogin) !== null && _0 !== void 0 ? _0 : memori.requireLoginToken);
    const headerProps = {
        memori: {
            ...memori,
            ownerUserID: (_2 = (_1 = memori.ownerUserID) !== null && _1 !== void 0 ? _1 : ownerUserID) !== null && _2 !== void 0 ? _2 : undefined,
        },
        apiClient: client,
        tenant,
        history,
        showShare: (_3 = showShare !== null && showShare !== void 0 ? showShare : integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.showShare) !== null && _3 !== void 0 ? _3 : true,
        position,
        layout: selectedLayout,
        additionalSettings,
        setShowPositionDrawer,
        setShowSettingsDrawer,
        setShowKnownFactsDrawer,
        setShowExpertsDrawer,
        enableAudio: (_4 = enableAudio !== null && enableAudio !== void 0 ? enableAudio : integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.enableAudio) !== null && _4 !== void 0 ? _4 : true,
        speakerMuted: speakerMuted !== null && speakerMuted !== void 0 ? speakerMuted : false,
        setSpeakerMuted: (mute) => {
            toggleMute(mute);
        },
        setShowChatHistoryDrawer,
        showSettings: (_5 = showSettings !== null && showSettings !== void 0 ? showSettings : integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.showSettings) !== null && _5 !== void 0 ? _5 : true,
        showChatHistory: (_6 = showChatHistory !== null && showChatHistory !== void 0 ? showChatHistory : integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.showChatHistory) !== null && _6 !== void 0 ? _6 : true,
        showMessageConsumption: enableMessageConsumption,
        hasUserActivatedSpeak,
        showReload: selectedLayout === 'TOTEM',
        showClear: (_7 = showClear !== null && showClear !== void 0 ? showClear : integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.showClear) !== null && _7 !== void 0 ? _7 : false,
        clearHistory: () => setHistory(h => h.slice(-1)),
        showLogin: canShowLoginButton,
        setShowLoginDrawer,
        loginToken,
        user,
        sessionID: sessionId,
        baseUrl,
        onLogout: () => {
            if (!loginToken)
                return;
            client.backend.pwlUserLogout(loginToken).then(() => {
                setShowLoginDrawer(false);
                setUser(undefined);
                setLoginToken(undefined);
                userTokenRef.current = undefined;
                (0, configuration_1.removeLocalConfig)('loginToken');
            });
        },
    };
    const avatarProps = {
        memori,
        integration,
        integrationConfig,
        tenant,
        instruct,
        avatar3dVisible,
        setAvatar3dVisible,
        hasUserActivatedSpeak,
        isPlayingAudio: isPlayingAudio &&
            !speakerMuted &&
            ((_8 = enableAudio !== null && enableAudio !== void 0 ? enableAudio : integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.enableAudio) !== null && _8 !== void 0 ? _8 : true),
        loading: !!memoriTyping,
        baseUrl,
        apiUrl: client.constants.BACKEND_URL,
        enablePositionControls,
        setEnablePositionControls,
        avatarType,
    };
    const startPanelProps = {
        memori,
        tenant: tenant,
        language: language,
        userLang: userLang,
        setUserLang: setUserLang,
        baseUrl: baseUrl,
        apiUrl: client.constants.BACKEND_URL,
        position: position,
        openPositionDrawer: () => setShowPositionDrawer(true),
        integrationConfig: integrationConfig,
        instruct: instruct,
        sessionId: sessionId,
        clickedStart: clickedStart,
        isMultilanguageEnabled: isMultilanguageEnabled,
        onClickStart: onClickStart,
        isUserLoggedIn: !!loginToken && !!(user === null || user === void 0 ? void 0 : user.userID),
        hasInitialSession: !!initialSessionID,
        notEnoughCredits: needsCredits && !hasEnoughCredits,
        showLogin: canShowLoginButton,
        setShowLoginDrawer,
        user,
    };
    const chatProps = {
        memori,
        sessionID: sessionId || '',
        tenant,
        translateTo: isMultilanguageEnabled &&
            userLang.toUpperCase() !==
                ((_13 = ((_12 = (_11 = (_10 = (_9 = memori.culture) === null || _9 === void 0 ? void 0 : _9.split('-')) === null || _10 === void 0 ? void 0 : _10[0]) !== null && _11 !== void 0 ? _11 : i18n.language) !== null && _12 !== void 0 ? _12 : 'IT')) === null || _13 === void 0 ? void 0 : _13.toUpperCase())
            ? userLang
            : undefined,
        baseUrl,
        apiUrl: client.constants.BACKEND_URL,
        layout,
        memoriTyping,
        typingText,
        showTypingText: (_14 = showTypingText !== null && showTypingText !== void 0 ? showTypingText : integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.showTypingText) !== null && _14 !== void 0 ? _14 : false,
        history: showFullHistory ? history : history.slice(-2),
        authToken: resolveLoginToken(),
        dialogState: currentDialogState,
        pushMessage,
        simulateUserPrompt,
        showDates,
        showContextPerLine,
        showMessageConsumption: enableMessageConsumption,
        showAIicon,
        showUpload: enableUpload,
        showReasoning: enableReasoning,
        showWhyThisAnswer,
        showCopyButton: (_15 = showCopyButton !== null && showCopyButton !== void 0 ? showCopyButton : integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.showCopyButton) !== null && _15 !== void 0 ? _15 : true,
        showTranslationOriginal: (_16 = showTranslationOriginal !== null && showTranslationOriginal !== void 0 ? showTranslationOriginal : integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.showTranslationOriginal) !== null && _16 !== void 0 ? _16 : false,
        client,
        instruct,
        preview,
        sendOnEnter,
        setSendOnEnter,
        microphoneMode: continuousSpeech ? 'CONTINUOUS' : 'HOLD_TO_TALK',
        attachmentsMenuOpen,
        setAttachmentsMenuOpen,
        showInputs,
        showMicrophone: !!ttsProvider && ((_17 = enableAudio !== null && enableAudio !== void 0 ? enableAudio : integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.enableAudio) !== null && _17 !== void 0 ? _17 : true),
        showFunctionCache,
        userMessage,
        onChangeUserMessage,
        sendMessage: (msg, media) => {
            ttsStop();
            stopRecording();
            setHasUserTypedMessage(true);
            sendMessage(msg, media);
            setUserMessage('');
        },
        stopListening: stopRecording,
        startListening: () => {
            setHasUserTypedMessage(false);
            startRecording();
        },
        stopAudio: ttsStop,
        listening: isListening,
        setEnableFocusChatInput,
        isPlayingAudio,
        customMediaRenderer,
        user,
        userAvatar,
        experts,
        useMathFormatting: applyMathFormatting,
        maxTotalMessagePayload,
        maxTextareaCharacters,
    };
    const integrationBackground = integration && globalBackgroundUrl ? ((0, jsx_runtime_1.jsx)("div", { className: "memori--global-background", children: (0, jsx_runtime_1.jsx)("div", { className: "memori--global-background-image", style: { backgroundImage: globalBackgroundUrl } }) })) : ((0, jsx_runtime_1.jsx)("div", { className: "memori--global-background no-background-image" }));
    const integrationStyle = integration ? ((0, jsx_runtime_1.jsx)("style", { dangerouslySetInnerHTML: { __html: integrationStylesheet } })) : null;
    const poweredBy = ((0, jsx_runtime_1.jsx)(PoweredBy_1.default, { tenant: tenant, userLang: userLang, integrationID: integration === null || integration === void 0 ? void 0 : integration.integrationID, memoriHash: `${memori.ownerTenantName}-${memori.ownerUserName}-${memori.name}` }));
    const Layout = customLayout
        ? customLayout
        : selectedLayout === 'TOTEM'
            ? Totem_1.default
            : selectedLayout === 'CHAT'
                ? Chat_2.default
                : selectedLayout === 'FULLPAGE'
                    ? FullPage_1.default
                    : selectedLayout === 'WEBSITE_ASSISTANT'
                        ? WebsiteAssistant_1.default
                        : selectedLayout === 'HIDDEN_CHAT'
                            ? HiddenChat_1.default
                            : selectedLayout === 'ZOOMED_FULL_BODY'
                                ? ZoomedFullBody_1.default
                                : FullPage_1.default;
    return ((0, jsx_runtime_1.jsxs)("div", { className: (0, classnames_1.default)('memori', 'memori-widget', `memori-layout-${selectedLayout.toLowerCase()}`, `memori-controls-${controlsPosition.toLowerCase()}`, `memori--avatar-${(integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.avatar) || 'default'}`, {
            'memori--auto-start': autoStart,
            'memori--preview': preview,
            'memori--embed': embed,
            'memori--with-integration': integration,
            'memori--with-speechkey': !!ttsProvider,
            'memori--active': hasUserActivatedSpeak,
            'memori--hide-emissions': hideEmissions,
            'memori--has-active-session': !!sessionId,
        }), "data-memori-name": memori === null || memori === void 0 ? void 0 : memori.name, "data-memori-id": memori === null || memori === void 0 ? void 0 : memori.engineMemoriID, "data-memori-secondary-id": memori === null || memori === void 0 ? void 0 : memori.memoriID, "data-memori-session-id": sessionId, "data-memori-integration": integration === null || integration === void 0 ? void 0 : integration.integrationID, "data-memori-engine-state": JSON.stringify({
            ...currentDialogState,
            sessionID: sessionId,
        }), style: { height }, children: [(0, jsx_runtime_1.jsx)(Layout, { Header: Header_1.default, headerProps: headerProps, Avatar: Avatar_1.default, avatarProps: avatarProps, Chat: Chat_1.default, chatProps: chatProps, StartPanel: StartPanel_1.default, startPanelProps: startPanelProps, integrationStyle: integrationStyle, integrationBackground: integrationBackground, poweredBy: poweredBy, autoStart: autoStart, sessionId: sessionId, hasUserActivatedSpeak: hasUserActivatedSpeak, loading: loading, avatar3dHidden: avatar3dHidden !== null && avatar3dHidden !== void 0 ? avatar3dHidden : integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.avatar_3d_hidden }), (0, jsx_runtime_1.jsx)(ArtifactAPI_1.ArtifactAPIBridge, { pushMessage: (message) => {
                    setHistory(history => {
                        if (!history.length)
                            return history;
                        const lastMessage = history[history.length - 1];
                        if (!lastMessage || lastMessage.fromUser)
                            return history;
                        const updatedLastMessage = {
                            ...lastMessage,
                            text: lastMessage.text + message.text,
                        };
                        return [...history.slice(0, -1), updatedLastMessage];
                    });
                } }), (0, jsx_runtime_1.jsx)("audio", { id: "memori-audio", style: { display: 'none' }, src: "https://aisuru.com/intro.mp3" }), isClient && ((0, jsx_runtime_1.jsx)(Auth_1.default, { withModal: true, pwdOrTokens: authModalState, openModal: !!authModalState, setPwdOrTokens: setAuthModalState, showTokens: memori.privacyType === 'SECRET', onFinish: (values) => {
                    var _a, _b, _c, _d;
                    if (values['password'])
                        setMemoriPwd(values['password']);
                    if (values['password'])
                        memoriPassword = values['password'];
                    if (values['tokens'])
                        setMemoriTokens(values['tokens']);
                    return reopenSession(!sessionId, values['password'], values['tokens'], personification === null || personification === void 0 ? void 0 : personification.tag, personification === null || personification === void 0 ? void 0 : personification.pin, {
                        LANG: userLang,
                        PATHNAME: (_a = window.location.pathname) === null || _a === void 0 ? void 0 : _a.toUpperCase(),
                        ROUTE: ((_d = (_c = (_b = window.location.pathname) === null || _b === void 0 ? void 0 : _b.split('/')) === null || _c === void 0 ? void 0 : _c.pop()) === null || _d === void 0 ? void 0 : _d.toUpperCase()) ||
                            '',
                        ...(initialContextVars || {}),
                    }, initialQuestion, birthDate)
                        .then(state => {
                        if (!(state === null || state === void 0 ? void 0 : state.sessionID)) {
                            throw new Error('AUTH_FAILED');
                        }
                        setAuthModalState(null);
                        if (state === null || state === void 0 ? void 0 : state.dialogState) {
                            setHasUserActivatedSpeak(true);
                        }
                        else {
                            onClickStart(state);
                        }
                    })
                        .catch(error => {
                        throw error;
                    });
                }, minimumNumberOfRecoveryTokens: (_18 = memori === null || memori === void 0 ? void 0 : memori.minimumNumberOfRecoveryTokens) !== null && _18 !== void 0 ? _18 : 1 })), isClient && ((0, jsx_runtime_1.jsx)(AgeVerificationModal_1.default, { visible: showAgeVerification, minAge: minAge, onClose: birthDate => {
                    var _a, _b, _c, _d;
                    if (birthDate) {
                        setBirthDate(birthDate);
                        (0, configuration_1.setLocalConfig)('birthDate', birthDate);
                        reopenSession(!sessionId, memoriPassword || memoriPwd || (memori === null || memori === void 0 ? void 0 : memori.secretToken), memoriTokens, personification === null || personification === void 0 ? void 0 : personification.tag, personification === null || personification === void 0 ? void 0 : personification.pin, {
                            LANG: userLang,
                            PATHNAME: (_a = window.location.pathname) === null || _a === void 0 ? void 0 : _a.toUpperCase(),
                            ROUTE: ((_d = (_c = (_b = window.location.pathname) === null || _b === void 0 ? void 0 : _b.split('/')) === null || _c === void 0 ? void 0 : _c.pop()) === null || _d === void 0 ? void 0 : _d.toUpperCase()) || '',
                            ...(initialContextVars || {}),
                        }, initialQuestion, birthDate)
                            .then(state => {
                            setShowAgeVerification(false);
                            setAuthModalState(null);
                            onClickStart(state || undefined);
                        })
                            .catch(() => {
                            setShowAgeVerification(false);
                        });
                    }
                    else {
                        setShowAgeVerification(false);
                        setClickedStart(false);
                    }
                } })), showSettingsDrawer && ((0, jsx_runtime_1.jsx)(SettingsDrawer_1.default, { layout: selectedLayout, open: !!showSettingsDrawer, onClose: () => setShowSettingsDrawer(false), microphoneMode: continuousSpeech ? 'CONTINUOUS' : 'HOLD_TO_TALK', continuousSpeechTimeout: continuousSpeechTimeout, setMicrophoneMode: mode => setContinuousSpeech(mode === 'CONTINUOUS'), setContinuousSpeechTimeout: setContinuousSpeechTimeout, controlsPosition: controlsPosition, setControlsPosition: setControlsPosition, hideEmissions: hideEmissions, setHideEmissions: setHideEmissions, avatarType: avatarType, setAvatarType: setAvatarType, enablePositionControls: enablePositionControls, setEnablePositionControls: setEnablePositionControls, isAvatar3d: !!(integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.avatarURL), additionalSettings: additionalSettings, speakerMuted: speakerMuted })), showChatHistoryDrawer && ((0, jsx_runtime_1.jsx)(ChatHistory_1.default, { open: !!showChatHistoryDrawer, onClose: () => setShowChatHistoryDrawer(false), resumeSession: chatLog => {
                    setChatLogID(chatLog.chatLogID);
                    onClickStart(undefined, false, chatLog);
                    setShowChatHistoryDrawer(false);
                }, apiClient: client, sessionId: sessionId || '', memori: memori, baseUrl: baseUrl, history: history, apiUrl: client.constants.BACKEND_URL, loginToken: loginToken, language: language, userLang: userLang, isMultilanguageEnabled: isMultilanguageEnabled })), showPositionDrawer && ((0, jsx_runtime_1.jsx)(PositionDrawer_1.default, { memori: memori, open: !!showPositionDrawer, venue: position, setVenue: setPosition, onClose: () => {
                    setShowPositionDrawer(false);
                    if (autoStart) {
                        onClickStart();
                    }
                }, drawerClassName: selectedLayout === 'WEBSITE_ASSISTANT'
                    ? 'memori-drawer--above-website-assistant'
                    : undefined })), showKnownFactsDrawer && sessionId && ((0, jsx_runtime_1.jsx)(KnownFacts_1.default, { apiClient: client, memori: memori, sessionID: sessionId, visible: showKnownFactsDrawer, closeDrawer: () => setShowKnownFactsDrawer(false) })), showExpertsDrawer && !!experts && ((0, jsx_runtime_1.jsx)(ExpertsDrawer_1.default, { apiUrl: client.constants.BACKEND_URL, baseUrl: baseUrl, tenant: tenant, experts: experts, open: showExpertsDrawer, onClose: () => setShowExpertsDrawer(false) })), showLoginDrawer && (tenant === null || tenant === void 0 ? void 0 : tenant.name) && ((0, jsx_runtime_1.jsx)(LoginDrawer_1.default, { tenant: tenant, apiClient: client, open: !!showLoginDrawer, user: user, loginToken: loginToken, onClose: () => setShowLoginDrawer(false), drawerClassName: selectedLayout === 'WEBSITE_ASSISTANT'
                    ? 'memori-drawer--above-website-assistant'
                    : undefined, onLogin: (user, token) => {
                    var _a, _b, _c, _d;
                    reopenSession(false, memoriPassword || memoriPwd || (memori === null || memori === void 0 ? void 0 : memori.secretToken), [], personification === null || personification === void 0 ? void 0 : personification.tag, personification === null || personification === void 0 ? void 0 : personification.pin, {
                        LANG: userLang,
                        PATHNAME: (_a = window.location.pathname) === null || _a === void 0 ? void 0 : _a.toUpperCase(),
                        ROUTE: ((_d = (_c = (_b = window.location.pathname) === null || _b === void 0 ? void 0 : _b.split('/')) === null || _c === void 0 ? void 0 : _c.pop()) === null || _d === void 0 ? void 0 : _d.toUpperCase()) ||
                            '',
                        ...(initialContextVars || {}),
                    }, undefined, birthDate, { loginToken: token }, undefined, sessionId).then(state => {
                        var _a, _b;
                        setShowLoginDrawer(false);
                        setUser(user);
                        setLoginToken(token);
                        userTokenRef.current = token;
                        (0, configuration_1.setLocalConfig)('loginToken', token);
                        if ((state === null || state === void 0 ? void 0 : state.sessionID) &&
                            state.sessionID !== sessionId &&
                            (state === null || state === void 0 ? void 0 : state.dialogState)) {
                            const username = (user === null || user === void 0 ? void 0 : user.userName) || t('login.user');
                            pushMessage({
                                text: '',
                                emitter: state.dialogState.emitter,
                                media: (_b = (_a = state.dialogState.emittedMedia) !== null && _a !== void 0 ? _a : state.dialogState.media) !== null && _b !== void 0 ? _b : [],
                                fromUser: false,
                                initial: t('login.successfullyLoggedIn', { username }),
                                contextVars: state.dialogState.contextVars,
                                date: state.dialogState.currentDate,
                                placeName: state.dialogState.currentPlaceName,
                                placeLatitude: state.dialogState.currentLatitude,
                                placeLongitude: state.dialogState.currentLongitude,
                                placeUncertaintyKm: state.dialogState.currentUncertaintyKm,
                                tag: state.dialogState.currentTag,
                                memoryTags: state.dialogState.memoryTags,
                            });
                            setCurrentDialogState(state.dialogState);
                        }
                    });
                }, setUser: setUser, onLogout: () => {
                    if (!loginToken)
                        return;
                    client.backend.pwlUserLogout(loginToken).then(() => {
                        setShowLoginDrawer(false);
                        setUser(undefined);
                        setLoginToken(undefined);
                        userTokenRef.current = undefined;
                        (0, configuration_1.removeLocalConfig)('loginToken');
                    });
                } }))] }));
};
exports.default = MemoriWidget;
//# sourceMappingURL=MemoriWidget.js.map