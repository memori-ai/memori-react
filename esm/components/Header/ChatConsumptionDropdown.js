import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import Dropdown from '../ui/Dropdown';
import GasStation from '../icons/GasStation';
import { BADGE_EMOJI } from '../../helpers/llmUsage';
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
const formatCountValue = (value, locale) => new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
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
const ChatConsumptionDropdown = ({ history, hasSpacedButtons = false, trigger, }) => {
    const { t, i18n } = useTranslation();
    const currentLocale = i18n.language || navigator.language || 'en';
    const chatLog = useMemo(() => ({ lines: history }), [history]);
    const chatConsumptionTotals = useMemo(() => {
        var _a;
        const totals = {
            totalInputTokens: 0,
            totalOutputTokens: 0,
            energy: 0,
            gwp: 0,
            wcf: 0,
            models: new Set(),
        };
        ((_a = chatLog === null || chatLog === void 0 ? void 0 : chatLog.lines) !== null && _a !== void 0 ? _a : []).forEach(line => {
            var _a, _b, _c, _d, _e;
            const llmUsage = line.llmUsage;
            if (!llmUsage)
                return;
            totals.totalInputTokens += (_a = llmUsage.totalInputTokens) !== null && _a !== void 0 ? _a : 0;
            totals.totalOutputTokens += (_b = llmUsage.outputTokens) !== null && _b !== void 0 ? _b : 0;
            if (llmUsage.provider || llmUsage.model) {
                totals.models.add([llmUsage.provider, llmUsage.model].filter(Boolean).join(' · '));
            }
            if (!llmUsage.energyImpact)
                return;
            const impact = llmUsage.energyImpact;
            totals.energy += (_c = getMetricValue(impact.energy)) !== null && _c !== void 0 ? _c : 0;
            totals.gwp += (_d = getMetricValue(impact.gwp)) !== null && _d !== void 0 ? _d : 0;
            totals.wcf += (_e = getMetricValue(impact.wcf)) !== null && _e !== void 0 ? _e : 0;
        });
        return totals;
    }, [chatLog]);
    const llmUsageModels = useMemo(() => Array.from(chatConsumptionTotals.models), [chatConsumptionTotals.models]);
    const hasConsumptionData = useMemo(() => {
        var _a;
        return ((_a = chatLog === null || chatLog === void 0 ? void 0 : chatLog.lines) !== null && _a !== void 0 ? _a : []).some(line => !!line.llmUsage);
    }, [chatLog]);
    if (!hasConsumptionData)
        return null;
    return (_jsx(Dropdown, { placement: "bottom-right", trigger: trigger !== null && trigger !== void 0 ? trigger : (_jsx(Button, { primary: true, shape: "circle", className: cx('memori-header--button', 'memori-header--button--sustainability', hasSpacedButtons && 'memori-header--button-spaced'), title: t('write_and_speak.showMessageConsumptionLabel') ||
                'LLM consumption', icon: _jsx(GasStation, { className: "memori-header--button--sustainability-icon" }) })), children: _jsxs("div", { className: "memori-dropdown--sustainability", children: [_jsx("h4", { className: "memori-dropdown--sustainability-title", children: t('chatLogs.totalChatConsumptionTitle') || 'Consumo Totale Chat' }), _jsxs("div", { className: "memori-dropdown--sustainability-section", children: [_jsx("h5", { className: "memori-dropdown--sustainability-section-title", children: t('chatLogs.modelUsage') || 'Model usage' }), _jsxs("div", { className: "memori-dropdown--sustainability-summary", children: [_jsxs("div", { className: "memori-dropdown--sustainability-stat", children: [_jsx("span", { className: "memori-dropdown--sustainability-stat-label", children: t('chatLogs.input') || 'Input' }), _jsx("strong", { className: "memori-dropdown--sustainability-stat-value", children: formatCountValue(chatConsumptionTotals.totalInputTokens, currentLocale) }), _jsx("span", { className: "memori-dropdown--sustainability-stat-meta", children: t('chatLogs.tokens') || 'Tokens' })] }), _jsxs("div", { className: "memori-dropdown--sustainability-stat", children: [_jsx("span", { className: "memori-dropdown--sustainability-stat-label", children: t('chatLogs.output') || 'Output' }), _jsx("strong", { className: "memori-dropdown--sustainability-stat-value", children: formatCountValue(chatConsumptionTotals.totalOutputTokens, currentLocale) }), _jsx("span", { className: "memori-dropdown--sustainability-stat-meta", children: t('chatLogs.tokens') || 'Tokens' })] })] }), llmUsageModels.length > 0 && (_jsxs("div", { className: "memori-dropdown--sustainability-row memori-dropdown--sustainability-row--stacked", children: [_jsxs("span", { className: "memori-dropdown--sustainability-label", children: [t('chatLogs.provider') || 'Provider', " /", ' ', t('chatLogs.model') || 'Model'] }), _jsx("div", { className: "memori-dropdown--sustainability-tags", children: llmUsageModels.map(modelLabel => (_jsx("span", { className: "memori-dropdown--sustainability-tag", children: modelLabel }, modelLabel))) })] }))] }), _jsxs("div", { className: "memori-dropdown--sustainability-metrics", children: [_jsx("h5", { className: "memori-dropdown--sustainability-section-title", children: t('chatLogs.environmentalImpact') || 'Environmental impact' }), _jsxs("div", { className: "memori-dropdown--sustainability-row", children: [_jsxs("span", { className: "memori-dropdown--sustainability-label", children: [_jsx("span", { "aria-hidden": "true", children: BADGE_EMOJI.energy }), ' ', t('chatLogs.energy') || 'Energy'] }), _jsx("strong", { className: "memori-dropdown--sustainability-value", children: formatImpactInReadableUnit(chatConsumptionTotals.energy, 'energy', currentLocale) })] }), _jsxs("div", { className: "memori-dropdown--sustainability-row", children: [_jsxs("span", { className: "memori-dropdown--sustainability-label", children: [_jsx("span", { "aria-hidden": "true", children: BADGE_EMOJI.co2 }), ' ', t('chatLogs.co2') || 'CO2'] }), _jsx("strong", { className: "memori-dropdown--sustainability-value", children: formatImpactInReadableUnit(chatConsumptionTotals.gwp, 'co2', currentLocale) })] }), _jsxs("div", { className: "memori-dropdown--sustainability-row", children: [_jsxs("span", { className: "memori-dropdown--sustainability-label", children: [_jsx("span", { "aria-hidden": "true", children: BADGE_EMOJI.water }), ' ', t('chatLogs.water') || 'Water'] }), _jsx("strong", { className: "memori-dropdown--sustainability-value", children: formatImpactInReadableUnit(chatConsumptionTotals.wcf, 'water', currentLocale) })] })] })] }) }));
};
export default ChatConsumptionDropdown;
//# sourceMappingURL=ChatConsumptionDropdown.js.map