import { useEffect, useState } from 'react';
import Tooltip from '../ui/Tooltip';
import Warning from '../icons/Warning';
import { useTranslation } from 'react-i18next';

export interface Props {
  forceStatus?: string;
  provider?: 'OpenAI' | string | null;
}

const initProviderStatus = (provider?: Props['provider']) => {
  switch (provider) {
    case 'DEFAULT':
    case 'OpenAI':
      return {
        getStatus: async () => {
          const res = await fetch(
            'https://status.openai.com/api/v2/summary.json'
          );
          const data = await res.json();
          return data.status.indicator ?? 'none';
        },
        statusPage: 'https://status.openai.com/',
      };
    default:
      return {
        getStatus: async () => 'none',
        statusPage: '',
      };
  }
};

const CompletionProviderStatus = ({ forceStatus, provider }: Props) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState(forceStatus ?? 'none');

  const providerStatus = initProviderStatus(provider);

  useEffect(() => {
    if (forceStatus) return;

    providerStatus.getStatus().then(status => setStatus(status));
  }, [forceStatus, provider]);

  return status !== 'none' ? (
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
