import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useCallback } from 'react';
import Tooltip from '../ui/Tooltip';
import Warning from '../icons/Warning';
import Alert from '../icons/Alert';
import Info from '../icons/Info';
import { useTranslation } from 'react-i18next';
import Spin from '../ui/Spin';
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
    const { t } = useTranslation();
    const [status, setStatus] = useState(forceStatus !== null && forceStatus !== void 0 ? forceStatus : 'operational');
    const [isLoading, setIsLoading] = useState(false);
    const config = PROVIDER_CONFIGS[provider];
    const getStatus = useCallback(async () => {
        if (!config)
            return 'operational';
        return fetchProviderStatus(config);
    }, [config]);
    useEffect(() => {
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
        return (_jsx("div", { className: "memori--completion-provider-status--loading", children: _jsx(Spin, { spinning: true }) }));
    }
    if (!status || status === 'operational') {
        return null;
    }
    const getStatusDetails = () => {
        switch (status) {
            case 'major_outage':
                return {
                    Icon: Alert,
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
                    Icon: Warning,
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
                    Icon: Info,
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
    return (_jsx(Tooltip, { className: "memori--completion-provider-status--tooltip", align: "right", content: _jsxs("div", { children: [_jsx("p", { children: message }), (config === null || config === void 0 ? void 0 : config.statusPage) && (_jsx("p", { children: _jsx("a", { href: config.statusPage, rel: "noopener noreferrer", target: "_blank", children: t('completionProviderCheckStatusPage') }) }))] }), children: _jsx(Icon, { className: `memori--completion-provider-status--icon ${className}` }) }));
};
export default CompletionProviderStatus;
//# sourceMappingURL=CompletionProviderStatus.js.map