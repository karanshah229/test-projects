import { getCssText } from '@hackerrank/hrds-components';
import newrelic from 'newrelic';
import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';
import Script from 'next/script';

import { logger } from 'src/utils/logger';

type NewRelicProps = {
  browserTimingHeader: string;
};

class MyDocument extends Document<NewRelicProps> {
  static async getInitialProps(
    ctx: DocumentContext,
  ): Promise<DocumentInitialProps & NewRelicProps> {
    const initialProps = await Document.getInitialProps(ctx);

    // /**
    //  * For SSG pages the build is faster than the agent connect cycle
    //  * In those cases, let's wait for the agent to connect before getting
    //  * the browser agent script.
    //  */
    // if (!newrelic.agent.collector.isConnected()) {
    //   await new Promise((resolve) => {
    //     newrelic.agent.on('connected', resolve);
    //   });
    // }

    const browserTimingHeader = (newrelic as any).getBrowserTimingHeader({
      hasToRemoveScriptWrapper: true,
    });

    return {
      ...initialProps,
      browserTimingHeader,
    };
  }

  render() {
    const { browserTimingHeader } = this.props;
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://hrcdn.net" />
          <style id="stitches" dangerouslySetInnerHTML={{ __html: getCssText() }} />
        </Head>
        <body>
          <Main />
          <NextScript />
          <Script
            id="newrelic-script"
            dangerouslySetInnerHTML={{ __html: browserTimingHeader }}
            strategy="beforeInteractive"
            onError={() => {
              // eslint-disable-next-line no-console
              logger.error('NewRelic initialisation failed');
            }}
          />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
