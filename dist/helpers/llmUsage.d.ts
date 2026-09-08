export interface LlmUsageOnLine {
    provider?: string;
    model?: string;
    totalInputTokens?: number;
    inputCacheReadTokens?: number;
    inputCacheWriteTokens?: number;
    outputTokens?: number;
    durationMs?: number;
    energyImpact?: {
        energy?: number | {
            source?: string;
            parsedValue?: number;
        };
        energyUnit?: string;
        gwp?: number | {
            source?: string;
            parsedValue?: number;
        };
        gwpUnit?: string;
        wcf?: number | {
            source?: string;
            parsedValue?: number;
        };
        wcfUnit?: string;
    };
}
export type UsageBadgeType = 'llm' | 'energy' | 'co2' | 'water';
type NumericMetric = number | {
    source?: string;
    parsedValue?: number;
};
type ImpactMetricType = 'energy' | 'co2' | 'water';
type TranslateFn = (key: string, options?: {
    [key: string]: unknown;
}) => string;
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
export declare const BADGE_EMOJI: Record<UsageBadgeType, string>;
export declare const escapeHtml: (value: string) => string;
export declare const getMetricValue: (metric?: NumericMetric) => number | undefined;
export declare const formatIntegerValue: (value: number, locale?: string) => string;
export declare const formatDuration: (durationMs?: number, locale?: string) => string;
export declare const formatImpactInReadableUnit: (value: number, metricType: ImpactMetricType, locale?: string) => string;
export declare const formatImpactWithApiUnit: (value: number, unitFromApi: string | undefined, fallbackUnit: string, metricType: ImpactMetricType, locale?: string) => string;
export declare const getImpactComparison: (value: number, metricType: ImpactMetricType, locale: string | undefined, t: TranslateFn) => string;
export declare const buildLlmUsageHtml: (usage: LlmUsageOnLine, labels: LlmUsageLabels, lineIndex: number, locale?: string) => string;
export {};
