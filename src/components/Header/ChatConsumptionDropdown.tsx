import React, { useMemo } from 'react';
import cx from 'classnames';
import { Message } from '@memori.ai/memori-api-client/dist/types';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import Dropdown from '../ui/Dropdown';
import GasStation from '../icons/GasStation';
import { BADGE_EMOJI } from '../../helpers/llmUsage';

type ImpactMetricType = 'energy' | 'co2' | 'water';

type LlmUsageEnergyImpact = {
  energy?: number | { source?: string; parsedValue?: number };
  gwp?: number | { source?: string; parsedValue?: number };
  wcf?: number | { source?: string; parsedValue?: number };
};

type MessageLlmUsage = {
  provider?: string;
  model?: string;
  totalInputTokens?: number;
  outputTokens?: number;
  energyImpact?: LlmUsageEnergyImpact;
};

export interface ChatConsumptionDropdownProps {
  history: Message[];
  hasSpacedButtons?: boolean;
  trigger?: React.ReactNode;
}

const getMetricValue = (
  metric?: number | { source?: string; parsedValue?: number }
): number | undefined => {
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

const formatMetricValue = (value: number, locale: string): string =>
  new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: Math.abs(value) >= 1 ? 3 : 4,
  }).format(value);

const formatCountValue = (value: number, locale: string): string =>
  new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(value);

const formatImpactInReadableUnit = (
  value: number,
  metricType: ImpactMetricType,
  locale: string
): string => {
  const absValue = Math.abs(value);

  if (metricType === 'energy') {
    if (absValue >= 1) return `${formatMetricValue(value, locale)} kWh`;
    const wh = value * 1000;
    if (Math.abs(wh) >= 1) return `${formatMetricValue(wh, locale)} Wh`;
    return `${formatMetricValue(wh * 1000, locale)} mWh`;
  }

  if (metricType === 'co2') {
    if (absValue >= 1) return `${formatMetricValue(value, locale)} kg`;
    const g = value * 1000;
    if (Math.abs(g) >= 1) return `${formatMetricValue(g, locale)} g`;
    return `${formatMetricValue(g * 1000, locale)} mg`;
  }

  if (absValue >= 1) return `${formatMetricValue(value, locale)} L`;
  const ml = value * 1000;
  if (Math.abs(ml) >= 1) return `${formatMetricValue(ml, locale)} mL`;
  return `${formatMetricValue(ml * 1000, locale)} μL`;
};

