import React from 'react';
import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@memori.ai/ui';
import { withTranslation, WithTranslation } from 'react-i18next';

interface Props extends WithTranslation {
  fallback?: ReactNode;
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback ? (
        this.props.fallback
      ) : (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.4)',
            color: 'var(--memori-text-color)',
            padding: '2rem',
            borderRadius: '10px',
          }}
        >
          <h2>{this.props.t('error.generic')}</h2>
          <Button variant="primary" onClick={() => this.setState({ hasError: false })}>
            {this.props.t('error.tryAgain') || 'Try again'}
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default withTranslation(['common'])(ErrorBoundary);
