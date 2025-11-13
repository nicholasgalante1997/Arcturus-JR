import * as Sentry from '@sentry/react';
import React from 'react';
import { createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from 'react-router';

import { getJavascriptEnvironment } from '@/utils/env';
import { jlog } from '@/utils/log';

class ArcJrSentry {
  static Sentry = Sentry;

  static sentryReactDefaultErrorHandler(error: Error, info: React.ErrorInfo) {
    jlog.label('sentry-react-default-error-handler');
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

  private __poisoned: boolean = false;
  private sentryOptions: Sentry.BrowserOptions;
  private sentry: ReturnType<typeof Sentry.init> | null;

  constructor() {
    if (!process.env.SENTRY_DSN) {
      this.__poisoned = true;
      this.sentryOptions = Object.freeze({
        dsn: ''
      });
      this.sentry = Object.freeze(null);
      console.warn('@sentry/react DSN not provided. @sentry/react is disabled.');
      return;
    }

    this.sentryOptions = {
      dsn: process.env.SENTRY_DSN,
      enableLogs: true,
      environment: process.env.NODE_ENV || 'production',
      integrations: [
        Sentry.reactRouterV7BrowserTracingIntegration({
          useEffect: React.useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes
        })
      ],
      release: process.env.SENTRY_RELEASE || 'local.dev',
      // Adds request headers and IP for users, for more info visit:
      // https://docs.sentry.io/platforms/javascript/guides/react/configuration/options/#sendDefaultPii
      // We need to disable this for now due to
      // SNYK-JS-SENTRYCORE-14105053: Insertion of Sensitive Information Into Sent Data affecting @sentry/core package
      // Vulnerability | CVE-2025-65944 | CWE-201 | SNYK-JS-SENTRYCORE-14105053
      // Fixed in: @10.27.0 | Exploit maturity: HIGH
      sendDefaultPii: false,
      tracesSampleRate: 0.1,
      transport: Sentry.makeFetchTransport,
      transportOptions: {
        fetchOptions: {
          // Force correct headers
          headers: {
            'Content-Type': 'application/x-sentry-envelope'
          },
          // Ensure credentials are included
          credentials: 'omit'
        }
      },
      beforeSend(event, hint) {
        jlog('sentry send event', event, hint);
        return event;
      },

      beforeSendLog(log) {
        jlog('sentry send log event', log);
        return log;
      }
    };
  }

  init() {
    if (this.__poisoned) {
      return;
    }

    if (getJavascriptEnvironment() === 'server') {
      /**
       * We can use @sentry/bun for server prerendering events
       * but we do not need to init @sentry/react on the server
       */
      return;
    }

    this.sentry = Sentry.init(this.sentryOptions);
    jlog('Sentry is initalized');
  }
}

export default ArcJrSentry;
