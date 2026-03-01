// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN || 'SENTRY_PROJECT_DSN', // Found at Project -> Settings -> Client Keys
  tracesSampleRate: (samplingContext) => {
    if (samplingContext?.transactionContext?.name === 'GET /healthcheck') {
      return 0;
    }
    return 0.05;
  },
});
