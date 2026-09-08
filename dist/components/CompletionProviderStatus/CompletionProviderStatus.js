"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Tooltip_1 = tslib_1.__importDefault(require("../ui/Tooltip"));
const Warning_1 = tslib_1.__importDefault(require("../icons/Warning"));
const Alert_1 = tslib_1.__importDefault(require("../icons/Alert"));
const Info_1 = tslib_1.__importDefault(require("../icons/Info"));
const react_i18next_1 = require("react-i18next");
const Spin_1 = tslib_1.__importDefault(require("../ui/Spin"));
const PROVIDER_CONFIGS = {
    OpenAI: {
        statusUrl: 'https://status.openai.com/api/v2/summary.json',
        statusPage: 'https://status.openai.com/',
        apiComponentName: ['Chat', 'Completions (legacy)'],
    },
    Mistral: {
        statusUrl: 'https://status.mistral-data.com/api/v2/summary.json',
        statusPage: 'https://status.mistral-data.com/',
        apiComponentName: ['Mistral'],
    },
    Anthropic: {
        statusUrl: 'https://status.claude.com/api/v2/summary.json',
        statusPage: 'https://status.claude.com/',
        apiComponentName: [
            'Claude API (api.anthropic.com)',
            'api.anthropic.com',
        ],
    },
};
const fetchProviderStatus = async (config) => {
    try {
        const response = await fetch(config.statusUrl);
        if (!response.ok) {
            console.warn(`Status API returned ${response.status}`);
            return 'operational';
        }
        const data = await response.json();
        if (data.components) {
            if (config.apiComponentName) {
                const apiComponentNames = Array.isArray(config.apiComponentName)
                    ? config.apiComponentName
                    : [config.apiComponentName];
                for (const name of apiComponentNames) {
                    const apiComponent = data.components.find((component) => component.name === name);
                    if (apiComponent && apiComponent.status !== 'operational') {
                        return apiComponent.status;
                    }
                }
            }
            const anyDegradedComponent = data.components.some((component) => component.status !== 'operational');
            if (anyDegradedComponent) {
                return 'degraded_performance';
            }
        }
        if (data.status && data.status.indicator !== 'none') {
            if (data.status.indicator === 'critical')
                return 'major_outage';
            if (data.status.indicator === 'major')
                return 'partial_outage';
            if (data.status.indicator === 'minor')
                return 'degraded_performance';
        }
        return 'operational';
    }
    catch (error) {
        console.error('Error fetching provider status:', error);
        return 'operational';
    }
};
const CompletionProviderStatus = ({ forceStatus, provider = 'Anthropic', }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [status, setStatus] = (0, react_1.useState)(forceStatus !== null && forceStatus !== void 0 ? forceStatus : 'operational');
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const config = PROVIDER_CONFIGS[provider];
    const getStatus = (0, react_1.useCallback)(async () => {
        if (!config)
            return 'operational';
        return fetchProviderStatus(config);
    }, [config]);
    (0, react_1.useEffect)(() => {
        let mounted = true;
        const abortController = new AbortController();
        const checkStatus = async () => {
            if (forceStatus)
                return;
            setIsLoading(true);
            try {
                const newStatus = await getStatus();
                if (mounted) {
                    setStatus(newStatus);
                }
            }
            catch (error) {
                console.error('Failed to check status:', error);
                if (mounted) {
                    setStatus('operational');
                }
            }
            finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        };
        checkStatus();
        return () => {
            mounted = false;
            abortController.abort();
        };
    }, [forceStatus, getStatus]);
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "memori--completion-provider-status--loading", children: (0, jsx_runtime_1.jsx)(Spin_1.default, { spinning: true }) }));
    }
    if (!status || status === 'operational') {
        return null;
    }
    const getStatusDetails = () => {
        switch (status) {
            case 'major_outage':
                return {
                    Icon: Alert_1.default,
                    message: t('completionProviderMajorOutage', {
                        provider: provider !== null && provider !== void 0 ? provider : t('completionProviderFallbackName'),
                        fallback: t('completionProviderDown', {
                            provider: provider !== null && provider !== void 0 ? provider : t('completionProviderFallbackName'),
                        })
                    }),
                    className: "memori--completion-provider-status--icon-error"
                };
            case 'partial_outage':
                return {
                    Icon: Warning_1.default,
                    message: t('completionProviderPartialOutage', {
                        provider: provider !== null && provider !== void 0 ? provider : t('completionProviderFallbackName'),
                        fallback: t('completionProviderDown', {
                            provider: provider !== null && provider !== void 0 ? provider : t('completionProviderFallbackName'),
                        })
                    }),
                    className: "memori--completion-provider-status--icon-warning"
                };
            case 'degraded_performance':
            default:
                return {
                    Icon: Info_1.default,
                    message: t('completionProviderDegraded', {
                        provider: provider !== null && provider !== void 0 ? provider : t('completionProviderFallbackName'),
                        fallback: t('completionProviderDown', {
                            provider: provider !== null && provider !== void 0 ? provider : t('completionProviderFallbackName'),
                        })
                    }),
                    className: "memori--completion-provider-status--icon-info"
                };
        }
    };
    const { Icon, message, className } = getStatusDetails();
    return ((0, jsx_runtime_1.jsx)(Tooltip_1.default, { className: "memori--completion-provider-status--tooltip", align: "right", content: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { children: message }), (config === null || config === void 0 ? void 0 : config.statusPage) && ((0, jsx_runtime_1.jsx)("p", { children: (0, jsx_runtime_1.jsx)("a", { href: config.statusPage, rel: "noopener noreferrer", target: "_blank", children: t('completionProviderCheckStatusPage') }) }))] }), children: (0, jsx_runtime_1.jsx)(Icon, { className: `memori--completion-provider-status--icon ${className}` }) }));
};
exports.default = CompletionProviderStatus;
//# sourceMappingURL=CompletionProviderStatus.js.map