import * as Sentry from '@sentry/react';
import * as React from 'react';

import { jlog } from '@/utils/log';
import { pipeline } from '@/utils/pipeline';

import ErrorBoundaryView from './View';

import type { ErrorBoundaryProps, ErrorBoundaryState } from './types';

/**
 * NOTE
 *
 * I don't think we're actually using this error boundary anywhere within our application,
 * within the SuspenseEnabledQuery pattern, we are using react-error-boundary,
 * meaning we aren't getting any of the benefits of any of the Sentry monitoring we've set up here
 *
 * We should look into reproducing the same setup,
 * but using react-error-boundary
 *
 * NOTE Ok we've reproduced the same setup with react-error-boundary
 * This component can now be deprecated
 *
 * @deprecated
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: Boolean(props.forceErrorState) };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    jlog.label('error-boundary');
    jlog('ErrorBoundary caught an error', error, info);
    jlog('Component Stack:', info.componentStack);
    jlog.unlabel();

    // Send to Sentry with additional context
    Sentry.withScope((scope) => {
      scope.setContext('react', {
        componentStack: info.componentStack
      });
      scope.setLevel('error');
      Sentry.captureException(error);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  componentDidUpdate(_prevProps: Readonly<ErrorBoundaryProps>) {
    if (this.props.forceErrorState && !this.state.hasError) {
      this.setState({ hasError: true });
    }
  }

  render() {
    return (
      <ErrorBoundaryView hasError={this.state.hasError} fallback={this.props.fallback}>
        {this.props.children}
      </ErrorBoundaryView>
    );
  }
}

export default pipeline(React.memo)(ErrorBoundary) as React.MemoExoticComponent<typeof ErrorBoundary>;
