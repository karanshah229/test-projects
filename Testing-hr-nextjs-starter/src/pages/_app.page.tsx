import { Open_Sans as OpenSans } from '@next/font/google';
import { SSRProvider } from '@react-aria/ssr';
import { appWithTranslation } from 'next-i18next';
import Head from 'next/head';
import { Provider } from 'react-redux';

import { wrapper } from '../store';

import type { AppProps } from 'next/app';

import '@hackerrank/hrds-styles/dist/main.css';
import '../styles/reset.scss';

const openSans = OpenSans({
  weight: ['400', '600'],
  display: 'swap',
  subsets: ['latin'],
});

function MyApp({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style jsx global>{`
          html {
            font-family: ${openSans.style.fontFamily};
          }
        `}</style>
      </Head>
      <Provider store={store}>
        <SSRProvider>
          <Component {...props.pageProps} />
        </SSRProvider>
      </Provider>
    </>
  );
}

export default appWithTranslation(MyApp);
