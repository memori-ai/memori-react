"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildLlmUsageHtml = exports.getImpactComparison = exports.formatImpactWithApiUnit = exports.formatImpactInReadableUnit = exports.formatDuration = exports.formatIntegerValue = exports.getMetricValue = exports.escapeHtml = exports.BADGE_EMOJI = void 0;
exports.BADGE_EMOJI = {
    llm: '🤖',
    energy: '⚡',
    co2: '🌍',
    water: '💧',
};
const escapeHtml = (value) => value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
exports.escapeHtml = escapeHtml;
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
exports.getMetricValue = getMetricValue;
const formatMetricValue = (value, locale = 'it-IT') => {
    if (!Number.isFinite(value))
        return '—';
    if (value === 0)
        return '0';
    const absValue = Math.abs(value);
    return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: absValue >= 1 ? 3 : 4,
    }).format(value);
};
const formatIntegerValue = (value, locale = 'it-IT') => {
    if (!Number.isFinite(value))
        return '0';
    return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value);
};
exports.formatIntegerValue = formatIntegerValue;
const formatDuration = (durationMs, locale = 'it-IT') => {
    if (typeof durationMs !== 'number' || !Number.isFinite(durationMs)) {
        return '—';
    }
    if (durationMs < 1000)
        return `${(0, exports.formatIntegerValue)(durationMs, locale)} ms`;
    return `${formatMetricValue(durationMs / 1000, locale)} s`;
};
exports.formatDuration = formatDuration;
const floorToSingleDecimal = (value) => Math.floor(value * 10) / 10;
const formatComparisonNumber = (value, locale = 'it-IT') => new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
}).format(floorToSingleDecimal(value));
const formatReadableDuration = (seconds, locale = 'it-IT') => {
    if (!Number.isFinite(seconds) || seconds <= 0)
        return '0 s';
    if (seconds < 60)
        return `${formatComparisonNumber(seconds, locale)} s`;
    const minutes = seconds / 60;
    if (minutes < 60)
        return `${formatComparisonNumber(minutes, locale)} min`;
    return `${formatComparisonNumber(minutes / 60, locale)} h`;
};
const formatReadableDistance = (meters, locale = 'it-IT') => {
    if (!Number.isFinite(meters) || meters <= 0)
        return '0 m';
    if (meters < 1000)
        return `${formatComparisonNumber(meters, locale)} m`;
    return `${formatComparisonNumber(meters / 1000, locale)} km`;
};
const getApiUnitToBaseFactor = (unitFromApi, metricType) => {
    const u = (unitFromApi !== null && unitFromApi !== void 0 ? unitFromApi : '').trim().toLowerCase();
    if (metricType === 'energy') {
        if (u === 'kwh')
            return 1;
        if (u === 'wh')
            return 0.001;
        if (u === 'mwh')
            return 0.000001;
        return 1;
    }
    if (metricType === 'co2') {
        if (u === 'kg' || u === 'kgco2eq')
            return 1;
        if (u === 'g')
            return 0.001;
        if (u === 'mg')
            return 0.000001;
        return 1;
    }
    if (u === 'l')
        return 1;
    if (u === 'ml')
        return 0.001;
    if (u === 'μl' || u === 'ul')
        return 0.000001;
    return 1;
};
const formatImpactInReadableUnit = (value, metricType, locale = 'it-IT') => {
    const absValue = Math.abs(value);
    if (metricType === 'energy') {
        if (absValue >= 1)
            return `${formatMetricValue(value, locale)} kWh`;
        const wattHours = value * 1000;
        if (Math.abs(wattHours) >= 1)
            return `${formatMetricValue(wattHours, locale)} Wh`;
        return `${formatMetricValue(wattHours * 1000, locale)} mWh`;
    }
    if (metricType === 'co2') {
        if (absValue >= 1)
            return `${formatMetricValue(value, locale)} kg`;
        const grams = value * 1000;
        if (Math.abs(grams) >= 1)
            return `${formatMetricValue(grams, locale)} g`;
        return `${formatMetricValue(grams * 1000, locale)} mg`;
    }
    if (absValue >= 1)
        return `${formatMetricValue(value, locale)} L`;
    const milliliters = value * 1000;
    if (Math.abs(milliliters) >= 1)
        return `${formatMetricValue(milliliters, locale)} mL`;
    return `${formatMetricValue(milliliters * 1000, locale)} μL`;
};
exports.formatImpactInReadableUnit = formatImpactInReadableUnit;
const formatImpactWithApiUnit = (value, unitFromApi, fallbackUnit, metricType, locale = 'it-IT') => {
    const factor = getApiUnitToBaseFactor(unitFromApi !== null && unitFromApi !== void 0 ? unitFromApi : fallbackUnit, metricType);
    const baseValue = value * factor;
    return (0, exports.formatImpactInReadableUnit)(baseValue, metricType, locale);
};
exports.formatImpactWithApiUnit = formatImpactWithApiUnit;
const getImpactComparison = (value, metricType, locale = 'it-IT', t) => {
    if (!Number.isFinite(value) || value <= 0) {
        return t('chatLogs.impactComparisonUnavailable');
    }
    if (metricType === 'energy') {
        const ledSeconds = (value * 1000 * 3600) / 10;
        return t('chatLogs.impactComparisonEnergy', {
            duration: formatReadableDuration(ledSeconds, locale),
        });
    }
    if (metricType === 'co2') {
        const averageCarMeters = (value / 0.12) * 1000;
        return t('chatLogs.impactComparisonCo2', {
            distance: formatReadableDistance(averageCarMeters, locale),
        });
    }
    const drops = (value * 1000) / 0.05;
    return t('chatLogs.impactComparisonWater', {
        count: formatComparisonNumber(drops, locale),
    });
};
exports.getImpactComparison = getImpactComparison;
const buildUsageBadgeHtml = ({ badgeType, badgeClassName, label, value, lineIndex, emoji, }) => {
    const escapedLabel = (0, exports.escapeHtml)(label);
    const valueHtml = value
        ? `<span class="memori-chat--usage-badge-value">${value}</span>`
        : '';
    const content = valueHtml ||
        `<span class="memori-chat--usage-badge-label">${escapedLabel}</span>`;
    return `<button type="button" class="memori-chat--usage-badge ${badgeClassName}" data-llm-badge-type="${badgeType}" data-line-index="${lineIndex}" aria-label="${escapedLabel}">${emoji} ${content}</button>`;
};
const buildLlmUsageHtml = (usage, labels, lineIndex, locale = 'it-IT') => {
    var _a, _b, _c, _d, _e, _f;
    const badges = [
        buildUsageBadgeHtml({
            badgeType: 'llm',
            badgeClassName: 'memori-chat--usage-badge-llm',
            label: labels.llm,
            lineIndex,
            emoji: exports.BADGE_EMOJI.llm,
        }),
    ];
    const energy = (0, exports.getMetricValue)((_a = usage.energyImpact) === null || _a === void 0 ? void 0 : _a.energy);
    const gwp = (0, exports.getMetricValue)((_b = usage.energyImpact) === null || _b === void 0 ? void 0 : _b.gwp);
    const wcf = (0, exports.getMetricValue)((_c = usage.energyImpact) === null || _c === void 0 ? void 0 : _c.wcf);
    if (typeof energy === 'number') {
        const energyFormatted = (0, exports.formatImpactWithApiUnit)(energy, (_d = usage.energyImpact) === null || _d === void 0 ? void 0 : _d.energyUnit, 'kWh', 'energy', locale);
        badges.push(buildUsageBadgeHtml({
            badgeType: 'energy',
            badgeClassName: 'memori-chat--usage-badge-energy',
            label: `${labels.energy} ${energyFormatted}`,
            value: (0, exports.escapeHtml)(energyFormatted),
            lineIndex,
            emoji: exports.BADGE_EMOJI.energy,
        }));
    }
    if (typeof gwp === 'number') {
        const co2Formatted = (0, exports.formatImpactWithApiUnit)(gwp, (_e = usage.energyImpact) === null || _e === void 0 ? void 0 : _e.gwpUnit, 'kgCO2eq', 'co2', locale);
        badges.push(buildUsageBadgeHtml({
            badgeType: 'co2',
            badgeClassName: 'memori-chat--usage-badge-co2',
            label: `${labels.co2} ${co2Formatted}`,
            value: (0, exports.escapeHtml)(co2Formatted),
            lineIndex,
            emoji: exports.BADGE_EMOJI.co2,
        }));
    }
    if (typeof wcf === 'number') {
        const waterFormatted = (0, exports.formatImpactWithApiUnit)(wcf, (_f = usage.energyImpact) === null || _f === void 0 ? void 0 : _f.wcfUnit, 'L', 'water', locale);
        badges.push(buildUsageBadgeHtml({
            badgeType: 'water',
            badgeClassName: 'memori-chat--usage-badge-water',
            label: `${labels.water} ${waterFormatted}`,
            value: (0, exports.escapeHtml)(waterFormatted),
            lineIndex,
            emoji: exports.BADGE_EMOJI.water,
        }));
    }
    return `<div class="memori-chat--llm-usage" data-llm-usage><hr class="memori-chat--llm-usage-hr" /><p class="memori-chat--llm-usage-hint">${(0, exports.escapeHtml)(labels.usageBadgesHint)}</p><div class="memori-chat--llm-usage-badges">${badges.join('')}</div></div>`;
};
exports.buildLlmUsageHtml = buildLlmUsageHtml;
//# sourceMappingURL=llmUsage.js.map