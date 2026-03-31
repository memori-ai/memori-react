export interface LlmUsageOnLine {
  provider?: string;
  model?: string;
  totalInputTokens?: number;
  inputCacheReadTokens?: number;
  inputCacheWriteTokens?: number;
  outputTokens?: number;
  durationMs?: number;
  energyImpact?: {
    energy?: number | { source?: string; parsedValue?: number };
    energyUnit?: string;
    gwp?: number | { source?: string; parsedValue?: number };
    gwpUnit?: string;
    wcf?: number | { source?: string; parsedValue?: number };
    wcfUnit?: string;
  };
}

export type UsageBadgeType = 'llm' | 'energy' | 'co2' | 'water';
type NumericMetric = number | { source?: string; parsedValue?: number };
type ImpactMetricType = 'energy' | 'co2' | 'water';
type TranslateFn = (key: string, options?: { [key: string]: unknown }) => string;

export interface LlmUsageLabels {
  llm: string;
  model: string;
  provider: string;
  tokens: string;
  input: string;
  output: string;
  cacheRead: string;
  cacheWrite: string;
  duration: string;
  energy: string;
  co2: string;
  water: string;
  usageBadgesHint: string;
}

export const BADGE_EMOJI: Record<UsageBadgeType, string> = {
  llm: '🤖',
  energy: '⚡',
  co2: '🌍',
  water: '💧',
};

export const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

export const getMetricValue = (metric?: NumericMetric): number | undefined => {
  if (typeof metric === 'number' && Number.isFinite(metric)) return metric;
  if (!metric || typeof metric !== 'object') return undefined;
  if (
    typeof metric.parsedValue === 'number' &&
    Number.isFinite(metric.parsedValue)
  ) {
    return metric.parsedValue;
  }
  if (typeof metric.source === 'string') {
    const parsed = Number(metric.source);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
};

const formatMetricValue = (value: number, locale = 'it-IT'): string => {
  if (!Number.isFinite(value)) return '—';
  if (value === 0) return '0';

  const absValue = Math.abs(value);
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: absValue >= 1 ? 3 : 4,
  }).format(value);
};

export const formatIntegerValue = (value: number, locale = 'it-IT'): string => {
  if (!Number.isFinite(value)) return '0';
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(
    value,
  );
};

export const formatDuration = (durationMs?: number, locale = 'it-IT'): string => {
  if (typeof durationMs !== 'number' || !Number.isFinite(durationMs)) {
    return '—';
  }
  if (durationMs < 1000) return `${formatIntegerValue(durationMs, locale)} ms`;
  return `${formatMetricValue(durationMs / 1000, locale)} s`;
};

const floorToSingleDecimal = (value: number): number =>
  Math.floor(value * 10) / 10;

const formatComparisonNumber = (value: number, locale = 'it-IT'): string =>
  new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(floorToSingleDecimal(value));

const formatReadableDuration = (seconds: number, locale = 'it-IT'): string => {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0 s';
  if (seconds < 60) return `${formatComparisonNumber(seconds, locale)} s`;

  const minutes = seconds / 60;
  if (minutes < 60) return `${formatComparisonNumber(minutes, locale)} min`;

  return `${formatComparisonNumber(minutes / 60, locale)} h`;
};

const formatReadableDistance = (meters: number, locale = 'it-IT'): string => {
  if (!Number.isFinite(meters) || meters <= 0) return '0 m';
  if (meters < 1000) return `${formatComparisonNumber(meters, locale)} m`;
  return `${formatComparisonNumber(meters / 1000, locale)} km`;
};

const getApiUnitToBaseFactor = (
  unitFromApi: string | undefined,
  metricType: ImpactMetricType,
): number => {
  const u = (unitFromApi ?? '').trim().toLowerCase();
  if (metricType === 'energy') {
    if (u === 'kwh') return 1;
    if (u === 'wh') return 0.001;
    if (u === 'mwh') return 0.000001;
    return 1;
  }
  if (metricType === 'co2') {
    if (u === 'kg' || u === 'kgco2eq') return 1;
    if (u === 'g') return 0.001;
    if (u === 'mg') return 0.000001;
    return 1;
  }
  if (u === 'l') return 1;
  if (u === 'ml') return 0.001;
  if (u === 'μl' || u === 'ul') return 0.000001;
  return 1;
};

