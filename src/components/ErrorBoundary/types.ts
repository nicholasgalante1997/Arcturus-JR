import React from 'react';

export interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    forceErrorState?: boolean;
};

export interface ErrorBoundaryState {
    hasError: boolean;
    error?: unknown;
};