import { useEffect, useState } from 'react';
import Tooltip from '../ui/Tooltip';
import Warning from '../icons/Warning';
import { Tenant } from '@memori.ai/memori-api-client/dist/types';
import { useTranslation } from 'react-i18next';

type Status =
  | 'operational'
  | 'degraded_performance'
  | 'partial_outage'
  | 'major_outage'
  | undefined;

export interface Props {
  forceStatus?: Status;
  provider?: Tenant['defaultCompletionProvider'];
}

const initProviderStatus = (
  provider?: Props['provider'] | 'DEFAULT'
): {
  getStatus: () => Promise<Status>;
  statusPage: string;
} => {
  switch (provider) {
    case 'DEFAULT':
    case 'OpenAI':
      return {
        getStatus: async () => {
          const res = await fetch(
            'https://status.openai.com/api/v2/summary.json'
          );
          const data = await res.json();
          const status = data.components.find(
            (component: { name: string }) => component.name === 'API'
          )?.status as Status;
          return status ?? 'operational';
        },
        statusPage: 'https://status.openai.com/',
      };
    default:
      return {
        getStatus: async () => 'operational',
        statusPage: '',
      };
  }
};

const CompletionProviderStatus = ({ forceStatus, provider }: Props) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<Status>(forceStatus ?? 'operational');

  const providerStatus = initProviderStatus(provider);

  useEffect(() => {
    if (forceStatus) return;

    providerStatus
      .getStatus()
      .then(status => setStatus(status))
      .catch(console.log);
  }, [forceStatus, provider]);

  return status !== 'operational' ? (
    <Tooltip
      className="memori--completion-provider-status--tooltip"
      align="topLeft"
      content={
        <div>
          <p>
            {t('completionProviderDown', {
              provider: provider ?? t('completionProviderFallbackName'),
            })}
          </p>
          {!!providerStatus.statusPage?.length && (
            <p>
              <a
                href={providerStatus.statusPage}
                rel="noopener noreferrer"
                target="_blank"
              >
                {t('completionProviderCheckStatusPage')}
              </a>
            </p>
          )}
        </div>
      }
    >
      <Warning className="memori--completion-provider-status--icon" />
    </Tooltip>
  ) : null;
};

export default CompletionProviderStatus;