export const formatImpactInReadableUnit = (
  value: number,
  metricType: ImpactMetricType,
  locale = 'it-IT',
): string => {
  const absValue = Math.abs(value);

  if (metricType === 'energy') {
    if (absValue >= 1) return `${formatMetricValue(value, locale)} kWh`;
    const wattHours = value * 1000;
    if (Math.abs(wattHours) >= 1) return `${formatMetricValue(wattHours, locale)} Wh`;
    return `${formatMetricValue(wattHours * 1000, locale)} mWh`;
  }

  if (metricType === 'co2') {
    if (absValue >= 1) return `${formatMetricValue(value, locale)} kg`;
    const grams = value * 1000;
    if (Math.abs(grams) >= 1) return `${formatMetricValue(grams, locale)} g`;
    return `${formatMetricValue(grams * 1000, locale)} mg`;
  }

  if (absValue >= 1) return `${formatMetricValue(value, locale)} L`;
  const milliliters = value * 1000;
  if (Math.abs(milliliters) >= 1) return `${formatMetricValue(milliliters, locale)} mL`;
  return `${formatMetricValue(milliliters * 1000, locale)} μL`;
};

export const formatImpactWithApiUnit = (
  value: number,
  unitFromApi: string | undefined,
  fallbackUnit: string,
  metricType: ImpactMetricType,
  locale = 'it-IT',
): string => {
  const factor = getApiUnitToBaseFactor(
    unitFromApi ?? fallbackUnit,
    metricType,
  );
  const baseValue = value * factor;
  return formatImpactInReadableUnit(baseValue, metricType, locale);
};

export const getImpactComparison = (
  value: number,
  metricType: ImpactMetricType,
  locale = 'it-IT',
  t: TranslateFn,
): string => {
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

const buildUsageBadgeHtml = ({
  badgeType,
  badgeClassName,
  label,
  value,
  lineIndex,
  emoji,
}: {
  badgeType: UsageBadgeType;
  badgeClassName: string;
  label: string;
  value?: string;
  lineIndex: number;
  emoji: string;
}): string => {
  const escapedLabel = escapeHtml(label);
  const valueHtml = value
    ? `<span class="memori-chat--usage-badge-value">${value}</span>`
    : '';
  const content =
    valueHtml ||
    `<span class="memori-chat--usage-badge-label">${escapedLabel}</span>`;

  return `<button type="button" class="memori-chat--usage-badge ${badgeClassName}" data-llm-badge-type="${badgeType}" data-line-index="${lineIndex}" aria-label="${escapedLabel}">${emoji} ${content}</button>`;
};

export const buildLlmUsageHtml = (
  usage: LlmUsageOnLine,
  labels: LlmUsageLabels,
  lineIndex: number,
  locale = 'it-IT',
): string => {
  const badges = [
    buildUsageBadgeHtml({
      badgeType: 'llm',
      badgeClassName: 'memori-chat--usage-badge-llm',
      label: labels.llm,
      lineIndex,
      emoji: BADGE_EMOJI.llm,
    }),
  ];

  const energy = getMetricValue(usage.energyImpact?.energy);
  const gwp = getMetricValue(usage.energyImpact?.gwp);
  const wcf = getMetricValue(usage.energyImpact?.wcf);

  if (typeof energy === 'number') {
    const energyFormatted = formatImpactWithApiUnit(
      energy,
      usage.energyImpact?.energyUnit,
      'kWh',
      'energy',
      locale,
    );
    badges.push(
      buildUsageBadgeHtml({
        badgeType: 'energy',
        badgeClassName: 'memori-chat--usage-badge-energy',
        label: `${labels.energy} ${energyFormatted}`,
        value: escapeHtml(energyFormatted),
        lineIndex,
        emoji: BADGE_EMOJI.energy,
      }),
    );
  }

  if (typeof gwp === 'number') {
    const co2Formatted = formatImpactWithApiUnit(
      gwp,
      usage.energyImpact?.gwpUnit,
      'kgCO2eq',
      'co2',
      locale,
    );
    badges.push(
      buildUsageBadgeHtml({
        badgeType: 'co2',
        badgeClassName: 'memori-chat--usage-badge-co2',
        label: `${labels.co2} ${co2Formatted}`,
        value: escapeHtml(co2Formatted),
        lineIndex,
        emoji: BADGE_EMOJI.co2,
      }),
    );
  }

  if (typeof wcf === 'number') {
    const waterFormatted = formatImpactWithApiUnit(
      wcf,
      usage.energyImpact?.wcfUnit,
      'L',
      'water',
      locale,
    );
    badges.push(
      buildUsageBadgeHtml({
        badgeType: 'water',
        badgeClassName: 'memori-chat--usage-badge-water',
        label: `${labels.water} ${waterFormatted}`,
        value: escapeHtml(waterFormatted),
        lineIndex,
        emoji: BADGE_EMOJI.water,
      }),
    );
  }

  return `<div class="memori-chat--llm-usage" data-llm-usage><hr class="memori-chat--llm-usage-hr" /><p class="memori-chat--llm-usage-hint">${escapeHtml(
    labels.usageBadgesHint,
  )}</p><div class="memori-chat--llm-usage-badges">${badges.join(
    '',
  )}</div></div>`;
};
