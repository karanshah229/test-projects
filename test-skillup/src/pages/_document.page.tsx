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

import { CDN_URL_PREFIX } from 'src/constants/common';
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
          <link rel="icon" href={`${CDN_URL_PREFIX}/favicon.ico`} />
          <style id="stitches" dangerouslySetInnerHTML={{ __html: getCssText() }} />
        </Head>
        <body data-theme="light">
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
          <Script
            id="fullstory-script"
            dangerouslySetInnerHTML={{
              __html: `
          var isFullStoryEnabled = ${process.env.NODE_ENV === 'production'};
          if(isFullStoryEnabled){
            window['_fs_host'] = 'fsrelay.hackerrank.com';
            window['_fs_script'] = 'fsrelay.hackerrank.com/s/fs.js';
            window['_fs_org'] = 'Q02VK';
            window['_fs_namespace'] = 'SKILLUP_FS';
            (function(m,n,e,t,l,o,g,y){
                if (e in m) {if(m.console && m.console.log) { m.console.log('FullStory namespace conflict. Please set window["_fs_namespace"].');} return;}
                g=m[e]=function(a,b,s){g.q?g.q.push([a,b,s]):g._api(a,b,s);};g.q=[];
                o=n.createElement(t);o.async=1;o.crossOrigin='anonymous';o.src='https://'+_fs_script;
                y=n.getElementsByTagName(t)[0];y.parentNode.insertBefore(o,y);
                g.identify=function(i,v,s){g(l,{uid:i},s);if(v)g(l,v,s)};g.setUserVars=function(v,s){g(l,v,s)};g.event=function(i,v,s){g('event',{n:i,p:v},s)};
                g.anonymize=function(){g.identify(!!0)};
                g.shutdown=function(){g("rec",!1)};g.restart=function(){g("rec",!0)};
                g.log = function(a,b){g("log",[a,b])};
                g.consent=function(a){g("consent",!arguments.length||a)};
                g.identifyAccount=function(i,v){o='account';v=v||{};v.acctId=i;g(o,v)};
                g.clearUserCookie=function(){};
                g.setVars=function(n, p){g('setVars',[n,p]);};
                g._w={};y='XMLHttpRequest';g._w[y]=m[y];y='fetch';g._w[y]=m[y];
                if(m[y])m[y]=function(){return g._w[y].apply(this,arguments)};
                g._v="1.3.0";
            })(window,document,window['_fs_namespace'],'script','user');
          }
            `,
            }}
            strategy="beforeInteractive"
            onError={() => {
              // eslint-disable-next-line no-console
              logger.error('Fullstory initialisation failed');
            }}
          />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
