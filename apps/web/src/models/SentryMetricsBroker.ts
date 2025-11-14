import * as Sentry from '@sentry/react';

import type { SerializableHash } from '@/types/Serializable';

export class SentryMetricsBroker {
  /**
   * Track custom events
   */
  static trackEvent(eventName: string, data?: SerializableHash) {
    Sentry.addBreadcrumb({
      category: 'custom',
      message: eventName,
      level: 'info',
      data
    });
  }

  /**
   * Track page views
   */
  static trackPageView(pageName: string, properties?: SerializableHash) {
    Sentry.addBreadcrumb({
      category: 'navigation',
      message: `Page View: ${pageName}`,
      level: 'info',
      data: properties
    });
  }

  /**
   * Track user interactions
   */
  static trackInteraction(action: string, target: string, data?: SerializableHash) {
    Sentry.addBreadcrumb({
      category: 'ui.interaction',
      message: `${action} on ${target}`,
      level: 'info',
      data
    });
  }

  /**
   * Set user context
   */
  static identifyUser(userId?: string, email?: string, username?: string) {
    Sentry.setUser({
      id: userId,
      email,
      username
    });
  }

  /**
   * Reset user context
   */
  static resetUser() {
    Sentry.setUser(null);
  }

  /**
   * Manual error capture with context
   */
  static captureError(error: Error, contextKey?: string, context?: Record<string, unknown>) {
    Sentry.withScope((scope) => {
      if (contextKey && context) {
        scope.setContext(contextKey, context);
      }
      Sentry.captureException(error);
    });
  }
}
