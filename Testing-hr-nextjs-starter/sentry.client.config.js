// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN || 'SENTRY_PROJECT_DSN', // Found at Project -> Settings -> Client Keys
  tracesSampleRate: (samplingContext) => {
    if (samplingContext?.transactionContext?.name === 'GET /healthcheck') {
      // Since this is not an error, ignore all transactions to the '/healthcheck' endpoint
      return 0;
    }
    // Default sample rate
    return 0.05;
  },
});
