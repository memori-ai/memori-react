import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { getResourceUrl } from '../../helpers/media';
import { useTranslation } from 'react-i18next';
import Tooltip from '../ui/Tooltip';
import { getTranslation } from '../../helpers/translations';
import Button from '../ui/Button';
import Translation from '../icons/Translation';
import { getGroupedChatLanguages } from '../../helpers/constants';
import BlockedMemoriBadge from '../BlockedMemoriBadge/BlockedMemoriBadge';
import Group from '../icons/Group';
import DeepThought from '../icons/DeepThought';
import CompletionProviderStatus from '../CompletionProviderStatus/CompletionProviderStatus';
import MapMarker from '../icons/MapMarker';
import UserIcon from '../icons/User';
import QuestionHelp from '../icons/QuestionHelp';
import Expandable from '../ui/Expandable';
const StartPanel = ({ memori, tenant, language, userLang, setUserLang, baseUrl, apiUrl, position, openPositionDrawer, instruct = false, hasInitialSession = false, clickedStart, onClickStart, initializeTTS, _TEST_forceProviderStatus, isUserLoggedIn = false, user, showLogin = false, setShowLoginDrawer, notEnoughCredits = false, isMultilanguageEnabled, }) => {
    var _a, _b, _c, _d;
    const { t, i18n } = useTranslation();
    const [translatedDescription, setTranslatedDescription] = useState(memori.description);
    const blockedUntilDate = new Date(memori.blockedUntil || Date.now());
    const isMemoriBlocked = blockedUntilDate > new Date(Date.now());
    const [showTranslation, setShowTranslation] = useState(true);
    const toggleTranslations = () => {
        setShowTranslation(show => !show);
    };
    useEffect(() => {
        var _a, _b, _c, _d, _f, _g;
        if ((((_b = (_a = i18n.language) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : 'IT') !==
            ((_c = language === null || language === void 0 ? void 0 : language.toUpperCase()) !== null && _c !== void 0 ? _c : 'IT') ||
            translatedDescription !== memori.description) &&
            !!((_d = memori.description) === null || _d === void 0 ? void 0 : _d.length)) {
            getTranslation(memori.description, (_g = (_f = i18n.language) === null || _f === void 0 ? void 0 : _f.toUpperCase()) !== null && _g !== void 0 ? _g : 'IT', language, baseUrl)
                .then(value => {
                setTranslatedDescription(value.text);
            })
                .catch(console.error);
        }
    }, [i18n.language, language, memori.description, baseUrl]);
    return (_jsxs("div", { className: "memori--start-panel", children: [_jsxs("div", { className: "memori--cover", style: {
                    backgroundImage: `url("${getResourceUrl({
                        type: 'cover',
                        tenantID: tenant === null || tenant === void 0 ? void 0 : tenant.name,
                        resourceURI: memori.coverURL,
                        baseURL: baseUrl,
                        apiURL: apiUrl,
                    })}"), url("${getResourceUrl({
                        type: 'cover',
                        tenantID: tenant === null || tenant === void 0 ? void 0 : tenant.name,
                        baseURL: baseUrl,
                        apiURL: apiUrl,
                    })}")`,
                }, children: [!!memori.enableBoardOfExperts && (_jsx("div", { className: "memori--board-of-experts", children: _jsx(Tooltip, { align: "left", content: t('boardOfExperts'), children: _jsx("span", { "aria-label": t('boardOfExperts') || 'Board of Experts', children: _jsx(Group, {}) }) }) })), !!memori.nsfw && (_jsx("div", { className: "memori--nsfw", children: _jsx(Tooltip, { align: "left", content: t('nsfw'), children: _jsx("span", { title: t('nsfw') || 'NSFW', children: "\uD83D\uDD1E" }) }) }))] }), _jsxs("picture", { className: "memori--avatar", children: [_jsx("source", { src: (_a = memori.avatarURL) !== null && _a !== void 0 ? _a : getResourceUrl({
                            type: 'avatar',
                            tenantID: tenant === null || tenant === void 0 ? void 0 : tenant.name,
                            resourceURI: memori.avatarURL,
                            baseURL: baseUrl,
                            apiURL: apiUrl,
                        }) }), _jsx("img", { alt: memori.name, src: memori.avatarURL && memori.avatarURL.length > 0
                            ? getResourceUrl({
                                type: 'avatar',
                                tenantID: tenant === null || tenant === void 0 ? void 0 : tenant.name,
                                resourceURI: memori.avatarURL,
                                baseURL: baseUrl,
                                apiURL: apiUrl,
                            })
                            : getResourceUrl({
                                type: 'avatar',
                                tenantID: tenant === null || tenant === void 0 ? void 0 : tenant.name,
                                baseURL: baseUrl,
                                apiURL: apiUrl,
                            }) })] }), _jsx("h2", { className: "memori--title", children: memori.name }), memori.needsPosition && !position && (_jsxs("div", { className: "memori--needsPosition", children: [_jsx("p", { children: t('write_and_speak.requirePositionHelp', { name: memori.name }) }), _jsx(Button, { primary: true, onClick: () => openPositionDrawer(), className: "memori--start-button", icon: _jsx(MapMarker, {}), children: t('widget.position') })] })), ((memori.needsPosition && position) || !memori.needsPosition) &&
                !!memori.requireLoginToken &&
                !(tenant === null || tenant === void 0 ? void 0 : tenant.ssoLogin) &&
                !isUserLoggedIn && (_jsxs("div", { className: "memori--needsLogin", children: [_jsx("p", { children: t('write_and_speak.requirePositionHelp', { name: memori.name }) }), _jsx(Button, { primary: true, onClick: () => setShowLoginDrawer(true), className: "memori--start-button", icon: _jsx(UserIcon, {}), children: t('login.login') || 'Login' })] })), ((memori.needsPosition && position) || !memori.needsPosition) &&
                (!memori.requireLoginToken ||
                    (memori.requireLoginToken && isUserLoggedIn)) && (_jsxs("div", { className: "memori--description", children: [_jsxs("p", { children: [_jsx(Expandable, { className: "memori--description-text", rows: 3, children: translatedDescription && showTranslation
                                    ? translatedDescription
                                    : memori.description }), translatedDescription !== memori.description && (_jsx(Button, { ghost: true, className: "memori--translation-toggle", icon: _jsx(Translation, {}), onClick: () => toggleTranslations(), children: showTranslation
                                    ? t('showOriginalText')
                                    : t('showTranslatedText') }))] }), isMultilanguageEnabled && !instruct && (_jsxs("div", { className: "memori--language-chooser", children: [_jsx("label", { id: "user-lang-pref-label", htmlFor: "user-lang-pref", children: t('write_and_speak.iWantToTalkToIn', {
                                    name: memori.name,
                                }) }), _jsxs("select", { id: "user-lang-pref", className: "memori-select--button", value: (userLang !== null && userLang !== void 0 ? userLang : i18n.language).toUpperCase(), "aria-labelledby": "user-lang-pref-label", onChange: e => {
                                    setUserLang(e.target.value);
                                }, children: [_jsx("optgroup", { label: t('popularLanguages') || 'Popular', children: getGroupedChatLanguages().popular.map(lang => (_jsx("option", { value: lang.value, "aria-label": lang.label, children: lang.label }, `popular-${lang.value}`))) }), _jsx("optgroup", { label: t('allLanguages') || 'All Languages', children: getGroupedChatLanguages().all.map(lang => (_jsx("option", { value: lang.value, "aria-label": lang.label, children: lang.label }, `all-${lang.value}`))) })] })] })), _jsxs("div", { className: "memori--start-privacy-explanation-container", children: [_jsx("p", { className: "memori--start-privacy-explanation", children: t('write_and_speak.pagePrivacyExplanation') }), _jsx(Tooltip, { align: "topLeft", content: _jsxs("div", { className: "memori--privacy-tooltip-content", children: [_jsxs("p", { children: [' ', t('write_and_speak.pagePrivacyExplanationList.allConversations')] }), _jsx("ul", { className: "memori--privacy-tooltip-content-list", children: isUserLoggedIn ? (_jsx("li", { children: t('write_and_speak.pagePrivacyExplanationList.contentAndUsername') })) : (_jsx("li", { children: t('write_and_speak.pagePrivacyExplanationList.contentAndIpAddress') })) }), _jsx("p", { children: t('write_and_speak.pagePrivacyExplanationList.authorUsesInfo') }), _jsx("a", { href: (_b = tenant === null || tenant === void 0 ? void 0 : tenant.privacyPolicyURL) !== null && _b !== void 0 ? _b : 'https://memori.ai/en/privacy-policy', target: "_blank", rel: "noopener noreferrer", children: (_c = tenant === null || tenant === void 0 ? void 0 : tenant.privacyPolicyURL) !== null && _c !== void 0 ? _c : t('privacyPolicy') })] }), children: _jsx(QuestionHelp, { className: "memori--start-privacy-explanation-icon" }) })] }), _jsx(Button, { primary: true, disabled: (isMemoriBlocked && !memori.isGiver) || notEnoughCredits, loading: clickedStart, onClick: _e => {
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
                                : 'resumeButton'}`) }), _jsx(CompletionProviderStatus, { provider: (_d = memori === null || memori === void 0 ? void 0 : memori.completionConfigForQuestionAnswering) === null || _d === void 0 ? void 0 : _d.provider, forceStatus: _TEST_forceProviderStatus }), _jsx("p", { className: "memori--start-description", children: instruct
                            ? t('write_and_speak.pageInstructExplanation')
                            : t('write_and_speak.pageTryMeExplanation') }), (isMemoriBlocked || notEnoughCredits) && (_jsx(BlockedMemoriBadge, { memoriName: memori.name, blockedUntil: memori.blockedUntil, notEnoughCredits: notEnoughCredits, showGiverInfo: memori.isGiver, showTitle: true, marginLeft: true })), !!memori.enableDeepThought && !instruct && (_jsxs("div", { className: "memori--deep-thought-disclaimer", children: [_jsx(Tooltip, { align: "left", content: t('deepThoughtHelper'), children: _jsx(DeepThought, {}) }), _jsx("h2", { children: isUserLoggedIn && !!(user === null || user === void 0 ? void 0 : user.pAndCUAccepted)
                                    ? t('deepThoughtDisclaimerTitle')
                                    : t('deepThought') }), isUserLoggedIn && !(user === null || user === void 0 ? void 0 : user.pAndCUAccepted) && (_jsx("p", { children: t('deepThoughtPreDisclaimerNotAllowed') })), !isUserLoggedIn && (_jsx("p", { children: t('deepThoughtPreDisclaimerUnlogged') })), !isUserLoggedIn && showLogin && (_jsx("p", { children: _jsx(Button, { outlined: true, padded: false, onClick: () => setShowLoginDrawer(true), children: t('login.login') || 'Login' }) })), _jsx("p", { className: "memori--deep-thought-disclaimer-text", children: t('deepThoughtDisclaimer') })] }))] }))] }));
};
export default StartPanel;
//# sourceMappingURL=StartPanel.js.map