const ChatConsumptionDropdown: React.FC<ChatConsumptionDropdownProps> = ({
  history,
  hasSpacedButtons = false,
  trigger,
}) => {
  const { t, i18n } = useTranslation();

  const currentLocale = i18n.language || navigator.language || 'en';
  const chatLog = useMemo(() => ({ lines: history }), [history]);

  const chatConsumptionTotals = useMemo(() => {
    const totals = {
      totalInputTokens: 0,
      totalOutputTokens: 0,
      energy: 0,
      gwp: 0,
      wcf: 0,
      models: new Set<string>(),
    };

    (chatLog?.lines ?? []).forEach(line => {
      const llmUsage = (line as Message & {
        llmUsage?: MessageLlmUsage;
      }).llmUsage;

      if (!llmUsage) return;

      totals.totalInputTokens += llmUsage.totalInputTokens ?? 0;
      totals.totalOutputTokens += llmUsage.outputTokens ?? 0;

      if (llmUsage.provider || llmUsage.model) {
        totals.models.add(
          [llmUsage.provider, llmUsage.model].filter(Boolean).join(' · ')
        );
      }

      if (!llmUsage.energyImpact) return;

      const impact = llmUsage.energyImpact;
      totals.energy += getMetricValue(impact.energy) ?? 0;
      totals.gwp += getMetricValue(impact.gwp) ?? 0;
      totals.wcf += getMetricValue(impact.wcf) ?? 0;
    });

    return totals;
  }, [chatLog]);

  const llmUsageModels = useMemo(
    () => Array.from(chatConsumptionTotals.models),
    [chatConsumptionTotals.models]
  );

  const hasConsumptionData = useMemo(
    () =>
      (chatLog?.lines ?? []).some(
        line =>
          !!(line as Message & { llmUsage?: MessageLlmUsage }).llmUsage
      ),
    [chatLog]
  );

  if (!hasConsumptionData) return null;

  return (
    <Dropdown
      placement="bottom-right"
      trigger={
        trigger ?? (
          <Button
            primary
            shape="circle"
            className={cx(
              'memori-header--button',
              'memori-header--button--sustainability',
              hasSpacedButtons && 'memori-header--button-spaced'
            )}
            title={
              t('write_and_speak.showMessageConsumptionLabel') ||
              'LLM consumption'
            }
            icon={
              <GasStation className="memori-header--button--sustainability-icon" />
            }
          />
        )
      }
    >
      <div className="memori-dropdown--sustainability">
        <h4 className="memori-dropdown--sustainability-title">
          {t('chatLogs.totalChatConsumptionTitle') || 'Consumo Totale Chat'}
        </h4>
        <div className="memori-dropdown--sustainability-section">
          <h5 className="memori-dropdown--sustainability-section-title">
            {t('chatLogs.modelUsage') || 'Model usage'}
          </h5>
          <div className="memori-dropdown--sustainability-summary">
            <div className="memori-dropdown--sustainability-stat">
              <span className="memori-dropdown--sustainability-stat-label">
                {t('chatLogs.input') || 'Input'}
              </span>
              <strong className="memori-dropdown--sustainability-stat-value">
                {formatCountValue(chatConsumptionTotals.totalInputTokens, currentLocale)}
              </strong>
              <span className="memori-dropdown--sustainability-stat-meta">
                {t('chatLogs.tokens') || 'Tokens'}
              </span>
            </div>
            <div className="memori-dropdown--sustainability-stat">
              <span className="memori-dropdown--sustainability-stat-label">
                {t('chatLogs.output') || 'Output'}
              </span>
              <strong className="memori-dropdown--sustainability-stat-value">
                {formatCountValue(chatConsumptionTotals.totalOutputTokens, currentLocale)}
              </strong>
              <span className="memori-dropdown--sustainability-stat-meta">
                {t('chatLogs.tokens') || 'Tokens'}
              </span>
            </div>
          </div>
          {llmUsageModels.length > 0 && (
            <div className="memori-dropdown--sustainability-row memori-dropdown--sustainability-row--stacked">
              <span className="memori-dropdown--sustainability-label">
                {t('chatLogs.provider') || 'Provider'} /{' '}
                {t('chatLogs.model') || 'Model'}
              </span>
              <div className="memori-dropdown--sustainability-tags">
                {llmUsageModels.map(modelLabel => (
                  <span
                    key={modelLabel}
                    className="memori-dropdown--sustainability-tag"
                  >
                    {modelLabel}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="memori-dropdown--sustainability-metrics">
          <h5 className="memori-dropdown--sustainability-section-title">
            {t('chatLogs.environmentalImpact') || 'Environmental impact'}
          </h5>
          <div className="memori-dropdown--sustainability-row">
            <span className="memori-dropdown--sustainability-label">
              <span aria-hidden="true">{BADGE_EMOJI.energy}</span>{' '}
              {t('chatLogs.energy') || 'Energy'}
            </span>
            <strong className="memori-dropdown--sustainability-value">
              {formatImpactInReadableUnit(
                chatConsumptionTotals.energy,
                'energy',
                currentLocale
              )}
            </strong>
          </div>
          <div className="memori-dropdown--sustainability-row">
            <span className="memori-dropdown--sustainability-label">
              <span aria-hidden="true">{BADGE_EMOJI.co2}</span>{' '}
              {t('chatLogs.co2') || 'CO2'}
            </span>
            <strong className="memori-dropdown--sustainability-value">
              {formatImpactInReadableUnit(
                chatConsumptionTotals.gwp,
                'co2',
                currentLocale
              )}
            </strong>
          </div>
          <div className="memori-dropdown--sustainability-row">
            <span className="memori-dropdown--sustainability-label">
              <span aria-hidden="true">{BADGE_EMOJI.water}</span>{' '}
              {t('chatLogs.water') || 'Water'}
            </span>
            <strong className="memori-dropdown--sustainability-value">
              {formatImpactInReadableUnit(
                chatConsumptionTotals.wcf,
                'water',
                currentLocale
              )}
            </strong>
          </div>
        </div>
      </div>
    </Dropdown>
  );
};

export default ChatConsumptionDropdown;
