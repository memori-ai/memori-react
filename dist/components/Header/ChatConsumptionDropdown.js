"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const react_i18next_1 = require("react-i18next");
const Button_1 = tslib_1.__importDefault(require("../ui/Button"));
const Dropdown_1 = tslib_1.__importDefault(require("../ui/Dropdown"));
const GasStation_1 = tslib_1.__importDefault(require("../icons/GasStation"));
const llmUsage_1 = require("../../helpers/llmUsage");
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
    const { t, i18n } = (0, react_i18next_1.useTranslation)();
    const currentLocale = i18n.language || navigator.language || 'en';
    const chatLog = (0, react_1.useMemo)(() => ({ lines: history }), [history]);
    const chatConsumptionTotals = (0, react_1.useMemo)(() => {
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
    const llmUsageModels = (0, react_1.useMemo)(() => Array.from(chatConsumptionTotals.models), [chatConsumptionTotals.models]);
    const hasConsumptionData = (0, react_1.useMemo)(() => {
        var _a;
        return ((_a = chatLog === null || chatLog === void 0 ? void 0 : chatLog.lines) !== null && _a !== void 0 ? _a : []).some(line => !!line.llmUsage);
    }, [chatLog]);
    if (!hasConsumptionData)
        return null;
    return ((0, jsx_runtime_1.jsx)(Dropdown_1.default, { placement: "bottom-right", trigger: trigger !== null && trigger !== void 0 ? trigger : ((0, jsx_runtime_1.jsx)(Button_1.default, { primary: true, shape: "circle", className: (0, classnames_1.default)('memori-header--button', 'memori-header--button--sustainability', hasSpacedButtons && 'memori-header--button-spaced'), title: t('write_and_speak.showMessageConsumptionLabel') ||
                'LLM consumption', icon: (0, jsx_runtime_1.jsx)(GasStation_1.default, { className: "memori-header--button--sustainability-icon" }) })), children: (0, jsx_runtime_1.jsxs)("div", { className: "memori-dropdown--sustainability", children: [(0, jsx_runtime_1.jsx)("h4", { className: "memori-dropdown--sustainability-title", children: t('chatLogs.totalChatConsumptionTitle') || 'Consumo Totale Chat' }), (0, jsx_runtime_1.jsxs)("div", { className: "memori-dropdown--sustainability-section", children: [(0, jsx_runtime_1.jsx)("h5", { className: "memori-dropdown--sustainability-section-title", children: t('chatLogs.modelUsage') || 'Model usage' }), (0, jsx_runtime_1.jsxs)("div", { className: "memori-dropdown--sustainability-summary", children: [(0, jsx_runtime_1.jsxs)("div", { className: "memori-dropdown--sustainability-stat", children: [(0, jsx_runtime_1.jsx)("span", { className: "memori-dropdown--sustainability-stat-label", children: t('chatLogs.input') || 'Input' }), (0, jsx_runtime_1.jsx)("strong", { className: "memori-dropdown--sustainability-stat-value", children: formatCountValue(chatConsumptionTotals.totalInputTokens, currentLocale) }), (0, jsx_runtime_1.jsx)("span", { className: "memori-dropdown--sustainability-stat-meta", children: t('chatLogs.tokens') || 'Tokens' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "memori-dropdown--sustainability-stat", children: [(0, jsx_runtime_1.jsx)("span", { className: "memori-dropdown--sustainability-stat-label", children: t('chatLogs.output') || 'Output' }), (0, jsx_runtime_1.jsx)("strong", { className: "memori-dropdown--sustainability-stat-value", children: formatCountValue(chatConsumptionTotals.totalOutputTokens, currentLocale) }), (0, jsx_runtime_1.jsx)("span", { className: "memori-dropdown--sustainability-stat-meta", children: t('chatLogs.tokens') || 'Tokens' })] })] }), llmUsageModels.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "memori-dropdown--sustainability-row memori-dropdown--sustainability-row--stacked", children: [(0, jsx_runtime_1.jsxs)("span", { className: "memori-dropdown--sustainability-label", children: [t('chatLogs.provider') || 'Provider', " /", ' ', t('chatLogs.model') || 'Model'] }), (0, jsx_runtime_1.jsx)("div", { className: "memori-dropdown--sustainability-tags", children: llmUsageModels.map(modelLabel => ((0, jsx_runtime_1.jsx)("span", { className: "memori-dropdown--sustainability-tag", children: modelLabel }, modelLabel))) })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "memori-dropdown--sustainability-metrics", children: [(0, jsx_runtime_1.jsx)("h5", { className: "memori-dropdown--sustainability-section-title", children: t('chatLogs.environmentalImpact') || 'Environmental impact' }), (0, jsx_runtime_1.jsxs)("div", { className: "memori-dropdown--sustainability-row", children: [(0, jsx_runtime_1.jsxs)("span", { className: "memori-dropdown--sustainability-label", children: [(0, jsx_runtime_1.jsx)("span", { "aria-hidden": "true", children: llmUsage_1.BADGE_EMOJI.energy }), ' ', t('chatLogs.energy') || 'Energy'] }), (0, jsx_runtime_1.jsx)("strong", { className: "memori-dropdown--sustainability-value", children: formatImpactInReadableUnit(chatConsumptionTotals.energy, 'energy', currentLocale) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "memori-dropdown--sustainability-row", children: [(0, jsx_runtime_1.jsxs)("span", { className: "memori-dropdown--sustainability-label", children: [(0, jsx_runtime_1.jsx)("span", { "aria-hidden": "true", children: llmUsage_1.BADGE_EMOJI.co2 }), ' ', t('chatLogs.co2') || 'CO2'] }), (0, jsx_runtime_1.jsx)("strong", { className: "memori-dropdown--sustainability-value", children: formatImpactInReadableUnit(chatConsumptionTotals.gwp, 'co2', currentLocale) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "memori-dropdown--sustainability-row", children: [(0, jsx_runtime_1.jsxs)("span", { className: "memori-dropdown--sustainability-label", children: [(0, jsx_runtime_1.jsx)("span", { "aria-hidden": "true", children: llmUsage_1.BADGE_EMOJI.water }), ' ', t('chatLogs.water') || 'Water'] }), (0, jsx_runtime_1.jsx)("strong", { className: "memori-dropdown--sustainability-value", children: formatImpactInReadableUnit(chatConsumptionTotals.wcf, 'water', currentLocale) })] })] })] }) }));
};
exports.default = ChatConsumptionDropdown;
//# sourceMappingURL=ChatConsumptionDropdown.js.map