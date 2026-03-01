import { ToastProvider } from '@hackerrank/hrds-components';
import App from 'next/app';
import { Open_Sans as OpenSans } from 'next/font/google';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { appWithTranslation, useTranslation } from 'next-i18next';
import { Provider } from 'react-redux';

import { HIDE_APP_NAV_ON_PATHS, UN_PROTECTED_ROUTES } from 'src/constants/common';
import { PageTransitionLoaderProvider } from 'src/contexts/PageTransitionLoaderContext';
import { AppHeader } from 'src/features/AppHeader/AppHeader';
import { TranslatedPageErrorBoundary } from 'src/features/PageErrorBoundary';
import { PageTransitionLoader } from 'src/features/PageTransitionLoader/PageTransitionLoader';
import { Page } from 'src/types/next';
import { isUserLoggedOut, redirectToHRWLogin } from 'src/utils/auth';
import {
  getCurrentURL,
  getEnvVars,
  isServer,
  setEnvVars,
  urlContainsFilename,
} from 'src/utils/common';

import { wrapper } from '../store';

import type { AppProps } from 'next/app';

// Next.js concats css files during build so min N/W requests are made for CSS
import '@hackerrank/hrds-styles/dist/main.css';
import '../styles/reset.scss';
import '../styles/hrds_overrides.scss';
import '../styles/global.scss';
import '../styles/animations.scss';

// Charting global CSS
import '../styles/highcharts.scss';

type Props = AppProps & {
  Component: Page;
};

const openSans = OpenSans({
  weight: ['400', '600', '700', '800'],
  display: 'swap',
  subsets: ['latin'],
});

function SkillUpApp({ Component, ...rest }: Props) {
  const envVars = getEnvVars();
  setEnvVars(envVars);

  const {
    store,
    props: { pageProps },
  } = wrapper.useWrappedStore(rest);

  const { t: translate } = useTranslation('common');
  const getLayout = Component.getLayout || ((page) => page);
  const router = useRouter();
  const showHeader = !HIDE_APP_NAV_ON_PATHS.includes(router.pathname);
  const htmlTitleString = `${translate('skillup_product_title')} | ${translate(
    'hackerrank_product_title',
  )}`;

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* !important used to overwrite HRDS styles */}
        {/* eslint-disable-next-line */}
        <style>{`
          :root {
            --hr-font-family-text: ${openSans.style.fontFamily} !important;
          }
        `}</style>
        <title>{htmlTitleString}</title>
      </Head>
      <Provider store={store}>
        <ToastProvider>
          <PageTransitionLoaderProvider>
            <TranslatedPageErrorBoundary>
              {showHeader && <AppHeader />}
              <PageTransitionLoader>
                {getLayout(<Component key={router.asPath} {...pageProps} />, pageProps)}
              </PageTransitionLoader>
            </TranslatedPageErrorBoundary>
          </PageTransitionLoaderProvider>
        </ToastProvider>
      </Provider>
    </>
  );
}

SkillUpApp.getInitialProps = async (appContext: any) => {
  // Server - Runs on every request
  // Client - Runs if requested Page does not have data fetching methods like gssp

  const context = await App.getInitialProps(appContext);

  // Early redirect in case of no auth tokens
  if (isServer) {
    const { ctx = {} } = appContext;
    const { res = {}, req = {} } = ctx;

    if (isUserLoggedOut(req) && !UN_PROTECTED_ROUTES.includes(getCurrentURL(req))) {
      // https://github.com/interviewstreet/skillup-frontend/issues/80
      if (!urlContainsFilename(req.url)) redirectToHRWLogin(req, res, true);
      return {
        pageProps: {},
      };
    }
  }

  return {
    ...context,
  };
};

export { SkillUpApp as PureMyApp };
export default appWithTranslation(SkillUpApp);
