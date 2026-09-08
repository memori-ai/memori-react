"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const media_1 = require("../../helpers/media");
const react_i18next_1 = require("react-i18next");
const Tooltip_1 = tslib_1.__importDefault(require("../ui/Tooltip"));
const translations_1 = require("../../helpers/translations");
const Button_1 = tslib_1.__importDefault(require("../ui/Button"));
const Translation_1 = tslib_1.__importDefault(require("../icons/Translation"));
const constants_1 = require("../../helpers/constants");
const BlockedMemoriBadge_1 = tslib_1.__importDefault(require("../BlockedMemoriBadge/BlockedMemoriBadge"));
const Group_1 = tslib_1.__importDefault(require("../icons/Group"));
const DeepThought_1 = tslib_1.__importDefault(require("../icons/DeepThought"));
const CompletionProviderStatus_1 = tslib_1.__importDefault(require("../CompletionProviderStatus/CompletionProviderStatus"));
const MapMarker_1 = tslib_1.__importDefault(require("../icons/MapMarker"));
const User_1 = tslib_1.__importDefault(require("../icons/User"));
const QuestionHelp_1 = tslib_1.__importDefault(require("../icons/QuestionHelp"));
const Expandable_1 = tslib_1.__importDefault(require("../ui/Expandable"));
const StartPanel = ({ memori, tenant, language, userLang, setUserLang, baseUrl, apiUrl, position, openPositionDrawer, instruct = false, hasInitialSession = false, clickedStart, onClickStart, initializeTTS, _TEST_forceProviderStatus, isUserLoggedIn = false, user, showLogin = false, setShowLoginDrawer, notEnoughCredits = false, isMultilanguageEnabled, }) => {
    var _a, _b, _c, _d;
    const { t, i18n } = (0, react_i18next_1.useTranslation)();
    const [translatedDescription, setTranslatedDescription] = (0, react_1.useState)(memori.description);
    const blockedUntilDate = new Date(memori.blockedUntil || Date.now());
    const isMemoriBlocked = blockedUntilDate > new Date(Date.now());
    const [showTranslation, setShowTranslation] = (0, react_1.useState)(true);
    const toggleTranslations = () => {
        setShowTranslation(show => !show);
    };
    (0, react_1.useEffect)(() => {
        var _a, _b, _c, _d, _f, _g;
        if ((((_b = (_a = i18n.language) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : 'IT') !==
            ((_c = language === null || language === void 0 ? void 0 : language.toUpperCase()) !== null && _c !== void 0 ? _c : 'IT') ||
            translatedDescription !== memori.description) &&
            !!((_d = memori.description) === null || _d === void 0 ? void 0 : _d.length)) {
            (0, translations_1.getTranslation)(memori.description, (_g = (_f = i18n.language) === null || _f === void 0 ? void 0 : _f.toUpperCase()) !== null && _g !== void 0 ? _g : 'IT', language, baseUrl)
                .then(value => {
                setTranslatedDescription(value.text);
            })
                .catch(console.error);
        }
    }, [i18n.language, language, memori.description, baseUrl]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "memori--start-panel", children: [(0, jsx_runtime_1.jsxs)("div", { className: "memori--cover", style: {
                    backgroundImage: `url("${(0, media_1.getResourceUrl)({
                        type: 'cover',
                        tenantID: tenant === null || tenant === void 0 ? void 0 : tenant.name,
                        resourceURI: memori.coverURL,
                        baseURL: baseUrl,
                        apiURL: apiUrl,
                    })}"), url("${(0, media_1.getResourceUrl)({
                        type: 'cover',
                        tenantID: tenant === null || tenant === void 0 ? void 0 : tenant.name,
                        baseURL: baseUrl,
                        apiURL: apiUrl,
                    })}")`,
                }, children: [!!memori.enableBoardOfExperts && ((0, jsx_runtime_1.jsx)("div", { className: "memori--board-of-experts", children: (0, jsx_runtime_1.jsx)(Tooltip_1.default, { align: "left", content: t('boardOfExperts'), children: (0, jsx_runtime_1.jsx)("span", { "aria-label": t('boardOfExperts') || 'Board of Experts', children: (0, jsx_runtime_1.jsx)(Group_1.default, {}) }) }) })), !!memori.nsfw && ((0, jsx_runtime_1.jsx)("div", { className: "memori--nsfw", children: (0, jsx_runtime_1.jsx)(Tooltip_1.default, { align: "left", content: t('nsfw'), children: (0, jsx_runtime_1.jsx)("span", { title: t('nsfw') || 'NSFW', children: "\uD83D\uDD1E" }) }) }))] }), (0, jsx_runtime_1.jsxs)("picture", { className: "memori--avatar", children: [(0, jsx_runtime_1.jsx)("source", { src: (_a = memori.avatarURL) !== null && _a !== void 0 ? _a : (0, media_1.getResourceUrl)({
                            type: 'avatar',
                            tenantID: tenant === null || tenant === void 0 ? void 0 : tenant.name,
                            resourceURI: memori.avatarURL,
                            baseURL: baseUrl,
                            apiURL: apiUrl,
                        }) }), (0, jsx_runtime_1.jsx)("img", { alt: memori.name, src: memori.avatarURL && memori.avatarURL.length > 0
                            ? (0, media_1.getResourceUrl)({
                                type: 'avatar',
                                tenantID: tenant === null || tenant === void 0 ? void 0 : tenant.name,
                                resourceURI: memori.avatarURL,
                                baseURL: baseUrl,
                                apiURL: apiUrl,
                            })
                            : (0, media_1.getResourceUrl)({
                                type: 'avatar',
                                tenantID: tenant === null || tenant === void 0 ? void 0 : tenant.name,
                                baseURL: baseUrl,
                                apiURL: apiUrl,
                            }) })] }), (0, jsx_runtime_1.jsx)("h2", { className: "memori--title", children: memori.name }), memori.needsPosition && !position && ((0, jsx_runtime_1.jsxs)("div", { className: "memori--needsPosition", children: [(0, jsx_runtime_1.jsx)("p", { children: t('write_and_speak.requirePositionHelp', { name: memori.name }) }), (0, jsx_runtime_1.jsx)(Button_1.default, { primary: true, onClick: () => openPositionDrawer(), className: "memori--start-button", icon: (0, jsx_runtime_1.jsx)(MapMarker_1.default, {}), children: t('widget.position') })] })), ((memori.needsPosition && position) || !memori.needsPosition) &&
                !!memori.requireLoginToken &&
                !(tenant === null || tenant === void 0 ? void 0 : tenant.ssoLogin) &&
                !isUserLoggedIn && ((0, jsx_runtime_1.jsxs)("div", { className: "memori--needsLogin", children: [(0, jsx_runtime_1.jsx)("p", { children: t('write_and_speak.requirePositionHelp', { name: memori.name }) }), (0, jsx_runtime_1.jsx)(Button_1.default, { primary: true, onClick: () => setShowLoginDrawer(true), className: "memori--start-button", icon: (0, jsx_runtime_1.jsx)(User_1.default, {}), children: t('login.login') || 'Login' })] })), ((memori.needsPosition && position) || !memori.needsPosition) &&
                (!memori.requireLoginToken ||
                    (memori.requireLoginToken && isUserLoggedIn)) && ((0, jsx_runtime_1.jsxs)("div", { className: "memori--description", children: [(0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)(Expandable_1.default, { className: "memori--description-text", rows: 3, children: translatedDescription && showTranslation
                                    ? translatedDescription
                                    : memori.description }), translatedDescription !== memori.description && ((0, jsx_runtime_1.jsx)(Button_1.default, { ghost: true, className: "memori--translation-toggle", icon: (0, jsx_runtime_1.jsx)(Translation_1.default, {}), onClick: () => toggleTranslations(), children: showTranslation
                                    ? t('showOriginalText')
                                    : t('showTranslatedText') }))] }), isMultilanguageEnabled && !instruct && ((0, jsx_runtime_1.jsxs)("div", { className: "memori--language-chooser", children: [(0, jsx_runtime_1.jsx)("label", { id: "user-lang-pref-label", htmlFor: "user-lang-pref", children: t('write_and_speak.iWantToTalkToIn', {
                                    name: memori.name,
                                }) }), (0, jsx_runtime_1.jsxs)("select", { id: "user-lang-pref", className: "memori-select--button", value: (userLang !== null && userLang !== void 0 ? userLang : i18n.language).toUpperCase(), "aria-labelledby": "user-lang-pref-label", onChange: e => {
                                    setUserLang(e.target.value);
                                }, children: [(0, jsx_runtime_1.jsx)("optgroup", { label: t('popularLanguages') || 'Popular', children: (0, constants_1.getGroupedChatLanguages)().popular.map(lang => ((0, jsx_runtime_1.jsx)("option", { value: lang.value, "aria-label": lang.label, children: lang.label }, `popular-${lang.value}`))) }), (0, jsx_runtime_1.jsx)("optgroup", { label: t('allLanguages') || 'All Languages', children: (0, constants_1.getGroupedChatLanguages)().all.map(lang => ((0, jsx_runtime_1.jsx)("option", { value: lang.value, "aria-label": lang.label, children: lang.label }, `all-${lang.value}`))) })] })] })), (0, jsx_runtime_1.jsxs)("div", { className: "memori--start-privacy-explanation-container", children: [(0, jsx_runtime_1.jsx)("p", { className: "memori--start-privacy-explanation", children: t('write_and_speak.pagePrivacyExplanation') }), (0, jsx_runtime_1.jsx)(Tooltip_1.default, { align: "topLeft", content: (0, jsx_runtime_1.jsxs)("div", { className: "memori--privacy-tooltip-content", children: [(0, jsx_runtime_1.jsxs)("p", { children: [' ', t('write_and_speak.pagePrivacyExplanationList.allConversations')] }), (0, jsx_runtime_1.jsx)("ul", { className: "memori--privacy-tooltip-content-list", children: isUserLoggedIn ? ((0, jsx_runtime_1.jsx)("li", { children: t('write_and_speak.pagePrivacyExplanationList.contentAndUsername') })) : ((0, jsx_runtime_1.jsx)("li", { children: t('write_and_speak.pagePrivacyExplanationList.contentAndIpAddress') })) }), (0, jsx_runtime_1.jsx)("p", { children: t('write_and_speak.pagePrivacyExplanationList.authorUsesInfo') }), (0, jsx_runtime_1.jsx)("a", { href: (_b = tenant === null || tenant === void 0 ? void 0 : tenant.privacyPolicyURL) !== null && _b !== void 0 ? _b : 'https://memori.ai/en/privacy-policy', target: "_blank", rel: "noopener noreferrer", children: (_c = tenant === null || tenant === void 0 ? void 0 : tenant.privacyPolicyURL) !== null && _c !== void 0 ? _c : t('privacyPolicy') })] }), children: (0, jsx_runtime_1.jsx)(QuestionHelp_1.default, { className: "memori--start-privacy-explanation-icon" }) })] }), (0, jsx_runtime_1.jsx)(Button_1.default, { primary: true, disabled: (isMemoriBlocked && !memori.isGiver) || notEnoughCredits, loading: clickedStart, onClick: _e => {
                            try {
                                window.speechSynthesis.speak(new SpeechSynthesisUtterance(''));
                            }
                            catch (e) {
                                console.error(e);
                            }
                            if (initializeTTS)
                                initializeTTS();
                            if (onClickStart)
                                onClickStart();
                        }, className: "memori--start-button", children: t(`write_and_speak.${instruct
                            ? 'instructButton'
                            : !hasInitialSession
                                ? 'tryMeButton'
                                : 'resumeButton'}`) }), (0, jsx_runtime_1.jsx)(CompletionProviderStatus_1.default, { provider: (_d = memori === null || memori === void 0 ? void 0 : memori.completionConfigForQuestionAnswering) === null || _d === void 0 ? void 0 : _d.provider, forceStatus: _TEST_forceProviderStatus }), (0, jsx_runtime_1.jsx)("p", { className: "memori--start-description", children: instruct
                            ? t('write_and_speak.pageInstructExplanation')
                            : t('write_and_speak.pageTryMeExplanation') }), (isMemoriBlocked || notEnoughCredits) && ((0, jsx_runtime_1.jsx)(BlockedMemoriBadge_1.default, { memoriName: memori.name, blockedUntil: memori.blockedUntil, notEnoughCredits: notEnoughCredits, showGiverInfo: memori.isGiver, showTitle: true, marginLeft: true })), !!memori.enableDeepThought && !instruct && ((0, jsx_runtime_1.jsxs)("div", { className: "memori--deep-thought-disclaimer", children: [(0, jsx_runtime_1.jsx)(Tooltip_1.default, { align: "left", content: t('deepThoughtHelper'), children: (0, jsx_runtime_1.jsx)(DeepThought_1.default, {}) }), (0, jsx_runtime_1.jsx)("h2", { children: isUserLoggedIn && !!(user === null || user === void 0 ? void 0 : user.pAndCUAccepted)
                                    ? t('deepThoughtDisclaimerTitle')
                                    : t('deepThought') }), isUserLoggedIn && !(user === null || user === void 0 ? void 0 : user.pAndCUAccepted) && ((0, jsx_runtime_1.jsx)("p", { children: t('deepThoughtPreDisclaimerNotAllowed') })), !isUserLoggedIn && ((0, jsx_runtime_1.jsx)("p", { children: t('deepThoughtPreDisclaimerUnlogged') })), !isUserLoggedIn && showLogin && ((0, jsx_runtime_1.jsx)("p", { children: (0, jsx_runtime_1.jsx)(Button_1.default, { outlined: true, padded: false, onClick: () => setShowLoginDrawer(true), children: t('login.login') || 'Login' }) })), (0, jsx_runtime_1.jsx)("p", { className: "memori--deep-thought-disclaimer-text", children: t('deepThoughtDisclaimer') })] }))] }))] }));
};
exports.default = StartPanel;
//# sourceMappingURL=StartPanel.js.map