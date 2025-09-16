import * as React from 'react';
import type { ErrorBoundaryProps, ErrorBoundaryState } from './types';

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: Boolean(props.forceErrorState) };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error', error, info);
    console.error('Component Stack:', info.componentStack, React.captureOwnerStack());
  }

  componentDidUpdate(
    prevProps: Readonly<ErrorBoundaryProps>,
    prevState: Readonly<ErrorBoundaryState>,
    snapshot?: any
  ): void {
    if (this.props.forceErrorState && !this.state.hasError) {
      this.setState({ hasError: true });
    }
  }

  render() {
    if (this.state.hasError) {
      /**
       * If we are in an error state, render the fallback UI if provided
       */
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
