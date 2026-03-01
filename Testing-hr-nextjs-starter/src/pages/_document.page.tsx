import { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://hrcdn.net" />
      </Head>
      <body>
        <Main />
        <NextScript />
        {process.env.NODE_ENV === 'production' && (
          <Script
            // TODO: A new logging, observability and error tracking service is being created.
            // If deployed, use that instead.
            // TODO: Update below src with correct src
            src="https://hrcdn.net/monitoring/new-relic/project_name.js"
            strategy="beforeInteractive"
            onError={() => {
              // eslint-disable-next-line no-console
              console.error('NewRelic initialisation failed');
            }}
          />
        )}
      </body>
    </Html>
  );
}
