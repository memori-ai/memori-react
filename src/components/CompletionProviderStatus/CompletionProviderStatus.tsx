import { useEffect, useState, useCallback } from 'react';
import Tooltip from '../ui/Tooltip';
import Warning from '../icons/Warning';
import Alert from '../icons/Alert';
import Info from '../icons/Info';
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
  apiComponentName?: string | string[]; // Component name(s) to look for
}

const PROVIDER_CONFIGS: Record<string, ProviderConfig> = {
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
    statusUrl: 'https://status.anthropic.com/api/v2/summary.json',
    statusPage: 'https://status.anthropic.com/',
    apiComponentName: ['api.anthropic.com'],
  },
};

// Modified to handle fetch errors, different component names, and check incidents
const fetchProviderStatus = async (config: ProviderConfig): Promise<Status> => {
  try {
    // Use cross-fetch instead of native fetch
    const response = await fetch(config.statusUrl);
    if (!response.ok) {
      console.warn(`Status API returned ${response.status}`);
      return 'operational'; // Fallback to operational on API errors
    }
    
    const data = await response.json();
    
    // Check for active incidents first
    if (data.incidents && Array.isArray(data.incidents) && data.incidents.length > 0) {
      const activeIncidents = data.incidents.filter(
        (incident: { status: string }) => 
          !['resolved', 'completed', 'postmortem'].includes(incident.status.toLowerCase())
      );
      
      if (activeIncidents.length > 0) {
        // For any active incident, return degraded performance to be less alarming
        return 'degraded_performance';
      }
    }
    
    // If no incidents or they're all resolved, check specific API components
    if (data.components) {
      // First try with primary API component names
      if (config.apiComponentName) {
        const apiComponentNames = Array.isArray(config.apiComponentName) 
          ? config.apiComponentName 
          : [config.apiComponentName];
        
        for (const name of apiComponentNames) {
          const apiComponent = data.components.find(
            (component: { name: string }) => component.name === name
          );
          
          if (apiComponent && apiComponent.status !== 'operational') {
            // Return degraded performance instead of component's actual status
            return 'degraded_performance';
          }
        }
      }
      
      // Check if any component is degraded (might indicate API issues)
      const anyDegradedComponent = data.components.some(
        (component: { status: string }) => component.status !== 'operational'
      );
      
      if (anyDegradedComponent) {
        return 'degraded_performance';
      }
    }
    
    // If no specific component issues found, check overall status
    if (data.status && data.status.indicator !== 'none') {
      // Simplify all non-operational states to degraded performance
      if (data.status.indicator !== 'none' && data.status.indicator !== 'operational') {
        return 'degraded_performance';
      }
    }
    
    return 'operational'; // Default to operational if no issues detected
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
    return fetchProviderStatus(config);
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

  // Get appropriate icon and message based on status severity
  const getStatusDetails = () => {
    switch (status) {
      case 'major_outage':
      case 'partial_outage':
      case 'degraded_performance':
      default:
        return {
          Icon: Info,
          message: t('completionProviderDegraded', {
            provider: provider ?? t('completionProviderFallbackName'),
            fallback: t('completionProviderDown', {
              provider: provider ?? t('completionProviderFallbackName'),
            })
          }),
          className: "memori--completion-provider-status--icon-info"
        };
    }
  };

  const { Icon, message, className } = getStatusDetails();

  return (
    <Tooltip
      className="memori--completion-provider-status--tooltip"
      align="right"
      content={
        <div>
          <p>{message}</p>
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
      <Icon className={`memori--completion-provider-status--icon ${className}`} />
    </Tooltip>
  );
};

export default CompletionProviderStatus;