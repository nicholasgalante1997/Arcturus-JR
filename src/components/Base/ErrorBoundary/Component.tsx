import * as React from 'react';

import { pipeline } from '@/utils/pipeline';

import ErrorBoundaryView from './View';

import type { ErrorBoundaryProps, ErrorBoundaryState } from './types';

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: Boolean(props.forceErrorState) };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error', error, info);
    console.error('Component Stack:', info.componentStack, React.captureOwnerStack());
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
