import { useEffect, useState, useCallback } from 'react';
import Tooltip from '../ui/Tooltip';
import Warning from '../icons/Warning';
import { useTranslation } from 'react-i18next';
import Spin from '../ui/Spin';

type Status =
  | 'operational'
  | 'degraded_performance'
  | 'partial_outage'
  | 'major_outage'
  | undefined;

export interface Props {
  forceStatus?: Status;
  provider?: string;
}

interface ProviderConfig {
  statusUrl: string;
  statusPage: string;
}

const PROVIDER_CONFIGS: Record<string, ProviderConfig> = {
  OpenAI: {
    statusUrl: 'https://status.openai.com/api/v2/summary.json',
    statusPage: 'https://status.openai.com/',
  },
  Mistral: {
    statusUrl: 'https://status.mistral-data.com/api/v2/summary.json',
    statusPage: 'https://status.mistral-data.com/',
  },
  Anthropic: {
    statusUrl: 'https://status.anthropic.com/api/v2/summary.json', 
    statusPage: 'https://status.anthropic.com/',
  },
};

// Modified to handle fetch errors and use cross-fetch
const fetchProviderStatus = async (statusUrl: string): Promise<Status> => {
  try {
    // Use cross-fetch instead of native fetch
    const response = await fetch(statusUrl);
    
    if (!response.ok) {
      console.warn(`Status API returned ${response.status}`);
      return 'operational'; // Fallback to operational on API errors
    }

    const data = await response.json();
    const apiComponent = data.components?.find(
      (component: { name: string }) => component.name === 'API'
    );

    return apiComponent?.status as Status ?? 'operational';
  } catch (error) {
    console.error('Error fetching provider status:', error);
    return 'operational'; // Fallback to operational on network errors
  }
};

const CompletionProviderStatus = ({
  forceStatus,
  provider = 'OpenAI',
}: Props) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<Status>(forceStatus ?? 'operational');
  const [isLoading, setIsLoading] = useState(false);

  const config = PROVIDER_CONFIGS[provider];

  const getStatus = useCallback(async () => {
    if (!config) return 'operational';
    return fetchProviderStatus(config.statusUrl);
  }, [config]);

  useEffect(() => {
    let mounted = true;
    const abortController = new AbortController();

    const checkStatus = async () => {
      if (forceStatus) return;
      
      setIsLoading(true);
      try {
        const newStatus = await getStatus();
        if (mounted) {
          setStatus(newStatus);
        }
      } catch (error) {
        console.error('Failed to check status:', error);
        if (mounted) {
          setStatus('operational'); // Fallback on error
        }
      } finally {
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
    return (
      <div className="memori--completion-provider-status--loading">
        <Spin spinning={true} />
      </div>
    );
  }

  if (!status || status === 'operational') {
    return null;
  }

  return (
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
          {config?.statusPage && (
            <p>
              <a
                href={config.statusPage}
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
  );
};

export default CompletionProviderStatus;