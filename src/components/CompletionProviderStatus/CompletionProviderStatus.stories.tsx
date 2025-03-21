import React from 'react';
import { Meta, Story } from '@storybook/react';
import CompletionProviderStatus, { Props } from './CompletionProviderStatus';
import './CompletionProviderStatus.css';

// Import the actual component for the live examples
import I18nWrapper from '../../I18nWrapper';

// Create a mock I18n provider instead of trying to replace useTranslation
const MockI18nProvider = ({ children }: { children: React.ReactNode }) => {
  // We'll create a wrapper component that provides the translation context
  return <div className="mock-i18n-wrapper">{children}</div>;
};

// Mock wrapper that also provides example tooltips
const MockI18nWrapper = ({ children, status }: { children: React.ReactNode, status?: string }) => {
  return (
    <MockI18nProvider>
      <div className="mock-tooltip">
        {children}
        {status && (
          <div className="mock-tooltip-content" style={{
            position: 'absolute',
            left: '50px',
            top: '0',
            backgroundColor: '#fff',
            border: '1px solid #eee',
            borderRadius: '5px',
            padding: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            zIndex: 10,
            width: '300px'
          }}>
            <p>{getStatusMessage(status)}</p>
            <p><a href="#" onClick={(e) => e.preventDefault()}>Check the status page for updates</a></p>
          </div>
        )}
      </div>
    </MockI18nProvider>
  );
};

// Helper function to get status messages
const getStatusMessage = (status: string): string => {
  switch (status) {
    case 'major_outage':
      return 'Mistral service is completely down. Please try again later.';
    case 'partial_outage':
      return 'Anthropic service is experiencing significant disruptions.';
    case 'degraded_performance':
      return 'OpenAI service is responding slower than usual.';
    default:
      return 'The service is currently experiencing issues.';
  }
};

const meta: Meta = {
  title: 'Completion Provider Status',
  component: CompletionProviderStatus as React.ComponentType<any>,
  parameters: {
    layout: 'centered',
    controls: { expanded: true },
  },
};

// Add real examples of the component for reference
export const LiveExample_OpenAI_DegradedPerformance = () => (
  <I18nWrapper>
    <div style={{ padding: '20px' }}>
      <h3>Live Component - OpenAI with Degraded Performance</h3>
      <p>This is how the actual component will appear:</p>
      <CompletionProviderStatus 
        forceStatus="degraded_performance" 
        provider="OpenAI" 
      />
    </div>
  </I18nWrapper>
);

export const LiveExample_Anthropic_PartialOutage = () => (
  <I18nWrapper>
    <div style={{ padding: '20px' }}>
      <h3>Live Component - Anthropic with Partial Outage</h3>
      <p>This is how the actual component will appear:</p>
      <CompletionProviderStatus 
        forceStatus="partial_outage" 
        provider="Anthropic" 
      />
    </div>
  </I18nWrapper>
);

export const LiveExample_Mistral_MajorOutage = () => (
  <I18nWrapper>
    <div style={{ padding: '20px' }}>
      <h3>Live Component - Mistral with Major Outage</h3>
      <p>This is how the actual component will appear:</p>
      <CompletionProviderStatus 
        forceStatus="major_outage" 
        provider="Mistral" 
      />
    </div>
  </I18nWrapper>
);

export default meta;

// Status container to add some context around the icon
const StatusContainer = ({ status, children }: { status: string, children: React.ReactNode }) => (
  <div style={{ 
    padding: '20px', 
    border: '1px solid #eee', 
    borderRadius: '5px', 
    margin: '10px 0',
    width: '500px'
  }}>
    <h3>{status}</h3>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div>{children}</div>
      <div style={{ fontSize: '14px', color: '#888' }}>← Hover to see message</div>
    </div>
  </div>
);

// Stories for each status type - we'll create visual examples instead of using the component
export const AllStatusTypes = () => (
  <div>
    <h2>Status Alert Types</h2>
    <p>Each alert has a different icon and color based on severity.</p>
    
    <StatusContainer status="Degraded Performance (Blue Info Icon)">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ 
          color: '#1890ff', 
          width: '24px', 
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #e8e8e8',
          borderRadius: '50%',
          backgroundColor: '#f0f5ff'
        }}>
          i
        </div>
        <div style={{ marginLeft: '10px' }}>
          &quot;OpenAI service is responding slower than usual.&quot;
        </div>
      </div>
    </StatusContainer>
    
    <StatusContainer status="Partial Outage (Yellow Warning Icon)">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ 
          color: '#faad14', 
          width: '24px', 
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #e8e8e8',
          borderRadius: '50%',
          backgroundColor: '#fffbe6'
        }}>
          ⚠️
        </div>
        <div style={{ marginLeft: '10px' }}>
          &quot;Anthropic service is experiencing significant disruptions.&quot;
        </div>
      </div>
    </StatusContainer>
    
    <StatusContainer status="Major Outage (Red Alert Icon)">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ 
          color: '#f5222d', 
          width: '24px', 
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #e8e8e8',
          borderRadius: '50%',
          backgroundColor: '#fff1f0'
        }}>
          ⚠️
        </div>
        <div style={{ marginLeft: '10px' }}>
          &quot;Mistral service is completely down. Please try again later.&quot;
        </div>
      </div>
    </StatusContainer>
  </div>
);

// Individual stories for each status using visual examples
export const DegradedPerformance = () => (
  <StatusContainer status="Degraded Performance (Blue Info Icon)">
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ 
        color: '#1890ff', 
        width: '24px', 
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #e8e8e8',
        borderRadius: '50%',
        backgroundColor: '#f0f5ff'
      }}>
        i
      </div>
      <div style={{ marginLeft: '10px' }}>
        &quot;OpenAI service is responding slower than usual.&quot;
      </div>
    </div>
  </StatusContainer>
);

export const PartialOutage = () => (
  <StatusContainer status="Partial Outage (Yellow Warning Icon)">
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ 
        color: '#faad14', 
        width: '24px', 
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #e8e8e8',
        borderRadius: '50%',
        backgroundColor: '#fffbe6'
      }}>
        ⚠️
      </div>
      <div style={{ marginLeft: '10px' }}>
        &quot;Anthropic service is experiencing significant disruptions.&quot;
      </div>
    </div>
  </StatusContainer>
);

export const MajorOutage = () => (
  <StatusContainer status="Major Outage (Red Alert Icon)">
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ 
        color: '#f5222d', 
        width: '24px', 
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #e8e8e8',
        borderRadius: '50%',
        backgroundColor: '#fff1f0'
      }}>
        ⚠️
      </div>
      <div style={{ marginLeft: '10px' }}>
        &quot;Mistral service is completely down. Please try again later.&quot;
      </div>
    </div>
  </StatusContainer>
);

// All statuses for each provider
export const AllProvidersWithDifferentStatuses = () => (
  <I18nWrapper>
    <div>
      <h2>Different Providers with Different Statuses</h2>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '20px', 
        padding: '20px', 
        border: '1px solid #eee',
        borderRadius: '5px',
        marginBottom: '20px'
      }}>
        <div>
          <h3>OpenAI - Degraded Performance</h3>
          <CompletionProviderStatus provider="OpenAI" forceStatus="degraded_performance" />
        </div>
        <div>
          <h3>Anthropic - Partial Outage</h3>
          <CompletionProviderStatus provider="Anthropic" forceStatus="partial_outage" />
        </div>
        <div>
          <h3>Mistral - Major Outage</h3>
          <CompletionProviderStatus provider="Mistral" forceStatus="major_outage" />
        </div>
      </div>
    </div>
  </I18nWrapper>
);