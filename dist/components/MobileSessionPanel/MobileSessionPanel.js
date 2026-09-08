"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const ui_1 = require("@memori.ai/ui");
const react_i18next_1 = require("react-i18next");
const error_1 = require("../../helpers/error");
const utils_1 = require("../../helpers/utils");
const GasStation_1 = tslib_1.__importDefault(require("../icons/GasStation"));
const ChatConsumptionDropdown_1 = require("../Header/ChatConsumptionDropdown");
const PositionPopover_1 = require("../PositionPopover/PositionPopover");
const getMetricValue = (metric) => {
    if (typeof metric === 'number' && Number.isFinite(metric))
        return metric;
    if (!metric || typeof metric !== 'object')
        return undefined;
    if (typeof metric.parsedValue === 'number' &&
        Number.isFinite(metric.parsedValue)) {
        return metric.parsedValue;
    }
    if (typeof metric.source === 'string') {
        const parsed = Number(metric.source);
        if (Number.isFinite(parsed))
            return parsed;
    }
    return undefined;
};
const formatMetricValue = (value, locale) => new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: Math.abs(value) >= 1 ? 3 : 4,
}).format(value);
const formatImpactInReadableUnit = (value, metricType, locale) => {
    const absValue = Math.abs(value);
    if (metricType === 'energy') {
        if (absValue >= 1)
            return `${formatMetricValue(value, locale)} kWh`;
        const wh = value * 1000;
        if (Math.abs(wh) >= 1)
            return `${formatMetricValue(wh, locale)} Wh`;
        return `${formatMetricValue(wh * 1000, locale)} mWh`;
    }
    if (metricType === 'co2') {
        if (absValue >= 1)
            return `${formatMetricValue(value, locale)} kg`;
        const g = value * 1000;
        if (Math.abs(g) >= 1)
            return `${formatMetricValue(g, locale)} g`;
        return `${formatMetricValue(g * 1000, locale)} mg`;
    }
    if (absValue >= 1)
        return `${formatMetricValue(value, locale)} L`;
    const ml = value * 1000;
    if (Math.abs(ml) >= 1)
        return `${formatMetricValue(ml, locale)} mL`;
    return `${formatMetricValue(ml * 1000, locale)} μL`;
};
const MobileSessionPanel = ({ open, onClose, presentation = 'sheet', title, loginToken, userName, user, apiClient, userEmail, birthDate, avatarURL, actions, logoutLabel = 'Log out', onLogout, onKnownFactsOpen, onLocationEnable, onLocationDisable, knownFactsPageTitle = 'Known facts', sharePageTitle = 'Share', locationPageTitle = 'Location tracking', backLabel = 'Back', locationStatusLabel = 'Status', locationPlace, locationUnknownLabel = 'Unknown position', locationEnableLabel = 'Use current position', locationDisableLabel = 'Disable location sharing', knownFactsDescription, knownFactsCtaLabel = 'Open full known facts', knownFactsCountLabel, shareContent, knownFactsDisabled = false, knownFactsHint, showSessionInfo = false, showKnownFacts = false, history = [], aiUsageTitle, showMessageConsumption = false, isLoggedIn = false, showLogin = false, loginLabel = 'Log in', onLogin, venue, setVenue, }) => {
    const showAuthControls = showLogin;
    const showProfileControls = showAuthControls && isLoggedIn;
    const panelRef = (0, react_1.useRef)(null);
    const dialogRef = (0, react_1.useRef)(null);
    const panelTitleId = 'mobile-session-panel-title';
    const touchStartYRef = (0, react_1.useRef)(0);
    const [dragOffset, setDragOffset] = (0, react_1.useState)(0);
    const [activeView, setActiveView] = (0, react_1.useState)('session');
    const { uploadAsset, pwlUpdateUser } = (apiClient === null || apiClient === void 0 ? void 0 : apiClient.backend) || {};
    const { add } = (0, ui_1.useAlertManager)();
    const { t, i18n } = (0, react_i18next_1.useTranslation)();
    const currentLocale = i18n.language || navigator.language || 'en';
    const sustainabilityTotals = (0, react_1.useMemo)(() => {
        const totals = { energy: 0, gwp: 0, wcf: 0 };
        history.forEach(line => {
            var _a, _b, _c, _d;
            const energyImpact = (_a = line.llmUsage) === null || _a === void 0 ? void 0 : _a.energyImpact;
            if (!energyImpact)
                return;
            totals.energy += (_b = getMetricValue(energyImpact.energy)) !== null && _b !== void 0 ? _b : 0;
            totals.gwp += (_c = getMetricValue(energyImpact.gwp)) !== null && _c !== void 0 ? _c : 0;
            totals.wcf += (_d = getMetricValue(energyImpact.wcf)) !== null && _d !== void 0 ? _d : 0;
        });
        return totals;
    }, [history]);
    const hasSustainabilityData = (0, react_1.useMemo)(() => history.some(line => {
        var _a;
        return !!((_a = line.llmUsage) === null || _a === void 0 ? void 0 : _a.energyImpact);
    }), [history]);
    const hasChatConsumptionData = (0, react_1.useMemo)(() => history.some(line => !!line.llmUsage), [history]);
    const aiUsageSubtitle = hasSustainabilityData
        ? `${formatImpactInReadableUnit(sustainabilityTotals.energy, 'energy', currentLocale)} • ${formatImpactInReadableUnit(sustainabilityTotals.gwp, 'co2', currentLocale)}`
        : t('widget.noData', { defaultValue: 'Nessun dato disponibile' });
    const resolvedKnownFactsHint = knownFactsHint || t('widget.knownFactsHint') || 'What I remember about you';
    const resolvedAiUsageTitle = aiUsageTitle || t('widget.aiConsumption') || 'AI usage';
    (0, react_1.useEffect)(() => {
        if (!open)
            return;
        const onEscape = (event) => {
            if (event.key === 'Escape')
                onClose();
        };
        document.addEventListener('keydown', onEscape);
        return () => document.removeEventListener('keydown', onEscape);
    }, [open, onClose]);
    (0, react_1.useEffect)(() => {
        var _a;
        if (!open)
            return;
        const previouslyFocused = document.activeElement;
        const root = dialogRef.current;
        if (!root)
            return;
        const handleKeyDown = (event) => {
            if (event.key !== 'Tab')
                return;
            const focusableElements = root.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (!focusableElements.length)
                return;
            const first = focusableElements[0];
            const last = focusableElements[focusableElements.length - 1];
            const active = document.activeElement;
            if (event.shiftKey && active === first) {
                event.preventDefault();
                last.focus();
            }
            else if (!event.shiftKey && active === last) {
                event.preventDefault();
                first.focus();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        (_a = panelRef.current) === null || _a === void 0 ? void 0 : _a.focus();
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            previouslyFocused === null || previouslyFocused === void 0 ? void 0 : previouslyFocused.focus();
        };
    }, [open]);
    (0, react_1.useEffect)(() => {
        if (open)
            setActiveView('session');
    }, [open]);
    if (!open)
        return null;
    const updateAvatar = async (avatar) => {
        if (!uploadAsset || !pwlUpdateUser) {
            add((0, ui_1.createAlertOptions)({
                description: t('login.avatarUploadError'),
                severity: 'error',
            }));
            return;
        }
        if (avatar && loginToken) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                var _a, _b, _c, _d;
                try {
                    const { asset: avatarAsset, ...resp } = await uploadAsset((_a = avatar.name) !== null && _a !== void 0 ? _a : 'avatar', (_b = e.target) === null || _b === void 0 ? void 0 : _b.result, loginToken !== null && loginToken !== void 0 ? loginToken : '');
                    if (resp.resultCode !== 0) {
                        console.error('[updateAvatar] Upload failed:', resp);
                        add((0, ui_1.createAlertOptions)({
                            description: t((0, error_1.getErrori18nKey)(resp.resultCode)),
                            severity: 'error',
                        }));
                    }
                    else if (avatarAsset) {
                        let newUser = {
                            userID: (_c = user === null || user === void 0 ? void 0 : user.userID) !== null && _c !== void 0 ? _c : '',
                            avatarURL: avatarAsset.assetURL,
                        };
                        const { ...updateResp } = await pwlUpdateUser(loginToken !== null && loginToken !== void 0 ? loginToken : '', (_d = user === null || user === void 0 ? void 0 : user.userID) !== null && _d !== void 0 ? _d : '', newUser);
                        if (updateResp.resultCode !== 0) {
                            add((0, ui_1.createAlertOptions)({
                                description: t((0, error_1.getErrori18nKey)(updateResp.resultCode)),
                                severity: 'error',
                            }));
                        }
                        else {
                            add((0, ui_1.createAlertOptions)({
                                description: t('login.avatarUploadSuccess'),
                                severity: 'success',
                            }));
                        }
                    }
                }
                catch (e) {
                    let err = e;
                    console.error('[updateAvatar] Error:', err);
                    if (err === null || err === void 0 ? void 0 : err.message)
                        add((0, ui_1.createAlertOptions)({
                            description: err.message,
                            severity: 'error',
                        }));
                }
            };
            reader.readAsDataURL(avatar);
        }
        else {
            console.error('[updateAvatar] Missing avatar or login token', {
                avatar,
                loginToken,
            });
            add((0, ui_1.createAlertOptions)({
                description: t('login.avatarUploadError'),
                severity: 'error',
            }));
        }
    };
    const isPopover = presentation === 'popover';
    const isLocationEnabled = Boolean(locationPlace &&
        locationPlace.trim().length > 0 &&
        locationPlace !== locationUnknownLabel);
    const visibleActions = actions.filter(action => {
        const normalizedKey = action.key.toLowerCase();
        const normalizedTitle = action.title.toLowerCase();
        const isKnownFactsAction = action.view === 'knownFacts';
        const isAudioAction = normalizedKey.includes('audio') ||
            normalizedTitle.includes('audio') ||
            normalizedTitle.includes('sound');
        return !isKnownFactsAction && !isAudioAction;
    });
    return ((0, jsx_runtime_1.jsxs)("div", { ref: dialogRef, className: `memori-mobile-session-panel--overlay ${isPopover ? 'memori-mobile-session-panel--overlay-popover' : ''}`, role: "presentation", children: [!isPopover && ((0, jsx_runtime_1.jsx)("button", { type: "button", className: "memori-mobile-session-panel--backdrop", "aria-label": String(t('close', { defaultValue: 'Close' })), onClick: onClose })), (0, jsx_runtime_1.jsxs)("section", { ref: panelRef, tabIndex: -1, className: `memori-mobile-session-panel ${isPopover ? 'memori-mobile-session-panel--popover' : ''}`, role: "dialog", "aria-modal": "true", "aria-labelledby": panelTitleId, onClick: event => event.stopPropagation(), onTouchStart: isPopover
                    ? undefined
                    : event => {
                        touchStartYRef.current = event.touches[0].clientY;
                        setDragOffset(0);
                    }, onTouchMove: isPopover
                    ? undefined
                    : event => {
                        const delta = event.touches[0].clientY - touchStartYRef.current;
                        if (delta > 0)
                            setDragOffset(delta);
                    }, onTouchEnd: isPopover
                    ? undefined
                    : () => {
                        if (dragOffset > 90) {
                            onClose();
                        }
                        setDragOffset(0);
                    }, style: {
                    transform: dragOffset ? `translateY(${dragOffset}px)` : undefined,
                }, children: [!isPopover && (0, jsx_runtime_1.jsx)("div", { className: "memori-mobile-session-panel--handle" }), activeView === 'session' ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [showProfileControls && ((0, jsx_runtime_1.jsxs)("div", { className: "memori-mobile-session-panel--user", children: [(0, jsx_runtime_1.jsx)("div", { className: "memori-dropdown--avatar-wrap", children: avatarURL ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("img", { src: avatarURL, alt: userName || userEmail, className: "memori-dropdown--avatar" }), (0, jsx_runtime_1.jsx)("span", { className: "memori-dropdown--avatar-overlay", "aria-hidden": true, children: (0, jsx_runtime_1.jsx)(lucide_react_1.Camera, { size: 20, strokeWidth: 2 }) }), (0, jsx_runtime_1.jsx)("label", { htmlFor: "mobile-session-avatar-upload", className: "sr-only", children: t('login.changeAvatar', {
                                                        defaultValue: 'Change profile picture',
                                                    }) }), (0, jsx_runtime_1.jsx)("input", { type: "file", name: "avatar", id: "mobile-session-avatar-upload", className: "memori-dropdown--avatar-input", onChange: e => {
                                                        var _a, _b;
                                                        return updateAvatar((_b = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : null);
                                                    }, accept: utils_1.imgMimeTypes.join(', ') })] })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)("div", { className: "memori-dropdown--avatar-placeholder", children: [(0, jsx_runtime_1.jsx)("span", { className: "memori-dropdown--avatar-initial", children: (userName || userEmail || 'U')
                                                            .charAt(0)
                                                            .toUpperCase() }), (0, jsx_runtime_1.jsx)("span", { className: "memori-dropdown--avatar-overlay", "aria-hidden": true, children: (0, jsx_runtime_1.jsx)(lucide_react_1.Camera, { size: 20, strokeWidth: 2 }) }), (0, jsx_runtime_1.jsx)("label", { htmlFor: "mobile-session-avatar-upload-placeholder", className: "sr-only", children: t('login.changeAvatar', {
                                                            defaultValue: 'Change profile picture',
                                                        }) }), (0, jsx_runtime_1.jsx)("input", { type: "file", name: "avatar", id: "mobile-session-avatar-upload-placeholder", className: "memori-dropdown--avatar-input", onChange: e => {
                                                            var _a, _b;
                                                            return updateAvatar((_b = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : null);
                                                        }, accept: utils_1.imgMimeTypes.join(', ') })] }) })) }), (0, jsx_runtime_1.jsxs)("div", { className: "memori-dropdown--user-details", children: [(0, jsx_runtime_1.jsx)("h3", { className: "memori-dropdown--user-name", children: userName }), (0, jsx_runtime_1.jsx)("p", { className: "memori-dropdown--user-email", children: userEmail }), (0, jsx_runtime_1.jsx)("div", { className: "memori-dropdown--user-badge", children: birthDate
                                                    ? new Date(birthDate).toLocaleDateString()
                                                    : 'Not set' })] })] })), (0, jsx_runtime_1.jsx)("h2", { id: panelTitleId, className: "memori-mobile-session-panel--section-title", children: title }), showSessionInfo && (showKnownFacts || showMessageConsumption) && ((0, jsx_runtime_1.jsxs)("ul", { className: "memori-mobile-session-panel--actions memori-mobile-session-panel--session-info", children: [isLoggedIn && showKnownFacts && ((0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)(ui_1.Button, { variant: "toolbar", size: "sm", className: "memori-mobile-session-panel--action", disabled: knownFactsDisabled, onClick: () => {
                                                if (knownFactsDisabled)
                                                    return;
                                                onKnownFactsOpen === null || onKnownFactsOpen === void 0 ? void 0 : onKnownFactsOpen();
                                            }, children: [(0, jsx_runtime_1.jsx)("span", { className: "memori-mobile-session-panel--action-icon", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Brain, { size: 18 }) }), (0, jsx_runtime_1.jsxs)("span", { className: "memori-mobile-session-panel--action-copy", children: [(0, jsx_runtime_1.jsx)("span", { className: "memori-mobile-session-panel--action-title", children: knownFactsPageTitle }), (0, jsx_runtime_1.jsx)("span", { className: "memori-mobile-session-panel--action-subtitle", children: resolvedKnownFactsHint })] })] }) })), showMessageConsumption && ((0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)(ui_1.Button, { variant: "toolbar", size: "sm", className: "memori-mobile-session-panel--action", disabled: !hasChatConsumptionData, onClick: () => {
                                                if (!hasChatConsumptionData)
                                                    return;
                                                setActiveView('aiUsage');
                                            }, children: [(0, jsx_runtime_1.jsx)("span", { className: "memori-mobile-session-panel--action-icon", children: (0, jsx_runtime_1.jsx)(GasStation_1.default, {}) }), (0, jsx_runtime_1.jsxs)("span", { className: "memori-mobile-session-panel--action-copy", children: [(0, jsx_runtime_1.jsx)("span", { className: "memori-mobile-session-panel--action-title", children: resolvedAiUsageTitle }), (0, jsx_runtime_1.jsx)("span", { className: "memori-mobile-session-panel--action-subtitle", children: aiUsageSubtitle })] }), (0, jsx_runtime_1.jsx)("span", { className: "memori-mobile-session-panel--action-trailing", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronRight, { size: 16 }) })] }) }))] })), (0, jsx_runtime_1.jsx)("ul", { className: "memori-mobile-session-panel--actions", children: visibleActions.map(action => ((0, jsx_runtime_1.jsx)("li", { children: (() => {
                                        const isKnownFactsAction = action.view === 'knownFacts';
                                        const isShareAction = action.view === 'share';
                                        const isActionDisabled = action.disabled || (isKnownFactsAction && !isLoggedIn);
                                        return ((0, jsx_runtime_1.jsxs)(ui_1.Button, { variant: "toolbar", size: "sm", className: "memori-mobile-session-panel--action", disabled: isActionDisabled, onClick: () => {
                                                var _a;
                                                if (isActionDisabled)
                                                    return;
                                                if (action.view === 'knownFacts') {
                                                    if (onKnownFactsOpen) {
                                                        onKnownFactsOpen();
                                                        return;
                                                    }
                                                }
                                                if (action.view) {
                                                    setActiveView(action.view);
                                                    return;
                                                }
                                                (_a = action.onClick) === null || _a === void 0 ? void 0 : _a.call(action);
                                            }, children: [(0, jsx_runtime_1.jsx)("span", { className: "memori-mobile-session-panel--action-icon", children: action.icon }), (0, jsx_runtime_1.jsxs)("span", { className: "memori-mobile-session-panel--action-copy", children: [(0, jsx_runtime_1.jsx)("span", { className: "memori-mobile-session-panel--action-title", children: action.title }), action.subtitle && ((0, jsx_runtime_1.jsx)("span", { className: "memori-mobile-session-panel--action-subtitle", children: action.subtitle }))] }), (isShareAction || action.view === 'location') && ((0, jsx_runtime_1.jsx)("span", { className: "memori-mobile-session-panel--action-trailing", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronRight, { size: 16 }) }))] }));
                                    })() }, action.key))) }), showProfileControls && ((0, jsx_runtime_1.jsxs)(ui_1.Button, { variant: "toolbar", size: "sm", shape: "default", className: "memori-mobile-session-panel--logout", onClick: onLogout, children: [(0, jsx_runtime_1.jsx)("span", { className: "memori-mobile-session-panel--action-icon", children: (0, jsx_runtime_1.jsx)(lucide_react_1.LogOut, { size: 18 }) }), (0, jsx_runtime_1.jsx)("span", { className: "memori-mobile-session-panel--logout-label", children: logoutLabel })] })), showAuthControls && !isLoggedIn && ((0, jsx_runtime_1.jsx)("div", { className: "memori-mobile-session-panel--login-cta-wrap", children: (0, jsx_runtime_1.jsxs)(ui_1.Button, { variant: "toolbar", size: "sm", className: "memori-mobile-session-panel--login-cta", onClick: onLogin, children: [(0, jsx_runtime_1.jsx)("span", { className: "memori-mobile-session-panel--action-icon", children: (0, jsx_runtime_1.jsx)(lucide_react_1.LogIn, { size: 18 }) }), loginLabel] }) }))] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "memori-mobile-session-panel--page", children: [(0, jsx_runtime_1.jsxs)(ui_1.Button, { variant: "toolbar", size: "sm", className: "memori-mobile-session-panel--back", onClick: () => setActiveView('session'), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ChevronLeft, { size: 16 }), backLabel] }), (0, jsx_runtime_1.jsx)("h3", { className: "memori-mobile-session-panel--page-title", children: activeView === 'location'
                                    ? locationPageTitle
                                    : activeView === 'share'
                                        ? sharePageTitle
                                        : activeView === 'aiUsage'
                                            ? resolvedAiUsageTitle
                                            : knownFactsPageTitle }), activeView === 'location' ? ((0, jsx_runtime_1.jsx)("div", { className: "memori-mobile-session-panel--page-content memori-mobile-session-panel--location-content", children: setVenue ? ((0, jsx_runtime_1.jsx)(PositionPopover_1.PositionPopoverContent, { venue: venue, setVenue: setVenue })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("p", { className: "memori-mobile-session-panel--meta-label", children: locationStatusLabel }), (0, jsx_runtime_1.jsx)("p", { className: "memori-mobile-session-panel--meta-value", children: locationPlace || locationUnknownLabel }), (0, jsx_runtime_1.jsxs)("div", { className: "memori-mobile-session-panel--page-actions", children: [(0, jsx_runtime_1.jsx)(ui_1.Button, { variant: "toolbar", size: "sm", className: `memori-mobile-session-panel--page-btn ${isLocationEnabled
                                                        ? 'memori-mobile-session-panel--page-btn-active'
                                                        : ''}`, onClick: onLocationEnable, children: (0, jsx_runtime_1.jsx)("span", { children: locationEnableLabel }) }), (0, jsx_runtime_1.jsx)(ui_1.Button, { variant: "toolbar", size: "sm", className: "memori-mobile-session-panel--page-btn memori-mobile-session-panel--page-btn-secondary", onClick: onLocationDisable, children: locationDisableLabel })] })] })) })) : activeView === 'share' ? ((0, jsx_runtime_1.jsx)("div", { className: "memori-mobile-session-panel--page-content memori-mobile-session-panel--share-content", children: shareContent })) : activeView === 'aiUsage' ? ((0, jsx_runtime_1.jsx)("div", { className: "memori-mobile-session-panel--page-content memori-mobile-session-panel--ai-usage-content", children: (0, jsx_runtime_1.jsx)(ChatConsumptionDropdown_1.ChatConsumptionContent, { history: history, showTitle: false, className: "memori-mobile-session-panel--ai-usage" }) })) : ((0, jsx_runtime_1.jsxs)("div", { className: "memori-mobile-session-panel--page-content", children: [knownFactsDescription && ((0, jsx_runtime_1.jsx)("p", { className: "memori-mobile-session-panel--known-facts-description", children: knownFactsDescription })), knownFactsCountLabel && ((0, jsx_runtime_1.jsx)("p", { className: "memori-mobile-session-panel--known-facts-count", children: knownFactsCountLabel })), (0, jsx_runtime_1.jsx)(ui_1.Button, { variant: "toolbar", size: "sm", className: "memori-mobile-session-panel--page-btn", disabled: knownFactsDisabled, onClick: onKnownFactsOpen, children: knownFactsCtaLabel })] }))] }))] })] }));
};
exports.default = MobileSessionPanel;
//# sourceMappingURL=MobileSessionPanel.js.map